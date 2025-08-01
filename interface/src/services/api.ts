import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_OBSERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dssApi = axios.create({
  baseURL: import.meta.env.VITE_DSS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const geoawarenessApi = axios.create({
  baseURL: import.meta.env.VITE_GEOAWARENESS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
