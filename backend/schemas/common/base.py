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


class ErrorResponse(BaseModel):
    """
    Human-readable string returned when an error occurs.
    """
    message: Optional[str]
