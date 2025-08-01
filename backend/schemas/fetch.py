from pydantic import BaseModel
from typing import List

from schemas.common.geo import Volume4D
from schemas.dss.remoteid import IdentificationServiceAreaFull
from .response import Response
from .uss.common import OperationalIntent, Constraint


class QueryVolumesResponseData(BaseModel):
    """
    Data model for the response of the query_volumes endpoint.
    """
    operational_intents: List[OperationalIntent]
    constraints: List[Constraint]
    identification_service_areas: List[IdentificationServiceAreaFull]


class QueryVolumesResponse(Response):
    """
    Response model for the query_volumes endpoint.
    """
    data: QueryVolumesResponseData
