import type {
  QueryConstraintReferenceParameters,
  QueryConstraintReferencesResponse,
  GetConstraintReferenceResponse,
  PutConstraintReferenceParameters,
  ChangeConstraintReferenceResponse,
  EntityID,
  EntityOVN,
} from "@/schemas";
import { Scope } from "@/schemas"; // Import the Scope enum
import { dssApi } from "../api";

const RESOURCE_PATH = "/constraint_references";

export const dssConstraintService = {
  queryConstraintReferences: async (
    params: QueryConstraintReferenceParameters,
  ): Promise<QueryConstraintReferencesResponse> => {
    const res = await dssApi.post(`${RESOURCE_PATH}/query`, params, {
      authContext: {
        scope: Scope.ConstraintManagement,
      },
    });
    return res.data;
  },

  getConstraintReference: async (
    entityid: EntityID,
  ): Promise<GetConstraintReferenceResponse> => {
    const res = await dssApi.get(`${RESOURCE_PATH}/${entityid}`, {
      authContext: {
        scope: Scope.ConstraintManagement,
      },
    });
    return res.data;
  },

  createConstraintReference: async (
    entityid: EntityID,
    params: PutConstraintReferenceParameters,
  ): Promise<ChangeConstraintReferenceResponse> => {
    const res = await dssApi.put(`${RESOURCE_PATH}/${entityid}`, params, {
      authContext: {
        scope: Scope.ConstraintManagement,
      },
    });
    return res.data;
  },

  updateConstraintReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
    params: PutConstraintReferenceParameters,
  ): Promise<ChangeConstraintReferenceResponse> => {
    const res = await dssApi.put(
      `${RESOURCE_PATH}/${entityid}/${ovn}`,
      params,
      {
        authContext: {
          scope: Scope.ConstraintManagement,
        },
      },
    );
    return res.data;
  },

  deleteConstraintReference: async (
    entityid: EntityID,
    ovn: EntityOVN,
  ): Promise<ChangeConstraintReferenceResponse> => {
    const res = await dssApi.delete(`${RESOURCE_PATH}/${entityid}/${ovn}`, {
      authContext: {
        scope: Scope.ConstraintManagement,
      },
    });
    return res.data;
  },
};
