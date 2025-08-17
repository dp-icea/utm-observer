import { ClientList } from "../../../components/sidebar/ClientList";
import { OperationalFiltersPanel } from "../../../features/filter-operations/ui/OperationalFiltersPanel";
import { NotificationPanel } from "../../../components/sidebar/NotificationPanel";
import { FlightTrackingPanel } from "../../../features/track-flights/ui/FlightTrackingPanel";
import { ConstraintManagementPanel } from "../../../features/manage-constraints/ui/ConstraintManagementPanel";

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