from typing import List
from datetime import time
from uuid import UUID
from schemas.common.base import Time
from schemas.common.enums import Audition, Authority, TimeFormat
from config.config import Settings
from httpx import AsyncClient
from schemas.dss.remoteid import SearchIdentificationServiceAreasResponse
from services.dss.remoteid import DSSRemoteIDService
from services.uss.remoteid import USSRemoteIDService
from datetime import datetime, timedelta, timezone
from pprint import pprint

from schemas.flights import (
    Flight,
    QueryFlightsRequest,
    QueryFlightsResponse,
)

RESOURCES_PATH = "/dasa-dp/api/telemetry"


class FlightsService:
    def __init__(self):
        settings = Settings()

        base_url = settings.BRUTM_BASE_URL

        if not base_url:
            raise ValueError(
                "BRUTM_BASE_URL must be set in the environment variables.")

        self.client = AsyncClient(
            base_url=base_url,
        )

    async def query_flights(
        self, params: QueryFlightsRequest
    ) -> QueryFlightsResponse:

        settings = Settings()
        apikey = settings.BRUTM_KEY

        if not apikey:
            raise ValueError(
                "BRUTM_KEY must be set in the environment variables.")

        query_params = {
            "apikey": apikey,
            "lat1": str(params.north),
            "lng1": str(params.west),
            "lat2": str(params.north),
            "lng2": str(params.east),
            "lat3": str(params.south),
            "lng3": str(params.east),
            "lat4": str(params.south),
            "lng4": str(params.west),
        }

        # Query ISA

        dssClient = DSSRemoteIDService()

        area = query_params["lat1"] + "," + query_params["lng1"] + "," + \
            query_params["lat2"] + "," + query_params["lng2"] + "," + \
            query_params["lat3"] + "," + query_params["lng3"] + "," + \
            query_params["lat4"] + "," + query_params["lng4"]

        now = datetime.now(timezone.utc)
        earliest_time = now.isoformat().replace("+00:00", "") + 'Z'
        latest_time = (now + timedelta(seconds=10)
                       ).isoformat().replace("+00:00", "") + 'Z'

        try:
            isas = await dssClient.search_identification_service_areas(
                area=area,
                earliest_time=earliest_time,
                latest_time=latest_time,
            )
        except Exception as e:
            isas = SearchIdentificationServiceAreasResponse(
                service_areas=[],
            )

        # Get Flights by ISA
        flights: List[Flight] = []
        errors = []

        for isa in isas.service_areas:
            print("Trying to query flights for ISA: ", isa.uss_base_url)

            try:
                ussClient = USSRemoteIDService(
                    base_url=isa.uss_base_url
                )

                flight_response = await ussClient.search_flights(
                    view=query_params["lat1"] + "," + query_params["lng1"] + "," +
                    query_params["lat3"] + "," + query_params["lng3"],
                    recent_positions_duration=0
                )

                if not flight_response.flights:
                    continue

                for flight in flight_response.flights:
                    details_response = await ussClient.get_flight_details(flight.id)

                    flight_obj = Flight(
                        id=flight.id,
                        aircraft_type=flight.aircraft_type,
                        current_state=flight.current_state,
                        operating_area=flight.operating_area,
                        simulated=flight.simulated,
                        recent_positions=flight.recent_positions,
                        identification_service_area=isa,
                        details=details_response.details
                    )

                    flights.append(flight_obj)

            except Exception as e:
                errors.append({
                    "error": str(e),
                    "service_area": isa.uss_base_url
                })

        return QueryFlightsResponse(
            flights=flights,
            partial=False,
            errors=[],
            timestamp=Time(
                value=datetime.now(timezone.utc),
                format=TimeFormat.RFC3339,
            ),
        )
