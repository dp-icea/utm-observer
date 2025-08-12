from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID

from domain.ports.repositories import WorldStateRepository, ReservationRepository
from domain.entities.world_state import WorldStateSnapshot, ReservationRequest
from schemas.common.geo import Volume4D


class InMemoryWorldStateRepository(WorldStateRepository):
    """In-memory implementation of WorldStateRepository for development/testing"""
    
    def __init__(self):
        self._snapshots: List[WorldStateSnapshot] = []
    
    async def save_snapshot(self, snapshot: WorldStateSnapshot) -> None:
        self._snapshots.append(snapshot)
        # Keep only last 100 snapshots to prevent memory issues
        if len(self._snapshots) > 100:
            self._snapshots = self._snapshots[-100:]
    
    async def get_latest_snapshot(self, area: Volume4D) -> Optional[WorldStateSnapshot]:
        # Simple implementation - in production would need proper spatial indexing
        matching_snapshots = [
            s for s in self._snapshots 
            if self._areas_overlap(s.area_of_interest, area)
        ]
        
        if not matching_snapshots:
            return None
        
        return max(matching_snapshots, key=lambda s: s.timestamp)
    
    async def get_snapshots_by_timerange(
        self, 
        area: Volume4D, 
        start_time: datetime, 
        end_time: datetime
    ) -> List[WorldStateSnapshot]:
        return [
            s for s in self._snapshots
            if (self._areas_overlap(s.area_of_interest, area) and
                start_time <= s.timestamp <= end_time)
        ]
    
    def _areas_overlap(self, area1: Volume4D, area2: Volume4D) -> bool:
        """Simplified area overlap check - would need proper implementation"""
        # For now, assume all areas overlap
        return True


class InMemoryReservationRepository(ReservationRepository):
    """In-memory implementation of ReservationRepository for development/testing"""
    
    def __init__(self):
        self._reservations: Dict[UUID, ReservationRequest] = {}
    
    async def save_reservation(self, reservation: ReservationRequest) -> None:
        self._reservations[reservation.id] = reservation
    
    async def get_reservation(self, reservation_id: UUID) -> Optional[ReservationRequest]:
        return self._reservations.get(reservation_id)
    
    async def get_active_reservations(self, area: Volume4D) -> List[ReservationRequest]:
        # Simple implementation - would need proper spatial queries in production
        return list(self._reservations.values())
    
    async def delete_reservation(self, reservation_id: UUID) -> bool:
        if reservation_id in self._reservations:
            del self._reservations[reservation_id]
            return True
        return False