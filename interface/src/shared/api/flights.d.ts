import type { Flight } from "@/shared/model";

export interface QueryFlightsRequest {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface QueryFlightsResponse {
  timestamp: string;
  flights: Flight[];
}
