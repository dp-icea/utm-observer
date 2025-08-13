# Domain entities - core business objects
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from .value_objects import Volume4D


class AirspaceVolume(BaseModel):
    """Core domain entity representing any 4D volume in airspace"""
    id: str
    volume: Volume4D
    type: str  # 'constraint', 'operational_intent', 'identification_service_area'
    source_url: Optional[str] = None
    metadata: dict = {}


class AirspaceSnapshot(BaseModel):
    """Aggregated view of airspace at a point in time - pure domain entity"""
    timestamp: datetime
    area_of_interest: Volume4D
    # Note: We'll use generic types here to avoid external schema dependencies
    # The adapters will handle conversion between domain and external schemas
    constraints: List[dict] = []
    operational_intents: List[dict] = []
    identification_service_areas: List[dict] = []
    active_flights: List[dict] = []
    
    @property
    def total_volumes(self) -> int:
        return len(self.constraints) + len(self.operational_intents) + len(self.identification_service_areas)
    
    @property
    def total_active_flights(self) -> int:
        return len(self.active_flights)