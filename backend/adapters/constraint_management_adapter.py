# Constraint Management Adapter - Direct implementation
from uuid import UUID

from ports.constraint_port import ConstraintManagementPort
from infrastructure.auth_client import AuthClient, BaseClient
from schemas.enums import Authority
from schemas.api import ApiException
from domain.external.dss.constraints import ChangeConstraintReferenceResponse
from config.config import Settings


class ConstraintManagementAdapter(ConstraintManagementPort):
    """Adapter for constraint management operations - direct implementation"""

    def __init__(self):
        # Direct DSS client for constraint deletion
        settings = Settings()

        self.dss_client = AuthClient(
            base_url=settings.BRUTM_BASE_URL,
            aud=settings.DSS_AUDIENCE,
        )

        self.geoawareness_client = BaseClient(
            base_url=f"{settings.BRUTM_BASE_URL}/geoawareness",
        )

    async def create_constraint(self, constraint_data: dict):
        """Create a new constraint using geoawareness utility"""

        response = await self.geoawareness_client.request(
            "PUT",
            "/geoawareness/v1/constraint",
            json=constraint_data,
        )

        if response.status_code != 200:
            raise ApiException(
                status_code=response.status_code,
                message=f"Failed to create constraint: {response.text}",
            )

    async def delete_constraint(self, constraint_id: str, ovn: str):
        """Delete a constraint by ID and OVN - direct implementation"""
        entity_uuid = UUID(constraint_id)

        response = await self.dss_client.request(
            "DELETE",
            f"/dss/v1/constraint_references/{entity_uuid}/{ovn}",
            scope=Authority.CONSTRAINT_MANAGEMENT,
        )

        if response.status_code != 200:
            raise ValueError(
                f"Error deleting constraint reference: {response.text}"
            )

        return ChangeConstraintReferenceResponse.model_validate(
            response.json()
        )
