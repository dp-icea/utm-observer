import type { Time, EntityID, EntityOVN } from "./common";
import type { VehicleTelemetry } from "./operational-intent";

export interface ExchangeRecord {
  url: string;
  method: string;
  headers?: string[];
  recorder_role: "Client" | "Server";
  request_time: Time;
  request_body?: string;
  response_time?: Time;
  response_body?: string;
  response_code?: number;
  problem?: string;
}

export interface UserNotificationRecord {
  triggering_event_time: Time;
  notification_time: Time;
  notification_details?: string;
  notification_triggering_event:
  | "GEN0400"
  | "GEN0405"
  | "SCD0090"
  | "SCD0095"
  | "ACM0010"
  | "CMSA0115"
  | "CMSA0300"
  | "CSTP0005"
  | "CSTP0010"
  | "CSTP0020"
  | "CSTP0025"
  | "CSTP0030"
  | "CSTP0035";
}

export interface UserInputRecord {
  triggering_event_time: Time;
  operational_intent_id: EntityID;
  input_triggering_event:
  | "OPIN0040"
  | "CMSA0010"
  | "CMSA0025"
  | "CMSA0100"
  | "CMSA0105"
  | "CMSA0110"
  | "CMSA0200"
  | "CMSA0205"
  | "CMSA0210"
  | "CMSA0215";
  input_details?: string;
}

export interface OperatorAssociation {
  operational_intent_id: EntityID;
  operator_id: string;
}

export interface PositionRecord {
  time_received: Time;
  telemetry: VehicleTelemetry;
}

export interface OperationalIntentPositions {
  operational_intent_id: EntityID;
  positions?: PositionRecord[];
}

export interface PlanningRecord {
  time: Time;
  ovns?: EntityOVN[];
  missing_operational_intents?: EntityID[];
  missing_constraints?: EntityID[];
  operational_intent_id?: EntityID;
  problem?: string;
}

export interface ConstraintProviderAssociation {
  constraint_id: EntityID;
  constraint_provider_id: string;
}

export interface USSLogSet {
  messages?: ExchangeRecord[];
  operator_notifications?: UserNotificationRecord[];
  operator_inputs?: UserInputRecord[];
  operator_associations?: OperatorAssociation[];
  planning_attempts?: PlanningRecord[];
  operational_intent_positions?: OperationalIntentPositions[];
  constraint_provider_associations?: ConstraintProviderAssociation[];
}

export interface ErrorReport {
  report_id?: string;
  exchange: ExchangeRecord;
}
