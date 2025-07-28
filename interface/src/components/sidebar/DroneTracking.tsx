import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio, MapPin, Battery, Signal } from "lucide-react";
import { useMap } from "@/contexts/MapContext";

interface DroneInfo {
  id: string;
  name: string;
  provider: string;
  status: "active" | "inactive" | "emergency";
  position: { lat: number; lng: number; alt: number };
  battery: number;
  signal: number;
  lastUpdate: string;
  selected: boolean;
}

const mockDrones: DroneInfo[] = [
  {
    id: "1",
    name: "Alpha-7",
    provider: "SkyDrone Corp",
    status: "active",
    position: { lat: 40.7128, lng: -74.006, alt: 150 },
    battery: 85,
    signal: 95,
    lastUpdate: "1 sec ago",
    selected: true,
  },
  {
    id: "2",
    name: "Beta-3",
    provider: "AeroTech Solutions",
    status: "active",
    position: { lat: 40.758, lng: -73.9855, alt: 200 },
    battery: 67,
    signal: 88,
    lastUpdate: "3 sec ago",
    selected: false,
  },
  {
    id: "3",
    name: "Gamma-1",
    provider: "DroneLogistics",
    status: "emergency",
    position: { lat: 40.7282, lng: -74.0776, alt: 75 },
    battery: 23,
    signal: 45,
    lastUpdate: "15 sec ago",
    selected: true,
  },
];

export const DroneTracking = () => {
  const [drones, setDrones] = useState<DroneInfo[]>(mockDrones);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([
    "SkyDrone Corp",
    "DroneLogistics",
  ]);

  const { isLive, flights } = useMap();

  const providers = Array.from(new Set(drones.map((d) => d.provider)));
  const filteredDrones = drones.filter((d) =>
    selectedProviders.includes(d.provider),
  );

  console.log("Flights", flights);

  const toggleDroneSelection = (id: string) => {
    setDrones(
      drones.map((drone) =>
        drone.id === id ? { ...drone, selected: !drone.selected } : drone,
      ),
    );
  };

  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider],
    );
  };

  const getStatusColor = (status: DroneInfo["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "emergency":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-green-500";
    if (battery > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const getSignalColor = (signal: number) => {
    if (signal > 70) return "text-green-500";
    if (signal > 40) return "text-yellow-500";
    return "text-red-500";
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
        <span className="text-xs font-medium text-gray-300">
          Select Providers:
        </span>
        <div className="space-y-1">
          {providers.map((provider) => (
            <div key={provider} className="flex items-center space-x-2">
              <Checkbox
                id={provider}
                checked={selectedProviders.includes(provider)}
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
        {filteredDrones.map((drone) => (
          <div
            key={drone.id}
            className={`p-3 rounded-lg border transition-colors ${drone.selected
                ? "bg-blue-900/30 border-blue-600"
                : "bg-gray-750 border-gray-600 hover:bg-gray-700"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={drone.selected}
                  onCheckedChange={() => toggleDroneSelection(drone.id)}
                />
                <span className="text-sm font-medium text-white">
                  {drone.name}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(drone.status)}`}
                />
              </div>
              <Badge
                variant={
                  drone.status === "emergency" ? "destructive" : "secondary"
                }
                className="text-xs px-2 py-0"
              >
                {drone.status}
              </Badge>
            </div>

            <div className="text-xs text-gray-400 mb-2">
              Provider: {drone.provider}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Alt: {drone.position.alt}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <Battery
                  className={`h-3 w-3 ${getBatteryColor(drone.battery)}`}
                />
                <span>{drone.battery}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Signal className={`h-3 w-3 ${getSignalColor(drone.signal)}`} />
                <span>{drone.signal}%</span>
              </div>
              <div className="text-gray-500">{drone.lastUpdate}</div>
            </div>

            <div className="text-xs mt-2 text-gray-500">
              {drone.position.lat.toFixed(4)}°, {drone.position.lng.toFixed(4)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
