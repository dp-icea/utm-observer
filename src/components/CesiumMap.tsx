import { useRef, useEffect, Component, createRef } from "react";
import { Matrix4, Cartesian3, Terrain, Ion, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, useCesium, Cesium3DTileset } from "resium";
import { CylinderTool } from "@/cylinder-tool.ts";

class ViewerController {
  constructor() {
    console.log("ViewerControlller component was called");
    const { viewer } = useCesium();

    if (!Cesium.defined(viewer)) {
      console.error("Viewer instance is not available.");
      return;
    }

    viewer.cesiumWidget.creditContainer.remove();

    viewer.camera.lookAt(
      Cartesian3.fromDegrees(-45.873938, -23.212619, 200.0),
      new Cartesian3(800.0, 800.0, 800.0),
    );

    viewer.camera.lookAtTransform(Matrix4.IDENTITY);

    new CylinderTool(viewer);
  }
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
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlY2Q0OTMyNS03ZjU0LTRjNDUtOTI1My02ZjdkMmMyNGMxZDYiLCJpZCI6MzA4MjgyLCJpYXQiOjE3NDkzMzMxMzR9.ezlAm0SmsrJil5SQA_Z7i7jHlDgJezGrK2_MMqd_gxg";

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
          style={{ width: "100%", height: "100%" }}
        >
          <ViewerManager />
          <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
        </Viewer>
      </div>
    );
  }
}
