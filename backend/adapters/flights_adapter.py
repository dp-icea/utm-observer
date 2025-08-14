# Flights Adapter - Direct implementation with all infrastructure logic
from typing import List
from datetime import datetime, timedelta, timezone
from pydantic import HttpUrl

from ports.flights_port import FlightDataPort
from domain.flights import Flight
from schemas.requests.flights import QueryFlightsRequest
from domain.external.dss.remoteid import (
    SearchIdentificationServiceAreasResponse,
)
from config.config import Settings
from infrastructure.auth_client import AuthClient, BaseClient
from schemas.enums import Authority
import logging


class FlightsAdapter(FlightDataPort):
    """Adapter for flight data - contains all infrastructure logic"""

    def __init__(self):
        settings = Settings()
        self.base_url = settings.BRUTM_BASE_URL
        self.api_key = settings.BRUTM_KEY

        if not self.base_url:
            raise ValueError(
                "BRUTM_BASE_URL must be set in environment variables"
            )
        if not self.api_key:
            raise ValueError("BRUTM_KEY must be set in environment variables")

        self.client = BaseClient(base_url=self.base_url)
        self.dss_client = AuthClient(
            base_url=self.base_url,
            aud=settings.DSS_AUDIENCE,
        )

    async def get_active_flights(
        self, area: QueryFlightsRequest
    ) -> List[Flight]:
        """Get active flights in the specified area - direct implementation"""

        # Build query parameters for the area
        query_params = {
            "apikey": self.api_key,
            "lat1": str(area.north),
            "lng1": str(area.west),
            "lat2": str(area.north),
            "lng2": str(area.east),
            "lat3": str(area.south),
            "lng3": str(area.east),
            "lat4": str(area.south),
            "lng4": str(area.west),
        }

        # Query ISAs from DSS
        isas = await self._query_identification_service_areas(query_params)

        # Get flights from each ISA
        flights: List[Flight] = []
        errors = []

        for isa in isas.service_areas:
            try:
                isa_flights = await self._get_flights_from_isa(
                    isa, query_params
                )
                flights.extend(isa_flights)
            except Exception as e:
                logging.error(
                    f"Error querying flights for ISA {isa.uss_base_url}: {e}"
                )
                errors.append(
                    {"error": str(e), "service_area": isa.uss_base_url}
                )

        return flights

    async def _query_identification_service_areas(
        self, query_params: dict
    ) -> SearchIdentificationServiceAreasResponse:
        """Query ISAs from DSS - moved from DSSRemoteIDService"""
        area = ",".join([
            query_params["lat1"],
            query_params["lng1"],
            query_params["lat2"],
            query_params["lng2"],
            query_params["lat3"],
            query_params["lng3"],
            query_params["lat4"],
            query_params["lng4"],
        ])

        now = datetime.now(timezone.utc)
        earliest_time = now.isoformat().replace("+00:00", "") + "Z"
        latest_time = (now + timedelta(seconds=10)).isoformat().replace(
            "+00:00", ""
        ) + "Z"

        try:
            response = await self.dss_client.request(
                "GET",
                "/dss/v1/identification_service_areas",
                params={
                    "area": area,
                    "earliest_time": earliest_time,
                    "latest_time": latest_time,
                },
                scope=Authority.CONFORMANCE_MONITORING_SA,
            )

            if response.status_code != 200:
                raise ValueError(f"Error querying ISAs: {response.text}")

            return SearchIdentificationServiceAreasResponse.model_validate(
                response.json()
            )

        except Exception:
            return SearchIdentificationServiceAreasResponse(service_areas=[])

    async def _get_flights_from_isa(
        self, isa, query_params: dict
    ) -> List[Flight]:
        """Get flights from a specific ISA - moved from USSRemoteIDService logic"""
        if not isa.uss_base_url:
            return []

        # Create USS client for this specific ISA
        uss_client = AuthClient(
            base_url=isa.uss_base_url, aud=HttpUrl(isa.uss_base_url).host
        )

        # Search for flights in the area
        view = ",".join([
            query_params["lat1"],
            query_params["lng1"],
            query_params["lat3"],
            query_params["lng3"],
        ])

        try:
            response = await uss_client.request(
                "GET",
                "/uss/v1/flights",
                params={"view": view, "recent_positions_duration": 0},
                scope=Authority.CONFORMANCE_MONITORING_SA,
            )

            if response.status_code != 200:
                raise ValueError(f"Error searching flights: {response.text}")

            flight_response = response.json()
            if not flight_response.get("flights"):
                return []

            flights = []
            for flight_data in flight_response["flights"]:
                # Get flight details
                details_response = None
                try:
                    response = await uss_client.request(
                        "GET",
                        f"/uss/v1/flights/{flight_data['id']}/details",
                        scope=Authority.CONFORMANCE_MONITORING_SA,
                    )
                    if response.status_code == 200:
                        details_response = response.json()
                except Exception:
                    pass

                # Create flight object
                flight_obj = Flight(
                    id=flight_data["id"],
                    aircraft_type=flight_data.get("aircraft_type"),
                    current_state=flight_data.get("current_state"),
                    operating_area=flight_data.get("operating_area"),
                    simulated=flight_data.get("simulated", False),
                    recent_positions=flight_data.get("recent_positions", []),
                    identification_service_area=isa,
                    details=(
                        details_response.get("details")
                        if details_response
                        else None
                    ),
                )

                flights.append(flight_obj)

            return flights

        except Exception as e:
            logging.error(
                f"Error getting flights from ISA {isa.uss_base_url}: {e}"
            )
            return []
