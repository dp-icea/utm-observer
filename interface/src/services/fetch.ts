import type {
  QueryConstraintReferencesResponse,
  Volume4D,
} from "@/schemas";
import { api } from "@/services/api";

const RESOURCE_PATH = "/fetch";

export const apiFetchService = {
  queryVolumes: async (
    params: Volume4D,
  ): Promise<QueryConstraintReferencesResponse> => {
    
    console.log(import.meta.env.VITE_OBSERVER_API);

    const res = await api.post(`${RESOURCE_PATH}`, params);
    return res.data;
  },
};

