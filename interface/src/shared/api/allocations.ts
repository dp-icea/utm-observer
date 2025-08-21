import type {
  QueryVolumesResponse,
  Volume4D,
  Rectangle,
  QueryFlightsResponse,
} from "@/schemas";
import { api } from "./api";

const RESOURCE_PATH = "/fetch";

export const AllocationsService = {
  query: async (params: Volume4D): Promise<QueryVolumesResponse> => {
    const res = await api.post(`${RESOURCE_PATH}/volumes`, params);
    return res.data.data;
  },
};
