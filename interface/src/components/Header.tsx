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
            <span className="text-sm text-gray-300">Online</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            24 Active
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="ml-1 text-xs">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
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
