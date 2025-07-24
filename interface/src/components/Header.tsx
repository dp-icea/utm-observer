import { Settings, Bell, User, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IconBRUTM from "@/assets/icon-br-utm.svg";
import { useMap } from "@/contexts/MapContext";
import { MaterialProgress } from "@/components/ui/material-progress"; // Make sure you have this import

export const Header = () => {
  const { loading } = useMap();

  return (
    <header className="h-16 bg-gray-800 border-gray-700 border-b flex items-center justify-between px-4 relative z-30">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img
            src={IconBRUTM}
            alt="BR-UTM Logo"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold text-white">BR-UTM Observer</p>
            <p className="text-sm text-gray-300">
              Real-time UTM Tracking System
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* System Status */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Wifi className="h-4 w-4 text-green-500" />
            {/* Make a state variable to verify if there are errors or is currently offline */}
            <span className="text-sm text-gray-300">Online</span>
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute bottom-0 left-0 w-full">
          <MaterialProgress />
        </div>
      )}
    </header>
  );
};
