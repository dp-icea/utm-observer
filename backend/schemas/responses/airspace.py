# API response schemas for airspace endpoints
from pydantic import BaseModel
from typing import List
from datetime import datetime

# Import external schemas for API responses (these are fine to use in API layer)
from schemas.uss.constraints import Constraint
from schemas.uss.common import OperationalIntent
from schemas.dss.remoteid import IdentificationServiceAreaFull
from schemas.flights import Flight
from schemas.api.common import ApiResponse


class AirspaceSnapshotData(BaseModel):
    """Data payload for airspace snapshot response"""
    operational_intents: List[OperationalIntent]
    constraints: List[Constraint]
    identification_service_areas: List[IdentificationServiceAreaFull]
    timestamp: datetime
    total_volumes: int


class AirspaceSnapshotResponse(ApiResponse):
    """Response model for airspace snapshot endpoint"""
    data: AirspaceSnapshotData


class FlightQueryData(BaseModel):
    """Data payload for flight query response"""
    flights: List[Flight]
    partial: bool
    errors: List[str]
    timestamp: datetime


class FlightQueryResponse(ApiResponse):
    """Response model for flight query endpoint"""
    data: FlightQueryData