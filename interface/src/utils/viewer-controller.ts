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

export class ViewerController {
  private viewer: Cesium.Viewer;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;

    this.viewer.cesiumWidget.creditContainer.remove();

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        this.viewer.camera.setView({
          destination: Cartesian3.fromDegrees(longitude, latitude, 2000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0,
          },
        });
      },
    );
  }

  addMoveEndCallback(callback: () => void) {
    this.viewer.camera.moveEnd.addEventListener(callback);
  }

  drawRegions(regions: Array<Constraint | OperationalIntent>) {
    console.log("Drawing regions:", regions);

    this.viewer.entities.removeAll();

    regions.forEach((region) => {
      const { reference, details } = region;
      const { volumes }: { volumes: Volume4D[] } = details;

      if (!volumes || volumes.length === 0) {
        console.warn("No volumes to display for:", reference.id);
        return;
      }

      for (const volume of volumes) {
        let color: Cesium.Color = Cesium.Color.GREY;
        if ("state" in reference) {
          color = OperationalIntentStateColor[reference["state"]];
        }

        if (volume.volume["outline_circle"]) {
          this.drawCylinder(volume.volume, color);
        } else if (volume.volume["outline_polygon"]) {
          this.drawPolygon(volume.volume, color);
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
  ) {
    console.log("Drawing cylinder for volume:", volume);

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

    this.viewer.entities.add({
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

  private getCylinderLength(height: number): number {
    return 2 * height; // Adjust as needed for visual representation
  }

  private drawPolygon(
    volume: Volume3D,
    color: Cesium.Color = Cesium.Color.GREY,
  ) {
    if (!("outline_polygon" in volume)) {
      return;
    }

    const minHeight = volume.altitude_lower.value;
    const maxHeight = volume.altitude_upper.value;

    const vertices = volume.outline_polygon.vertices.map(
      (vertex) => new Cesium.Cartographic(vertex.lng, vertex.lat, minHeight),
    );

    this.viewer.entities.add({
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
