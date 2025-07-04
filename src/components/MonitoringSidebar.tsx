
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Settings, 
  Activity
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ClientList } from './sidebar/ClientList';
import { OperationalFilters } from './sidebar/OperationalFilters';
import { NotificationPanel } from './sidebar/NotificationPanel';
import { DroneTracking } from './sidebar/DroneTracking';

const monitoringOptions = [
  { title: 'Live Tracking', icon: Activity, count: 24, status: 'active' },
  { title: 'Geofences', icon: MapPin, count: 8, status: 'normal' },
  { title: 'Alerts', icon: AlertTriangle, count: 3, status: 'warning' },
  { title: 'History', icon: Clock, count: null, status: 'normal' },
  { title: 'Settings', icon: Settings, count: null, status: 'normal' },
];

export const MonitoringSidebar = () => {
  const { state } = useSidebar();
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState('Live Tracking');
  const isCollapsed = state === 'collapsed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'warning': return 'destructive';
      case 'active': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Sidebar className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
      <SidebarContent className={isDarkMode ? 'text-white' : 'text-gray-900'}>
        {/* System Status */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-semibold`}>
              System Status
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className={`p-4 ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} rounded-lg mx-2 mb-4`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>CPU Usage</span>
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Memory</span>
                    <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Network</span>
                    <span className="text-sm text-green-400 font-medium">Optimal</span>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-semibold`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {monitoringOptions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={selectedOption === item.title}
                    onClick={() => setSelectedOption(item.title)}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                    {!isCollapsed && item.count && (
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)} text-white`}>
                        {item.count}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Client List */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2">
                <ClientList />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Operational Filters */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2">
                <OperationalFilters />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Notifications */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2">
                <NotificationPanel />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Drone Tracking */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2">
                <DroneTracking />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
