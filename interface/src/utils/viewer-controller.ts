import { Cartesian3 } from "cesium";
import * as Cesium from "cesium";
import { debounce } from "lodash-es";
import {
  OperationalIntentStateColor,
  type Constraint,
  type OperationalIntent,
  type Volume3D,
  type Volume4D,
} from "@/schemas";
import { apiFetchService } from "@/services";
import type { TimeRange } from "@/utils/interface-hook";

type EntityId = string;
type RegionId = string;
type RegionOvn = string;

interface DisplayedEntity {
  ovn: RegionOvn;
  entityIds: RegionId[];
}

export class ViewerController {
  private viewer: Cesium.Viewer;
  private displayedEntities: Record<RegionId, DisplayedEntity> = {};
  private handler: Cesium.ScreenSpaceEventHandler;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;

    this.viewer.cesiumWidget.creditContainer.remove();

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude, altitude } = position.coords;
        
        const cameraAltitude = altitude ? altitude + 1000 : 2000;

        this.viewer.camera.setView({
          destination: Cartesian3.fromDegrees(longitude, latitude, cameraAltitude),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0,
          },
        });
      },
    );

    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  }

  addMoveEndCallback(callback: () => void) {
    this.viewer.camera.moveEnd.addEventListener(callback);
  }

  addEntityClickCallback(
    callback: (entity: Cesium.Entity, regionId: RegionId) => void,
  ) {
    this.handler.setInputAction(
      (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObject = this.viewer.scene.pick(event.position);
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
          const pickedEntity = pickedObject.id as Cesium.Entity;
          const regionId = Object.keys(this.displayedEntities).find((id) =>
            this.displayedEntities[id].entityIds.includes(pickedEntity.id),
          );
          callback(pickedEntity, regionId as RegionId);
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );
  }

  displayRegions(regions: Array<Constraint | OperationalIntent>) {
    // Clearning RegionIds that are not in regions
    Object.keys(this.displayedEntities).forEach((regionId) => {
      if (!regions.some((region) => region.reference.id === regionId)) {
        this.displayedEntities[regionId].entityIds.forEach((entityId) => {
          this.viewer.entities.removeById(entityId);
        });
        delete this.displayedEntities[regionId];
      }
    });

    regions.forEach((region) => {
      const { reference, details } = region;
      const { volumes }: { volumes: Volume4D[] } = details;

      if (!volumes || volumes.length === 0) {
        return;
      }

      if (!("id" in reference && "ovn" in reference)) {
        return;
      }

      if (
        reference.id in this.displayedEntities &&
        this.displayedEntities[reference.id].ovn === reference.ovn
      ) {
        return;
      }

      if (!(reference.id in this.displayedEntities)) {
        this.displayedEntities[reference.id] = {
          ovn: reference.ovn || "",
          entityIds: [],
        };
      }

      if (
        reference.id in this.displayedEntities &&
        this.displayedEntities[reference.id].ovn !== reference.ovn
      ) {
        this.displayedEntities[reference.id].entityIds.forEach((entityId) => {
          this.viewer.entities.removeById(entityId);
        });
        this.displayedEntities[reference.id].entityIds = [];
        this.displayedEntities[reference.id].ovn = reference.ovn || "";
      }

      for (const volume of volumes) {
        let color: Cesium.Color = Cesium.Color.GREY;
        if ("state" in reference) {
          color = OperationalIntentStateColor[reference["state"]];
        }

        if (volume.volume["outline_circle"]) {
          const entity = this.drawCylinder(volume.volume, color);

          if (entity) {
            this.displayedEntities[reference.id].entityIds.push(entity.id);
          }
        } else if (volume.volume["outline_polygon"]) {
          const entity = this.drawPolygon(volume.volume, color);

          if (entity) {
            this.displayedEntities[reference.id].entityIds.push(entity.id);
          }
        }
      }
    });
  }

  getViewRectangle = (): Cesium.Rectangle | undefined => {
    return this.viewer.camera.computeViewRectangle();
  };

  private drawCylinder(
    volume: Volume3D,
    color: Cesium.Color = Cesium.Color.GREY,
  ): Cesium.Entity | undefined {

    if (!("outline_circle" in volume)) {
      return;
    }

    const radius = volume.outline_circle.radius.value;

    const height = volume.altitude_upper.value - volume.altitude_lower.value;

    const center = new Cesium.Cartographic(
      volume.outline_circle.center.lng,
      volume.outline_circle.center.lat,
      volume.altitude_lower.value + height / 2,
    );

    return this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(center),
      cylinder: {
        length: height,
        topRadius: radius,
        bottomRadius: radius,
        material: color.withAlpha(0.5),
        outline: true,
        outlineColor: color,
      },
    });
  }

  private drawPolygon(
    volume: Volume3D,
    color: Cesium.Color = Cesium.Color.GREY,
  ): Cesium.Entity | undefined {
    if (!("outline_polygon" in volume)) {
      return;
    }

    const minHeight = volume.altitude_lower.value;
    const maxHeight = volume.altitude_upper.value;

    const vertices = volume.outline_polygon.vertices.map(
      (vertex) => new Cesium.Cartographic(vertex.lng, vertex.lat, minHeight),
    );

    return this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          vertices.map((vertex) => Cesium.Cartographic.toCartesian(vertex)),
        ),
        material: color.withAlpha(0.5),
        height: minHeight,
        extrudedHeight: maxHeight,
        outline: true,
        outlineColor: color,
      },
    });
  }
}
