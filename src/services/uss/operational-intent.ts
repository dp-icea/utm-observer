import type {
  GetOperationalIntentDetailsResponse,
  GetOperationalIntentTelemetryResponse,
  GetOperationalIntentAuthorizationResponse,
  PutOperationalIntentDetailsParameters,
  EntityID,
} from "@/schemas";
import api from "../api";

const BASE_URL = "/uss/v1/operational_intents";

export const ussOperationalIntentService = {
  getOperationalIntentDetails: async (
    entityid: EntityID,
  ): Promise<GetOperationalIntentDetailsResponse> => {
    const res = await api.get(`${BASE_URL}/${entityid}`);
    return res.data;
  },

  getOperationalIntentTelemetry: async (
    entityid: EntityID,
  ): Promise<GetOperationalIntentTelemetryResponse> => {
    const res = await api.get(`${BASE_URL}/${entityid}/telemetry`);
    return res.data;
  },

  getOperationalIntentAuthorization: async (
    entityid: EntityID,
  ): Promise<GetOperationalIntentAuthorizationResponse> => {
    const res = await api.get(`${BASE_URL}/${entityid}/authorization`);
    return res.data;
  },

  notifyOperationalIntentDetailsChanged: async (
    params: PutOperationalIntentDetailsParameters,
  ): Promise<void> => {
    const res = await api.post(BASE_URL, params);
    return res.data;
  },
};
