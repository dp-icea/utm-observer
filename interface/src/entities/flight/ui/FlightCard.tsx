import { Badge } from "../../../shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { MapPin, Radio, AlertTriangle } from "lucide-react";
import type { Flight, RIDOperationalStatus } from "../types";
import { FlightModel } from "../model/flight";

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flightId: string) => void;
  isSelected?: boolean;
}

export const FlightCard = ({ flight, onSelect, isSelected = false }: FlightCardProps) => {
  const flightModel = new FlightModel(flight);
  
  const getStatusColor = (status: RIDOperationalStatus) => {
    switch (status) {
      case "Emergency":
        return "destructive";
      case "Airborne":
        return "default";
      case "Ground":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: RIDOperationalStatus) => {
    switch (status) {
      case "Emergency":
        return <AlertTriangle className="h-4 w-4" />;
      case "Airborne":
        return <Radio className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-colors ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onSelect?.(flight.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{flight.details?.uas_id.registration_id || flight.id}</span>
          <Badge variant={getStatusColor(flight.current_state.operational_status)}>
            {getStatusIcon(flight.current_state.operational_status)}
            {flight.current_state.operational_status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-muted-foreground">
          <div>Operator: {flight.details?.operator_id || "Unknown"}</div>
          <div>Type: {flight.aircraft_type}</div>
          <div>Provider: {flight.identification_service_area.owner}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Speed: {flight.current_state.speed.toFixed(1)} m/s</div>
          <div>Alt: {flight.current_state.position.alt.toFixed(0)} m</div>
          <div>V.Speed: {flight.current_state.vertical_speed.toFixed(1)}</div>
          <div>Heading: {flight.current_state.track.toFixed(0)}°</div>
        </div>

        {flightModel.isInEmergency() && (
          <div className="text-xs text-red-600 font-medium">
            ⚠️ Emergency Status
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {flightModel.getCurrentPosition().lat.toFixed(4)}°, {flightModel.getCurrentPosition().lng.toFixed(4)}°
        </div>
      </CardContent>
    </Card>
  );
};