"use client";

import React from 'react';
import { Package, FileText, Truck, ArrowLeftRight, Settings, Warehouse } from 'lucide-react';
import { Activity } from '@/mock/data';
import { Card } from '@/components/ui/card';

interface ActivityTimelineProps {
  activities: Activity[];
}

const iconMap: Record<string, React.ElementType> = {
  Package,
  FileText,
  Truck,
  ArrowLeftRight,
  Settings,
  Warehouse,
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No activities yet</p>
        ) : (
          activities.map((activity, index) => {
            const Icon = activity.icon ? iconMap[activity.icon] : Package;
            const isLast = index === activities.length - 1;

            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-full min-h-[40px] bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(activity.date).toLocaleString()}
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded">
                    {activity.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
