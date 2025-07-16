from uuid import UUID
from ..auth.client import AuthHttpxClient
from ...schemas.uss.constraints import (
    GetConstraintDetailsResponse,
    PutConstraintDetailsParameters,
)


class USSConstraintsService:
    def __init__(self, client: AuthHttpxClient):
        self.client = client

    async def get_constraint_details(
        self, entity_id: UUID
    ) -> GetConstraintDetailsResponse:
        response = await self.client.get(f"/uss/v1/constraints/{entity_id}")
        return GetConstraintDetailsResponse(**response.json())

    async def notify_constraint_details_changed(
        self, params: PutConstraintDetailsParameters
    ) -> None:
        await self.client.post(
            "/uss/v1/constraints", json=params.dict(exclude_none=True)
        )
