from uuid import UUID
from schemas.dss.constraints import (
    QueryConstraintReferenceParameters,
    QueryConstraintReferencesResponse,
    GetConstraintReferenceResponse,
    PutConstraintReferenceParameters,
    ChangeConstraintReferenceResponse,
)
from schemas.common.enums import Audition, Authority
from services.client import AuthAsyncClient
from config.config import Settings


RESOURCE_PATH = "/dss/v1/constraint_references"


class DSSConstraintsService:
    def __init__(self):
        settings = Settings()
        self.client = AuthAsyncClient(
            base_url=settings.BRUTM_BASE_URL, aud=Audition.DSS.value)

    async def query_constraint_references(
        self, params: QueryConstraintReferenceParameters
    ) -> QueryConstraintReferencesResponse:
        response = await self.client.request(
            "POST",
            f"{RESOURCE_PATH}/query",
            scope=Authority.CONSTRAINT_PROCESSING,
            json=params.model_dump(mode="json")
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error querying constraint references: {response.text}"
            )

        return QueryConstraintReferencesResponse\
            .model_validate(response.json())

    async def get_constraint_reference(
        self, entity_id: UUID
    ) -> GetConstraintReferenceResponse:
        response = await self.client.request(
            "GET",
            f"{RESOURCE_PATH}/{entity_id}",
            scope=Authority.CONSTRAINT_PROCESSING,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error getting constraint reference: {response.text}"
            )

        return GetConstraintReferenceResponse\
            .model_validate(response.json())

    async def create_constraint_reference(
        self, entity_id: UUID, params: PutConstraintReferenceParameters
    ) -> ChangeConstraintReferenceResponse:
        response = await self.client.request(
            "PUT",
            f"{RESOURCE_PATH}/{entity_id}",
            json=params.model_dump(exclude_none=True),
            scope=Authority.CONSTRAINT_PROCESSING,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error creating constraint reference: {response.text}"
            )

        return ChangeConstraintReferenceResponse\
            .model_validate(response.json())

    async def update_constraint_reference(
        self, entity_id: UUID, ovn: str, params: PutConstraintReferenceParameters
    ) -> ChangeConstraintReferenceResponse:
        response = await self.client.request(
            "PUT",
            f"{RESOURCE_PATH}/{entity_id}/{ovn}",
            json=params.model_dump(exclude_none=True),
            scope=Authority.CONSTRAINT_PROCESSING,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error updating constraint reference: {response.text}"
            )

        return ChangeConstraintReferenceResponse\
            .model_validate(response.json())

    async def delete_constraint_reference(
        self, entity_id: UUID, ovn: str
    ) -> ChangeConstraintReferenceResponse:
        response = await self.client.request(
            "DELETE",
            f"{RESOURCE_PATH}/{entity_id}/{ovn}",
            scope=Authority.CONSTRAINT_PROCESSING,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error deleting constraint reference: {response.text}"
            )

        return ChangeConstraintReferenceResponse\
            .model_validate(response.json())
