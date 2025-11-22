"use client";

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/Table/DataTable';
import FormField from '@/components/Form/FormField';
import FormSelect from '@/components/Form/FormSelect';
import { fetchTransfers, fetchProducts, fetchWarehouses, createTransfer, validateTransfer } from '@/mock/api';
import { Transfer, Product, Warehouse } from '@/mock/data';
import { validateRequired, validatePositiveNumber } from '@/utils/validation';

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fromWarehouseId: '',
    toWarehouseId: '',
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
      const [transfersData, productsData, warehousesData] = await Promise.all([
        fetchTransfers(),
        fetchProducts(),
        fetchWarehouses(),
      ]);
      setTransfers(transfersData);
      setProducts(productsData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error loading transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.fromWarehouseId)) {
      newErrors.fromWarehouseId = 'From warehouse is required';
    }

    if (!validateRequired(formData.toWarehouseId)) {
      newErrors.toWarehouseId = 'To warehouse is required';
    }

    if (formData.fromWarehouseId === formData.toWarehouseId) {
      newErrors.toWarehouseId = 'Warehouses must be different';
    }

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
      const fromWarehouse = warehouses.find(w => w.id === formData.fromWarehouseId);
      const toWarehouse = warehouses.find(w => w.id === formData.toWarehouseId);
      
      const newTransfer = await createTransfer({
        product: product!.name,
        fromWarehouse: fromWarehouse!.name,
        toWarehouse: toWarehouse!.name,
        quantity: parseInt(formData.quantity),
        date: new Date().toISOString(),
        status: 'pending',
      });
      
      setTransfers([...transfers, newTransfer]);
      setFormData({ fromWarehouseId: '', toWarehouseId: '', productId: '', quantity: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating transfer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      const validated = await validateTransfer(id);
      setTransfers(transfers.map(t => t.id === id ? validated : t));
    } catch (error) {
      console.error('Error validating transfer:', error);
    }
  };

  const transferColumns = [
    { key: 'product', header: 'Product' },
    { key: 'fromWarehouse', header: 'From' },
    { key: 'toWarehouse', header: 'To' },
    { key: 'quantity', header: 'Quantity' },
    {
      key: 'date',
      header: 'Date',
      render: (item: Transfer) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Transfer) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Transfer) => (
        item.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleValidate(item.id);
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Validate
          </Button>
        )
      ),
    },
  ];

  const warehouseOptions = warehouses.map(w => ({ value: w.id, label: `${w.name} (${w.code})` }));
  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading transfers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Internal Transfers</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormSelect
              label="From Warehouse"
              id="fromWarehouseId"
              value={formData.fromWarehouseId}
              onChange={(value) => setFormData({ ...formData, fromWarehouseId: value })}
              options={warehouseOptions}
              error={errors.fromWarehouseId}
              required
              placeholder="Select warehouse"
            />

            <FormSelect
              label="To Warehouse"
              id="toWarehouseId"
              value={formData.toWarehouseId}
              onChange={(value) => setFormData({ ...formData, toWarehouseId: value })}
              options={warehouseOptions}
              error={errors.toWarehouseId}
              required
              placeholder="Select warehouse"
            />

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
              {saving ? 'Creating...' : 'Validate Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Transfer History</h3>
        <DataTable data={transfers} columns={transferColumns} />
      </div>
    </div>
  );
}
