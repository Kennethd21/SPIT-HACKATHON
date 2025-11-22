"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchNotifications, markNotificationAsRead } from '@/mock/api';
import { Notification } from '@/mock/data';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setShowNotifications(false);
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
        return 'border-l-yellow-500';
      case 'receipt_validated':
        return 'border-l-green-500';
      case 'delivery_validated':
        return 'border-l-blue-500';
      case 'transfer_completed':
        return 'border-l-purple-500';
      case 'adjustment_made':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-8 py-4">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        
        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="rounded-lg relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifications');
                      }}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-accent cursor-pointer transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                            !notification.read ? 'bg-accent/50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`font-semibold text-sm ${!notification.read ? 'text-primary' : ''}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(notification.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 cursor-pointer transition-colors">
            <User className="w-5 h-5 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}