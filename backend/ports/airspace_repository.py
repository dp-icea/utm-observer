# Ports - interfaces for external data sources
from abc import ABC, abstractmethod
from typing import List

from domain.value_objects import Volume4D
from schemas.external.dss.common import ConstraintReference, OperationalIntentReference
from schemas.external.dss.remoteid import IdentificationServiceArea, IdentificationServiceAreaFull
from schemas.external.uss.common import Constraint, OperationalIntent
from schemas.flights import Flight, QueryFlightsRequest


class AirspaceDataPort(ABC):
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


class VolumeDetailsPort(ABC):
    """Port for fetching detailed volume information from USS"""

    @abstractmethod
    async def get_constraint_details(self, reference: ConstraintReference) -> Constraint:
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


class FlightDataPort(ABC):
    """Port for fetching live flight data"""

    @abstractmethod
    async def get_active_flights(
        self, area: QueryFlightsRequest
    ) -> List[Flight]:
        pass


class ConstraintManagementPort(ABC):
    """Port for managing constraints"""

    @abstractmethod
    async def create_constraint(self, constraint_data: dict):
        pass

    @abstractmethod
    async def delete_constraint(self, constraint_id: str, ovn: str):
        pass

