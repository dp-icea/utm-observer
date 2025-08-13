# USS Adapter - Factory pattern for dynamic USS clients with direct implementation
from pydantic import HttpUrl

from ports.airspace_repository import VolumeDetailsPort
from schemas.external.dss.common import ConstraintReference, OperationalIntentReference
from schemas.external.dss.remoteid import IdentificationServiceArea
from schemas.external.uss.constraints import GetConstraintDetailsResponse
from schemas.external.uss.operational_intents import GetOperationalIntentDetailsResponse
from schemas.external.uss.remoteid import GetIdentificationServiceAreaDetailsResponse
from infrastructure.auth_client import AuthAsyncClient
from schemas.shared.enums import Authority


class USSAdapter(VolumeDetailsPort):
    """Adapter using factory pattern for dynamic USS clients - direct implementation"""
    
    def _create_auth_client(self, base_url: str) -> AuthAsyncClient:
        """Factory method to create USS-specific authenticated clients"""
        return AuthAsyncClient(
            base_url=base_url,
            aud=HttpUrl(base_url).host,
        )
    
    async def get_constraint_details(self, reference: ConstraintReference):
        """Get constraint details using factory-created client - direct implementation"""
        client = self._create_auth_client(reference.uss_base_url)
        
        response = await client.request(
            "GET",
            f"/uss/v1/constraints/{reference.id}",
            scope=Authority.CONSTRAINT_PROCESSING,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error getting constraint details: {response.text}")
            
        constraint_response = GetConstraintDetailsResponse.model_validate(response.json())
        return constraint_response.constraint
    
    async def get_operational_intent_details(self, reference: OperationalIntentReference):
        """Get operational intent details using factory-created client - direct implementation"""
        client = self._create_auth_client(reference.uss_base_url)
        
        response = await client.request(
            "GET",
            f"/uss/v1/operational_intents/{reference.id}",
            scope=Authority.STRATEGIC_COORDINATION,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error getting operational intent details: {response.text}")
            
        oi_response = GetOperationalIntentDetailsResponse.model_validate(response.json())
        return oi_response.operational_intent
    
    async def get_identification_service_area_details(self, reference: IdentificationServiceArea):
        """Get ISA details using factory-created client - direct implementation"""
        client = self._create_auth_client(reference.uss_base_url)
        
        response = await client.request(
            "GET",
            f"/uss/v1/identification_service_areas/{reference.id}",
            scope=Authority.CONFORMANCE_MONITORING_SA,
        )
        
        if response.status_code != 200:
            raise ValueError(f"Error getting ISA details: {response.text}")
            
        return GetIdentificationServiceAreaDetailsResponse.model_validate(response.json())