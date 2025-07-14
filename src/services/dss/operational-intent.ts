import type {
  QueryOperationalIntentReferenceParameters,
  QueryOperationalIntentReferenceResponse,
  GetOperationalIntentReferenceResponse,
  PutOperationalIntentReferenceParameters,
  ChangeOperationalIntentReferenceResponse,
  EntityID,
  EntityOVN,
} from "@/schemas";
import api from "../api";

const BASE_URL = "/dss/v1/operational_intent_references";

export const dssOperationalIntentService = {
  queryOperationalIntentReferences: async (
    params: QueryOperationalIntentReferenceParameters,
  ): Promise<QueryOperationalIntentReferenceResponse> => {
    const res = await api.post(`${BASE_URL}/query`, params);
    return res.data;
  },

  getOperationalIntentReference: async (
    entityid: EntityID,
  ): Promise<GetOperationalIntentReferenceResponse> => {
    const res = await api.get(`${BASE_URL}/${entityid}`);
    return res.data;
  },

  createOperationalIntentReference: async (
    entityid: EntityID,
    params: PutOperationalIntentReferenceParameters,
  ): Promise<ChangeOperationalIntentReferenceResponse> => {
    const res = await api.put(`${BASE_URL}/${entityid}`, params);
    return res.data;
  },

  updateOperationalIntentReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
    params: PutOperationalIntentReferenceParameters,
  ): Promise<ChangeOperationalIntentReferenceResponse> => {
    const res = await api.put(`${BASE_URL}/${entityid}/${ovn}`, params);
    return res.data;
  },

  deleteOperationalIntentReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
  ): Promise<ChangeOperationalIntentReferenceResponse> => {
    const res = await api.delete(`${BASE_URL}/${entityid}/${ovn}`);
    return res.data;
  },
};
