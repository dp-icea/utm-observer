from uuid import UUID
from pydantic import HttpUrl
from services.client import AuthAsyncClient
from schemas.common.enums import RIDAuthority
from schemas.uss.remoteid import (
    GetFlightsResponse,
    GetFlightDetailsResponse,
    GetIdentificationServiceAreaDetailsResponse,
    PutIdentificationServiceAreaNotificationParameters,
)

FLIGHTS_PATH = "/uss/flights"
ID_SERVICE_AREAS_PATH = "/uss/identification_service_areas"


class USSRemoteIDService:
    def __init__(self, base_url: HttpUrl):
        self._base_url = str(base_url)
        self._aud = base_url.host

        if not self._base_url or not self._aud:
            raise ValueError("Base URL and audience must be set for USS Remote ID Service.")

        self.client = AuthAsyncClient(
            base_url=self._base_url,
            aud=self._aud,
        )

    async def search_flights(
        self, view: str, recent_positions_duration: float | None = None
    ) -> GetFlightsResponse:
        params = {"view": view}
        if recent_positions_duration is not None:
            params["recent_positions_duration"] = recent_positions_duration

        response = await self.client.request(
            "GET",
            FLIGHTS_PATH,
            params=params,
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return GetFlightsResponse.model_validate(response.json())

    async def get_flight_details(self, flight_id: str) -> GetFlightDetailsResponse:
        response = await self.client.request(
            "GET",
            f"{FLIGHTS_PATH}/{flight_id}/details",
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return GetFlightDetailsResponse.model_validate(response.json())

    async def get_identification_service_area_details(
        self, area_id: UUID
    ) -> GetIdentificationServiceAreaDetailsResponse:
        response = await self.client.request(
            "GET",
            f"{ID_SERVICE_AREAS_PATH}/{area_id}",
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return GetIdentificationServiceAreaDetailsResponse.model_validate(response.json())

    async def post_identification_service_area(
        self, area_id: UUID, params: PutIdentificationServiceAreaNotificationParameters
    ) -> None:
        await self.client.request(
            "POST",
            f"{ID_SERVICE_AREAS_PATH}/{area_id}",
            json=params.model_dump(mode="json"),
            scope=RIDAuthority.SERVICE_PROVIDER,
        )
