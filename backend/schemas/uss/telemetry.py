from __future__ import annotations
from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from ..common.base import Time
from ..common.geo import Position, Altitude
from ..common.enums import VelocityUnitsSpeed


class Velocity(BaseModel):
    """
    Velocity of the vehicle (UAS).
    """
    speed: float
    units_speed: VelocityUnitsSpeed
    track: Optional[float] = 0


class VehicleTelemetry(BaseModel):
    """
    Vehicle position, altitude, and velocity.
    """
    time_measured: Time
    position: Optional[Position]
    velocity: Optional[Velocity]


class GetOperationalIntentTelemetryResponse(BaseModel):
    """
    Response to a peer request for telemetry of an off-nominal operational intent.
    """
    operational_intent_id: Optional[UUID]
    telemetry: Optional[VehicleTelemetry]
    next_telemetry_opportunity: Optional[Time]
