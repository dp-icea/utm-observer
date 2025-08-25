import axios from "axios";
import { ENV } from "@/shared/config/env";

export const api = axios.create({
  baseURL: ENV.OBSERVER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
