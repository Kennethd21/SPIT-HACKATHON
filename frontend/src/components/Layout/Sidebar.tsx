"use client";

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Truck, 
  ArrowLeftRight, 
  Settings as SettingsIcon,
  User,
  LogOut,
  Settings,
  Bell,
  History,
  TrendingUp
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: FileText, label: 'Receipts', path: '/receipts' },
  { icon: Truck, label: 'Deliveries', path: '/deliveries' },
  { icon: ArrowLeftRight, label: 'Transfers', path: '/transfers' },
  { icon: SettingsIcon, label: 'Adjustments', path: '/adjustments' },
  { icon: History, label: 'Movement History', path: '/movement-history' },
  { icon: TrendingUp, label: 'Restock Assistant', path: '/predictive-restock' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Warehouses', path: '/settings/warehouses' },
];

const bottomMenuItems = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: LogOut, label: 'Logout', path: '/logout' },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">StockMaster</h1>
        <p className="text-sm text-muted-foreground">Inventory System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-border">
        <ul className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}