import type {
  GetConstraintDetailsResponse,
  PutConstraintDetailsParameters,
  EntityID,
} from "@/schemas";
import api from "../api";

const BASE_URL = "/uss/v1/constraints";

export const ussConstraintService = {
  getConstraintDetails: async (
    entityid: EntityID,
  ): Promise<GetConstraintDetailsResponse> => {
    const res = await api.get(`${BASE_URL}/${entityid}`);
    return res.data;
  },

  notifyConstraintDetailsChanged: async (
    params: PutConstraintDetailsParameters,
  ): Promise<void> => {
    const res = await api.post(BASE_URL, params);
    return res.data;
  },
};
