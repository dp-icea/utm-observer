from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..common.base import Time
from ..common.enums import FlightType, OperationalIntentState, UssAvailabilityState
from ..common.geo import Volume4D
from .subscriptions import SubscriberToNotify, ImplicitSubscriptionParameters
from .common import OperationalIntentReference, ConstraintReference


class PutOperationalIntentReferenceParameters(BaseModel):
    """
    Parameters for a request to create an OperationalIntentReference in the DSS.
    """
    extents: List[Volume4D] = Field(..., min_items=1)
    key: Optional[List[str]] = []
    state: OperationalIntentState
    uss_base_url: Optional[str] = None
    subscription_id: Optional[UUID] = None
    new_subscription: Optional[ImplicitSubscriptionParameters] = None
    flight_type: Optional[FlightType] = None


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
    area_of_interest: Optional[Volume4D] = None


class QueryOperationalIntentReferenceResponse(BaseModel):
    """
    Response to DSS query for OperationalIntentReferences in an area of interest.
    """
    operational_intent_references: List[OperationalIntentReference] = []


class AirspaceConflictResponse(BaseModel):
    """
    Data provided when an airspace conflict was encountered.
    """
    message: Optional[str] = None
    missing_operational_intents: List[OperationalIntentReference] = []
    missing_constraints: List[ConstraintReference] = []
