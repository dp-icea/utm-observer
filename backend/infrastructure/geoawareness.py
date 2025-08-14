from typing import Any
from config.config import Settings
from httpx import AsyncClient
import logging

RESOURCES_PATH = "/geoawareness"


class GeoawarenessService:
    def __init__(self):
        settings = Settings()

        base_url = settings.BRUTM_BASE_URL

        if not base_url:
            raise ValueError(
                "BRUTM_BASE_URL must be set in the environment variables.")

        async def log_request(request):
            logging.info(
                f"Request: {request.method} {request.url}\nHeaders: {request.headers}\nBody: {request.content}")

        async def log_response(response):
            logging.info(
                f"Response: {response.status_code} {response.url}\nHeaders: {response.headers}\nBody: {response.text}")

        self.client = AsyncClient(
            base_url=base_url,
            event_hooks={
                "request": [log_request],
                "response": [log_response],
            },
        )

    async def create_constraint(
        self, params: Any
    ) -> Any:

        attempts = 3

        prefix = params.get("identifier")[:3]
        digits = int(params.get("identifier")[3:], base=10)

        for attempt in range(attempts):
            try:
                if digits > 9999:
                    digits = 0

                params["identifier"] = f"{prefix}{digits:04d}"

                res = await self.client.request(
                    "PUT",
                    f"{RESOURCES_PATH}/geoawareness/v1/constraint",
                    json=params,
                )

                if res.status_code == 200:
                    raise ValueError(
                        f"Failed to create constraint: {res.status_code} - {res.text}"
                    )

                    return res.json()

            except Exception as e:
                print(
                    f"Error creating constraint: {e}. Maybe updating this constraint is not working anymore.")
                raise ValueError(
                    f"Failed to create constraint: {e}"
                )
                digits += 1

        raise ValueError(
            "Failed to create constraint after multiple attempts.")
