from typing import List
from uuid import UUID
from pydantic import HttpUrl

from domain.ports.external_services import DSSService
from services.dss.constraints import DSSConstraintsService
from services.dss.operational_intents import DSSOperationalIntentsService
from services.dss.remoteid import DSSRemoteIDService
from schemas.common.geo import Volume4D
from schemas.dss.constraints import (
    QueryConstraintReferenceParameters,
    QueryConstraintReferencesResponse
)
from schemas.dss.operational_intents import (
    QueryOperationalIntentReferenceParameters,
    QueryOperationalIntentReferenceResponse
)
from schemas.dss.remoteid import SearchIdentificationServiceAreasResponse


class DSSServiceAdapter(DSSService):
    """Adapter for DSS service interactions"""
    
    def __init__(self):
        self._constraints_service = DSSConstraintsService()
        self._operational_intents_service = DSSOperationalIntentsService()
        self._remoteid_service = DSSRemoteIDService()
    
    async def query_constraints(self, area: Volume4D) -> QueryConstraintReferencesResponse:
        params = QueryConstraintReferenceParameters(area_of_interest=area)
        return await self._constraints_service.query_constraint_references(params)
    
    async def query_operational_intents(self, area: Volume4D) -> QueryOperationalIntentReferenceResponse:
        params = QueryOperationalIntentReferenceParameters(area_of_interest=area)
        return await self._operational_intents_service.query_operational_intent_references(params)
    
    async def query_identification_service_areas(
        self, 
        area: Volume4D
    ) -> SearchIdentificationServiceAreasResponse:
        # Convert Volume4D to area string format expected by DSS
        area_string = self._volume_to_area_string(area)
        
        # Extract time range from volume
        earliest_time = area.time_start.value.isoformat('T').replace("+00:00", "") + 'Z'
        latest_time = area.time_end.value.isoformat('T').replace("+00:00", "") + 'Z'
        
        return await self._remoteid_service.search_identification_service_areas(
            area=area_string,
            earliest_time=earliest_time,
            latest_time=latest_time
        )
    
    def _volume_to_area_string(self, volume: Volume4D) -> str:
        """Convert Volume4D to comma-separated coordinate string"""
        if hasattr(volume.volume, 'outline_polygon') and volume.volume.outline_polygon:
            vertices = volume.volume.outline_polygon.vertices
            return ",".join([f"{v.lat},{v.lng}" for v in vertices])
        
        # Fallback for other volume types
        return "0,0,0,0,0,0,0,0"  # Default area