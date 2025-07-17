from uuid import UUID
from schemas.dss.operational_intents import (
    QueryOperationalIntentReferenceParameters,
    QueryOperationalIntentReferenceResponse,
    GetOperationalIntentReferenceResponse,
    PutOperationalIntentReferenceParameters,
    ChangeOperationalIntentReferenceResponse,
)
from schemas.common.enums import Audition, Authority
from services.client import AuthAsyncClient
from config.config import Settings
from pprint import pprint


RESOURCE_PATH = "/dss/v1/operational_intent_references"


class DSSOperationalIntentsService:
    def __init__(self):
        settings = Settings()
        self.client = AuthAsyncClient(
            base_url=settings.BRUTM_BASE_URL, aud=Audition.DSS.value)

    async def query_operational_intent_references(
        self, params: QueryOperationalIntentReferenceParameters
    ) -> QueryOperationalIntentReferenceResponse:
        response = await self.client.request(
            "POST",
            f"{RESOURCE_PATH}/query",
            scope=Authority.STRATEGIC_COORDINATION,
            json=params.model_dump(mode="json"),
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error querying operational intent references: \
                {response.text}"
            )

        pprint(response.json())

        return QueryOperationalIntentReferenceResponse\
            .model_validate(response.json())

    async def get_operational_intent_reference(
        self, entity_id: UUID
    ) -> GetOperationalIntentReferenceResponse:
        response = await self.client.request(
            "GET",
            f"{RESOURCE_PATH}/{entity_id}",
            scope=Authority.STRATEGIC_COORDINATION,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error getting operational intent reference: {response.text}"
            )

        return GetOperationalIntentReferenceResponse\
            .model_validate(response.json())

    async def create_operational_intent_reference(
        self, entity_id: UUID, params: PutOperationalIntentReferenceParameters
    ) -> ChangeOperationalIntentReferenceResponse:
        response = await self.client.request(
            "PUT",
            f"{RESOURCE_PATH}/{entity_id}",
            json=params.model_dump(mode="json"),
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error creating operational intent reference: {response.text}"
            )

        return ChangeOperationalIntentReferenceResponse\
            .model_validate(response.json())

    async def update_operational_intent_reference(
        self,
        entity_id: UUID,
        ovn: str,
        params: PutOperationalIntentReferenceParameters,
    ) -> ChangeOperationalIntentReferenceResponse:
        response = await self.client.request(
            "PUT",
            f"{RESOURCE_PATH}/{entity_id}/{ovn}",
            json=params.model_dump(mode="json"),
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error updating operational intent reference: {response.text}"
            )

        return ChangeOperationalIntentReferenceResponse\
            .model_validate(response.json())

    async def delete_operational_intent_reference(
        self, entity_id: UUID, ovn: str
    ) -> ChangeOperationalIntentReferenceResponse:
        response = await self.client.request(
            "DELETE",
            f"{RESOURCE_PATH}/{entity_id}/{ovn}",
            scope=Authority.STRATEGIC_COORDINATION,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error deleting operational intent reference: {response.text}"
            )

        return ChangeOperationalIntentReferenceResponse\
            .model_validate(response.json())
