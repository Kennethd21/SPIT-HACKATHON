"use client";

import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, FileText, Truck, ArrowLeftRight } from 'lucide-react';
import KPICard from '@/components/Cards/KPICard';
import DataTable from '@/components/Table/DataTable';
import { fetchDashboardStats, fetchActivities } from '@/mock/api';
import { Activity } from '@/mock/data';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    scheduledTransfers: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, activitiesData] = await Promise.all([
        fetchDashboardStats(),
        fetchActivities(),
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activityColumns = [
    { key: 'type', header: 'Type' },
    { key: 'description', header: 'Description' },
    { 
      key: 'date', 
      header: 'Date',
      render: (item: Activity) => new Date(item.date).toLocaleString(),
    },
    { key: 'user', header: 'User' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={{ value: '+12% from last month', isPositive: true }}
        />
        <KPICard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          className="border-l-4 border-l-yellow-500"
        />
        <KPICard
          title="Pending Receipts"
          value={stats.pendingReceipts}
          icon={FileText}
        />
        <KPICard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Truck}
        />
        <KPICard
          title="Scheduled Transfers"
          value={stats.scheduledTransfers}
          icon={ArrowLeftRight}
        />
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <DataTable data={activities} columns={activityColumns} />
      </div>
    </div>
  );
}