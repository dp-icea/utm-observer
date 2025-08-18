import { Header } from "@/widgets/header/ui/Header";
import { MapViewer } from "@/widgets/map-viewer/ui/MapViewer";
import { SidebarPanel } from "@/widgets/sidebar-panel/ui/SidebarPanel";
import { TimelineBar } from "@/widgets/timeline-bar/ui/TimelineBar";
import { MapProvider } from "@/shared/providers/MapProvider";

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
