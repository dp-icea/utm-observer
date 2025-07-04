import { useRef, useEffect, Component, createRef } from "react";
import { Matrix4, Cartesian3, Terrain, Ion, IonResource } from "cesium";
import * as Cesium from "cesium";
import { Viewer, useCesium, Cesium3DTileset } from "resium";
import "./App.css";
import { CylinderTool } from "./cylinder-tool.ts";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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

class MapComponent extends Component {
  render() {
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlY2Q0OTMyNS03ZjU0LTRjNDUtOTI1My02ZjdkMmMyNGMxZDYiLCJpZCI6MzA4MjgyLCJpYXQiOjE3NDkzMzMxMzR9.ezlAm0SmsrJil5SQA_Z7i7jHlDgJezGrK2_MMqd_gxg";

    return (
      <div className="App">
        <h1 className="text-3xl font-bold underline text-center">
          Resium Example
        </h1>
        <div className="h-500">
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
          >
            <ViewerManager />
            <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
          </Viewer>
        </div>
      </div>
    );
  }
}

// class ExampleComponent extends Component {
//   componentDidMount() {
//     const { viewer } = useCesium();
//
//     console.log(viewer);
//   }
//
//   render() {
//     Ion.defaultAccessToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlY2Q0OTMyNS03ZjU0LTRjNDUtOTI1My02ZjdkMmMyNGMxZDYiLCJpZCI6MzA4MjgyLCJpYXQiOjE3NDkzMzMxMzR9.ezlAm0SmsrJil5SQA_Z7i7jHlDgJezGrK2_MMqd_gxg";
//
//     return (
//       <Viewer
//         full
//         terrain={Terrain.fromWorldTerrain()}
//         selectionIndicator={false}
//         infoBox={false}
//         animation={false}
//         timeline={false}
//         homeButton={false}
//         fullscreenButton={false}
//         navigationHelpButton={false}
//         vrButton={false}
//       />
//     );
//   }
// }

// function App() {
//   return (
//     <div className="App">
//       <MapComponent />
//     </div>
//   );
// }

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
