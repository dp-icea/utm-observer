from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from domain.base import Time
from schemas.enums import (
    UssAvailabilityState,
    FlightType,
    OperationalIntentState,
)


class ConstraintReference(BaseModel):
    """
    A ConstraintReference (area in which a constraint is present).
    """

    id: Optional[UUID] = None
    manager: Optional[str] = None
    uss_availability: Optional[UssAvailabilityState] = None
    version: Optional[int] = None
    ovn: Optional[str] = None
    time_start: Optional[Time] = None
    time_end: Optional[Time] = None
    uss_base_url: Optional[str] = None


class OperationalIntentReference(BaseModel):
    """
    High-level information of a planned or active operational intent.
    """

    id: Optional[UUID] = None
    flight_type: Optional[FlightType] = None
    manager: Optional[str] = None
    uss_availability: Optional[UssAvailabilityState] = None
    version: Optional[int] = None
    state: Optional[OperationalIntentState] = None
    ovn: Optional[str] = None
    time_start: Optional[Time] = None
    time_end: Optional[Time] = None
    uss_base_url: Optional[str] = None
    subscription_id: Optional[UUID] = None


class SubscriptionState(BaseModel):
    """
    State of subscription which is causing a notification to be sent.
    """

    subscription_id: Optional[UUID] = None
    notification_index: Optional[int] = Field(0, ge=0)


class SubscriberToNotify(BaseModel):
    """
    Subscriber to notify of a change in the airspace.
    """

    subscriptions: List[SubscriptionState] = Field(..., min_items=1)
    uss_base_url: Optional[str] = None
