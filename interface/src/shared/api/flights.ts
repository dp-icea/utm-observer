import type {
  QueryVolumesResponse,
  Volume4D,
  Rectangle,
  QueryFlightsResponse,
} from "@/schemas";
import { api } from "./api";

const RESOURCE_PATH = "/fetch";

export const FlightsService = {
  query: async (params: Rectangle): Promise<QueryFlightsResponse> => {
    const res = await api.post(`${RESOURCE_PATH}/flights`, params);
    return res.data.data;
  },
};
