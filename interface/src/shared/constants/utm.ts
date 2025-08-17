/**
 * UTM-specific constants and configuration
 */

// Flight operational statuses
export const FLIGHT_STATUS = {
  UNDECLARED: "Undeclared",
  GROUND: "Ground", 
  AIRBORNE: "Airborne",
  EMERGENCY: "Emergency",
  SYSTEM_FAILURE: "RemoteIDSystemFailure",
} as const;

// Aircraft types
export const AIRCRAFT_TYPES = {
  NOT_DECLARED: "NotDeclared",
  AEROPLANE: "Aeroplane",
  HELICOPTER: "Helicopter", 
  GYROPLANE: "Gyroplane",
  HYBRID_LIFT: "HybridLift",
  ORNITHOPTER: "Ornithopter",
  GLIDER: "Glider",
  KITE: "Kite",
  FREE_BALLOON: "FreeBalloon",
  CAPTIVE_BALLOON: "CaptiveBalloon",
  AIRSHIP: "Airship",
  FREE_FALL_PARACHUTE: "FreeFallOrParachute",
  ROCKET: "Rocket",
  TETHERED_POWERED: "TetheredPoweredAircraft",
  GROUND_OBSTACLE: "GroundObstacle",
  OTHER: "Other",
} as const;

// Operational intent states
export const OPERATIONAL_INTENT_STATES = {
  ACCEPTED: "Accepted",
  ACTIVATED: "Activated", 
  NONCONFORMING: "Nonconforming",
  DELETED: "Deleted",
} as const;

// Constraint/GeoZone types
export const GEOZONE_TYPES = {
  COMMON: "COMMON",
  CUSTOMIZED: "CUSTOMIZED",
  PROHIBITED: "PROHIBITED",
  REQ_AUTHORISATION: "REQ_AUTHORISATION",
  CONDITIONAL: "CONDITIONAL",
  NO_RESTRICTION: "NO_RESTRICTION",
} as const;

// Authority roles
export const AUTHORITY_ROLES = {
  AUTHORIZATION: "AUTHORIZATION",
  NOTIFICATION: "NOTIFICATION", 
  INFORMATION: "INFORMATION",
} as const;

// USS availability states
export const USS_AVAILABILITY = {
  UNKNOWN: "Unknown",
  NORMAL: "Normal",
  DOWN: "Down",
} as const;

// Default operational parameters
export const DEFAULT_PARAMS = {
  // Default flight altitude limits (meters)
  MIN_ALTITUDE: 0,
  MAX_ALTITUDE: 120,
  
  // Default operational durations (minutes)
  DEFAULT_FLIGHT_DURATION: 30,
  DEFAULT_CONSTRAINT_DURATION: 60,
  
  // Default geographic bounds (Brazil)
  BRAZIL_BOUNDS: {
    NORTH: 5.27,
    SOUTH: -33.75,
    EAST: -28.65,
    WEST: -73.99,
  },
  
  // Default update intervals (milliseconds)
  FLIGHT_UPDATE_INTERVAL: 5000,
  VOLUME_UPDATE_INTERVAL: 10000,
  
  // Default map view
  DEFAULT_MAP_CENTER: {
    lat: -23.2525,
    lng: -45.8561,
  },
  DEFAULT_MAP_ZOOM: 15,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  FLIGHTS: "/fetch/flights",
  VOLUMES: "/fetch/volumes", 
  CONSTRAINTS: "/constraint_management",
  OPERATIONAL_INTENTS: "/operational_intents",
  SUBSCRIPTIONS: "/subscriptions",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FLIGHT_NOT_FOUND: "Flight not found",
  CONSTRAINT_CREATION_FAILED: "Failed to create constraint",
  INVALID_COORDINATES: "Invalid geographic coordinates",
  ALTITUDE_OUT_OF_BOUNDS: "Altitude outside permitted range",
  TIME_RANGE_INVALID: "Invalid time range specified",
  UNAUTHORIZED_OPERATION: "Operation not authorized",
} as const;

// Success messages  
export const SUCCESS_MESSAGES = {
  CONSTRAINT_CREATED: "Constraint created successfully",
  FLIGHT_AUTHORIZED: "Flight authorized",
  SUBSCRIPTION_UPDATED: "Subscription updated",
} as const;