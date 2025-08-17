/**
 * Map and Cesium-specific constants
 */

// Cesium configuration
export const CESIUM_CONFIG = {
  // Default ion access token (should be overridden by env var)
  DEFAULT_ION_TOKEN: "your-cesium-ion-token-here",
  
  // Terrain providers
  TERRAIN_PROVIDERS: {
    WORLD_TERRAIN: "Cesium World Terrain",
    ELLIPSOID: "WGS84 Ellipsoid",
  },
  
  // Imagery providers
  IMAGERY_PROVIDERS: {
    OPENSTREETMAP: "OpenStreetMap",
    BING_MAPS: "Bing Maps",
    ESRI_WORLD: "Esri World Imagery",
  },
  
  // Default camera settings
  DEFAULT_CAMERA: {
    POSITION: {
      longitude: -45.8561,
      latitude: -23.2525,
      height: 1000,
    },
    HEADING: 0,
    PITCH: -90, // Looking straight down
    ROLL: 0,
  },
} as const;

// Map visualization settings
export const MAP_SETTINGS = {
  // Entity colors (Cesium.Color values will be set at runtime)
  COLORS: {
    FLIGHT_ACTIVE: "#00FF00",      // Green
    FLIGHT_EMERGENCY: "#FF0000",    // Red
    FLIGHT_GROUND: "#808080",       // Gray
    CONSTRAINT_PROHIBITED: "#FF0000", // Red
    CONSTRAINT_RESTRICTED: "#FFA500", // Orange
    OPERATIONAL_INTENT_ACCEPTED: "#FFFF00", // Yellow
    OPERATIONAL_INTENT_ACTIVATED: "#00FF00", // Green
    OPERATIONAL_INTENT_NONCONFORMING: "#FFA500", // Orange
    OPERATIONAL_INTENT_DELETED: "#FF0000", // Red
  },
  
  // Entity sizes and styles
  ENTITY_STYLES: {
    FLIGHT_POINT_SIZE: 8,
    FLIGHT_PATH_WIDTH: 2,
    VOLUME_OUTLINE_WIDTH: 2,
    VOLUME_FILL_OPACITY: 0.3,
    LABEL_FONT_SIZE: 12,
    LABEL_OUTLINE_WIDTH: 2,
  },
  
  // Animation and updates
  ANIMATION: {
    FLIGHT_UPDATE_INTERVAL: 1000, // ms
    CAMERA_TRANSITION_DURATION: 2, // seconds
    ENTITY_FADE_DURATION: 1, // seconds
  },
} as const;

// Layer visibility defaults
export const DEFAULT_LAYER_VISIBILITY = {
  FLIGHTS: true,
  OPERATIONAL_INTENTS: true,
  CONSTRAINTS: true,
  IDENTIFICATION_SERVICE_AREAS: true,
  TERRAIN: true,
  BUILDINGS: false,
  WEATHER: false,
} as const;

// Map interaction settings
export const MAP_INTERACTIONS = {
  // Mouse/touch controls
  ENABLE_ZOOM: true,
  ENABLE_ROTATE: true,
  ENABLE_PAN: true,
  ENABLE_TILT: true,
  
  // Selection and picking
  ENABLE_SELECTION: true,
  ENABLE_INFO_BOX: true,
  ENABLE_DOUBLE_CLICK_ZOOM: false,
  
  // Navigation controls
  SHOW_HOME_BUTTON: false,
  SHOW_FULLSCREEN_BUTTON: false,
  SHOW_SCENE_MODE_PICKER: false,
  SHOW_BASE_LAYER_PICKER: false,
  SHOW_NAVIGATION_HELP: false,
  SHOW_ANIMATION: false,
  SHOW_TIMELINE: false,
  SHOW_VR_BUTTON: false,
} as const;

// Performance settings
export const PERFORMANCE_SETTINGS = {
  // Entity limits
  MAX_FLIGHTS_DISPLAYED: 1000,
  MAX_VOLUMES_DISPLAYED: 500,
  MAX_HISTORY_POINTS: 100,
  
  // Update frequencies
  ENTITY_UPDATE_FREQUENCY: 60, // FPS
  TERRAIN_UPDATE_FREQUENCY: 30, // FPS
  
  // Memory management
  ENABLE_ENTITY_CLUSTERING: true,
  CLUSTER_PIXEL_RANGE: 80,
  CLUSTER_MINIMUM_SIZE: 50,
} as const;

// Coordinate systems and projections
export const COORDINATE_SYSTEMS = {
  WGS84: "EPSG:4326",
  WEB_MERCATOR: "EPSG:3857",
  UTM_ZONE_23S: "EPSG:32723", // For Brazil region
} as const;