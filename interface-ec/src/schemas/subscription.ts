import type { EntityID, Time, UssBaseURL, Volume4D } from "./common";
import type { ConstraintReference } from "./constraint";
import type { OperationalIntentReference } from "./operational-intent";

export type SubscriptionID = string;
export type SubscriptionNotificationIndex = number;
export type SubscriptionUssBaseURL = UssBaseURL;

export interface SubscriptionState {
  subscription_id: SubscriptionID;
  notification_index: SubscriptionNotificationIndex;
}

export interface SubscriberToNotify {
  subscriptions: SubscriptionState[];
  uss_base_url: UssBaseURL;
}

export interface Subscription {
  id: SubscriptionID;
  version: string;
  notification_index: SubscriptionNotificationIndex;
  time_start?: Time;
  time_end?: Time;
  uss_base_url: UssBaseURL;
  notify_for_operational_intents?: boolean;
  notify_for_constraints?: boolean;
  implicit_subscription?: boolean;
  dependent_operational_intents?: EntityID[];
}

export interface QuerySubscriptionParameters {
  area_of_interest?: Volume4D;
}

export interface QuerySubscriptionsResponse {
  subscriptions: Subscription[];
}

export interface GetSubscriptionResponse {
  subscription: Subscription;
}

export interface PutSubscriptionParameters {
  extents: Volume4D;
  uss_base_url: UssBaseURL;
  notify_for_operational_intents?: boolean;
  notify_for_constraints?: boolean;
}

export interface PutSubscriptionResponse {
  subscription: Subscription;
  operational_intent_references?: OperationalIntentReference[];
  constraint_references?: ConstraintReference[];
}

export interface DeleteSubscriptionResponse {
  subscription: Subscription;
}

export interface ImplicitSubscriptionParameters {
  uss_base_url: SubscriptionUssBaseURL;
  notify_for_constraints?: boolean;
}
