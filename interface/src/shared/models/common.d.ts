export type FlightType = "VLOS" | "EVLOS" | "BVLOS";
export type UUIDv4Format = string;
export type EntityID = UUIDv4Format;
export type EntityOVN = string;
export type EntityVersion = number;
export type Key = EntityOVN[];
export type URL = string;
export type Version = string;

export interface Time {
  value: string; // RFC3339-formatted time/date string
  format: "RFC3339";
}

export interface Radius {
  value: number;
  units: "M";
}

export interface Altitude {
  value: number;
  reference: "W84";
  units: "M";
}

export type Latitude = number;
export type Longitude = number;

export interface LatLngPoint {
  lat: Latitude;
  lng: Longitude;
}

export interface Polygon {
  vertices: LatLngPoint[];
}

export interface Circle {
  center: LatLngPoint;
  radius: Radius;
}

export interface Rectangle {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Volume3D {
  outline_circle?: Circle;
  outline_polygon?: Polygon;
  altitude_lower: Altitude;
  altitude_upper: Altitude;
}

export interface Volume4D {
  volume: Volume3D;
  time_start: Time;
  time_end: Time;
}

export interface ErrorResponse {
  message?: string;
}

export type UssBaseURL = string;