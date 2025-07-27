import type { Volume4D } from "./common";
import type { Constraint } from "./constraint";
import type { OperationalIntent } from "./operational-intent";


export interface QueryVolumesResponse {
  operational_intents: OperationalIntent[];
  constraints: Constraint[],
  identification_service_areas: Volume4D[];
}
