from __future__ import annotations
from enum import Enum
from pydantic import BaseModel


class FlightType(str, Enum):
    """
    String for flight type. Accepted values are "VLOS", "EVLOS" or "BVLOS"
    """
    VLOS = "VLOS"
    EVLOS = "EVLOS"
    BVLOS = "BVLOS"


class OperationalIntentState(str, Enum):
    """
    State of an operational intent.
    """
    Accepted = "Accepted"
    Activated = "Activated"
    Nonconforming = "Nonconforming"
    Contingent = "Contingent"
