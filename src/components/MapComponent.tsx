import { useRef, useEffect, Component, createRef } from "react";
import { Matrix4, Cartesian3, Terrain, Ion, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, useCesium, Cesium3DTileset, ImageryLayer } from "resium";

const IonKey = import.meta.env.VITE_ION_KEY;

class ViewerController {
  constructor() {
    console.log("ViewerControlller component was called");
    const { viewer } = useCesium();

    if (!Cesium.defined(viewer)) {
      console.error("Viewer instance is not available.");
      return;
    }

    console.log("Trying to obtain the user current location");
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        console.log("User's current location:", latitude, longitude);
        // viewer.camera.setView({
        //   destination: Cartesian3.fromDegrees(longitude, latitude, 2000),
        //   orientation: {
        //     heading: Cesium.Math.toRadians(0),
        //     pitch: Cesium.Math.toRadians(-90),
        //     roll: 0,
        //   },
        // });
      },
    );

    viewer.cesiumWidget.creditContainer.remove();

    // Default ICEA
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(-45.873938, -23.212619, 2000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
    });

    viewer.camera.lookAtTransform(Matrix4.IDENTITY);

    viewer.camera.moveEnd.addEventListener(() => {
      const cameraPosition = viewer.camera.computeViewRectangle();
      console.log("Camera position:", cameraPosition);
    });
  }

  private fetchDataForCurrentView = () => {
    // Logic to determine bounding box and make API call
    // (We'll cover this in the next section)
    console.log("Fetching data for the new view...");
  };
}

const ViewerManager = () => {
  const controllerRef = useRef<ViewerController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new ViewerController();
  }
  return null;
};

export default class MapComponent extends Component {
  render() {
    // Set the default access token for Cesium Ion  d

    Ion.defaultAccessToken = IonKey;

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
