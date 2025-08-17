import type { Flight, RIDOperationalStatus, UAType } from "../types";
import type { Constraint } from "../../constraint/types";
import type { Time, LatLngPoint } from "../../../shared/types/common";

export class FlightModel {
  constructor(private flight: Flight) {}

  // Business logic methods
  isInEmergency(): boolean {
    return this.flight.current_state.operational_status === "Emergency";
  }

  isAirborne(): boolean {
    return this.flight.current_state.operational_status === "Airborne";
  }

  isOnGround(): boolean {
    return this.flight.current_state.operational_status === "Ground";
  }

  hasSystemFailure(): boolean {
    return this.flight.current_state.operational_status === "RemoteIDSystemFailure";
  }

  canEnterAirspace(constraint: Constraint): boolean {
    // Check if flight can enter constrained airspace
    // This would involve checking volumes, time ranges, aircraft type restrictions, etc.
    return true; // Placeholder implementation
  }

  getCurrentPosition(): LatLngPoint {
    return {
      lat: this.flight.current_state.position.lat,
      lng: this.flight.current_state.position.lng,
    };
  }

  getOperatorDistance(): number | null {
    if (!this.flight.details?.operator_location) return null;
    
    const flightPos = this.getCurrentPosition();
    const operatorPos = this.flight.details.operator_location;
    
    // Calculate distance using Haversine formula
    return this.calculateDistance(flightPos, operatorPos);
  }

  validateFlightPath(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate operating area
    if (!this.flight.operating_area.volumes.length) {
      errors.push("No operating volumes defined");
    }
    
    // Validate aircraft type
    if (!this.isValidAircraftType(this.flight.aircraft_type)) {
      errors.push("Invalid aircraft type");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private calculateDistance(pos1: LatLngPoint, pos2: LatLngPoint): number {
    // Haversine formula implementation
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (pos1.lat * Math.PI) / 180;
    const φ2 = (pos2.lat * Math.PI) / 180;
    const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private isValidAircraftType(type: UAType): boolean {
    const validTypes: UAType[] = [
      "Aeroplane", "Helicopter", "Gyroplane", "HybridLift",
      "Ornithopter", "Glider", "Kite", "FreeBalloon",
      "CaptiveBalloon", "Airship", "FreeFallOrParachute",
      "Rocket", "TetheredPoweredAircraft", "GroundObstacle", "Other"
    ];
    return validTypes.includes(type);
  }
}