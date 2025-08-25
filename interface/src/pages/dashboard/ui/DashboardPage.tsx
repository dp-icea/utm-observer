import { Header } from "./Header";
import { MapViewer } from "./MapViewer";
import { SidebarPanel } from "./SidebarPanel";
import { TimelineBar } from "./TimelineBar";
import { MapProvider } from "@/shared/lib/map";

export const DashboardPage = () => {
  return (
    <MapProvider>
      <div className="min-h-screen flex w-full bg-gray-900">
        <SidebarPanel />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 flex flex-col relative">
            <div className="flex-1 relative">
              <MapViewer />
            </div>
            <TimelineBar />
          </main>
        </div>
      </div>
    </MapProvider>
  );
};
