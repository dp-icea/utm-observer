from abc import ABC, abstractmethod
from typing import List
from uuid import UUID
from pydantic import HttpUrl

from schemas.common.geo import Volume4D
from schemas.dss.constraints import QueryConstraintReferencesResponse
from schemas.dss.operational_intents import QueryOperationalIntentReferenceResponse
from schemas.dss.remoteid import SearchIdentificationServiceAreasResponse
from schemas.uss.operational_intents import OperationalIntent
from schemas.uss.constraints import Constraint
from schemas.dss.remoteid import IdentificationServiceAreaFull
from schemas.flights import QueryFlightsRequest, QueryFlightsResponse


class DSSService(ABC):
    """Port for DSS (Discovery and Synchronization Service) interactions"""
    
    @abstractmethod
    async def query_constraints(self, area: Volume4D) -> QueryConstraintReferencesResponse:
        """Query constraint references from DSS"""
        pass
    
    @abstractmethod
    async def query_operational_intents(self, area: Volume4D) -> QueryOperationalIntentReferenceResponse:
        """Query operational intent references from DSS"""
        pass
    
    @abstractmethod
    async def query_identification_service_areas(
        self, 
        area: Volume4D
    ) -> SearchIdentificationServiceAreasResponse:
        """Query identification service areas from DSS"""
        pass


class USSService(ABC):
    """Port for USS (UAS Service Supplier) interactions"""
    
    @abstractmethod
    async def get_operational_intent_details(
        self, 
        base_url: HttpUrl, 
        intent_id: UUID
    ) -> OperationalIntent:
        """Get detailed operational intent from USS"""
        pass
    
    @abstractmethod
    async def get_constraint_details(
        self, 
        base_url: HttpUrl, 
        constraint_id: UUID
    ) -> Constraint:
        """Get detailed constraint from USS"""
        pass
    
    @abstractmethod
    async def get_identification_service_area_details(
        self, 
        base_url: HttpUrl, 
        area_id: UUID
    ) -> IdentificationServiceAreaFull:
        """Get detailed identification service area from USS"""
        pass


class FlightTrackingService(ABC):
    """Port for flight tracking service interactions"""
    
    @abstractmethod
    async def query_flights(self, request: QueryFlightsRequest) -> QueryFlightsResponse:
        """Query live flight data"""
        pass


class NotificationService(ABC):
    """Port for sending notifications about world state changes"""
    
    @abstractmethod
    async def notify_world_state_change(self, snapshot: 'WorldStateSnapshot') -> None:
        """Notify subscribers of world state changes"""
        pass
    
    @abstractmethod
    async def notify_reservation_conflict(self, conflicts: List[str]) -> None:
        """Notify about reservation conflicts"""
        pass