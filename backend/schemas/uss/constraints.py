from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..common.geo import Volume4D, GeoZone
from ..dss.constraints import ConstraintReference
from ..dss.subscriptions import SubscriptionState
from schemas.uss.common import Constraint


class PutConstraintDetailsParameters(BaseModel):
    """
    Parameters of a message informing of new full information for a constraint.
    """
    constraint_id: Optional[UUID]
    constraint: Optional[Constraint]
    subscriptions: List[SubscriptionState] = Field(..., min_items=1)


class GetConstraintDetailsResponse(BaseModel):
    """
    Response to peer request for the details of operational intent with the given ID.
    """
    constraint: Constraint
