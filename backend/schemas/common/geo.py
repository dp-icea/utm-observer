from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field
from .base import Time
from .enums import (
    RadiusUnits,
    AltitudeReference,
    AltitudeUnits,
    PositionAccuracyHorizontal,
    PositionAccuracyVertical,
)


class Radius(BaseModel):
    """
    A radius object with a value and units.
    """
    value: float = Field(..., gt=0)
    units: RadiusUnits


class Altitude(BaseModel):
    """
    An altitude object with a value, reference, and units.
    """
    value: float
    reference: AltitudeReference
    units: AltitudeUnits


class LatLngPoint(BaseModel):
    """
    Point on the earth's surface.
    """
    lng: float
    lat: float


class Polygon(BaseModel):
    """
    An enclosed area on the earth.
    """
    vertices: List[LatLngPoint] = Field(..., min_items=3)


class Circle(BaseModel):
    """
    A circular area on the surface of the earth.
    """
    center: Optional[LatLngPoint]
    radius: Optional[Radius]


class Volume3D(BaseModel):
    """
    A three-dimensional geographic volume consisting of a vertically-extruded shape.
    """
    outline_circle: Optional[Circle]
    outline_polygon: Optional[Polygon]
    altitude_lower: Optional[Altitude]
    altitude_upper: Optional[Altitude]


class Volume4D(BaseModel):
    """
    Contiguous block of geographic spacetime.
    """
    volume: Volume3D
    time_start: Optional[Time]
    time_end: Optional[Time]


class Position(BaseModel):
    """
    Location of the vehicle (UAS) as reported for UTM.
    """
    longitude: Optional[float]
    latitude: Optional[float]
    accuracy_h: Optional[PositionAccuracyHorizontal]
    accuracy_v: Optional[PositionAccuracyVertical]
    extrapolated: bool = False
    altitude: Optional[Altitude]
