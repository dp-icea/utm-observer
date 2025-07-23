import * as Cesium from "cesium";

import type {
  Polygon,
  EntityID,
  FlightType,
  Time,
  UssBaseURL,
  Volume4D,
  Altitude,
  Latitude,
  Longitude,
  EntityOVN,
  EntityVersion,
  Key,
} from "./common";
import type { UssAvailabilityState } from "./dss";
import type {
  ImplicitSubscriptionParameters,
  SubscriptionID,
} from "./subscription";

export type OperationalIntentState =
  | "Accepted"
  | "Activated"
  | "Nonconforming"
  | "Deleted";

export const OperationalIntentStateColor: Record<string, Cesium.Color> = {
  Accepted: Cesium.Color.YELLOW,
  Activated: Cesium.Color.GREEN,
  Nonconforming: Cesium.Color.ORANGE,
  Deleted: Cesium.Color.RED,
};
export type Priority = number;

export interface OperationalIntentReference {
  id: EntityID;
  flight_type: FlightType;
  manager: string;
  uss_availability: UssAvailabilityState;
  version: EntityVersion;
  state: OperationalIntentState;
  ovn?: EntityOVN;
  time_start: Time;
  time_end: Time;
  uss_base_url: UssBaseURL;
  subscription_id: SubscriptionID;
}

export type OperationalIntentFlightType = FlightType;
export type OperationalIntentUssBaseURL = UssBaseURL;

export interface PutOperationalIntentReferenceParameters {
  extents: Volume4D[];
  key?: Key;
  state: OperationalIntentState;
  uss_base_url: UssBaseURL;
  subscription_id?: EntityID;
  new_subscription?: ImplicitSubscriptionParameters;
  flight_type: FlightType;
}

export interface GetOperationalIntentReferenceResponse {
  operational_intent_reference: OperationalIntentReference;
}

export interface QueryOperationalIntentReferenceParameters {
  area_of_interest?: Volume4D;
}

export interface QueryOperationalIntentReferenceResponse {
  operational_intent_references: OperationalIntentReference[];
}

export interface OperationalIntentDetails {
  volumes?: Volume4D[];
  off_nominal_volumes?: Volume4D[];
  priority?: Priority;
}

export interface OperationalIntent {
  reference: OperationalIntentReference;
  details: OperationalIntentDetails;
}

export interface GetOperationalIntentDetailsResponse {
  operational_intent: OperationalIntent;
}

export type PositionAccuracyVertical =
  | "VAUnknown"
  | "VA150mPlus"
  | "VA150m"
  | "VA45m"
  | "VA25m"
  | "VA10m"
  | "VA3m"
  | "VA1m";
export type PositionAccuracyHorizontal =
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

export interface Position {
  longitude?: Longitude;
  latitude?: Latitude;
  accuracy_h?: PositionAccuracyHorizontal;
  accuracy_v?: PositionAccuracyVertical;
  extrapolated?: boolean;
  altitude?: Altitude;
}

export interface Velocity {
  speed: number;
  units_speed: "MetersPerSecond";
  track?: number;
}

export interface VehicleTelemetry {
  time_measured: Time;
  position: Position;
  velocity: Velocity;
}

export interface GetOperationalIntentTelemetryResponse {
  operational_intent_id: EntityID;
  telemetry: VehicleTelemetry;
  next_telemetry_opportunity?: Time;
}

export interface PolygonVolumeSchema {
  volume: {
    outline_polygon: Polygon;
    altitude_lower: Altitude;
    altitude_upper: Altitude;
  };
  time_start: Time;
  time_end: Time;
}
