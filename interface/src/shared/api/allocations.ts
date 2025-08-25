import type {
  QueryAllocationsRequest,
  QueryAllocationsResponse,
} from "./allocations.d";
import { api } from "./api";

const RESOURCE_PATH = "/airspace";

export const AllocationsService = {
  query: async (params: QueryAllocationsRequest): Promise<QueryAllocationsResponse> => {
    const res = await api.post(`${RESOURCE_PATH}/allocations`, params);
    return res.data.data;
  },
};
