import type { SubscriberToNotify, EntityID } from "../../shared/types/common";
import type { Constraint, ConstraintReference } from "../constraint/types";
import type {
  OperationalIntent,
  OperationalIntentReference,
} from "../operational-intent/types";
import type { SubscriptionState } from "../subscription/types";

export interface ChangeOperationalIntentReferenceResponse {
  subscribers: SubscriberToNotify[];
  operational_intent_reference: OperationalIntentReference;
}

export interface ChangeConstraintReferenceResponse {
  subscribers: SubscriberToNotify[];
  constraint_reference: ConstraintReference;
}

export interface PutOperationalIntentDetailsParameters {
  operational_intent_id: EntityID;
  operational_intent?: OperationalIntent;
  subscriptions: SubscriptionState[];
}

export interface PutConstraintDetailsParameters {
  constraint_id: EntityID;
  constraint?: Constraint;
  subscriptions: SubscriptionState[];
}

export interface GetOperationalIntentAuthorizationResponse {
  issued_by?: string;
  issued_to?: {
    cnpj?: string;
    razao_social?: string;
    nome_fantasia?: string;
  };
  operation_profile?:
  | "Padrão"
  | "Especial - Órgãos de Governo"
  | "Especial - Outros"
  | "Aerolevantamento"
  | "Entorno de Estrutura"
  | "Aeroagrícola"
  | "Atípico";
  operators?: string[];
  aircraft?: string;
  contigency_strategy?: "Return to Home (RTH)" | "Parachute";
  timestamp?: number;
  observations?: string;
}
