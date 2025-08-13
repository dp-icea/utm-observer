# Compatibility layer for base schemas
from domain.value_objects import Time
from pydantic import BaseModel
from typing import Optional


class ErrorResponse(BaseModel):
    """
    Human-readable string returned when an error occurs.
    """
    message: Optional[str] = None