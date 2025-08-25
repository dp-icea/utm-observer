from pydantic import BaseModel
from typing import List, Optional

from domain.value_objects import Time
from schemas.external.dss.remoteid import IdentificationServiceArea
from schemas.external.uss.remoteid import RIDFlight, RIDFlightDetails


class QueryFlightsResponse(BaseModel):
    """
    Response model for the query_volumes endpoint.
    """

    flights: List[Flight]
    partial: bool
    errors: List[str]
    timestamp: Time
