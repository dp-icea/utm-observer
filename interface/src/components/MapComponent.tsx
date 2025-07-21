import { useRef, useEffect, Component } from "react";
import { Cartesian3, Terrain, Ion, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, useCesium, Cesium3DTileset, ImageryLayer } from "resium";
import { debounce } from "lodash-es";
import { format } from "date-fns";
import {
  OperationalIntentStateColor,
  type Constraint,
  type OperationalIntent,
  type Volume3D,
  type Volume4D,
} from "@/schemas";
import { apiFetchService } from "@/services";
import { useMap } from "@/contexts/MapContext";

const IonKey = import.meta.env.VITE_ION_KEY;

class ViewerController {
  private viewer: Cesium.Viewer;
  private debouncedDataFetch: () => void;
  private debouncedUpdateViewerVolumes: () => void;
  private timelineRange: () => {
    startTime: Date;
    endTime: Date;
  };
  private selectedMinutes: number[] = [0];
  private volumes: Array<Constraint | OperationalIntent>[] = [];

  constructor(
    viewer: Cesium.Viewer,
    timelineRange: () => {
      startTime: Date;
      endTime: Date;
    },
    selectedMinutes: number[] = [0],
  ) {
    this.viewer = viewer;
    this.timelineRange = timelineRange;
    this.selectedMinutes = selectedMinutes;

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

    this.debouncedDataFetch = debounce(this.fetchDataForCurrentView, 500);
    this.debouncedUpdateViewerVolumes = debounce(this.updateViewerVolumes, 500);
    viewer.camera.moveEnd.addEventListener(this.debouncedDataFetch);
  }

  setTimelineRange = (
    timelineRange: () => {
      startTime: Date;
      endTime: Date;
    },
  ) => {
    this.timelineRange = timelineRange;
  };

  setSelectedMinutes = (selectedMinutes: number[]) => {
    this.selectedMinutes = selectedMinutes;
    this.debouncedUpdateViewerVolumes();
  };

  private appendVolumes(volumes: Array<Constraint | OperationalIntent>) {
    const existingIds = new Set(this.volumes.map((v) => v.reference.id));
    const newVolumes = volumes.filter((v) => !existingIds.has(v.reference.id));
    this.volumes = this.volumes.concat(newVolumes);
  }

  fetchDataForCurrentView = async () => {
    const rectangle = this.viewer.camera.computeViewRectangle();
    if (!Cesium.defined(rectangle)) {
      return;
    }

    const { startTime, endTime } = this.timelineRange();

    console.log("Fetching data for rectangle:", rectangle);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);

    const boundingVolume: Volume4D = {
      volume: {
        outline_polygon: {
          vertices: [
            {
              lng: rectangle.west,
              lat: rectangle.north,
            },
            {
              lng: rectangle.east,
              lat: rectangle.north,
            },
            {
              lng: rectangle.east,
              lat: rectangle.south,
            },
            {
              lng: rectangle.west,
              lat: rectangle.south,
            },
          ],
        },
        altitude_lower: {
          value: 0,
          reference: "W84",
          units: "M",
        },
        altitude_upper: {
          value: 10000,
          reference: "W84",
          units: "M",
        },
      },
      time_start: { value: startTime.toISOString(), format: "RFC3339" },
      time_end: { value: endTime.toISOString(), format: "RFC3339" },
    };

    const volumes = await apiFetchService.queryVolumes(boundingVolume);
    console.log("Volumes Fetched:", volumes);

    this.appendVolumes(volumes.constraints);
    this.appendVolumes(volumes.operational_intents);

    console.log("All Volumes:", this.volumes);
  };

  private drawCylinder(
    volume: Volume3D,
    color: Cesium.Color = Cesium.Color.GREY,
  ) {
    console.log("Drawing cylinder for volume:", volume);

    if (!("outline_circle" in volume)) {
      return;
    }

    const center = new Cesium.Cartographic(
      volume.outline_circle.center.lng,
      volume.outline_circle.center.lat,
      volume.altitude_lower.value,
    );

    const radius = volume.outline_circle.radius.value;

    const height = volume.altitude_upper.value - volume.altitude_lower.value;

    this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(center),
      cylinder: {
        length: this.getCylinderLength(height),
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

  updateViewerVolumes() {
    console.log(
      "Updating viewer to display volumes:",
      this.volumes,
      "At time:",
      this.timelineRange(),
      "Selected Minutes:",
      this.selectedMinutes,
    );

    this.viewer.entities.removeAll();

    this.volumes.forEach((obj) => {
      console.log("Trying to update for volume", obj);

      const { reference, details } = obj;
      const { volumes }: { volumes: Volume4D[] } = details;

      if (!volumes || volumes.length === 0) {
        console.warn("No volumes to display for:", reference.id);
        return;
      }

      for (const volume of volumes) {
        const timeStart = volume.time_start.value;
        const timeEnd = volume.time_end.value;

        const rangeStartTime = new Date(timeStart);
        const minutesOffset = this.selectedMinutes[0] || 0;
        const selectedTime = new Date(
          rangeStartTime.getTime() + minutesOffset * 60 * 1000,
        );

        if (selectedTime < rangeStartTime || selectedTime > new Date(timeEnd)) {
          console.warn(
            `Selected time ${selectedTime} is outside the volume time range: ${timeStart} - ${timeEnd}`,
          );
          continue;
        }

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

  destroy() {
    this.viewer.camera.moveEnd.removeEventListener(this.debouncedDataFetch);
  }
}

const ViewerManager = () => {
  const { startDate, startTime, endDate, endTime, selectedMinutes } = useMap();
  const controllerRef = useRef<ViewerController | null>(null);
  const { viewer } = useCesium();

  const getTimelineState = () => {
    console.log("Getting timeline state");
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const startDateTime = new Date(
      `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
    );
    const endDateTime = new Date(`${format(endDate, "yyyy-MM-dd")}T${endTime}`);
    return { startTime: startDateTime, endTime: endDateTime };
  };

  useEffect(() => {
    if (viewer && !controllerRef.current) {
      controllerRef.current = new ViewerController(
        viewer,
        getTimelineState,
        selectedMinutes,
      );
    }

    if (controllerRef.current) {
      controllerRef.current.setTimelineRange(getTimelineState);
      controllerRef.current.fetchDataForCurrentView();
    }
  }, [viewer, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setSelectedMinutes(selectedMinutes);
    }
  }, [selectedMinutes]);

  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  return null;
};

export default class MapComponent extends Component {
  render() {
    if (IonKey) {
      Ion.defaultAccessToken = IonKey;
    }

    return (
      <div className="absolute inset-0">
        <Viewer
          terrain={Terrain.fromWorldTerrain()}
          selectionIndicator={false}
          infoBox={false}
          animation={false}
          timeline={false}
          homeButton={false}
          fullscreenButton={false}
          navigationHelpButton={false}
          vrButton={false}
          sceneModePicker={false}
          baseLayerPicker={false}
          style={{ width: "100%", height: "100%" }}
        >
          <ViewerManager />
          <ImageryLayer
            imageryProvider={
              new Cesium.OpenStreetMapImageryProvider({
                url: "https://a.tile.openstreetmap.org",
              })
            }
            show={true}
          />
          <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
        </Viewer>
      </div>
    );
  }
}
