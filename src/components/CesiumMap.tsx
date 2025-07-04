import React from "react";
import { Viewer, Entity } from "resium";
import { Cartesian3, Color } from "cesium";

interface CesiumMapProps {
  isDarkMode?: boolean;
}

export const CesiumMap: React.FC<CesiumMapProps> = ({ isDarkMode = true }) => {
  // Sample satellite position
  const satellitePosition = Cartesian3.fromDegrees(-75.0, 40.0, 500000);

  return (
    <Viewer full>
      <Entity
        name="tokyo"
        description="test"
        position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
      />
    </Viewer>
    // <div className="absolute inset-0">
    //   <Viewer
    //     full
    //     timeline={false}
    //     animation={false}
    //     homeButton={false}
    //     sceneModePicker={false}
    //     navigationHelpButton={false}
    //     baseLayerPicker={false}
    //     geocoder={false}
    //     fullscreenButton={false}
    //     vrButton={false}
    //     infoBox={false}
    //     selectionIndicator={false}
    //     style={{ width: "100%", height: "100%" }}
    //   >
    //     {/* Sample satellite entity */}
    //     <Entity position={satellitePosition} name="Satellite Alpha-1">
    //       <PointGraphics
    //         pixelSize={15}
    //         color={Color.YELLOW}
    //         outlineColor={Color.BLACK}
    //         outlineWidth={2}
    //         heightReference={0}
    //       />
    //     </Entity>
    //   </Viewer>
    //
    //   {/* Map overlay controls */}
    //   <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 space-y-2 z-10">
    //     <div className="text-white text-sm font-medium">Map Controls</div>
    //     <div className="space-y-1 text-xs text-gray-300">
    //       <div>Left click + drag: Rotate</div>
    //       <div>Right click + drag: Pan</div>
    //       <div>Scroll: Zoom</div>
    //     </div>
    //   </div>
    //
    //   {/* Status indicator */}
    //   <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 z-10">
    //     <div className="flex items-center space-x-2 text-white text-sm">
    //       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    //       <span>3D Map Active</span>
    //     </div>
    //   </div>
    // </div>
  );
};
