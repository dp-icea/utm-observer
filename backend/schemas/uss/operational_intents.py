from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..common.geo import Volume4D
from ..dss.operational_intents import OperationalIntentReference
from ..dss.subscriptions import SubscriptionState


class OperationalIntentDetails(BaseModel):
    """
    Details of a UTM operational intent.
    """
    volumes: List[Volume4D] = []
    off_nominal_volumes: List[Volume4D] = []
    priority: Optional[int] = 0


class OperationalIntent(BaseModel):
    """
    Full description of a UTM operational intent.
    """
    reference: OperationalIntentReference
    details: OperationalIntentDetails


class PutOperationalIntentDetailsParameters(BaseModel):
    """
    Parameters of a message informing of detailed information for a peer operational intent.
    """
    operational_intent_id: Optional[UUID]
    operational_intent: Optional[OperationalIntent]
    subscriptions: List[SubscriptionState] = Field(..., min_items=1)


class GetOperationalIntentDetailsResponse(BaseModel):
    """
    Response to peer request for the details of operational intent with the given ID.
    """
    operational_intent: OperationalIntent
