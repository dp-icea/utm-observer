# Domain entities - core business objects
from typing import List
from pydantic import BaseModel
from datetime import datetime

from domain.base import Volume4D

from domain.external.uss.common import OperationalIntent, Constraint
from domain.external.dss.remoteid import (
    IdentificationServiceAreaFull,
)


class AirspaceAllocations(BaseModel):
    """Aggregated view of airspace at a point in time - pure domain entity"""

    timestamp: datetime
    area_of_interest: Volume4D
    constraints: List[Constraint] = []
    operational_intents: List[OperationalIntent] = []
    identification_service_areas: List[IdentificationServiceAreaFull] = []

    @property
    def total_volumes(self) -> int:
        return (
            len(self.constraints)
            + len(self.operational_intents)
            + len(self.identification_service_areas)
        )
