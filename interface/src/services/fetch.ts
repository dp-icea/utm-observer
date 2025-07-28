import type { QueryVolumesResponse, Volume4D, Rectangle, QueryFlightsResponse } from "@/schemas";
import { api } from "@/services/api";

const RESOURCE_PATH = "/fetch";

export const apiFetchService = {
  queryVolumes: async (params: Volume4D): Promise<QueryVolumesResponse> => {
    const res = await api.post(`${RESOURCE_PATH}`, params);
    return res.data.data;
  },

  queryFlights: async (params: Rectangle): Promise<QueryFlightsResponse> => {
    const res = await api.post(`${RESOURCE_PATH}/flights`, params);
    return res.data.data;
  }
};
