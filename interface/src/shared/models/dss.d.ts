import type { ConstraintReference } from "../../entities/constraint/types";
import type { OperationalIntentReference } from "../../entities/operational-intent/types";

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