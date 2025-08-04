from typing import List, Any
from datetime import time
from uuid import UUID
from schemas.common.base import Time
from schemas.common.enums import Audition, Authority, TimeFormat
from config.config import Settings
from httpx import AsyncClient
from services.dss.remoteid import DSSRemoteIDService
from services.uss.remoteid import USSRemoteIDService
from datetime import datetime, timedelta, timezone
from pprint import pprint

from schemas.flights import (
    Flight,
    QueryFlightsRequest,
    QueryFlightsResponse,
)

RESOURCES_PATH = "/geoawareness"


class GeoawarenessService:
    def __init__(self):
        settings = Settings()

        base_url = settings.BRUTM_BASE_URL

        if not base_url:
            raise ValueError(
                "BRUTM_BASE_URL must be set in the environment variables.")

        self.client = AsyncClient(
            base_url=base_url,
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

                if res.status_code != 200:
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
