# API request schemas for airspace endpoints
from pydantic import BaseModel
from domain.value_objects import Volume4D


class AirspaceSnapshotRequest(BaseModel):
    """Request model for getting airspace snapshot"""
    area_of_interest: Volume4D


class FlightQueryRequest(BaseModel):
    """Request model for querying flights in an area"""
    north: float
    east: float
    south: float
    west: float