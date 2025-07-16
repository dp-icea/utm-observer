from uuid import UUID
from ..auth.client import AuthHttpxClient
from ...schemas.dss.operational_intents import (
    QueryOperationalIntentReferenceParameters,
    QueryOperationalIntentReferenceResponse,
    GetOperationalIntentReferenceResponse,
    PutOperationalIntentReferenceParameters,
    ChangeOperationalIntentReferenceResponse,
)


class DSSOperationalIntentsService:
    def __init__(self, client: AuthHttpxClient):
        self.client = client

    async def query_operational_intent_references(
        self, params: QueryOperationalIntentReferenceParameters
    ) -> QueryOperationalIntentReferenceResponse:
        response = await self.client.post(
            "/dss/v1/operational_intent_references/query",
            json=params.dict(exclude_none=True),
        )
        return QueryOperationalIntentReferenceResponse(**response.json())

    async def get_operational_intent_reference(
        self, entity_id: UUID
    ) -> GetOperationalIntentReferenceResponse:
        response = await self.client.get(
            f"/dss/v1/operational_intent_references/{entity_id}"
        )
        return GetOperationalIntentReferenceResponse(**response.json())

    async def create_operational_intent_reference(
        self, entity_id: UUID, params: PutOperationalIntentReferenceParameters
    ) -> ChangeOperationalIntentReferenceResponse:
        response = await self.client.put(
            f"/dss/v1/operational_intent_references/{entity_id}",
            json=params.dict(exclude_none=True),
        )
        return ChangeOperationalIntentReferenceResponse(**response.json())

    async def update_operational_intent_reference(
        self, entity_id: UUID, ovn: str, params: PutOperationalIntentReferenceParameters
    ) -> ChangeOperationalIntentReferenceResponse:
        response = await self.client.put(
            f"/dss/v1/operational_intent_references/{entity_id}/{ovn}",
            json=params.dict(exclude_none=True),
        )
        return ChangeOperationalIntentReferenceResponse(**response.json())

    async def delete_operational_intent_reference(
        self, entity_id: UUID, ovn: str
    ) -> ChangeOperationalIntentReferenceResponse:
        response = await self.client.delete(
            f"/dss/v1/operational_intent_references/{entity_id}/{ovn}"
        )
        return ChangeOperationalIntentReferenceResponse(**response.json())
