from pydantic import BaseModel
from typing import List
from .response import Response
from .uss.common import OperationalIntent, Constraint


class QueryVolumesResponseData(BaseModel):
    """
    Data model for the response of the query_volumes endpoint.
    """
    operational_intents: List[OperationalIntent]
    constraints: List[Constraint]


class QueryVolumesResponse(Response):
    """
    Response model for the query_volumes endpoint.
    """
    data: QueryVolumesResponseData
