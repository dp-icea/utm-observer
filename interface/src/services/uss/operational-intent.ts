import type {
  GetOperationalIntentDetailsResponse,
  GetOperationalIntentTelemetryResponse,
  GetOperationalIntentAuthorizationResponse,
  PutOperationalIntentDetailsParameters,
  EntityID,
} from "@/schemas";
import { createUssApi } from "../api";
import { Scope } from "@/schemas";

const RESOURCE_PATH = "/uss/v1/operational_intents";

export const ussOperationalIntentService = {
  getOperationalIntentDetails: async (
    ussBaseUrl: string,
    entityid: EntityID,
  ): Promise<GetOperationalIntentDetailsResponse> => {
    const ussApi = createUssApi(ussBaseUrl);
    const res = await ussApi.get(`${RESOURCE_PATH}/${entityid}`, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  getOperationalIntentTelemetry: async (
    ussBaseUrl: string,
    entityid: EntityID,
  ): Promise<GetOperationalIntentTelemetryResponse> => {
    const ussApi = createUssApi(ussBaseUrl);
    const res = await ussApi.get(`${RESOURCE_PATH}/${entityid}/telemetry`, {
      authContext: {
        scope: Scope.ConformanceMonitoringSA,
      },
    });
    return res.data;
  },

  getOperationalIntentAuthorization: async (
    ussBaseUrl: string,
    entityid: EntityID,
  ): Promise<GetOperationalIntentAuthorizationResponse> => {
    const ussApi = createUssApi(ussBaseUrl);
    const res = await ussApi.get(`${RESOURCE_PATH}/${entityid}/authorization`, {
      authContext: {
        scope: Scope.AviationAuthority,
      },
    });
    return res.data;
  },

  notifyOperationalIntentDetailsChanged: async (
    ussBaseUrl: string,
    params: PutOperationalIntentDetailsParameters,
  ): Promise<void> => {
    const ussApi = createUssApi(ussBaseUrl);
    const res = await ussApi.post(RESOURCE_PATH, params, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },
};
