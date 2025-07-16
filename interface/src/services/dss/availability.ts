import type {
  SetUssAvailabilityStatusParameters,
  UssAvailabilityStatusResponse,
} from "@/schemas";
import { dssApi } from "../api";
import { Scope } from "@/schemas";

const RESOURCE_PATH = "/dss/v1/uss_availability";

export const dssAvailabilityService = {
  setUssAvailability: async (
    ussId: string,
    params: SetUssAvailabilityStatusParameters,
  ): Promise<UssAvailabilityStatusResponse> => {
    const res = await dssApi.put(`${RESOURCE_PATH}/${ussId}`, params, {
      authContext: {
        scope: Scope.AvailabilityArbitration,
      },
    });
    return res.data;
  },
  getUssAvailability: async (
    ussId: string,
  ): Promise<UssAvailabilityStatusResponse> => {
    const res = await dssApi.get(`${RESOURCE_PATH}/${ussId}`, {
      authContext: {
        scope: Scope.AvailabilityArbitration,
      },
    });
    return res.data;
  },
};
