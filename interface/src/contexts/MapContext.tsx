import { createContext, useContext, useState, ReactNode } from "react";
import { format } from "date-fns";

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
