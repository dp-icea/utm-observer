import type {
  QuerySubscriptionParameters,
  QuerySubscriptionsResponse,
  GetSubscriptionResponse,
  PutSubscriptionParameters,
  PutSubscriptionResponse,
  DeleteSubscriptionResponse,
  SubscriptionID,
} from "@/schemas";
import api from "../api";

const BASE_URL = "/dss/v1/subscriptions";

// TODO: Change those things to async functions
export const dssSubscriptionService = {
  querySubscriptions: async (
    params: QuerySubscriptionParameters,
  ): Promise<QuerySubscriptionsResponse> => {
    const res = await api.post(`${BASE_URL}/query`, params);
    return res.data;
  },

  getSubscription: async (
    subscriptionid: SubscriptionID,
  ): Promise<GetSubscriptionResponse> => {
    const res = await api.get(`${BASE_URL}/${subscriptionid}`);
    return res.data;
  },

  createSubscription: async (
    subscriptionid: SubscriptionID,
    params: PutSubscriptionParameters,
  ): Promise<PutSubscriptionResponse> => {
    const res = await api.put(`${BASE_URL}/${subscriptionid}`, params);
    return res.data;
  },

  updateSubscription: async (
    subscriptionid: SubscriptionID,
    version: string,
    params: PutSubscriptionParameters,
  ): Promise<PutSubscriptionResponse> => {
    const res = await api.put(
      `${BASE_URL}/${subscriptionid}/${version}`,
      params,
    );
    return res.data;
  },

  deleteSubscription: async (
    subscriptionid: SubscriptionID,
    version: string,
  ): Promise<DeleteSubscriptionResponse> => {
    const res = await api.delete(`${BASE_URL}/${subscriptionid}/${version}`);
    return res.data;
  },
};
