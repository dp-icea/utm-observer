import type { LatLngPoint, Circle, Polygon, Volume3D, Volume4D } from "../types/common";

/**
 * Geographic and geometric utility functions for UTM operations
 */

/**
 * Calculate distance between two geographic points using Haversine formula
 */
export function calculateDistance(point1: LatLngPoint, point2: LatLngPoint): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if a point is inside a circular area
 */
export function isPointInCircle(point: LatLngPoint, circle: Circle): boolean {
  const distance = calculateDistance(point, circle.center);
  return distance <= circle.radius.value;
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export function isPointInPolygon(point: LatLngPoint, polygon: Polygon): boolean {
  const { lat, lng } = point;
  const vertices = polygon.vertices;
  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].lng;
    const yi = vertices[i].lat;
    const xj = vertices[j].lng;
    const yj = vertices[j].lat;

    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Check if a point is inside a 3D volume at a given altitude
 */
export function isPointInVolume3D(
  point: LatLngPoint, 
  altitude: number, 
  volume: Volume3D
): boolean {
  // Check altitude bounds
  if (altitude < volume.altitude_lower.value || altitude > volume.altitude_upper.value) {
    return false;
  }

  // Check horizontal bounds
  if (volume.outline_circle) {
    return isPointInCircle(point, volume.outline_circle);
  }
  
  if (volume.outline_polygon) {
    return isPointInPolygon(point, volume.outline_polygon);
  }

  return false;
}

/**
 * Check if two volumes intersect
 */
export function doVolumesIntersect(volume1: Volume3D, volume2: Volume3D): boolean {
  // Check altitude overlap
  const alt1Min = volume1.altitude_lower.value;
  const alt1Max = volume1.altitude_upper.value;
  const alt2Min = volume2.altitude_lower.value;
  const alt2Max = volume2.altitude_upper.value;

  if (alt1Max < alt2Min || alt2Max < alt1Min) {
    return false; // No altitude overlap
  }

  // For horizontal intersection, this would need more complex geometry
  // Placeholder implementation
  return true;
}

/**
 * Calculate the area of a polygon in square meters
 */
export function calculatePolygonArea(polygon: Polygon): number {
  const vertices = polygon.vertices;
  if (vertices.length < 3) return 0;

  let area = 0;
  const R = 6371e3; // Earth's radius in meters

  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const lat1 = vertices[i].lat * Math.PI / 180;
    const lat2 = vertices[j].lat * Math.PI / 180;
    const lng1 = vertices[i].lng * Math.PI / 180;
    const lng2 = vertices[j].lng * Math.PI / 180;

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs(area * R * R / 2);
  return area;
}

/**
 * Get the center point of a polygon
 */
export function getPolygonCenter(polygon: Polygon): LatLngPoint {
  const vertices = polygon.vertices;
  let lat = 0;
  let lng = 0;

  for (const vertex of vertices) {
    lat += vertex.lat;
    lng += vertex.lng;
  }

  return {
    lat: lat / vertices.length,
    lng: lng / vertices.length,
  };
}