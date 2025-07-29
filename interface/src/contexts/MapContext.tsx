import { createContext, useContext, useState, type ReactNode } from "react";
import { format } from "date-fns";
import type {
  Constraint,
  Flight,
  IdentificationServiceAreaFull,
  OperationalIntent,
  RIDFlight,
} from "@/schemas";
import type { FilterCategory } from "@/components/sidebar/OperationalFilters";
import type { FilterClient } from "@/components/sidebar/ClientList";
import { MapState } from "@/schemas/context";

interface IMapContext {
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
  selectedProviders: string[];
  setSelectedProviders: (providers: string[]) => void;
  selectedFlights: string[];
  setSelectedFlights: (flights: string[]) => void;
}

const MapContext = createContext<IMapContext | undefined>(undefined);

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
  const [isLive, setIsLive] = useState<boolean>(true);

  const [flights, setFlights] = useState<Flight[]>([]);

  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    flights.map((flight) => flight.id as string),
  );
  const [selectedFlights, setSelectedFlights] = useState<string[]>(
    flights.map((flight) => flight.identification_service_area.owner),
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
        selectedProviders,
        setSelectedProviders,
        selectedFlights,
        setSelectedFlights,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
