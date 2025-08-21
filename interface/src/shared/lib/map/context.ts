import type { Constraint } from "@/entities/constraint";
import type { IdentificationServiceAreaFull } from "@/entities/identification-service-area";
import type { OperationalIntent } from "@/entities/operational-intent";
import type { FilterCategory } from "@/features/dashboard-filters/ui/OperationalFiltersPanel";
import { createContext } from "react";
import type { MapState } from "../types";
import type { Flight } from "@/entities/flight";

export interface IMapContext {
  startDate: Date;
  setStartDate: (date: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  selectedMinutes: number[];
  setSelectedMinutes: (minutes: number[]) => void;
  volumes: Array<
    Constraint | OperationalIntent | IdentificationServiceAreaFull
  >;
  setVolumes: (
    volumes: Array<
      Constraint | OperationalIntent | IdentificationServiceAreaFull
    >,
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadingConstraintRequest: boolean;
  setLoadingConstraintRequest: (loading: boolean) => void;
  filters: FilterCategory[];
  setFilters: (filters: FilterCategory[]) => void;
  managerFilter: string[];
  setManagerFilter: (filter: string[]) => void;
  mapState: MapState;
  setMapState: (state: MapState) => void;
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  flightsFilter: string[];
  setFlightsFilter: (flights: string[]) => void;
  flightProvidersFilter: string[];
  setFlightProvidersFilter: (flights: string[]) => void;
}

export const MapContext = createContext<IMapContext | undefined>(undefined);
