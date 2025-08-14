# API request schemas for constraint endpoints
from pydantic import BaseModel
from typing import List, Any
from domain.value_objects import LatLngPoint


class CreateConstraintRequest(BaseModel):
    """Request model for creating a constraint"""
    constraint_data: Any  # Flexible for different constraint types


class DeleteConstraintsInAreaRequest(BaseModel):
    """Request model for deleting constraints in an area"""
    coordinates: List[LatLngPoint]