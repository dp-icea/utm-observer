from uuid import UUID
from pydantic import HttpUrl

from domain.ports.external_services import USSService
from services.uss.operational_intents import USSOperationalIntentsService
from services.uss.constraints import USSConstraintsService
from services.uss.remoteid import USSRemoteIDService
from schemas.uss.operational_intents import OperationalIntent
from schemas.uss.constraints import Constraint
from schemas.dss.remoteid import IdentificationServiceAreaFull, IdentificationServiceAreaDetails


class USSServiceAdapter(USSService):
    """Adapter for USS service interactions"""
    
    async def get_operational_intent_details(
        self, 
        base_url: HttpUrl, 
        intent_id: UUID
    ) -> OperationalIntent:
        service = USSOperationalIntentsService(base_url=base_url)
        response = await service.get_operational_intent_details(intent_id)
        return response.operational_intent
    
    async def get_constraint_details(
        self, 
        base_url: HttpUrl, 
        constraint_id: UUID
    ) -> Constraint:
        service = USSConstraintsService(base_url=base_url)
        response = await service.get_constraint_details(constraint_id)
        return response.constraint
    
    async def get_identification_service_area_details(
        self, 
        base_url: HttpUrl, 
        area_id: UUID
    ) -> IdentificationServiceAreaFull:
        service = USSRemoteIDService(base_url=base_url)
        response = await service.get_identification_service_area_details(area_id)
        
        # Create full ISA object
        return IdentificationServiceAreaFull(
            reference=response,  # Assuming response contains reference data
            details=IdentificationServiceAreaDetails(
                volumes=[response.extents]
            )
        )