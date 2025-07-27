from uuid import UUID
from config.config import Settings
from services.client import AuthAsyncClient
from schemas.common.enums import Audition, RIDAuthority
from schemas.dss.remoteid import (
    SearchIdentificationServiceAreasResponse,
    GetIdentificationServiceAreaResponse,
    PutIdentificationServiceAreaResponse,
    DeleteIdentificationServiceAreaResponse,
    CreateIdentificationServiceAreaParameters,
    UpdateIdentificationServiceAreaParameters,
    SearchSubscriptionsResponse,
    GetSubscriptionResponse,
    PutSubscriptionResponse,
    DeleteSubscriptionResponse,
    CreateSubscriptionParameters,
    UpdateSubscriptionParameters,
)


ID_SERVICE_AREAS_PATH = "/rid/v2/dss/identification_service_areas"
SUBSCRIPTIONS_PATH = "/rid/v2/dss/subscriptions"


class DSSRemoteIDService:
    def __init__(self):
        settings = Settings()
        self.client = AuthAsyncClient(
            base_url=settings.BRUTM_BASE_URL, aud=Audition.DSS.value
        )

    # Identification Service Areas
    async def search_identification_service_areas(
        self, area: str, earliest_time: str, latest_time: str
    ) -> SearchIdentificationServiceAreasResponse:
        response = await self.client.request(
            "GET",
            ID_SERVICE_AREAS_PATH,
            params={
                "area": area,
                "earliest_time": earliest_time,
                "latest_time": latest_time
            },
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return SearchIdentificationServiceAreasResponse.model_validate(response.json())

    async def get_identification_service_area(self, area_id: UUID) -> GetIdentificationServiceAreaResponse:
        response = await self.client.request(
            "GET",
            f"{ID_SERVICE_AREAS_PATH}/{area_id}",
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return GetIdentificationServiceAreaResponse.model_validate(response.json())

    async def create_identification_service_area(
        self, area_id: UUID, params: CreateIdentificationServiceAreaParameters
    ) -> PutIdentificationServiceAreaResponse:
        response = await self.client.request(
            "PUT",
            f"{ID_SERVICE_AREAS_PATH}/{area_id}",
            json=params.model_dump(mode="json"),
            scope=RIDAuthority.SERVICE_PROVIDER,
        )
        return PutIdentificationServiceAreaResponse.model_validate(response.json())

    async def update_identification_service_area(
        self, area_id: UUID, version: str, params: UpdateIdentificationServiceAreaParameters
    ) -> PutIdentificationServiceAreaResponse:
        response = await self.client.request(
            "PUT",
            f"{ID_SERVICE_AREAS_PATH}/{area_id}/{version}",
            json=params.model_dump(mode="json"),
            scope=RIDAuthority.SERVICE_PROVIDER,
        )
        return PutIdentificationServiceAreaResponse.model_validate(response.json())

    async def delete_identification_service_area(
        self, area_id: UUID, version: str
    ) -> DeleteIdentificationServiceAreaResponse:
        response = await self.client.request(
            "DELETE",
            f"{ID_SERVICE_AREAS_PATH}/{area_id}/{version}",
            scope=RIDAuthority.SERVICE_PROVIDER,
        )
        return DeleteIdentificationServiceAreaResponse.model_validate(response.json())

    # Subscriptions
    async def search_subscriptions(self, area: str) -> SearchSubscriptionsResponse:
        response = await self.client.request(
            "GET",
            SUBSCRIPTIONS_PATH,
            params={"area": area},
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return SearchSubscriptionsResponse.model_validate(response.json())

    async def get_subscription(self, subscription_id: UUID) -> GetSubscriptionResponse:
        response = await self.client.request(
            "GET",
            f"{SUBSCRIPTIONS_PATH}/{subscription_id}",
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return GetSubscriptionResponse.model_validate(response.json())

    async def create_subscription(
        self, subscription_id: UUID, params: CreateSubscriptionParameters
    ) -> PutSubscriptionResponse:
        response = await self.client.request(
            "PUT",
            f"{SUBSCRIPTIONS_PATH}/{subscription_id}",
            json=params.model_dump(mode="json"),
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return PutSubscriptionResponse.model_validate(response.json())

    async def update_subscription(
        self, subscription_id: UUID, version: str, params: UpdateSubscriptionParameters
    ) -> PutSubscriptionResponse:
        response = await self.client.request(
            "PUT",
            f"{SUBSCRIPTIONS_PATH}/{subscription_id}/{version}",
            json=params.model_dump(mode="json"),
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return PutSubscriptionResponse.model_validate(response.json())

    async def delete_subscription(
        self, subscription_id: UUID, version: str
    ) -> DeleteSubscriptionResponse:
        response = await self.client.request(
            "DELETE",
            f"{SUBSCRIPTIONS_PATH}/{subscription_id}/{version}",
            scope=RIDAuthority.DISPLAY_PROVIDER,
        )
        return DeleteSubscriptionResponse.model_validate(response.json())
