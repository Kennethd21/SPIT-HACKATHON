"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/Table/DataTable';
import { fetchProducts, fetchMovementHistory } from '@/mock/api';
import { Product, MovementHistory } from '@/mock/data';

interface RestockPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  avgDailyUsage: number;
  daysUntilOutOfStock: number;
  suggestedReorderQty: number;
}

export default function PredictiveRestock() {
  const [predictions, setPredictions] = useState<RestockPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const [products, movements] = await Promise.all([
        fetchProducts(),
        fetchMovementHistory(),
      ]);

      // Calculate predictions for each product
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const productPredictions: RestockPrediction[] = products.map((product) => {
        // Get deliveries in last 30 days for this product
        const recentDeliveries = movements.filter(
          (m) =>
            m.type === 'delivery' &&
            m.product === product.name &&
            new Date(m.date).getTime() > thirtyDaysAgo
        );

        const totalDelivered = recentDeliveries.reduce((sum, m) => sum + m.quantity, 0);
        const avgDailyUsage = totalDelivered / 30;
        const currentStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
        const daysUntilOutOfStock = avgDailyUsage > 0 ? Math.floor(currentStock / avgDailyUsage) : 999;
        const suggestedReorderQty = Math.max(0, Math.ceil(avgDailyUsage * 14 - currentStock));

        return {
          productId: product.id,
          productName: product.name,
          currentStock,
          avgDailyUsage: Math.round(avgDailyUsage * 100) / 100,
          daysUntilOutOfStock,
          suggestedReorderQty,
        };
      });

      // Sort by urgency (days until out of stock)
      productPredictions.sort((a, b) => a.daysUntilOutOfStock - b.daysUntilOutOfStock);
      setPredictions(productPredictions);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'productName', header: 'Product' },
    {
      key: 'currentStock',
      header: 'Current Stock',
      render: (item: RestockPrediction) => (
        <span className="font-semibold">{item.currentStock} units</span>
      ),
    },
    {
      key: 'avgDailyUsage',
      header: 'Avg Daily Usage',
      render: (item: RestockPrediction) => (
        <span className="text-muted-foreground">{item.avgDailyUsage} units/day</span>
      ),
    },
    {
      key: 'daysUntilOutOfStock',
      header: 'Days Until Out of Stock',
      render: (item: RestockPrediction) => (
        <div className="flex items-center gap-2">
          {item.daysUntilOutOfStock < 7 && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`font-semibold ${
              item.daysUntilOutOfStock < 7
                ? 'text-red-600 dark:text-red-400'
                : item.daysUntilOutOfStock < 14
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {item.daysUntilOutOfStock > 100 ? '> 100' : item.daysUntilOutOfStock} days
          </span>
        </div>
      ),
    },
    {
      key: 'suggestedReorderQty',
      header: 'Suggested Reorder',
      render: (item: RestockPrediction) => (
        <span className="font-semibold text-primary">
          {item.suggestedReorderQty} units
        </span>
      ),
    },
  ];

  const urgentRestocks = predictions.filter((p) => p.daysUntilOutOfStock < 7);
  const mediumRestocks = predictions.filter(
    (p) => p.daysUntilOutOfStock >= 7 && p.daysUntilOutOfStock < 14
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Analyzing stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Predictive Restock Assistant</h2>
        <p className="text-muted-foreground mt-1">
          AI-powered recommendations based on historical usage patterns
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Urgent Restocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {urgentRestocks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Less than 7 days of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Medium Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {mediumRestocks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">7-14 days of stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{predictions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Being monitored</p>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Restock Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={predictions} columns={columns} />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">How predictions are calculated:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Average Daily Usage = Total deliveries in last 30 days ÷ 30</li>
            <li>• Days Until Out of Stock = Current Stock ÷ Average Daily Usage</li>
            <li>• Suggested Reorder Quantity = (Avg Daily Usage × 14 days) - Current Stock</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
