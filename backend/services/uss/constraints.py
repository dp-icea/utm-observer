from uuid import UUID
from pydantic import HttpUrl
from services.client import AuthAsyncClient
from schemas.uss.constraints import (
    GetConstraintDetailsResponse,
    PutConstraintDetailsParameters,
)
from schemas.common.enums import Authority

RESOURCE_PATH = "/uss/v1/constraints"


class USSConstraintsService:
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

    async def get_constraint_details(
        self, entity_id: UUID
    ) -> GetConstraintDetailsResponse:
        response = await self.client.request(
            "GET",
            f"{RESOURCE_PATH}/{entity_id}",
            scope=Authority.CONSTRAINT_PROCESSING,
        )
        return GetConstraintDetailsResponse.model_validate(response.json())

    async def notify_constraint_details_changed(
        self, params: PutConstraintDetailsParameters
    ) -> None:
        await self.client.request(
            "POST",
            f"{RESOURCE_PATH}",
            json=params.model_dump(mode="json"),
            scope=Authority.CONSTRAINT_MANAGEMENT,
        )
