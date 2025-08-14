# Ports - interfaces for external data sources
from abc import ABC, abstractmethod
from typing import List

from domain.base import Volume4D
from domain.external.dss.common import (
    ConstraintReference,
    OperationalIntentReference,
)
from domain.external.dss.remoteid import (
    IdentificationServiceArea,
    IdentificationServiceAreaFull,
)
from domain.external.uss.common import Constraint, OperationalIntent


class AirspaceReferencesDataPort(ABC):
    """Port for fetching airspace constraint references"""

    @abstractmethod
    async def get_constraint_references(
        self, area: Volume4D
    ) -> List[ConstraintReference]:
        pass

    @abstractmethod
    async def get_operational_intent_references(
        self, area: Volume4D
    ) -> List[OperationalIntentReference]:
        pass

    @abstractmethod
    async def get_identification_service_areas(
        self, area: Volume4D
    ) -> List[IdentificationServiceArea]:
        pass


class AirspaceDetailsDataPort(ABC):
    """Port for fetching detailed volume information from USS"""

    @abstractmethod
    async def get_constraint_details(
        self, reference: ConstraintReference
    ) -> Constraint:
        pass

    @abstractmethod
    async def get_operational_intent_details(
        self, reference: OperationalIntentReference
    ) -> OperationalIntent:
        pass

    @abstractmethod
    async def get_identification_service_area_details(
        self, reference: IdentificationServiceArea
    ) -> IdentificationServiceAreaFull:
        pass
