import type {
  QueryOperationalIntentReferenceParameters,
  QueryOperationalIntentReferenceResponse,
  GetOperationalIntentReferenceResponse,
  PutOperationalIntentReferenceParameters,
  ChangeOperationalIntentReferenceResponse,
  EntityID,
  EntityOVN,
} from "@/schemas";
import { dssApi } from "../api";
import { Scope } from "@/schemas";

const RESOURCE_PATH = "/dss/v1/operational_intent_references";

export const dssOperationalIntentService = {
  queryOperationalIntentReferences: async (
    params: QueryOperationalIntentReferenceParameters,
  ): Promise<QueryOperationalIntentReferenceResponse> => {
    const res = await dssApi.post(`${RESOURCE_PATH}/query`, params, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  getOperationalIntentReference: async (
    entityid: EntityID,
  ): Promise<GetOperationalIntentReferenceResponse> => {
    const res = await dssApi.get(`${RESOURCE_PATH}/${entityid}`, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  createOperationalIntentReference: async (
    entityid: EntityID,
    params: PutOperationalIntentReferenceParameters,
  ): Promise<ChangeOperationalIntentReferenceResponse> => {
    const res = await dssApi.put(`${RESOURCE_PATH}/${entityid}`, params, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  updateOperationalIntentReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
    params: PutOperationalIntentReferenceParameters,
  ): Promise<ChangeOperationalIntentReferenceResponse> => {
    const res = await dssApi.put(
      `${RESOURCE_PATH}/${entityid}/${ovn}`,
      params,
      {
        authContext: {
          scope: Scope.StrategicCoordination,
        },
      },
    );
    return res.data;
  },

  deleteOperationalIntentReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
  ): Promise<ChangeOperationalIntentReferenceResponse> => {
    const res = await dssApi.delete(`${RESOURCE_PATH}/${entityid}/${ovn}`, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },
};
