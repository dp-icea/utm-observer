export const ENV = {
  OBSERVER_API_URL: import.meta.env.VITE_OBSERVER_API_URL || "/api",
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;