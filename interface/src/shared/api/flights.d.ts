import type {
  Flight,
} from "@/shared/model";

export interface QueryFlightsRequest {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface QueryFlightsResponse {
  flights: Flight[];
  partial: boolean;
  errors: string[];
  timestamp: string;
}
