from __future__ import annotations
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from .enums import TimeFormat


class Time(BaseModel):
    """
    A time object with a value and format.
    """
    value: datetime
    format: TimeFormat

    class Config:
        json_encoders = {
            # TODO: I guess this should somehow consider the timezone, but I still dont understand how to send timezone times to the DSS service
            datetime: lambda v: v.isoformat('T').replace("+00:00", "") + 'Z'
        }


class ErrorResponse(BaseModel):
    """
    Human-readable string returned when an error occurs.
    """
    message: Optional[str] = None
