import { useRef, useEffect, Component, createRef } from "react";
import { Matrix4, Cartesian3, Terrain, Ion, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, useCesium, Cesium3DTileset, ImageryLayer } from "resium";
import { debounce } from "lodash-es";
import type { Volume4D } from "@/schemas";
import { apiFetchService } from "@/services";

const IonKey = import.meta.env.VITE_ION_KEY;

class ViewerController {
  private viewer: Cesium.Viewer;
  private debouncedDataFetch: () => void;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;

    console.log("ViewerControlller component was called");

    this.viewer.cesiumWidget.creditContainer.remove();

    console.log("Trying to obtain the user current location");
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        console.log("User's current location:", latitude, longitude);
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

    // ICEA São Jose Coords for testing
    // viewer.camera.setView({
    //   destination: Cartesian3.fromDegrees(-45.873938, -23.212619, 2000),
    //   orientation: {
    //     heading: Cesium.Math.toRadians(0),
    //     pitch: Cesium.Math.toRadians(-90),
    //     roll: 0,
    //   },
    // });

    this.debouncedDataFetch = debounce(this.fetchDataForCurrentView, 500); // 500ms debounce delay

    viewer.camera.moveEnd.addEventListener(this.debouncedDataFetch);
  }

  private fetchDataForCurrentView = async () => {
    const rectangle = this.viewer.camera.computeViewRectangle();

    if (!Cesium.defined(rectangle)) {
      console.warn("Camera rectangle is not defined.");
      return;
    }

    console.log("Camera Rectangle:", rectangle);

    // You'll need to get the start and end times from your TimelineBar component's state
    const startTime = new Date(); // Replace with actual start time
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // Replace with actual end time

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
        // You can also specify altitude ranges if needed
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

    // Now you can use this boundingVolume to make an API request
    // Example using your dssOperationalIntentService
    const volumes =
      await apiFetchService.queryVolumes(boundingVolume);

    console.log("Volumes Fetched:", volumes);
  };

  destroy() {
    this.viewer.camera.moveEnd.removeEventListener(this.debouncedDataFetch);
  }
}

const ViewerManager = () => {
  const controllerRef = useRef<ViewerController | null>(null);
  if (!controllerRef.current) {
    const { viewer } = useCesium();

    if (!Cesium.defined(viewer)) {
      console.error("Viewer instance is not available.");
      return;
    }

    controllerRef.current = new ViewerController(viewer);
  }
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
