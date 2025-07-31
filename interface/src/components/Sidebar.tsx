import { ClientList } from "./sidebar/ClientList";
import { OperationalFilters } from "./sidebar/OperationalFilters";
import { NotificationPanel } from "./sidebar/NotificationPanel";
import { DroneTracking } from "./sidebar/DroneTracking";

export const Sidebar = () => {
  return (
    <div className="w-80 bg-gray-800 border-gray-700 h-screen overflow-y-auto">
      <div className="text-white space-y-4 p-4">
        <ClientList />
        <OperationalFilters />
        {/*<NotificationPanel />*/}
        <DroneTracking />
      </div>
    </div>
  );
};
