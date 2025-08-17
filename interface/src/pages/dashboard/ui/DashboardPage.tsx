import { Header } from "../../../components/Header";
import { Login } from "../../../components/Login";
import { useAuth } from "../../../hooks/useAuth";
import { MapViewer } from "../../../widgets/map-viewer/ui/MapViewer";
import { SidebarPanel } from "../../../widgets/sidebar-panel/ui/SidebarPanel";
import { TimelineBar } from "../../../widgets/timeline-bar/ui/TimelineBar";

const Dashboard = () => {
  return (
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
  );
};

export const DashboardPage = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={login} />;
  }

  return <Dashboard />;
};