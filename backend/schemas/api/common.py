# Common API schemas
from pydantic import BaseModel
from typing import Optional, Any


class ApiResponse(BaseModel):
    """Base API response model"""
    message: Optional[str] = None
    data: Optional[Any] = None


class ApiError(BaseModel):
    """API error response model"""
    message: str
    error_code: Optional[str] = None
    details: Optional[Any] = None