from __future__ import annotations
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..common.geo import Volume4D, GeoZone
from ..dss.constraints import ConstraintReference
from ..dss.subscriptions import SubscriptionState


class ConstraintDetails(BaseModel):
    """
    Details of a UTM constraint.
    """
    volumes: List[Volume4D] = Field(..., min_items=1)
    type: Optional[str]
    geozone: Optional[GeoZone]


class Constraint(BaseModel):
    """
    Full specification of a UTM constraint.
    """
    reference: ConstraintReference
    details: ConstraintDetails


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
