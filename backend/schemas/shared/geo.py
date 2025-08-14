# Compatibility layer - re-exports domain value objects for backward compatibility
# This allows existing code to continue working while we migrate

from domain.value_objects import (
    Volume4D,
    Volume3D,
    Polygon,
    Circle,
    LatLngPoint,
    Altitude,
    Radius,
    Time
)

# Re-export position and other external-specific schemas
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from domain.value_objects import Altitude
from .enums import PositionAccuracyHorizontal, PositionAccuracyVertical


class Position(BaseModel):
    """
    Location of the vehicle (UAS) as reported for UTM.
    """
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    accuracy_h: Optional[PositionAccuracyHorizontal] = None
    accuracy_v: Optional[PositionAccuracyVertical] = None
    extrapolated: bool = False
    altitude: Optional[Altitude] = None


class GeoZone(BaseModel):
    """
    An airspace of defined dimensions, above the land areas or territorial
    waters of a State, within which a particular restriction or condition
    for UAS flights applies.
    """
    identifier: str
    country: str
    zone_authority: List[Any]
    type: str
    restriction: str
    name: Optional[str] = None
    restriction_conditions: Optional[List[Any]] = None
    region: Optional[int] = Field(None, ge=0, le=65535)
    reason: Optional[List[str]] = Field(default=None, max_items=9)
    other_reason_info: Optional[str] = Field(default=None, max_length=30)
    regulation_exemption: Optional[str] = None
    u_space_class: Optional[str] = None
    message: Optional[str] = None
    additional_properties: Optional[dict] = Field(default=None)
