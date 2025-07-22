import { Component } from "react";
import { Terrain, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, Cesium3DTileset, ImageryLayer } from "resium";
import { InterfaceHook } from "@/utils/interface-hook";

export default class Map extends Component {
  render() {
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
          <InterfaceHook />
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
