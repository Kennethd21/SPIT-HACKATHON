"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FormField from '@/components/Form/FormField';
import FormSelect from '@/components/Form/FormSelect';
import { fetchProducts } from '@/mock/api';
import { Product } from '@/mock/data';
import { validateRequired, validatePositiveNumber } from '@/utils/validation';
import { AlertCircle } from 'lucide-react';

export default function Adjustments() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productId: '',
    countedQuantity: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (productId: string) => {
    setFormData({ ...formData, productId });
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  const systemQuantity = selectedProduct 
    ? Object.values(selectedProduct.stock).reduce((a, b) => a + b, 0)
    : 0;

  const difference = formData.countedQuantity 
    ? parseInt(formData.countedQuantity) - systemQuantity
    : 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.productId)) {
      newErrors.productId = 'Product is required';
    }

    if (!validateRequired(formData.countedQuantity) || !validatePositiveNumber(formData.countedQuantity)) {
      newErrors.countedQuantity = 'Valid counted quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      // Simulate API call to adjust stock
      await new Promise(resolve => setTimeout(resolve, 800));
      
      alert(`Stock adjusted successfully!\nProduct: ${selectedProduct?.name}\nDifference: ${difference > 0 ? '+' : ''}${difference} units`);
      
      setFormData({ productId: '', countedQuantity: '' });
      setSelectedProduct(null);
      setErrors({});
    } catch (error) {
      console.error('Error adjusting stock:', error);
    } finally {
      setSaving(false);
    }
  };

  const productOptions = products.map(p => ({ value: p.id, label: `${p.name} (${p.sku})` }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading adjustments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Stock Adjustments</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adjust Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormSelect
                label="Product"
                id="productId"
                value={formData.productId}
                onChange={handleProductChange}
                options={productOptions}
                error={errors.productId}
                required
                placeholder="Select product"
              />

              <FormField
                label="Counted Quantity"
                id="countedQuantity"
                type="number"
                value={formData.countedQuantity}
                onChange={(value) => setFormData({ ...formData, countedQuantity: value })}
                error={errors.countedQuantity}
                required
                placeholder="Enter counted quantity"
              />

              <Button type="submit" disabled={saving || !selectedProduct} className="w-full">
                {saving ? 'Updating...' : 'Update Stock'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {selectedProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="text-lg font-semibold">{selectedProduct.name}</p>
                <p className="text-sm text-muted-foreground">{selectedProduct.sku}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">System Quantity</p>
                  <p className="text-2xl font-bold">{systemQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Counted Quantity</p>
                  <p className="text-2xl font-bold">
                    {formData.countedQuantity || '-'}
                  </p>
                </div>
              </div>

              {formData.countedQuantity && (
                <div className={`p-4 rounded-lg ${
                  difference === 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                  difference > 0 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                  'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      difference === 0 ? 'text-green-600 dark:text-green-400' :
                      difference > 0 ? 'text-blue-600 dark:text-blue-400' :
                      'text-red-600 dark:text-red-400'
                    }`} />
                    <div>
                      <p className={`font-semibold ${
                        difference === 0 ? 'text-green-900 dark:text-green-100' :
                        difference > 0 ? 'text-blue-900 dark:text-blue-100' :
                        'text-red-900 dark:text-red-100'
                      }`}>
                        Difference: {difference > 0 ? '+' : ''}{difference} units
                      </p>
                      <p className={`text-sm ${
                        difference === 0 ? 'text-green-700 dark:text-green-300' :
                        difference > 0 ? 'text-blue-700 dark:text-blue-300' :
                        'text-red-700 dark:text-red-300'
                      }`}>
                        {difference === 0 ? 'No adjustment needed' :
                         difference > 0 ? 'Stock will be increased' :
                         'Stock will be decreased'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Stock by Warehouse</p>
                <div className="space-y-2">
                  {Object.entries(selectedProduct.stock).map(([warehouseId, quantity]) => {
                    const warehouse = warehouseId; // In real app, would look up warehouse name
                    return (
                      <div key={warehouseId} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">Warehouse {warehouseId}</span>
                        <span className="font-semibold">{quantity} units</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
