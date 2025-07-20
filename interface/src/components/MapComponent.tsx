import { useRef, useEffect, Component } from "react";
import { Cartesian3, Terrain, Ion, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, useCesium, Cesium3DTileset, ImageryLayer } from "resium";
import { debounce } from "lodash-es";
import { format } from "date-fns";
import type { Volume4D } from "@/schemas";
import { apiFetchService } from "@/services";
import { useMap } from "@/contexts/MapContext";

const IonKey = import.meta.env.VITE_ION_KEY;

class ViewerController {
  private viewer: Cesium.Viewer;
  private debouncedDataFetch: () => void;
  private getTimelineState: () => { startTime: Date; endTime: Date };

  constructor(
    viewer: Cesium.Viewer,
    getTimelineState: () => { startTime: Date; endTime: Date },
  ) {
    this.viewer = viewer;
    this.getTimelineState = getTimelineState;

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
    viewer.camera.moveEnd.addEventListener(this.debouncedDataFetch);
  }

  private fetchDataForCurrentView = async () => {
    const rectangle = this.viewer.camera.computeViewRectangle();
    if (!Cesium.defined(rectangle)) {
      return;
    }

    const { startTime, endTime } = this.getTimelineState();

    const boundingVolume: Volume4D = {
      volume: {
        outline_polygon: {
          vertices: [
            {
              lng: Cesium.Math.toDegrees(rectangle.west),
              lat: Cesium.Math.toDegrees(rectangle.north),
            },
            {
              lng: Cesium.Math.toDegrees(rectangle.east),
              lat: Cesium.Math.toDegrees(rectangle.north),
            },
            {
              lng: Cesium.Math.toDegrees(rectangle.east),
              lat: Cesium.Math.toDegrees(rectangle.south),
            },
            {
              lng: Cesium.Math.toDegrees(rectangle.west),
              lat: Cesium.Math.toDegrees(rectangle.south),
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
  };

  destroy() {
    this.viewer.camera.moveEnd.removeEventListener(this.debouncedDataFetch);
  }
}

const ViewerManager = () => {
  const { startDate, startTime, endDate, endTime } = useMap();
  const controllerRef = useRef<ViewerController | null>(null);
  const { viewer } = useCesium();

  const getTimelineState = () => {
    const startDateTime = new Date(
      `${format(startDate, "yyyy-MM-dd")}T${startTime}`,
    );
    const endDateTime = new Date(
      `${format(endDate, "yyyy-MM-dd")}T${endTime}`,
    );
    return { startTime: startDateTime, endTime: endDateTime };
  };

  useEffect(() => {
    if (viewer && !controllerRef.current) {
      controllerRef.current = new ViewerController(viewer, getTimelineState);
    }
    // No need to return a cleanup function that re-creates the controller on every date/time change
    // as the getTimelineState function will always get the latest values from the context.
  }, [viewer]);

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
