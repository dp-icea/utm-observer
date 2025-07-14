import type {
  SetUssAvailabilityStatusParameters,
  UssAvailabilityStatusResponse,
} from "@/schemas";
import api from "../api";

const BASE_URL = "/dss/v1/uss_availability";

export const dssAvailabilityService = {
  setUssAvailability: async (
    ussId: string,
    params: SetUssAvailabilityStatusParameters,
  ): Promise<UssAvailabilityStatusResponse> => {
    const res = await api.put(`${BASE_URL}/${ussId}`, params);
    return res.data;
  },
  getUssAvailability: async (
    ussId: string,
  ): Promise<UssAvailabilityStatusResponse> => {
    const res = await api.get(`${BASE_URL}/${ussId}`);
    return res.data;
  },
};
