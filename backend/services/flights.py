from uuid import UUID
from schemas.common.enums import Audition, Authority
from config.config import Settings
from httpx import AsyncClient

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
            raise ValueError("BRUTM_BASE_URL must be set in the environment variables.")

        self.client = AsyncClient(
                base_url=base_url,
        )

    async def query_flights(
        self, params: QueryFlightsRequest
    ) -> QueryFlightsResponse:

        settings = Settings()
        apikey = settings.BRUTM_KEY

        if not apikey:
            raise ValueError("BRUTM_KEY must be set in the environment variables.")

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

        response = await self.client.request(
            "GET",
            f"{RESOURCES_PATH}",
            params=query_params,  # Send as query parameters
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error querying flights: {response.text}"
            )

        return QueryFlightsResponse.model_validate(response.json())
