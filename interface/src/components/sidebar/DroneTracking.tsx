import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, MapPin, Battery, Signal } from "lucide-react";
import { useMap } from "@/contexts/MapContext";
import type { RIDAuthData, RIDOperationalStatus } from "@/schemas";

export const DroneTracking = () => {
  const { isLive, flights } = useMap();

  console.log("Amount of flights:", flights.length);

  // Will later become a context thing filter
  const [selectedDrones, setSelectedDrones] = useState<string[]>(
    flights.map((flight) => flight.id as string),
  );

  const providers = Array.from(
    new Set(flights.map((flight) => flight.identification_service_area.owner)),
  );
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    providers.slice(),
  );

  const toggleDroneSelection = (id: string) => {
    setSelectedDrones(() =>
      selectedDrones.includes(id)
        ? selectedDrones.filter((d) => d !== id)
        : [...selectedDrones, id],
    );
  };

  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider],
    );
  };

  const isProviderSelected = (provider: string) => {
    return !selectedProviders.includes(provider);
  };

  const isFlightSelected = (flightId: string) => {
    return !selectedDrones.includes(flightId);
  };

  const getStatusColor = (status: RIDOperationalStatus) => {
    switch (status) {
      case "Undeclared":
        return "bg-gray-500";
      case "Ground":
        return "bg-gray-400";
      case "Airborne":
        return "bg-green-500";
      case "Emergency":
        return "bg-red-500";
      case "RemoteIDSystemFailure":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const onFlightsUpdate = () => { };

  useEffect(onFlightsUpdate, [flights]);

  if (flights.length === 0 || !isLive) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-white">
            Live Drone Tracking
          </span>
        </div>
        <Badge variant="default" className="text-xs">
          {flights.length} active
        </Badge>
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-gray-300 justify-start">
          Select Providers:
        </span>
        <div className="space-y-1">
          {providers.map((provider) => (
            <div key={provider} className="flex items-center space-x-2">
              <Checkbox
                id={provider}
                checked={isProviderSelected(provider)}
                onCheckedChange={() => toggleProvider(provider)}
              />
              <label
                htmlFor={provider}
                className="text-xs cursor-pointer text-gray-300"
              >
                {provider}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Drone List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className={`p-3 rounded-lg border transition-colors ${isFlightSelected(flight.id)
                ? "bg-blue-900/30 border-blue-600"
                : "bg-gray-750 border-gray-600 hover:bg-gray-700"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isFlightSelected(flight.id)}
                  onCheckedChange={() => toggleDroneSelection(flight.id)}
                />
                <span className="text-sm font-medium text-white">
                  {flight.details.operator_id}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(flight.current_state.operational_status)}`}
                />
              </div>
              <Badge
                variant={
                  flight.current_state.operational_status === "Emergency"
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs px-2 py-0"
              >
                {flight.current_state.operational_status}
              </Badge>
            </div>

            <div className="text-xs text-gray-400 mb-2">
              {flight.identification_service_area.owner.toUpperCase()}
            </div>
            <div className="text-xs text-gray-400 mb-2">
              {flight.details.operation_description}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                {/* TODO: Add icon */}
                <span>Type: {flight.aircraft_type}</span>
              </div>
              <div className="flex items-center space-x-1">
                {/* TODO: Add icon */}
                <span>
                  Pressure: {flight.current_state.position.pressure_altitude}%
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Speed: {flight.current_state.speed.toFixed(3)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>V. Speed: {flight.current_state.vertical_speed}</span>
              </div>
              {flight.details.operator_location && (
                <div className="flex items-center space-x-1">
                  <span>
                    Op. Loc: {flight.details.operator_location.lat.toFixed(2)}°,{" "}
                    {flight.details.operator_location.lng.toFixed(2)}°
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <span>SISANT: {flight.details.uas_id.registration_id}</span>
              </div>
            </div>

            <div className="text-xs mt-2 text-gray-500">
              {flight.current_state.position.lat.toFixed(4)}°,{" "}
              {flight.current_state.position.lng.toFixed(4)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
