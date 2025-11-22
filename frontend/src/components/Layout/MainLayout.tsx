"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/receipts': 'Receipts',
  '/deliveries': 'Deliveries',
  '/transfers': 'Internal Transfers',
  '/adjustments': 'Stock Adjustments',
  '/movement-history': 'Movement History',
  '/predictive-restock': 'Predictive Restock Assistant',
  '/notifications': 'Notifications',
  '/settings/warehouses': 'Warehouses',
  '/profile': 'Profile',
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'StockMaster';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 h-screen z-30 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          {children}
        </main>
      </div>
    </div>
  );
}