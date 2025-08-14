# Common API schemas
from pydantic import BaseModel
from typing import Optional, Any
from fastapi import HTTPException


class ApiResponse(BaseModel):
    """Base API response model"""

    message: Optional[str] = None
    data: Optional[Any] = None


class ApiException(HTTPException):
    """Custom API exception that can be raised in endpoints"""

    def __init__(
        self, status_code: int, message: str, details: Optional[Any] = None
    ):
        self.message = message
        self.details = details
        super().__init__(
            status_code=status_code,
            detail={"message": message, "details": details},
        )
