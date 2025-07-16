from uuid import UUID
from ..auth.client import AuthHttpxClient
from ...schemas.dss.subscriptions import (
    QuerySubscriptionParameters,
    QuerySubscriptionsResponse,
    GetSubscriptionResponse,
    PutSubscriptionParameters,
    PutSubscriptionResponse,
    DeleteSubscriptionResponse,
)


class DSSSubscriptionsService:
    def __init__(self, client: AuthHttpxClient):
        self.client = client

    async def query_subscriptions(
        self, params: QuerySubscriptionParameters
    ) -> QuerySubscriptionsResponse:
        response = await self.client.post(
            "/dss/v1/subscriptions/query", json=params.dict(exclude_none=True)
        )
        return QuerySubscriptionsResponse(**response.json())

    async def get_subscription(self, subscription_id: UUID) -> GetSubscriptionResponse:
        response = await self.client.get(f"/dss/v1/subscriptions/{subscription_id}")
        return GetSubscriptionResponse(**response.json())

    async def create_subscription(
        self, subscription_id: UUID, params: PutSubscriptionParameters
    ) -> PutSubscriptionResponse:
        response = await self.client.put(
            f"/dss/v1/subscriptions/{subscription_id}",
            json=params.dict(exclude_none=True),
        )
        return PutSubscriptionResponse(**response.json())

    async def update_subscription(
        self, subscription_id: UUID, version: str, params: PutSubscriptionParameters
    ) -> PutSubscriptionResponse:
        response = await self.client.put(
            f"/dss/v1/subscriptions/{subscription_id}/{version}",
            json=params.dict(exclude_none=True),
        )
        return PutSubscriptionResponse(**response.json())

    async def delete_subscription(
        self, subscription_id: UUID, version: str
    ) -> DeleteSubscriptionResponse:
        response = await self.client.delete(
            f"/dss/v1/subscriptions/{subscription_id}/{version}"
        )
        return DeleteSubscriptionResponse(**response.json())
