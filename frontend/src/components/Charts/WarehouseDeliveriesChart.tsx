"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface WarehouseDeliveriesChartProps {
  data: Record<string, number>;
}

export default function WarehouseDeliveriesChart({ data }: WarehouseDeliveriesChartProps) {
  const maxValue = Math.max(...Object.values(data), 1);
  const warehouses = Object.keys(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Deliveries per Warehouse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {warehouses.map((warehouse) => {
            const value = data[warehouse];
            const percentage = (value / maxValue) * 100;

            return (
              <div key={warehouse}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{warehouse}</span>
                  <span className="text-sm text-muted-foreground">{value} units</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {warehouses.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No delivery data available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
