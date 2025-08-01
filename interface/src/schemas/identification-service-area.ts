import type { EntityID, Time, UssBaseURL, Version, Volume4D } from "./common";
import type { SubscriberToNotify } from "./subscription";

//class IdentificationServiceAreaDetails(BaseModel):
//    volumes: List[Volume4D] = Field(..., min_items=1)
//
//class IdentificationServiceAreaFull(BaseModel):
//    reference: IdentificationServiceArea
//    details: IdentificationServiceAreaDetails

export interface IdentificationServiceAreaDetails {
  volumes: Volume4D[];
}

export interface IdentificationServiceAreaFull {
  reference: IdentificationServiceArea;
  details: IdentificationServiceAreaDetails;
}

export interface IdentificationServiceArea {
  id: EntityID;
  owner: string;
  time_start: Time;
  time_end: Time;
  version: Version;
  uss_base_url: UssBaseURL;
}

export interface CreateIdentificationServiceAreaParameters {
  extents: Volume4D;
  uss_base_url: UssBaseURL;
}

export interface UpdateIdentificationServiceAreaParameters {
  extents: Volume4D;
  uss_base_url: UssBaseURL;
}

export interface PutIdentificationServiceAreaResponse {
  service_area: IdentificationServiceArea;
  subscribers: SubscriberToNotify[];
}

export interface DeleteIdentificationServiceAreaResponse {
  service_area: IdentificationServiceArea;
  subscribers: SubscriberToNotify[];
}
