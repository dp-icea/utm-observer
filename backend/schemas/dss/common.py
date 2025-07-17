from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from schemas.common.base import Time
from schemas.common.enums import (
    UssAvailabilityState,
    FlightType,
    OperationalIntentState,
)


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


class SubscriptionState(BaseModel):
    """
    State of subscription which is causing a notification to be sent.
    """
    subscription_id: Optional[UUID]
    notification_index: Optional[int] = Field(0, ge=0)


class SubscriberToNotify(BaseModel):
    """
    Subscriber to notify of a change in the airspace.
    """
    subscriptions: List[SubscriptionState] = Field(..., min_items=1)
    uss_base_url: Optional[str]
