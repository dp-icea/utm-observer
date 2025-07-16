from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator
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
    outline_circle: Optional[Circle] = None
    outline_polygon: Optional[Polygon] = None
    altitude_lower: Altitude
    altitude_upper: Altitude

    @model_validator(mode="before")
    def check_fields(cls, values):
        if not values.get("outline_circle") and not values.get("outline_polygon"):
            raise ValueError(
                "Either outline_circle or outline_polygon must be provided.")
        if values.get("outline_circle") and values.get("outline_polygon"):
            raise ValueError(
                "Only one of outline_circle or outline_polygon can be provided.")
        return values


class Volume4D(BaseModel):
    """
    Contiguous block of geographic spacetime.
    """
    volume: Volume3D
    time_start: Time
    time_end: Time


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
