from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from ..entities.world_state import WorldStateSnapshot, ReservationRequest
from schemas.common.geo import Volume4D


class WorldStateRepository(ABC):
    """Port for world state data persistence"""
    
    @abstractmethod
    async def save_snapshot(self, snapshot: WorldStateSnapshot) -> None:
        """Save a world state snapshot"""
        pass
    
    @abstractmethod
    async def get_latest_snapshot(self, area: Volume4D) -> Optional[WorldStateSnapshot]:
        """Get the most recent snapshot for an area"""
        pass
    
    @abstractmethod
    async def get_snapshots_by_timerange(
        self, 
        area: Volume4D, 
        start_time: datetime, 
        end_time: datetime
    ) -> List[WorldStateSnapshot]:
        """Get snapshots within a time range"""
        pass


class ReservationRepository(ABC):
    """Port for reservation data persistence"""
    
    @abstractmethod
    async def save_reservation(self, reservation: ReservationRequest) -> None:
        """Save a reservation request"""
        pass
    
    @abstractmethod
    async def get_reservation(self, reservation_id: UUID) -> Optional[ReservationRequest]:
        """Get a reservation by ID"""
        pass
    
    @abstractmethod
    async def get_active_reservations(self, area: Volume4D) -> List[ReservationRequest]:
        """Get active reservations in an area"""
        pass
    
    @abstractmethod
    async def delete_reservation(self, reservation_id: UUID) -> bool:
        """Delete a reservation"""
        pass