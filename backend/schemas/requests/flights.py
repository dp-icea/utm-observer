from pydantic import BaseModel


class QueryFlightsRequest(BaseModel):
    """
    Data model for the response of the query_volumes endpoint.
    """

    north: float
    east: float
    south: float
    west: float
