export type CodeZoneIdentifierType = string;
export type CodeCountryISOType = string;
export type TextShortType = string;
export type CodeZoneType =
  | "COMMON"
  | "CUSTOMIZED"
  | "PROHIBITED"
  | "REQ_AUTHORISATION"
  | "CONDITIONAL"
  | "NO_RESTRICTION";
export type CodeRestrictionType = string;
export type ConditionExpressionType = string;
export type CodeZoneReasonType =
  | "AIR_TRAFFIC"
  | "SENSITIVE"
  | "PRIVACY"
  | "POPULATION"
  | "NATURE"
  | "NOISE"
  | "FOREIGN_TERRITORY"
  | "EMERGENCY"
  | "OTHER";
export type CodeYesNoType = "YES" | "NO";
export type CodeUSpaceClassType = string;
export type CodeAuthorityRole =
  | "AUTHORIZATION"
  | "NOTIFICATION"
  | "INFORMATION";

export interface Authority {
  name?: TextShortType;
  service?: TextShortType;
  contact_name?: TextShortType;
  site_url?: TextShortType;
  email?: TextShortType;
  phone?: TextShortType;
  purpose?: CodeAuthorityRole;
  interval_before?: string; // ISO 8601 duration
}

export interface GeoZone {
  identifier: CodeZoneIdentifierType;
  country: CodeCountryISOType;
  zone_authority: Authority[];
  name?: TextShortType;
  type: CodeZoneType;
  restriction: CodeRestrictionType;
  restriction_conditions?: ConditionExpressionType[];
  region?: number;
  reason?: CodeZoneReasonType[];
  other_reason_info?: string;
  regulation_exemption?: CodeYesNoType;
  u_space_class?: CodeUSpaceClassType;
  message?: TextShortType;
  additional_properties?: object;
}
