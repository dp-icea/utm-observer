import type { Constraint, ConstraintDetails } from "../types";
import type { Flight } from "../../flight/types";
import type { Time, Volume4D, UAType } from "../../../shared/types/common";

export class ConstraintModel {
  constructor(private constraint: Constraint) {}

  // Business logic methods
  isActiveAt(time: Time): boolean {
    const checkTime = new Date(time.value);
    const startTime = new Date(this.constraint.reference.time_start.value);
    const endTime = new Date(this.constraint.reference.time_end.value);
    
    return checkTime >= startTime && checkTime <= endTime;
  }

  isCurrentlyActive(): boolean {
    const now: Time = {
      value: new Date().toISOString(),
      format: "RFC3339"
    };
    return this.isActiveAt(now);
  }

  appliesToFlight(flight: Flight): boolean {
    // Check if constraint applies to this flight
    return this.appliesToAircraftType(flight.aircraft_type) &&
           this.intersectsWithFlightPath(flight);
  }

  getRestrictedVolumes(): Volume4D[] {
    return this.constraint.details.volumes;
  }

  allowsFlightType(aircraftType: UAType): boolean {
    // Check if this aircraft type is allowed in the constrained area
    // This would depend on the constraint type and geozone rules
    if (this.constraint.details.geozone?.type === "PROHIBITED") {
      return false;
    }
    
    if (this.constraint.details.geozone?.type === "REQ_AUTHORISATION") {
      // Would need to check if flight has proper authorization
      return false; // Conservative approach
    }
    
    return true;
  }

  getAuthorityContacts(): string[] {
    if (!this.constraint.details.geozone?.zone_authority) {
      return [];
    }
    
    return this.constraint.details.geozone.zone_authority
      .map(auth => auth.email)
      .filter(email => email !== undefined) as string[];
  }

  getRestrictionLevel(): "PROHIBITED" | "RESTRICTED" | "CONDITIONAL" | "OPEN" {
    const geozone = this.constraint.details.geozone;
    
    if (!geozone) return "OPEN";
    
    switch (geozone.type) {
      case "PROHIBITED":
        return "PROHIBITED";
      case "REQ_AUTHORISATION":
        return "RESTRICTED";
      case "CONDITIONAL":
        return "CONDITIONAL";
      default:
        return "OPEN";
    }
  }

  private appliesToAircraftType(aircraftType: UAType): boolean {
    // Check if constraint applies to this aircraft type
    // This would depend on the specific constraint rules
    return true; // Placeholder - would need specific business rules
  }

  private intersectsWithFlightPath(flight: Flight): boolean {
    // Check if flight path intersects with constraint volumes
    // This would involve complex 4D volume intersection calculations
    return true; // Placeholder - would need geometric calculations
  }
}