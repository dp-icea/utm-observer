from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field

from domain.base import Time, Volume4D, LatLngPoint
from domain.external.dss.remoteid import IdentificationServiceArea
from schemas.enums import (
    HorizontalAccuracy,
    VerticalAccuracy,
    SpeedAccuracy,
    RIDOperationalStatus,
    UAType,
)
from ..dss.common import SubscriptionState


class RIDAircraftPosition(BaseModel):
    """
    Position of an aircraft as reported for remote ID purposes.
    """

    lat: float
    lng: float
    alt: Optional[float] = -1000
    accuracy_h: Optional[HorizontalAccuracy] = None
    accuracy_v: Optional[VerticalAccuracy] = None
    extrapolated: Optional[bool] = False
    pressure_altitude: Optional[float] = -1000


class RIDHeight(BaseModel):
    """
    A relative altitude for the purposes of remote ID.
    """

    distance: Optional[float] = 0
    reference: str


class RIDAircraftState(BaseModel):
    """
    State of an aircraft for the purposes of remote ID.
    """

    timestamp: Time
    timestamp_accuracy: float
    position: RIDAircraftPosition
    speed_accuracy: SpeedAccuracy
    operational_status: Optional[RIDOperationalStatus] = None
    track: Optional[float] = 361
    speed: Optional[float] = 255
    vertical_speed: Optional[float] = 63


class RIDRecentAircraftPosition(BaseModel):
    """
    A short collection of recent aircraft movement.
    """

    time: Time
    position: RIDAircraftPosition


class OperatingArea(BaseModel):
    """
    Area of operation containing one or more aircraft participating in remote identification.
    """

    aircraft_count: Optional[int] = Field(None, ge=1)
    volumes: Optional[List[OperatingArea]] = []


class RIDFlight(BaseModel):
    """
    Description of a remote ID flight.
    """

    id: str
    aircraft_type: UAType
    current_state: Optional[RIDAircraftState] = None
    operating_area: Optional[OperatingArea] = None
    simulated: Optional[bool] = False
    recent_positions: Optional[List[RIDRecentAircraftPosition]] = []


class UASID(BaseModel):
    """
    Identification of the UAS performing this flight.
    """

    registration_id: Optional[str] = ""


class RIDAuthData(BaseModel):
    """
    Additional authentication data.
    """

    format: Optional[int] = 0
    data: Optional[str] = ""


class RIDFlightDetails(BaseModel):
    """
    Details about a flight reported by a remote ID service provider.
    """

    id: str
    uas_id: Optional[UASID] = None
    operator_id: Optional[str] = ""
    operator_location: Optional[LatLngPoint] = None
    operation_description: Optional[str] = ""
    auth_data: Optional[RIDAuthData] = None


class GetFlightsResponse(BaseModel):
    """
    Response to remote ID provider query for flight information in an area of interest.
    """

    timestamp: Time
    flights: Optional[List[RIDFlight]] = []
    no_isas_present: Optional[bool] = False


class GetFlightDetailsResponse(BaseModel):
    """
    Response to remote ID provider query for details about a specific flight.
    """

    details: RIDFlightDetails


class GetIdentificationServiceAreaDetailsResponse(BaseModel):
    """
    Response to request for the details of an identification service area with the given ID.
    """

    extents: Volume4D


class PutIdentificationServiceAreaNotificationParameters(BaseModel):
    """
    Parameters of a message informing of new full information for an Identification Service Area.
    """

    service_area: Optional[IdentificationServiceArea] = None
    subscriptions: List[SubscriptionState] = Field(..., min_items=1)
    extents: Optional[Volume4D] = None
