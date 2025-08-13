# Ports - interfaces for external data sources
from abc import ABC, abstractmethod
from typing import List

from schemas.common.geo import Volume4D
from schemas.dss.common import ConstraintReference, OperationalIntentReference
from schemas.dss.remoteid import IdentificationServiceArea
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
    async def get_constraint_details(self, reference: ConstraintReference):
        pass

    @abstractmethod
    async def get_operational_intent_details(
        self, reference: OperationalIntentReference
    ):
        pass

    @abstractmethod
    async def get_identification_service_area_details(
        self, reference: IdentificationServiceArea
    ):
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

