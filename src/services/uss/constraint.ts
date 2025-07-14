import type {
  GetConstraintDetailsResponse,
  PutConstraintDetailsParameters,
  EntityID,
} from "@/schemas";
import { createUssApi } from "../api";

const RESOURCE_PATH = "/uss/v1/constraints";

export const ussConstraintService = {
  getConstraintDetails: async (
    ussBaseUrl: string,
    entityid: EntityID,
  ): Promise<GetConstraintDetailsResponse> => {
    const ussApi = createUssApi(ussBaseUrl); // Create an API instance for the specific USS
    const res = await ussApi.get(`${RESOURCE_PATH}/${entityid}`, {
      // The audience is now handled automatically by the interceptor
      authContext: { scope: "utm.constraint_processing" },
    });
    return res.data;
  },

  notifyConstraintDetailsChanged: async (
    ussBaseUrl: string,
    params: PutConstraintDetailsParameters,
  ): Promise<void> => {
    const ussApi = createUssApi(ussBaseUrl);
    const res = await ussApi.post(RESOURCE_PATH, params, {
      authContext: { scope: "utm.constraint_management" },
    });
    return res.data;
  },
};
