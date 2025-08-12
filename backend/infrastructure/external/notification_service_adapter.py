from typing import List
import logging

from domain.ports.external_services import NotificationService
from domain.entities.world_state import WorldStateSnapshot


logger = logging.getLogger(__name__)


class LoggingNotificationService(NotificationService):
    """Simple logging-based notification service for development"""
    
    async def notify_world_state_change(self, snapshot: WorldStateSnapshot) -> None:
        logger.info(
            f"World state changed for area {snapshot.area_of_interest} "
            f"at {snapshot.timestamp}. "
            f"Found {len(snapshot.operational_intents)} operational intents, "
            f"{len(snapshot.constraints)} constraints, "
            f"{len(snapshot.flights)} flights."
        )
    
    async def notify_reservation_conflict(self, conflicts: List[str]) -> None:
        logger.warning(f"Reservation conflicts detected: {', '.join(conflicts)}")


class WebSocketNotificationService(NotificationService):
    """WebSocket-based notification service for real-time updates"""
    
    def __init__(self):
        self._connections = []  # Would store WebSocket connections
    
    async def notify_world_state_change(self, snapshot: WorldStateSnapshot) -> None:
        # Would broadcast to all connected WebSocket clients
        message = {
            "type": "world_state_update",
            "area": snapshot.area_of_interest.model_dump(),
            "timestamp": snapshot.timestamp.isoformat(),
            "operational_intents_count": len(snapshot.operational_intents),
            "constraints_count": len(snapshot.constraints),
            "flights_count": len(snapshot.flights),
        }
        
        # Placeholder for WebSocket broadcast
        logger.info(f"Broadcasting world state update: {message}")
    
    async def notify_reservation_conflict(self, conflicts: List[str]) -> None:
        message = {
            "type": "reservation_conflict",
            "conflicts": conflicts
        }
        
        # Placeholder for WebSocket broadcast
        logger.warning(f"Broadcasting reservation conflict: {message}")