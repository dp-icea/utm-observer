import * as Cesium from "cesium";

export enum CylinderVolumeState {
  DRAFT = "DRAFT",
  ACCEPTED = "ACCEPTED",
  ERROR = "ERROR",
  REQUESTED = "REQUESTED",
}

export const CylinderVolumeStateColors = {
  [CylinderVolumeState.DRAFT]: Cesium.Color.YELLOW,
  [CylinderVolumeState.ACCEPTED]: Cesium.Color.GREEN,
  [CylinderVolumeState.ERROR]: Cesium.Color.RED,
  [CylinderVolumeState.REQUESTED]: Cesium.Color.BLACK,
} as const;

export interface CylinderVolumeModel {
  center: Cesium.Cartographic;
  radius: number;
  height: number;
  entity?: Cesium.Entity;
  state: CylinderVolumeState;
  confirmedVolume?: CylinderVolumeSchema;
}

export interface CylinderVolumeSchema {
  volume: {
    outline_circle: {
      center: {
        lng: number;
        lat: number;
      };
      radius: {
        value: number;
        units: string;
      };
    };
    altitude_lower: {
      value: number;
      reference: string;
      units: string;
    };
    altitude_upper: {
      value: number;
      reference: string;
      units: string;
    };
  };
  time_start: {
    value: string;
    format: string;
  };
  time_end: {
    value: string;
    format: string;
  };
}

export interface CylinderVolumeRequestPayload {
  volume: {
    outline_circle: {
      center: {
        lng: number;
        lat: number;
      };
      radius: {
        value: number;
        units: string;
      };
    };
    altitude_lower: {
      value: number;
      reference: string;
      units: string;
    };
    altitude_upper: {
      value: number;
      reference: string;
      units: string;
    };
  };
  time_start: {
    value: string;
    format: string;
  };
  time_end: {
    value: string;
    format: string;
  };
}

export interface FlightRequestReference {
  id: string;
  flight_type: string;
  manager: string;
  uss_availability: string;
  version: number;
  state: CylinderVolumeState;
  ovn: string;
  time_start: {
    value: string;
    format: string;
  };
  time_end: {
    value: string;
    format: string;
  };
  uss_base_url: string;
  subscription_id?: string; // Optional, may not be present in all references
}

export interface FlightRequestResponse {
  status: number;
  message: string;
  data: {
    reference: FlightRequestReference;
    details: {
      volumes: Array<CylinderVolumeSchema | PolygonVolumeSchema>; // List of volumes, can include both cylinder and polygon volumes
      off_nominal_volumes?: any[]; // Optional, may not be present in all responses
      priority?: number; // Optional, may not be present in all responses
    };
  };
}

export interface CylinderVolumeConflictResponse {
  detail: {
    message: string;
    data: {
      constraints: any[]; // List of constraints, if any
      operational_intents: FlightRequestReference[]; // List of conflicting operational intents
    };
  };
}
