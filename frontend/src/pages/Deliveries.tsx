"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/Table/DataTable';
import FormField from '@/components/Form/FormField';
import FormSelect from '@/components/Form/FormSelect';
import { fetchDeliveries, fetchProducts, createDelivery, updateDeliveryStatus } from '@/mock/api';
import { Delivery, Product } from '@/mock/data';
import { validateRequired, validatePositiveNumber } from '@/utils/validation';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deliveriesData, productsData] = await Promise.all([
        fetchDeliveries(),
        fetchProducts(),
      ]);
      setDeliveries(deliveriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.productId)) {
      newErrors.productId = 'Product is required';
    }

    if (!validateRequired(formData.quantity) || !validatePositiveNumber(formData.quantity)) {
      newErrors.quantity = 'Valid quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      const product = products.find(p => p.id === formData.productId);
      const newDelivery = await createDelivery({
        product: product!.name,
        quantity: parseInt(formData.quantity),
        date: new Date().toISOString(),
        status: 'pending',
      });
      
      setDeliveries([...deliveries, newDelivery]);
      setFormData({ productId: '', quantity: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating delivery:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Delivery['status']) => {
    try {
      const updated = await updateDeliveryStatus(id, status);
      setDeliveries(deliveries.map(d => d.id === id ? updated : d));
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const deliveryColumns = [
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    {
      key: 'date',
      header: 'Date',
      render: (item: Delivery) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Delivery) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
          item.status === 'packed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
          item.status === 'picked' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Delivery) => (
        <div className="flex gap-2">
          {item.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(item.id, 'picked');
              }}
            >
              Pick
            </Button>
          )}
          {item.status === 'picked' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(item.id, 'packed');
              }}
            >
              Pack
            </Button>
          )}
          {item.status === 'packed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(item.id, 'delivered');
              }}
            >
              Validate Delivery
            </Button>
          )}
        </div>
      ),
    },
  ];

  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Outgoing Goods (Deliveries)</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create Delivery Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormSelect
              label="Product"
              id="productId"
              value={formData.productId}
              onChange={(value) => setFormData({ ...formData, productId: value })}
              options={productOptions}
              error={errors.productId}
              required
              placeholder="Select product"
            />

            <FormField
              label="Quantity"
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(value) => setFormData({ ...formData, quantity: value })}
              error={errors.quantity}
              required
              placeholder="Enter quantity"
            />

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Creating...' : 'Create Delivery Order'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Delivery Orders</h3>
        <DataTable data={deliveries} columns={deliveryColumns} />
      </div>
    </div>
  );
}
