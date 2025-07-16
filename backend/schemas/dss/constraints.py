from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..common.base import Time
from ..common.enums import UssAvailabilityState
from ..common.geo import Volume4D
from .subscriptions import SubscriberToNotify


class ConstraintReference(BaseModel):
    """
    A ConstraintReference (area in which a constraint is present).
    """
    id: Optional[UUID]
    manager: Optional[str]
    uss_availability: Optional[UssAvailabilityState]
    version: Optional[int]
    ovn: Optional[str]
    time_start: Optional[Time]
    time_end: Optional[Time]
    uss_base_url: Optional[str]


class PutConstraintReferenceParameters(BaseModel):
    """
    Parameters for a request to create/update a ConstraintReference in the DSS.
    """
    extents: List[Volume4D] = Field(..., min_items=1)
    uss_base_url: Optional[str]


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
    area_of_interest: Optional[Volume4D]


class QueryConstraintReferencesResponse(BaseModel):
    """
    Response to DSS query for ConstraintReferences in an area of interest.
    """
    constraint_references: List[ConstraintReference] = []
