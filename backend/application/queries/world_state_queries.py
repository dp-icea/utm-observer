from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from ..handlers.base import Query, QueryHandler
from domain.entities.world_state import WorldStateSnapshot, ReservationRequest
from domain.ports.repositories import WorldStateRepository, ReservationRepository
from schemas.common.geo import Volume4D


@dataclass
class GetWorldStateQuery(Query):
    area_of_interest: Volume4D


@dataclass
class GetWorldStateHistoryQuery(Query):
    area_of_interest: Volume4D
    start_time: datetime
    end_time: datetime


@dataclass
class GetReservationQuery(Query):
    reservation_id: UUID


@dataclass
class GetActiveReservationsQuery(Query):
    area_of_interest: Volume4D


class GetWorldStateHandler(
    QueryHandler[GetWorldStateQuery, Optional[WorldStateSnapshot]]
):
    def __init__(self, world_state_repo: WorldStateRepository):
        self._world_state_repo = world_state_repo
    
    async def handle(self, query: GetWorldStateQuery) -> Optional[WorldStateSnapshot]:
        return await self._world_state_repo.get_latest_snapshot(query.area_of_interest)


class GetWorldStateHistoryHandler(
    QueryHandler[GetWorldStateHistoryQuery, List[WorldStateSnapshot]]
):
    def __init__(self, world_state_repo: WorldStateRepository):
        self._world_state_repo = world_state_repo
    
    async def handle(self, query: GetWorldStateHistoryQuery) -> List[WorldStateSnapshot]:
        return await self._world_state_repo.get_snapshots_by_timerange(
            query.area_of_interest,
            query.start_time,
            query.end_time
        )


class GetReservationHandler(
    QueryHandler[GetReservationQuery, Optional[ReservationRequest]]
):
    def __init__(self, reservation_repo: ReservationRepository):
        self._reservation_repo = reservation_repo
    
    async def handle(self, query: GetReservationQuery) -> Optional[ReservationRequest]:
        return await self._reservation_repo.get_reservation(query.reservation_id)


class GetActiveReservationsHandler(
    QueryHandler[GetActiveReservationsQuery, List[ReservationRequest]]
):
    def __init__(self, reservation_repo: ReservationRepository):
        self._reservation_repo = reservation_repo
    
    async def handle(self, query: GetActiveReservationsQuery) -> List[ReservationRequest]:
        return await self._reservation_repo.get_active_reservations(
            query.area_of_interest
        )