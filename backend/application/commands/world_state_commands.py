from dataclasses import dataclass
from typing import List
from uuid import UUID

from ..handlers.base import Command, CommandHandler
from domain.entities.world_state import WorldStateSnapshot, ReservationRequest
from domain.services.world_state_domain_service import WorldStateDomainService
from domain.ports.repositories import ReservationRepository
from domain.ports.external_services import NotificationService
from schemas.common.geo import Volume4D


@dataclass
class CreateWorldStateSnapshotCommand(Command):
    area_of_interest: Volume4D


@dataclass
class CreateReservationCommand(Command):
    reservation: ReservationRequest


@dataclass
class CancelReservationCommand(Command):
    reservation_id: UUID


class CreateWorldStateSnapshotHandler(
    CommandHandler[CreateWorldStateSnapshotCommand, WorldStateSnapshot]
):
    def __init__(self, world_state_service: WorldStateDomainService):
        self._world_state_service = world_state_service
    
    async def handle(self, command: CreateWorldStateSnapshotCommand) -> WorldStateSnapshot:
        return await self._world_state_service.create_world_state_snapshot(
            command.area_of_interest
        )


class CreateReservationHandler(CommandHandler[CreateReservationCommand, bool]):
    def __init__(
        self,
        world_state_service: WorldStateDomainService,
        reservation_repo: ReservationRepository,
        notification_service: NotificationService,
    ):
        self._world_state_service = world_state_service
        self._reservation_repo = reservation_repo
        self._notification_service = notification_service
    
    async def handle(self, command: CreateReservationCommand) -> bool:
        # Validate reservation
        is_valid, conflicts = await self._world_state_service.validate_reservation_request(
            command.reservation
        )
        
        if not is_valid:
            await self._notification_service.notify_reservation_conflict(conflicts)
            return False
        
        # Save reservation
        await self._reservation_repo.save_reservation(command.reservation)
        return True


class CancelReservationHandler(CommandHandler[CancelReservationCommand, bool]):
    def __init__(self, reservation_repo: ReservationRepository):
        self._reservation_repo = reservation_repo
    
    async def handle(self, command: CancelReservationCommand) -> bool:
        return await self._reservation_repo.delete_reservation(command.reservation_id)