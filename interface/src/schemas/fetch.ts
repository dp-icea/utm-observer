import type { Constraint } from "./constraint";
import type { OperationalIntent } from "./operational-intent";


export interface QueryVolumesResponse {
  operational_intents: OperationalIntent[];
  constraints: Constraint[],
}
