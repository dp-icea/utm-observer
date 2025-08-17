import type {
  EntityID,
  EntityVersion,
  EntityOVN,
  Time,
  UssBaseURL,
  Volume4D,
} from "../../shared/types/common";
import type { UssAvailabilityState } from "../../shared/types/dss";
import type { GeoZone } from "../geozone/types";

export interface ConstraintReference {
  id: EntityID;
  manager: string;
  uss_availability: UssAvailabilityState;
  version: EntityVersion;
  ovn?: EntityOVN;
  time_start: Time;
  time_end: Time;
  uss_base_url: UssBaseURL;
}

export type ConstraintUssBaseURL = UssBaseURL;

export interface PutConstraintReferenceParameters {
  extents: Volume4D[];
  uss_base_url: ConstraintUssBaseURL;
}

export interface GetConstraintReferenceResponse {
  constraint_reference: ConstraintReference;
}

export interface GetConstraintDetailsResponse {
  constraint: Constraint;
}

export interface QueryConstraintReferenceParameters {
  area_of_interest?: Volume4D;
}

export interface QueryConstraintReferencesResponse {
  constraint_references: ConstraintReference[];
}

export interface ConstraintDetails {
  volumes: Volume4D[];
  type?: string;
  geozone?: GeoZone;
}

export interface Constraint {
  reference: ConstraintReference;
  details: ConstraintDetails;
}