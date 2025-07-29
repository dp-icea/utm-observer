from pydantic import BaseModel
from typing import List, Optional

from schemas.common.base import Time
from schemas.dss.remoteid import IdentificationServiceArea
from schemas.uss.remoteid import RIDFlight, RIDFlightDetails
from .response import Response
from .uss.common import OperationalIntent, Constraint

class Flight(RIDFlight):
    identification_service_area: IdentificationServiceArea
    details: RIDFlightDetails

class QueryFlightsRequest(BaseModel):
    """
    Data model for the response of the query_volumes endpoint.
    """
    north: float
    east: float
    south: float
    west: float


class QueryFlightsResponse(BaseModel):
    """
    Response model for the query_volumes endpoint.
    """
    flights: List[Flight]
    partial: bool
    errors: List[str]
    timestamp: Time
