import type { Constraint } from "./constraint";
import type { RIDFlight } from "./flight";
import type { IdentificationServiceAreaFull } from "./identification-service-area";
import type { OperationalIntent } from "./operational-intent";


export interface QueryVolumesResponse {
  operational_intents: OperationalIntent[];
  constraints: Constraint[],
  identification_service_areas: IdentificationServiceAreaFull[];
}

export interface QueryFlightsResponse {
  flights: RIDFlight[];
  partial: boolean;
  errors: string[];
  timestamp: string;
}

