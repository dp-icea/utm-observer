import { ClientList } from "@/features/dashboard-filters/ui/ClientListPanel";
import { OperationalFiltersPanel } from "@/features/dashboard-filters/ui/OperationalFiltersPanel";
import { FlightTrackingPanel } from "@/features/track-flights/ui/FlightTrackingPanel";

export const SidebarPanel = () => {
  return (
    <div className="w-80 bg-gray-800 border-gray-700 h-screen overflow-y-auto">
      <div className="text-white space-y-4 p-4">
        {/* <ConstraintManagementPanel /> */}
        <ClientList />
        <OperationalFiltersPanel />
        {/*<NotificationPanel />*/}
        <FlightTrackingPanel />
      </div>
    </div>
  );
};
