import { useState, useEffect } from "react";
import type { Flight, RIDFlight } from "../../../entities/flight/types";

export interface FlightTrackingState {
  flights: Flight[];
  selectedFlights: string[];
  activeProviders: string[];
  isLiveMode: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export const useFlightTracking = () => {
  const [state, setState] = useState<FlightTrackingState>({
    flights: [],
    selectedFlights: [],
    activeProviders: [],
    isLiveMode: false,
    lastUpdate: null,
    error: null,
  });

  const selectFlight = (flightId: string) => {
    setState(prev => ({
      ...prev,
      selectedFlights: prev.selectedFlights.includes(flightId)
        ? prev.selectedFlights.filter(id => id !== flightId)
        : [...prev.selectedFlights, flightId],
    }));
  };

  const selectAllFlights = () => {
    setState(prev => ({
      ...prev,
      selectedFlights: prev.flights.map(f => f.id),
    }));
  };

  const clearAllFlights = () => {
    setState(prev => ({
      ...prev,
      selectedFlights: [],
    }));
  };

  const toggleProvider = (providerName: string) => {
    setState(prev => ({
      ...prev,
      activeProviders: prev.activeProviders.includes(providerName)
        ? prev.activeProviders.filter(name => name !== providerName)
        : [...prev.activeProviders, providerName],
    }));
  };

  const setLiveMode = (isLive: boolean) => {
    setState(prev => ({
      ...prev,
      isLiveMode: isLive,
    }));
  };

  const updateFlights = (flights: Flight[]) => {
    setState(prev => ({
      ...prev,
      flights,
      lastUpdate: new Date(),
      error: null,
    }));
  };

  const setError = (error: string) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  };

  // Get filtered flights based on selected providers
  const getFilteredFlights = () => {
    if (state.activeProviders.length === 0) {
      return state.flights;
    }
    
    return state.flights.filter(flight =>
      state.activeProviders.includes(flight.identification_service_area.owner)
    );
  };

  // Get flight statistics
  const getFlightStats = () => {
    const filteredFlights = getFilteredFlights();
    
    return {
      total: filteredFlights.length,
      airborne: filteredFlights.filter(f => f.current_state.operational_status === "Airborne").length,
      ground: filteredFlights.filter(f => f.current_state.operational_status === "Ground").length,
      emergency: filteredFlights.filter(f => f.current_state.operational_status === "Emergency").length,
      selected: state.selectedFlights.length,
    };
  };

  return {
    ...state,
    selectFlight,
    selectAllFlights,
    clearAllFlights,
    toggleProvider,
    setLiveMode,
    updateFlights,
    setError,
    getFilteredFlights,
    getFlightStats,
  };
};