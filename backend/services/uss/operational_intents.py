from uuid import UUID
from ..auth.client import AuthHttpxClient
from ...schemas.uss.operational_intents import (
    GetOperationalIntentDetailsResponse,
    PutOperationalIntentDetailsParameters,
)
from ...schemas.uss.telemetry import GetOperationalIntentTelemetryResponse
from ...schemas.dss.operational_intents import GetOperationalIntentAuthorizationResponse


class USSOperationalIntentsService:
    def __init__(self, client: AuthHttpxClient):
        self.client = client

    async def get_operational_intent_details(
        self, entity_id: UUID
    ) -> GetOperationalIntentDetailsResponse:
        response = await self.client.get(f"/uss/v1/operational_intents/{entity_id}")
        return GetOperationalIntentDetailsResponse(**response.json())

    async def get_operational_intent_telemetry(
        self, entity_id: UUID
    ) -> GetOperationalIntentTelemetryResponse:
        response = await self.client.get(
            f"/uss/v1/operational_intents/{entity_id}/telemetry"
        )
        return GetOperationalIntentTelemetryResponse(**response.json())

    async def notify_operational_intent_details_changed(
        self, params: PutOperationalIntentDetailsParameters
    ) -> None:
        await self.client.post(
            "/uss/v1/operational_intents", json=params.dict(exclude_none=True)
        )

    async def get_operational_intent_authorization(
        self, entity_id: UUID
    ) -> GetOperationalIntentAuthorizationResponse:
        response = await self.client.get(
            f"/uss/v1/operational_intents/{entity_id}/authorization"
        )
        return GetOperationalIntentAuthorizationResponse(**response.json())
