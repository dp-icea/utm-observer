import { Settings, Bell, User, Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IconBRUTM from "@/assets/icon-br-utm.svg";
import { useMap } from "@/contexts/MapContext";
import { MaterialProgress } from "@/components/ui/material-progress";
import { MapState } from "@/schemas/context";


export const Header = () => {
  const { loading, mapState } = useMap();
  
  const getConnectionIcon = () => {
    switch (mapState) {
      case MapState.ONLINE:
        return <Wifi className="h-4 w-4 text-green-500" />;
      case MapState.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case MapState.LOADING:
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case MapState.OFFLINE:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionText = () => {
    switch (mapState) {
      case MapState.ONLINE:
        return 'Online';
      case MapState.ERROR:
        return 'Error';
      case MapState.LOADING:
        return 'Connecting...';
      case MapState.OFFLINE:
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

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
            {getConnectionIcon()}
            <span className="text-sm text-gray-300">{getConnectionText()}</span>
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
