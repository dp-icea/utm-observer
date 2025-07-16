import type {
  QuerySubscriptionParameters,
  QuerySubscriptionsResponse,
  GetSubscriptionResponse,
  PutSubscriptionParameters,
  PutSubscriptionResponse,
  DeleteSubscriptionResponse,
  SubscriptionID,
} from "@/schemas";
import { dssApi } from "../api";
import { Scope } from "@/schemas";

const RESOURCE_PATH = "/dss/v1/subscriptions";

export const dssSubscriptionService = {
  querySubscriptions: async (
    params: QuerySubscriptionParameters,
  ): Promise<QuerySubscriptionsResponse> => {
    const res = await dssApi.post(`${RESOURCE_PATH}/query`, params, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  getSubscription: async (
    subscriptionid: SubscriptionID,
  ): Promise<GetSubscriptionResponse> => {
    const res = await dssApi.get(`${RESOURCE_PATH}/${subscriptionid}`, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  createSubscription: async (
    subscriptionid: SubscriptionID,
    params: PutSubscriptionParameters,
  ): Promise<PutSubscriptionResponse> => {
    const res = await dssApi.put(`${RESOURCE_PATH}/${subscriptionid}`, params, {
      authContext: {
        scope: Scope.StrategicCoordination,
      },
    });
    return res.data;
  },

  updateSubscription: async (
    subscriptionid: SubscriptionID,
    version: string,
    params: PutSubscriptionParameters,
  ): Promise<PutSubscriptionResponse> => {
    const res = await dssApi.put(
      `${RESOURCE_PATH}/${subscriptionid}/${version}`,
      params,
      {
        authContext: {
          scope: Scope.StrategicCoordination,
        },
      },
    );
    return res.data;
  },

  deleteSubscription: async (
    subscriptionid: SubscriptionID,
    version: string,
  ): Promise<DeleteSubscriptionResponse> => {
    const res = await dssApi.delete(
      `${RESOURCE_PATH}/${subscriptionid}/${version}`,
      {
        authContext: {
          scope: Scope.StrategicCoordination,
        },
      },
    );
    return res.data;
  },
};
