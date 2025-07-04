
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'constraint' | 'operational-intent' | 'subscription' | 'utm-zone' | 'flight-plan';
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'constraint',
    title: 'New Constraint Added',
    message: 'Weather restriction zone activated in sector 7',
    timestamp: '2 min ago',
    severity: 'warning',
    read: false,
  },
  {
    id: '2',
    type: 'flight-plan',
    title: 'Flight Plan Check-In',
    message: 'Drone Alpha-7 checked in at waypoint 3',
    timestamp: '5 min ago',
    severity: 'success',
    read: false,
  },
  {
    id: '3',
    type: 'operational-intent',
    title: 'Operational Intent Updated',
    message: 'SkyDrone Corp modified flight path',
    timestamp: '12 min ago',
    severity: 'info',
    read: true,
  },
  {
    id: '4',
    type: 'subscription',
    title: 'New Subscription',
    message: 'AeroTech subscribed to sector updates',
    timestamp: '1 hour ago',
    severity: 'info',
    read: true,
  },
];

export const NotificationPanel = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'constraint': return <AlertTriangle className="h-3 w-3" />;
      case 'flight-plan': return <CheckCircle className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getSeverityColor = (severity: Notification['severity']) => {
    switch (severity) {
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      default: return isDarkMode ? 'text-blue-400' : 'text-blue-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs px-2 py-0">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllAsRead}
            className="h-6 px-2 text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              notification.read
                ? isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                : isDarkMode
                  ? 'bg-gray-750 border-gray-600 hover:bg-gray-700'
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-2">
              <div className={getSeverityColor(notification.severity)}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </div>
                <div className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {notification.message}
                </div>
                <div className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {notification.timestamp}
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
