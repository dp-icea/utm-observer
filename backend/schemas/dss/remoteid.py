from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field, HttpUrl
from ..common.base import Time
from ..common.geo import Volume4D
from .common import SubscriberToNotify, SubscriptionState


class IdentificationServiceArea(BaseModel):
    """
    An Identification Service Area (area in which remote ID services are being provided).
    The DSS reports only these declarations and clients must exchange flight information peer-to-peer.
    """
    uss_base_url: HttpUrl
    owner: str
    time_start: Time
    time_end: Time
    version: str
    id: str


class Subscription(BaseModel):
    """
    Specification of a geographic area that a client is interested in on an ongoing basis (e.g., "planning area").
    Internal to the DSS.
    """
    id: UUID
    uss_base_url: HttpUrl
    owner: str
    version: str
    notification_index: Optional[int] = 0
    time_end: Optional[Time] = None
    time_start: Optional[Time] = None


class CreateIdentificationServiceAreaParameters(BaseModel):
    """
    Parameters for a request to create an Identification Service Area in the DSS.
    """
    extents: Volume4D
    uss_base_url: HttpUrl


class UpdateIdentificationServiceAreaParameters(BaseModel):
    """
    Parameters for a request to update an Identification Service Area in the DSS.
    """
    extents: Volume4D
    uss_base_url: HttpUrl


class PutIdentificationServiceAreaResponse(BaseModel):
    """
    Response to a request to create or update a reference to an Identification Service Area in the DSS.
    """
    service_area: IdentificationServiceArea
    subscribers: Optional[List[SubscriberToNotify]] = []


class DeleteIdentificationServiceAreaResponse(BaseModel):
    """
    Response for a request to delete an Identification Service Area.
    """
    service_area: IdentificationServiceArea
    subscribers: Optional[List[SubscriberToNotify]] = []


class GetIdentificationServiceAreaResponse(BaseModel):
    """
    Response to DSS request for the identification service area with the given ID.
    """
    service_area: IdentificationServiceArea


class SearchIdentificationServiceAreasResponse(BaseModel):
    """
    Response to DSS query for Identification Service Areas in an area of interest.
    """
    service_areas: List[IdentificationServiceArea] = []


class CreateSubscriptionParameters(BaseModel):
    """
    Parameters for a request to create a subscription in the DSS.
    """
    extents: Volume4D
    uss_base_url: HttpUrl


class UpdateSubscriptionParameters(BaseModel):
    """
    Parameters for a request to update a subscription in the DSS.
    """
    extents: Volume4D
    uss_base_url: HttpUrl


class PutSubscriptionResponse(BaseModel):
    """
    Response for a request to create or update a subscription.
    """
    subscription: Subscription
    service_areas: Optional[List[IdentificationServiceArea]] = []


class DeleteSubscriptionResponse(BaseModel):
    """
    Response for a successful request to delete an Subscription.
    """
    subscription: Subscription


class GetSubscriptionResponse(BaseModel):
    """
    Response to DSS request for the subscription with the given id.
    """
    subscription: Subscription


class SearchSubscriptionsResponse(BaseModel):
    """
    Response to DSS query for subscriptions in a particular area.
    """
    subscriptions: Optional[List[Subscription]] = []
