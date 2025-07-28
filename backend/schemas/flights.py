from pydantic import BaseModel
from typing import List, Optional

from schemas.common.base import Time
from schemas.uss.remoteid import RIDFlight
from .response import Response
from .uss.common import OperationalIntent, Constraint

"""
{
        "id": "38183a90-bcf5-4624-b6db-2858328cdca9",
        "aircraft_type": "Helicopter",
        "current_state": {
            "timestamp": {
                "value": "2025-07-25T18:44:08.954963+00:00",
                "format": "RFC3339"
            },
            "timestamp_accuracy": 0.0,
            "operational_status": "Undeclared",
            "position": {
                "lat": -0.40046107380081475,
                "lng": -0.803222012720825,
                "alt": 2042.7601744074568,
                "accuracy_h": "HAUnknown",
                "accuracy_v": "VAUnknown",
                "extrapolated": false,
                "pressure_altitude": -1000.0,
                "height": {
                    "distance": 0.0,
                    "reference": "TakeoffLocation"
                }
            },
            "track": 168.25194889891932,
            "speed": 3.5249294670352027,
            "speed_accuracy": "SAUnknown",
            "vertical_speed": 63.0
        },
        "operating_area": null,
        "simulated": false,
        "recent_positions": []
    }
"""

class Height(BaseModel):
    distance: float
    reference: str

class Position(BaseModel):
    lat: float
    lng: float
    alt: float
    accuracy_h: str
    accuracy_v: str
    extrapolated: bool
    pressure_altitude: float
    height: Height

class CurrentState(BaseModel):
    timestamp: Time
    timestamp_accuracy: float
    operational_status: str
    position: Position
    track: float
    speed: float
    speed_accuracy: str
    vertical_speed: float

class Flight(BaseModel):
    id: str
    aircraft_type: str
    current_state: CurrentState
    operating_area: Optional[str]
    simulated: bool
    recent_positions: List[Position]

class QueryFlightsRequest(BaseModel):
    """
    Data model for the response of the query_volumes endpoint.
    """
    north: float
    east: float
    south: float
    west: float


class QueryFlightsResponse(BaseModel):
    """
    Response model for the query_volumes endpoint.
    """
    flights: List[RIDFlight]
    partial: bool
    errors: List[str]
    timestamp: Time
