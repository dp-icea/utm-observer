# DSS Adapter - Direct implementation with all infrastructure logic
from typing import List

from ports.airspace_repository import AirspaceDataPort
from domain.value_objects import Volume4D
from schemas.external.dss.common import ConstraintReference, OperationalIntentReference
from schemas.external.dss.remoteid import IdentificationServiceArea
from schemas.external.dss.constraints import (
    QueryConstraintReferenceParameters,
    QueryConstraintReferencesResponse
)
from schemas.external.dss.operational_intents import (
    QueryOperationalIntentReferenceParameters,
    QueryOperationalIntentReferenceResponse
)
from schemas.external.dss.remoteid import SearchIdentificationServiceAreasResponse
from infrastructure.auth_client import AuthAsyncClient
from schemas.shared.enums import Authority
from config.config import Settings


class DSSAdapter(AirspaceDataPort):
    """Adapter for DSS - contains all infrastructure logic"""
    
    def __init__(self):
        settings = Settings()
        self.client = AuthAsyncClient(
            base_url=settings.BRUTM_BASE_URL,
            aud=settings.DSS_AUDIENCE or "dss.example.com"
        )
        
        # Simple caching to handle DSS errors
        self._last_constraints = []
        self._last_operational_intents = []
        self._last_isas = []
    
    async def get_constraint_references(self, area: Volume4D) -> List[ConstraintReference]:
        """Get constraint references from DSS - direct implementation"""
        try:
            params = QueryConstraintReferenceParameters(area_of_interest=area)
            
            response = await self.client.request(
                "POST",
                "/dss/v1/constraint_references/query",
                json=params.model_dump(mode="json"),
                scope=Authority.CONSTRAINT_PROCESSING
            )
            
            if response.status_code != 200:
                raise ValueError(f"Error querying constraint references: {response.text}")
            
            query_response = QueryConstraintReferencesResponse.model_validate(response.json())
            self._last_constraints = query_response.constraint_references
            return query_response.constraint_references
            
        except Exception as e:
            print(f"Error querying constraints from DSS: {e}")
            print("Using cached constraint references")
            return self._last_constraints
    
    async def get_operational_intent_references(self, area: Volume4D) -> List[OperationalIntentReference]:
        """Get operational intent references from DSS - direct implementation"""
        try:
            params = QueryOperationalIntentReferenceParameters(area_of_interest=area)
            
            response = await self.client.request(
                "POST",
                "/dss/v1/operational_intent_references/query",
                json=params.model_dump(mode="json"),
                scope=Authority.STRATEGIC_COORDINATION
            )
            
            if response.status_code != 200:
                raise ValueError(f"Error querying operational intent references: {response.text}")
            
            query_response = QueryOperationalIntentReferenceResponse.model_validate(response.json())
            self._last_operational_intents = query_response.operational_intent_references
            return query_response.operational_intent_references
            
        except Exception as e:
            print(f"Error querying operational intents from DSS: {e}")
            print("Using cached operational intent references")
            return self._last_operational_intents
    
    async def get_identification_service_areas(self, area: Volume4D) -> List[IdentificationServiceArea]:
        """Get identification service areas from DSS - direct implementation"""
        try:
            if not hasattr(area.volume, 'outline_polygon'):
                return []
                
            area_string = ",".join([
                f"{vertex.lat},{vertex.lng}" 
                for vertex in area.volume.outline_polygon.vertices
            ])
            
            response = await self.client.request(
                "GET",
                "/dss/v1/identification_service_areas",
                params={
                    "area": area_string,
                    "earliest_time": area.time_start.value.isoformat('T').replace("+00:00", "") + 'Z',
                    "latest_time": area.time_end.value.isoformat('T').replace("+00:00", "") + 'Z',
                },
                scope=Authority.CONFORMANCE_MONITORING_SA
            )
            
            if response.status_code != 200:
                raise ValueError(f"Error querying ISAs: {response.text}")
            
            search_response = SearchIdentificationServiceAreasResponse.model_validate(response.json())
            self._last_isas = search_response.service_areas
            return search_response.service_areas
            
        except Exception as e:
            print(f"Error querying ISAs from DSS: {e}")
            print("Using cached ISA references")
            return self._last_isas