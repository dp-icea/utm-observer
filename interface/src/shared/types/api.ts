import type { Constraint } from "../../entities/constraint/types";
import type { Flight, RIDFlight } from "../../entities/flight/types";
import type { IdentificationServiceAreaFull } from "../../entities/identification-service-area/types";
import type { OperationalIntent } from "../../entities/operational-intent/types";

export interface QueryVolumesResponse {
  operational_intents: OperationalIntent[];
  constraints: Constraint[];
  identification_service_areas: IdentificationServiceAreaFull[];
}

export interface QueryFlightsResponse {
  flights: Flight[];
  partial: boolean;
  errors: string[];
  timestamp: string;
}