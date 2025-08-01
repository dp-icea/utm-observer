from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field
from schemas.dss.operational_intents import OperationalIntentReference
from schemas.common.geo import Volume4D, GeoZone
from schemas.dss.constraints import ConstraintReference


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


class ConstraintDetails(BaseModel):
    """
    Details of a UTM constraint.
    """
    volumes: List[Volume4D] = Field(..., min_items=1)
    type: Optional[str] = None
    geozone: Optional[GeoZone] = None


class Constraint(BaseModel):
    """
    Full specification of a UTM constraint.
    """
    reference: ConstraintReference
    details: ConstraintDetails
