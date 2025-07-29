from datetime import time
from uuid import UUID
from schemas.common.base import Time
from schemas.common.enums import Audition, Authority, TimeFormat
from config.config import Settings
from httpx import AsyncClient
from services.dss.remoteid import DSSRemoteIDService
from services.uss.remoteid import USSRemoteIDService
from datetime import datetime, timedelta, timezone
from pprint import pprint

from schemas.flights import (
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
            "lat1": params.north,
            "lng1": params.west,
            "lat2": params.north,
            "lng2": params.east,
            "lat3": params.south,
            "lng3": params.east,
            "lat4": params.south,
            "lng4": params.west,
        }

        # Query ISA

        dssClient = DSSRemoteIDService()

        area = str(query_params["lat1"]) + "," + str(query_params["lng1"]) + "," + \
            str(query_params["lat2"]) + "," + str(query_params["lng2"]) + "," + \
            str(query_params["lat3"]) + "," + str(query_params["lng3"]) + "," + \
            str(query_params["lat4"]) + "," + str(query_params["lng4"])

        now = datetime.now(timezone.utc)
        earliest_time = now.isoformat().replace("+00:00", "") + 'Z'
        latest_time = (now + timedelta(seconds=10)
                       ).isoformat().replace("+00:00", "") + 'Z'

        isas = await dssClient.search_identification_service_areas(
            area=area,
            earliest_time=earliest_time,
            latest_time=latest_time,
        )

        pprint(isas)

        # Get Flights by ISA
        flights = []
        errors = []

        for isa in isas.service_areas:
            try:
                ussClient = USSRemoteIDService(
                    base_url=isa.uss_base_url
                )
                flight_response = await ussClient.search_flights(
                    view=query_params["lat1"] + "," + query_params["lng1"] + "," +
                    query_params["lat3"] + "," + query_params["lng3"],
                    recent_positions_duration=0
                )

                flights.append(flight_response.flights)
            except Exception as e:
                errors.append({
                    "error": str(e),
                    "service_area": isa.uss_base_url
                })

        pprint(flights)

        response = QueryFlightsResponse(
            flights=flights,
            partial=False,
            errors=[],
            timestamp=Time(
                value=datetime.now(timezone.utc),
                format=TimeFormat.RFC3339,
            ),
        )

        return response
