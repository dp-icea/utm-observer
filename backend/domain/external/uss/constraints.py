from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from domain.external.dss.common import SubscriptionState
from domain.external.uss.common import Constraint


class PutConstraintDetailsParameters(BaseModel):
    """
    Parameters of a message informing of new full information for a constraint.
    """

    constraint_id: Optional[UUID] = None
    constraint: Optional[Constraint] = None
    subscriptions: List[SubscriptionState] = Field(..., min_items=1)


class GetConstraintDetailsResponse(BaseModel):
    """
    Response to peer request for the details of operational intent with the given ID.
    """

    constraint: Constraint
