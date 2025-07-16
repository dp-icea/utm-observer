import type { ConstraintReference } from "./constraint";
import type { OperationalIntentReference } from "./operational-intent";

export type UssAvailabilityState = "Unknown" | "Normal" | "Down";

export interface UssAvailabilityStatus {
  uss: string;
  availability: UssAvailabilityState;
}

export interface SetUssAvailabilityStatusParameters {
  old_version: string;
  availability: UssAvailabilityState;
}

export interface UssAvailabilityStatusResponse {
  version: string;
  status: UssAvailabilityStatus;
}
export interface AirspaceConflictResponse {
  message?: string;
  missing_operational_intents?: OperationalIntentReference[];
  missing_constraints?: ConstraintReference[];
}
