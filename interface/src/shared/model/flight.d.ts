import type {
  Latitude,
  LatLngPoint,
  Longitude,
  Time,
  Volume4D,
} from "./common.d";
import type { IdentificationServiceArea } from "./isa.d";

export type RIDFlightID = string;

export type UAType =
  | "NotDeclared"
  | "Aeroplane"
  | "Helicopter"
  | "Gyroplane"
  | "HybridLift"
  | "Ornithopter"
  | "Glider"
  | "Kite"
  | "FreeBalloon"
  | "CaptiveBalloon"
  | "Airship"
  | "FreeFallOrParachute"
  | "Rocket"
  | "TetheredPoweredAircraft"
  | "GroundObstacle"
  | "Other";

export type RIDOperationalStatus =
  | "Undeclared"
  | "Ground"
  | "Airborne"
  | "Emergency"
  | "RemoteIDSystemFailure";

export interface RIDAuthData {
  format: number;
  data: string;
}

export interface RIDHeight {
  distance: number;
  reference: "TakeoffLocation" | "GroundLevel";
}

export type HorizontalAccuracy =
  | "HAUnknown"
  | "HA10NMPlus"
  | "HA10NM"
  | "HA4NM"
  | "HA2NM"
  | "HA1NM"
  | "HA05NM"
  | "HA03NM"
  | "HA01NM"
  | "HA005NM"
  | "HA30m"
  | "HA10m"
  | "HA3m"
  | "HA1m";

export type VerticalAccuracy =
  | "VAUnknown"
  | "VA150mPlus"
  | "VA150m"
  | "VA45m"
  | "VA25m"
  | "VA10m"
  | "VA3m"
  | "VA1m";

export type SpeedAccuracy =
  | "SAUnknown"
  | "SA10mpsPlus"
  | "SA10mps"
  | "SA3mps"
  | "SA1mps"
  | "SA03mps";

export interface RIDAircraftPosition {
  lat: Latitude;
  lng: Longitude;
  alt: number;
  accuracy_h: HorizontalAccuracy;
  accuracy_v: VerticalAccuracy;
  extrapolated: boolean;
  pressure_altitude: number;
  height: RIDHeight;
}

export interface RIDAircraftState {
  timestamp: Time;
  timestamp_accuracy: number;
  operational_status: RIDOperationalStatus;
  position: RIDAircraftPosition;
  track: number;
  speed: number;
  speed_accuracy: SpeedAccuracy;
  vertical_speed: number;
}

export interface RIDRecentAircraftPosition {
  time: Time;
  position: RIDAircraftPosition;
}

export interface OperatingArea {
  aircraft_count: number;
  volumes: Volume4D[];
}

export interface RIDFlight {
  id: RIDFlightID;
  aircraft_type: UAType;
  current_state: RIDAircraftState;
  operating_area: OperatingArea;
  simulated: boolean;
  recent_positions: RIDRecentAircraftPosition[];
}

export interface Flight extends RIDFlight {
  identification_service_area: IdentificationServiceArea;
  details: RIDFlightDetails;
}

export interface UASID {
  registration_id: string;
}

export interface OperatorLocation {
  position: RIDAircraftPosition
}

export interface RIDFlightDetails {
  id: string,
  uas_id: UASID,
  operator_id: string,
  operator_location: LatLngPoint,
  operation_description: string,
  auth_data: RIDAuthData
}

export interface GetFlightsResponse {
  timestamp: Time;
  flights: RIDFlight[];
}
