"use client";

import React from 'react';
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          {children}
        </main>
      </div>
    </div>
  );
}