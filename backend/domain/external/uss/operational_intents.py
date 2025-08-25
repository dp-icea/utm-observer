from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field

from domain.external.dss.common import SubscriptionState
from domain.external.uss.common import OperationalIntent


class PutOperationalIntentDetailsParameters(BaseModel):
    """
    Parameters of a message informing of detailed information for a peer operational intent.
    """

    operational_intent_id: Optional[UUID] = None
    operational_intent: Optional[OperationalIntent] = None
    subscriptions: List[SubscriptionState] = Field(..., min_items=1)


class GetOperationalIntentDetailsResponse(BaseModel):
    """
    Response to peer request for the details of operational intent with the given ID.
    """

    operational_intent: OperationalIntent
