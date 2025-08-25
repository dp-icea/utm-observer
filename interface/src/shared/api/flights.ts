import type {
  QueryFlightsRequest,
  QueryFlightsResponse
} from "./flights.d";
import { api } from "./api";

const RESOURCE_PATH = "/airspace";

export const FlightsService = {
  query: async (params: QueryFlightsRequest): Promise<QueryFlightsResponse> => {
    const res = await api.post(`${RESOURCE_PATH}/flights`, params);
    return res.data.data;
  },
};
