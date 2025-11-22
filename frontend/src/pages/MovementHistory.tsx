"use client";

import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Settings } from 'lucide-react';
import DataTable from '@/components/Table/DataTable';
import ActivityTimeline from '@/components/Timeline/ActivityTimeline';
import { fetchMovementHistory, fetchActivities } from '@/mock/api';
import { MovementHistory, Activity } from '@/mock/data';

export default function MovementHistoryPage() {
  const [movements, setMovements] = useState<MovementHistory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [movementsData, activitiesData] = await Promise.all([
        fetchMovementHistory(),
        fetchActivities(),
      ]);
      setMovements(movementsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading movement history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: MovementHistory['type']) => {
    switch (type) {
      case 'receipt':
        return <ArrowDownToLine className="w-4 h-4 text-green-600" />;
      case 'delivery':
        return <ArrowUpFromLine className="w-4 h-4 text-blue-600" />;
      case 'transfer':
        return <ArrowLeftRight className="w-4 h-4 text-purple-600" />;
      case 'adjustment':
        return <Settings className="w-4 h-4 text-orange-600" />;
    }
  };

  const movementColumns = [
    {
      key: 'type',
      header: 'Type',
      render: (item: MovementHistory) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(item.type)}
          <span className="capitalize">{item.type}</span>
        </div>
      ),
    },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    {
      key: 'fromWarehouse',
      header: 'From',
      render: (item: MovementHistory) => item.fromWarehouse || '-',
    },
    {
      key: 'toWarehouse',
      header: 'To',
      render: (item: MovementHistory) => item.toWarehouse || '-',
    },
    {
      key: 'date',
      header: 'Date',
      render: (item: MovementHistory) => new Date(item.date).toLocaleString(),
    },
    { key: 'user', header: 'User' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading movement history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Movement History</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable data={movements} columns={movementColumns} />
        </div>
        <div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
}
