from http import HTTPStatus
from typing import List
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel

from core.container import Container
from application.commands.world_state_commands import (
    CreateWorldStateSnapshotCommand,
    CreateReservationCommand,
    CancelReservationCommand
)
from application.queries.world_state_queries import (
    GetWorldStateQuery,
    GetWorldStateHistoryQuery,
    GetReservationQuery,
    GetActiveReservationsQuery
)
from domain.entities.world_state import ReservationRequest
from schemas.common.geo import Volume4D
from schemas.response import Response
from schemas.fetch import QueryVolumesResponse, QueryVolumesResponseData


# Request/Response models
class CreateReservationRequest(BaseModel):
    area: Volume4D
    requester_id: str
    priority: int = 0


class WorldStateHistoryRequest(BaseModel):
    area_of_interest: Volume4D
    start_time: datetime
    end_time: datetime


router = APIRouter()
container = Container()


@router.post(
    "/volumes",
    response_description="Query world state for an area",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def query_world_state(
    area_of_interest: Volume4D = Body(),
    create_snapshot_handler=Depends(container.create_world_state_snapshot_handler),
    get_world_state_handler=Depends(container.get_world_state_handler),
):
    """Get current world state for an area, creating a new snapshot if needed"""
    
    # First try to get existing snapshot
    query = GetWorldStateQuery(area_of_interest=area_of_interest)
    snapshot = await get_world_state_handler.handle(query)
    
    # If no recent snapshot exists, create a new one
    if not snapshot:
        command = CreateWorldStateSnapshotCommand(area_of_interest=area_of_interest)
        snapshot = await create_snapshot_handler.handle(command)
    
    # Convert to response format
    response_data = QueryVolumesResponseData(
        operational_intents=snapshot.operational_intents,
        constraints=snapshot.constraints,
        identification_service_areas=snapshot.identification_service_areas,
    )
    
    return QueryVolumesResponse(
        message="World state retrieved successfully",
        data=response_data,
    )


@router.post(
    "/volumes/history",
    response_description="Get world state history for an area",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def get_world_state_history(
    request: WorldStateHistoryRequest = Body(),
    handler=Depends(container.get_world_state_history_handler),
):
    """Get historical world state snapshots for an area"""
    
    query = GetWorldStateHistoryQuery(
        area_of_interest=request.area_of_interest,
        start_time=request.start_time,
        end_time=request.end_time
    )
    
    snapshots = await handler.handle(query)
    
    return Response(
        message="World state history retrieved successfully",
        data={
            "snapshots": [
                {
                    "timestamp": snapshot.timestamp.isoformat(),
                    "operational_intents_count": len(snapshot.operational_intents),
                    "constraints_count": len(snapshot.constraints),
                    "flights_count": len(snapshot.flights),
                }
                for snapshot in snapshots
            ]
        }
    )


@router.post(
    "/reservations",
    response_description="Create a new reservation",
    response_model=Response,
    status_code=HTTPStatus.CREATED.value,
)
async def create_reservation(
    request: CreateReservationRequest = Body(),
    handler=Depends(container.create_reservation_handler),
):
    """Create a new area reservation"""
    
    reservation = ReservationRequest(
        id=UUID(),
        area=request.area,
        requester_id=request.requester_id,
        priority=request.priority,
        created_at=datetime.utcnow()
    )
    
    command = CreateReservationCommand(reservation=reservation)
    success = await handler.handle(command)
    
    if not success:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT.value,
            detail="Reservation conflicts with existing reservations or operational intents"
        )
    
    return Response(
        message="Reservation created successfully",
        data={"reservation_id": str(reservation.id)}
    )


@router.get(
    "/reservations/{reservation_id}",
    response_description="Get reservation details",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def get_reservation(
    reservation_id: UUID,
    handler=Depends(container.get_reservation_handler),
):
    """Get details of a specific reservation"""
    
    query = GetReservationQuery(reservation_id=reservation_id)
    reservation = await handler.handle(query)
    
    if not reservation:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND.value,
            detail="Reservation not found"
        )
    
    return Response(
        message="Reservation retrieved successfully",
        data={
            "id": str(reservation.id),
            "area": reservation.area.model_dump(),
            "requester_id": reservation.requester_id,
            "priority": reservation.priority,
            "created_at": reservation.created_at.isoformat() if reservation.created_at else None
        }
    )


@router.delete(
    "/reservations/{reservation_id}",
    response_description="Cancel a reservation",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def cancel_reservation(
    reservation_id: UUID,
    handler=Depends(container.cancel_reservation_handler),
):
    """Cancel an existing reservation"""
    
    command = CancelReservationCommand(reservation_id=reservation_id)
    success = await handler.handle(command)
    
    if not success:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND.value,
            detail="Reservation not found"
        )
    
    return Response(
        message="Reservation cancelled successfully",
        data={"reservation_id": str(reservation_id)}
    )


@router.post(
    "/reservations/active",
    response_description="Get active reservations in an area",
    response_model=Response,
    status_code=HTTPStatus.OK.value,
)
async def get_active_reservations(
    area_of_interest: Volume4D = Body(),
    handler=Depends(container.get_active_reservations_handler),
):
    """Get all active reservations in a specific area"""
    
    query = GetActiveReservationsQuery(area_of_interest=area_of_interest)
    reservations = await handler.handle(query)
    
    return Response(
        message="Active reservations retrieved successfully",
        data={
            "reservations": [
                {
                    "id": str(r.id),
                    "requester_id": r.requester_id,
                    "priority": r.priority,
                    "created_at": r.created_at.isoformat() if r.created_at else None
                }
                for r in reservations
            ]
        }
    )