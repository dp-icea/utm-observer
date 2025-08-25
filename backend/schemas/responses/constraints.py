# API response schemas for constraint endpoints
from pydantic import BaseModel
from typing import Any, List
from domain.value_objects import LatLngPoint
from schemas.api.common import ApiResponse


class CreateConstraintData(BaseModel):
    """Data payload for constraint creation response"""
    constraint_id: str
    status: str
    details: Any


class CreateConstraintResponse(ApiResponse):
    """Response model for constraint creation endpoint"""
    data: CreateConstraintData


class DeleteConstraintsData(BaseModel):
    """Data payload for constraint deletion response"""
    coordinates: List[LatLngPoint]
    deleted_count: int
    errors: List[str] = []


class DeleteConstraintsResponse(ApiResponse):
    """Response model for constraint deletion endpoint"""
    data: DeleteConstraintsData