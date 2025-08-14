# USS Adapter - Factory pattern for dynamic USS clients with direct implementation
from pydantic import HttpUrl

from domain.external.dss.common import (
    ConstraintReference,
    OperationalIntentReference,
)
from domain.external.dss.remoteid import (
    IdentificationServiceArea,
    IdentificationServiceAreaFull,
    IdentificationServiceAreaDetails,
)
from domain.external.uss.common import Constraint, OperationalIntent
from domain.external.uss.constraints import GetConstraintDetailsResponse
from domain.external.uss.operational_intents import (
    GetOperationalIntentDetailsResponse,
)
from domain.external.uss.remoteid import (
    GetIdentificationServiceAreaDetailsResponse,
)
from infrastructure.auth_client import AuthClient
from ports.airspace_port import AirspaceDetailsDataPort
from schemas.enums import Authority


class USSAdapter(AirspaceDetailsDataPort):
    """Adapter using factory pattern for dynamic USS clients - direct implementation"""

    def _create_auth_client(self, base_url: str) -> AuthClient:
        """Factory method to create USS-specific authenticated clients"""

        host = HttpUrl(base_url).host

        if not host:
            raise ValueError(
                "Invalid USS base URL provided to the USS Adapter."
            )

        return AuthClient(
            base_url=base_url,
            aud=host,
        )

    async def get_constraint_details(
        self, reference: ConstraintReference
    ) -> Constraint:
        """Get constraint details using factory-created client - direct implementation"""
        if not reference.uss_base_url:
            raise ValueError(
                "USS base URL must be provided in the Constraint Reference."
            )

        client = self._create_auth_client(reference.uss_base_url)

        response = await client.request(
            "GET",
            f"/uss/v1/constraints/{reference.id}",
            scope=Authority.CONSTRAINT_PROCESSING,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error getting constraint details: {response.text}"
            )

        constraint_response = GetConstraintDetailsResponse.model_validate(
            response.json()
        )
        return constraint_response.constraint

    async def get_operational_intent_details(
        self, reference: OperationalIntentReference
    ) -> OperationalIntent:
        """Get operational intent details using factory-created client - direct implementation"""
        if not reference.uss_base_url:
            raise ValueError(
                "USS base URL must be provided in the Operational Intent"
                " Reference."
            )

        client = self._create_auth_client(reference.uss_base_url)

        response = await client.request(
            "GET",
            f"/uss/v1/operational_intents/{reference.id}",
            scope=Authority.STRATEGIC_COORDINATION,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error getting operational intent details: {response.text}"
            )

        oi_response = GetOperationalIntentDetailsResponse.model_validate(
            response.json()
        )
        return oi_response.operational_intent

    async def get_identification_service_area_details(
        self, reference: IdentificationServiceArea
    ) -> IdentificationServiceAreaFull:
        """Get ISA details using factory-created client - direct implementation"""
        if not reference.uss_base_url:
            raise ValueError(
                "USS base URL must be provided in the Identification Service"
                " Area Reference."
            )

        client = self._create_auth_client(reference.uss_base_url)

        response = await client.request(
            "GET",
            f"/uss/v1/identification_service_areas/{reference.id}",
            scope=Authority.CONFORMANCE_MONITORING_SA,
        )

        if response.status_code != 200:
            raise ValueError(f"Error getting ISA details: {response.text}")

        isa_response = (
            GetIdentificationServiceAreaDetailsResponse.model_validate(
                response.json()
            )
        )

        return IdentificationServiceAreaFull(
            reference=reference,
            details=IdentificationServiceAreaDetails(
                volumes=[isa_response.extents]
            ),
        )
