import type {
  OperationalIntent,
  Constraint,
  IdentificationServiceAreaFull,
  Volume3D,
  Time
} from "@/shared/model";

export interface QueryAllocationsRequest {
  volume: Volume3D;
  time_start: Time;
  time_end: Time;
}

export interface QueryAllocationsResponse {
  operational_intents: OperationalIntent[];
  constraints: Constraint[];
  identification_service_areas: IdentificationServiceAreaFull[];
}
