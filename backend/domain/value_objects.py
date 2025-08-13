# Domain value objects - pure domain primitives with no external dependencies
from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator
from datetime import datetime
from enum import Enum


# Domain enums (moved from schemas/common/enums.py)
class TimeFormat(str, Enum):
    RFC3339 = "RFC3339"


class AltitudeReference(str, Enum):
    W84 = "W84"
    AGL = "AGL"


class AltitudeUnits(str, Enum):
    M = "M"
    FT = "FT"


class RadiusUnits(str, Enum):
    M = "M"
    KM = "KM"
    NM = "NM"


# Domain value objects
class Time(BaseModel):
    """Domain time representation"""

    value: datetime
    format: TimeFormat = TimeFormat.RFC3339

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat("T").replace("+00:00", "") + "Z"
        }


class Altitude(BaseModel):
    """Domain altitude representation"""

    value: float
    reference: AltitudeReference
    units: AltitudeUnits


class Radius(BaseModel):
    """Domain radius representation"""

    value: float = Field(..., gt=0)
    units: RadiusUnits


class LatLngPoint(BaseModel):
    """Point on the earth's surface - core domain primitive"""

    lng: float
    lat: float


class Polygon(BaseModel):
    """Enclosed area on the earth - domain geometric primitive"""

    vertices: List[LatLngPoint] = Field(..., min_items=3)


class Circle(BaseModel):
    """Circular area on the earth's surface - domain geometric primitive"""

    center: Optional[LatLngPoint] = None
    radius: Optional[Radius] = None


class Volume3D(BaseModel):
    """Three-dimensional geographic volume - core domain concept"""

    outline_circle: Optional[Circle] = None
    outline_polygon: Optional[Polygon] = None
    altitude_lower: Altitude
    altitude_upper: Altitude

    @model_validator(mode="before")
    def check_fields(cls, values):
        if not values.get("outline_circle") and not values.get(
            "outline_polygon"
        ):
            raise ValueError(
                "Either outline_circle or outline_polygon must be provided."
            )
        if values.get("outline_circle") and values.get("outline_polygon"):
            raise ValueError(
                "Only one of outline_circle or outline_polygon can be"
                " provided."
            )
        return values


class Volume4D(BaseModel):
    """Contiguous block of geographic spacetime - fundamental domain concept"""

    volume: Volume3D
    time_start: Time
    time_end: Time

