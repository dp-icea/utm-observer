import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import { MapState } from "@/shared/types/context";
import type { Constraint } from "@/entities/constraint";
import type { OperationalIntent } from "@/entities/operational-intent";
import type { IdentificationServiceAreaFull } from "@/entities/identification-service-area";
import type { FilterCategory } from "@/features/dashboard-filters/ui/OperationalFiltersPanel";
import type { Flight } from "@/entities/flight";
import { MapContext } from "../contexts/MapContext";

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(format(new Date(), "HH:mm"));
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  );
  const [endTime, setEndTime] = useState(
    format(new Date(Date.now() + 24 * 60 * 60 * 1000), "HH:mm"),
  );
  const [selectedMinutes, setSelectedMinutes] = useState([0]);
  const [volumes, setVolumes] = useState<
    Array<Constraint | OperationalIntent | IdentificationServiceAreaFull>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConstraintRequest, setLoadingConstraintRequest] =
    useState<boolean>(false);

  const [filters, setFilters] = useState<FilterCategory[]>([
    {
      id: "operational-intents",
      label: "Operational Intents",
      enabled: true,
    },
    { id: "constraints", label: "Constraints", enabled: true },
    {
      id: "identification-service-areas",
      label: "Identification Service Areas",
      enabled: false,
    },
  ]);
  const [managerFilter, setManagerFilter] = useState<string[]>([]);
  const [mapState, setMapState] = useState<MapState>(MapState.ONLINE);

  // This is default false to allow backup values in the timeline
  const [isLive, setIsLive] = useState<boolean>(false);

  const [flights, setFlights] = useState<Flight[]>([]);

  const [flightsFilter, setFlightsFilter] = useState<string[]>([]);
  const [flightProvidersFilter, setFlightProvidersFilter] = useState<string[]>(
    [],
  );

  return (
    <MapContext.Provider
      value={{
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        endDate,
        setEndDate,
        endTime,
        setEndTime,
        selectedMinutes,
        setSelectedMinutes,
        volumes,
        setVolumes,
        loading,
        setLoading,
        loadingConstraintRequest,
        setLoadingConstraintRequest,
        filters,
        setFilters,
        managerFilter,
        setManagerFilter,
        mapState,
        setMapState,
        isLive,
        setIsLive,
        flights,
        setFlights,
        flightsFilter,
        setFlightsFilter,
        flightProvidersFilter,
        setFlightProvidersFilter,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
