import type {
  QueryConstraintReferenceParameters,
  QueryConstraintReferencesResponse,
  GetConstraintReferenceResponse,
  PutConstraintReferenceParameters,
  ChangeConstraintReferenceResponse,
  EntityID,
  EntityOVN,
} from "@/schemas";
import api from "../api";

const BASE_URL = "/dss/v1/constraint_references";

export const dssConstraintService = {
  queryConstraintReferences: async (
    params: QueryConstraintReferenceParameters,
  ): Promise<QueryConstraintReferencesResponse> => {
    const res = await api.post(`${BASE_URL}/query`, params);
    return res.data;
  },

  getConstraintReference: async (
    entityid: EntityID,
  ): Promise<GetConstraintReferenceResponse> => {
    const res = await api.get(`${BASE_URL}/${entityid}`);
    return res.data;
  },

  createConstraintReference: async (
    entityid: EntityID,
    params: PutConstraintReferenceParameters,
  ): Promise<ChangeConstraintReferenceResponse> => {
    const res = await api.put(`${BASE_URL}/${entityid}`, params);
    return res.data;
  },

  updateConstraintReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
    params: PutConstraintReferenceParameters,
  ): Promise<ChangeConstraintReferenceResponse> => {
    const res = await api.put(`${BASE_URL}/${entityid}/${ovn}`, params);
    return res.data;
  },

  deleteConstraintReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
  ): Promise<ChangeConstraintReferenceResponse> => {
    const res = await api.delete(`${BASE_URL}/${entityid}/${ovn}`);
    return res.data;
  },
};
