from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field
from domain.base import Volume4D
from domain.external.dss.common import ConstraintReference, SubscriberToNotify


class PutConstraintReferenceParameters(BaseModel):
    """
    Parameters for a request to create/update a ConstraintReference in the DSS.
    """

    extents: List[Volume4D] = Field(..., min_items=1)
    uss_base_url: Optional[str] = None


class GetConstraintReferenceResponse(BaseModel):
    """
    Response to DSS request for the ConstraintReference with the given ID.
    """

    constraint_reference: ConstraintReference


class ChangeConstraintReferenceResponse(BaseModel):
    """
    Response to a request to create, update, or delete a ConstraintReference.
    """

    subscribers: List[SubscriberToNotify] = []
    constraint_reference: ConstraintReference


class QueryConstraintReferenceParameters(BaseModel):
    """
    Parameters for a request to find ConstraintReferences matching the provided criteria.
    """

    area_of_interest: Optional[Volume4D] = None


class QueryConstraintReferencesResponse(BaseModel):
    """
    Response to DSS query for ConstraintReferences in an area of interest.
    """

    constraint_references: List[ConstraintReference] = []
