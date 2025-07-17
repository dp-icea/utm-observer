from uuid import UUID
from pydantic import HttpUrl
from services.client import AuthAsyncClient
from schemas.uss.operational_intents import (
    GetOperationalIntentDetailsResponse,
    PutOperationalIntentDetailsParameters,
)
from schemas.common.enums import Authority
from schemas.uss.telemetry import GetOperationalIntentTelemetryResponse


RESOURCE_PATH = "/uss/v1/operational_intents"


class USSOperationalIntentsService:
    def __init__(self, base_url: HttpUrl):
        self._base_url = str(base_url)
        self._aud = base_url.host

        if not self._base_url or not self._aud:
            raise ValueError("Base URL and audience must be set for \
            USS Operational Intents Service.")

        self.client = AuthAsyncClient(
            base_url=self._base_url,
            aud=self._aud,
        )

    async def get_operational_intent_details(
        self, entity_id: UUID
    ) -> GetOperationalIntentDetailsResponse:
        response = await self.client.request(
            "GET",
            f"{RESOURCE_PATH}/{entity_id}",
            scope=Authority.STRATEGIC_COORDINATION,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error getting operational intent details: {response.text}"
            )

        return GetOperationalIntentDetailsResponse\
            .model_validate(response.json())

    async def get_operational_intent_telemetry(
        self, entity_id: UUID
    ) -> GetOperationalIntentTelemetryResponse:
        response = await self.client.request(
            "GET",
            f"{RESOURCE_PATH}/{entity_id}/telemetry",
            scope=Authority.CONFORMANCE_MONITORING_SA,
        )
        return GetOperationalIntentTelemetryResponse\
            .model_validate(response.json())

    async def notify_operational_intent_details_changed(
        self, params: PutOperationalIntentDetailsParameters
    ) -> None:
        await self.client.request(
            "POST",
            f"{RESOURCE_PATH}",
            json=params.model_dump(mode="json"),
            scope=Authority.STRATEGIC_COORDINATION,
        )
