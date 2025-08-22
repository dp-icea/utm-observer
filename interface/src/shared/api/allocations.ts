import type {
  QueryAllocationsRequest,
  QueryAllocationsResponse,
} from "./allocations.d";
import { api } from "./api";

const RESOURCE_PATH = "/fetch";

export const AllocationsService = {
  query: async (params: QueryAllocationsRequest): Promise<QueryAllocationsResponse> => {
    const res = await api.post(`${RESOURCE_PATH}/volumes`, params);
    return res.data.data;
  },
};
