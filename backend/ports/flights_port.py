# Ports - interfaces for external data sources
from abc import ABC, abstractmethod
from typing import List

from domain.flights import Flight
from schemas.requests.flights import QueryFlightsRequest


class FlightDataPort(ABC):
    """Port for fetching live flight data"""

    @abstractmethod
    async def get_active_flights(
        self, area: QueryFlightsRequest
    ) -> List[Flight]:
        pass
