from pydantic import BaseModel
from typing import List, Optional

from domain.value_objects import Time
from schemas.external.dss.remoteid import IdentificationServiceArea
from schemas.external.uss.remoteid import RIDFlight, RIDFlightDetails

class Flight(RIDFlight):
    identification_service_area: IdentificationServiceArea
    details: Optional[RIDFlightDetails]

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
