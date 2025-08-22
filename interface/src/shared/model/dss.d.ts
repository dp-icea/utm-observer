export type UssAvailabilityState = "Unknown" | "Normal" | "Down";

export interface UssAvailabilityStatus {
  uss: string;
  availability: UssAvailabilityState;
}

