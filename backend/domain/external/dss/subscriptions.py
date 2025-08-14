from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from domain.external.dss.common import (
    ConstraintReference,
    OperationalIntentReference,
)
from domain.base import Time, Volume4D


class Subscription(BaseModel):
    """
    Specification of a geographic area that a client is interested in on an ongoing basis.
    """

    id: Optional[UUID] = None
    version: Optional[str] = None
    notification_index: Optional[int] = Field(0, ge=0)
    time_start: Optional[Time] = None
    time_end: Optional[Time] = None
    uss_base_url: Optional[str] = None
    notify_for_operational_intents: bool = False
    notify_for_constraints: bool = False
    implicit_subscription: bool = False
    dependent_operational_intents: List[UUID] = []


class QuerySubscriptionParameters(BaseModel):
    """
    Parameters for a request to find subscriptions matching the provided criteria.
    """

    area_of_interest: Optional[Volume4D] = None


class QuerySubscriptionsResponse(BaseModel):
    """
    Response to DSS query for subscriptions in a particular geographic area.
    """

    subscriptions: List[Subscription] = []


class GetSubscriptionResponse(BaseModel):
    """
    Response to DSS request for the subscription with the given id.
    """

    subscription: Subscription


class PutSubscriptionParameters(BaseModel):
    """
    Parameters for a request to create/update a subscription in the DSS.
    """

    extents: Volume4D
    uss_base_url: str
    notify_for_operational_intents: bool = False
    notify_for_constraints: bool = False


class PutSubscriptionResponse(BaseModel):
    """
    Response for a request to create or update a subscription.
    """

    subscription: Subscription
    operational_intent_references: List[OperationalIntentReference] = []
    constraint_references: List[ConstraintReference] = []


class DeleteSubscriptionResponse(BaseModel):
    """
    Response for a successful request to delete a subscription.
    """

    subscription: Subscription


class ImplicitSubscriptionParameters(BaseModel):
    """
    Information necessary to create a subscription to serve a single operational intent's notification needs.
    """

    uss_base_url: Optional[str] = None
    notify_for_constraints: bool = False
