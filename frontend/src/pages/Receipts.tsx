"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/Table/DataTable';
import FormField from '@/components/Form/FormField';
import FormSelect from '@/components/Form/FormSelect';
import { fetchReceipts, fetchProducts, createReceipt, validateReceipt } from '@/mock/api';
import { Receipt, Product } from '@/mock/data';
import { validateRequired, validatePositiveNumber } from '@/utils/validation';

interface ReceiptLine {
  id: string;
  productId: string;
  quantity: string;
}

export default function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState('');
  const [lines, setLines] = useState<ReceiptLine[]>([{ id: '1', productId: '', quantity: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [receiptsData, productsData] = await Promise.all([
        fetchReceipts(),
        fetchProducts(),
      ]);
      setReceipts(receiptsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), productId: '', quantity: '' }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof ReceiptLine, value: string) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(supplier)) {
      newErrors.supplier = 'Supplier is required';
    }

    lines.forEach((line, index) => {
      if (!validateRequired(line.productId)) {
        newErrors[`product-${index}`] = 'Product is required';
      }
      if (!validateRequired(line.quantity) || !validatePositiveNumber(line.quantity)) {
        newErrors[`quantity-${index}`] = 'Valid quantity is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      for (const line of lines) {
        const product = products.find(p => p.id === line.productId);
        await createReceipt({
          supplier,
          product: product!.name,
          quantity: parseInt(line.quantity),
          date: new Date().toISOString(),
          status: 'pending',
        });
      }
      
      await loadData();
      setSupplier('');
      setLines([{ id: '1', productId: '', quantity: '' }]);
      setErrors({});
    } catch (error) {
      console.error('Error creating receipt:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      const validated = await validateReceipt(id);
      setReceipts(receipts.map(r => r.id === id ? validated : r));
    } catch (error) {
      console.error('Error validating receipt:', error);
    }
  };

  const receiptColumns = [
    { key: 'supplier', header: 'Supplier' },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    {
      key: 'date',
      header: 'Date',
      render: (item: Receipt) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Receipt) => (
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
      render: (item: Receipt) => (
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

  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Incoming Goods (Receipts)</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Supplier"
              id="supplier"
              value={supplier}
              onChange={setSupplier}
              error={errors.supplier}
              required
              placeholder="Enter supplier name"
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Products</label>
              <div className="space-y-3">
                {lines.map((line, index) => (
                  <div key={line.id} className="flex gap-3">
                    <div className="flex-1">
                      <FormSelect
                        label=""
                        id={`product-${line.id}`}
                        value={line.productId}
                        onChange={(value) => updateLine(line.id, 'productId', value)}
                        options={productOptions}
                        error={errors[`product-${index}`]}
                        placeholder="Select product"
                      />
                    </div>
                    <div className="w-32">
                      <FormField
                        label=""
                        id={`quantity-${line.id}`}
                        type="number"
                        value={line.quantity}
                        onChange={(value) => updateLine(line.id, 'quantity', value)}
                        error={errors[`quantity-${index}`]}
                        placeholder="Qty"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" onClick={addLine} className="mt-3">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Creating...' : 'Validate Receipt'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Receipt History</h3>
        <DataTable data={receipts} columns={receiptColumns} />
      </div>
    </div>
  );
}
