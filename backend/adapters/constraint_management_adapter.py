# Constraint Management Adapter - Direct implementation
from uuid import UUID

from ports.airspace_repository import ConstraintManagementPort
from infrastructure.geoawareness import GeoawarenessService
from infrastructure.auth_client import AuthAsyncClient
from schemas.shared.enums import Authority
from schemas.external.dss.constraints import ChangeConstraintReferenceResponse
from config.config import Settings


class ConstraintManagementAdapter(ConstraintManagementPort):
    """Adapter for constraint management operations - direct implementation"""
    
    def __init__(self):
        # Keep geoawareness as utility since it's complex business logic
        self.geoawareness_service = GeoawarenessService()
        
        # Direct DSS client for constraint deletion
        settings = Settings()
        self.dss_client = AuthAsyncClient(
            base_url=settings.BRUTM_BASE_URL,
            aud=settings.DSS_AUDIENCE or "dss.example.com"
        )
    
    async def create_constraint(self, constraint_data: dict):
        """Create a new constraint using geoawareness utility"""
        return await self.geoawareness_service.create_constraint(constraint_data)
    
    async def delete_constraint(self, constraint_id: str, ovn: str):
        """Delete a constraint by ID and OVN - direct implementation"""
        entity_uuid = UUID(constraint_id)
        
        response = await self.dss_client.request(
            "DELETE",
            f"/dss/v1/constraint_references/{entity_uuid}/{ovn}",
            scope=Authority.CONSTRAINT_MANAGEMENT,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error deleting constraint reference: {response.text}")
            
        return ChangeConstraintReferenceResponse.model_validate(response.json())