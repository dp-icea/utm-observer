import * as Cesium from "cesium";
import { CylinderVolumeModel } from "./volume";

export interface CylinderToolState {
  addedRegions: CylinderVolumeModel[];
  draftModel?: CylinderVolumeModel;
  draftEntity?: Cesium.Entity;
  guideEntity?: Cesium.Entity;
  isActive: boolean;
  // TODO: Change to a selectiontool if needed
  isSelecting: boolean;
}
