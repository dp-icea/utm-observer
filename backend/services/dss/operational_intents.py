from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from schemas.common.base import Time
from schemas.common.enums import FlightType, OperationalIntentState, UssAvailabilityState
from schemas.common.geo import Volume4D
from schemas.dss.subscriptions import ImplicitSubscriptionParameters
from schemas.dss.common import ConstraintReference, SubscriberToNotify


class OperationalIntentReference(BaseModel):
    """
    High-level information of a planned or active operational intent.
    """
    id: Optional[UUID]
    flight_type: Optional[FlightType]
    manager: Optional[str]
    uss_availability: Optional[UssAvailabilityState]
    version: Optional[int]
    state: Optional[OperationalIntentState]
    ovn: Optional[str]
    time_start: Optional[Time]
    time_end: Optional[Time]
    uss_base_url: Optional[str]
    subscription_id: Optional[UUID]


class PutOperationalIntentReferenceParameters(BaseModel):
    """
    Parameters for a request to create an OperationalIntentReference in the DSS.
    """
    extents: List[Volume4D] = Field(..., min_items=1)
    key: Optional[List[str]] = []
    state: OperationalIntentState
    uss_base_url: Optional[str]
    subscription_id: Optional[UUID]
    new_subscription: Optional[ImplicitSubscriptionParameters]
    flight_type: Optional[FlightType]


class GetOperationalIntentReferenceResponse(BaseModel):
    """
    Response to DSS request for the OperationalIntentReference with the given ID.
    """
    operational_intent_reference: OperationalIntentReference


class ChangeOperationalIntentReferenceResponse(BaseModel):
    """
    Response to a request to create, update, or delete an OperationalIntentReference in the DSS.
    """
    subscribers: List[SubscriberToNotify] = []
    operational_intent_reference: OperationalIntentReference


class QueryOperationalIntentReferenceParameters(BaseModel):
    """
    Parameters for a request to find OperationalIntentReferences matching the provided criteria.
    """
    area_of_interest: Optional[Volume4D]


class QueryOperationalIntentReferenceResponse(BaseModel):
    """
    Response to DSS query for OperationalIntentReferences in an area of interest.
    """
    operational_intent_references: List[OperationalIntentReference] = []


class AirspaceConflictResponse(BaseModel):
    """
    Data provided when an airspace conflict was encountered.
    """
    message: Optional[str]
    missing_operational_intents: List[OperationalIntentReference] = []
    missing_constraints: List[ConstraintReference] = []
