"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/Table/DataTable';
import Modal from '@/components/Modal/Modal';
import FormField from '@/components/Form/FormField';
import FormSelect from '@/components/Form/FormSelect';
import { fetchProducts, fetchWarehouses, createProduct, updateProduct } from '@/mock/api';
import { Product, Warehouse } from '@/mock/data';
import { validateRequired } from '@/utils/validation';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    stock: {} as Record<string, number>,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, warehousesData] = await Promise.all([
        fetchProducts(),
        fetchWarehouses(),
      ]);
      setProducts(productsData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        stock: { ...product.stock },
      });
    } else {
      setEditingProduct(null);
      const initialStock: Record<string, number> = {};
      warehouses.forEach(w => initialStock[w.id] = 0);
      setFormData({
        name: '',
        sku: '',
        category: '',
        stock: initialStock,
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Product name is required';
    }

    if (!validateRequired(formData.sku)) {
      newErrors.sku = 'SKU is required';
    }

    if (!validateRequired(formData.category)) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        ));
      } else {
        const newProduct = await createProduct(formData);
        setProducts([...products, newProduct]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const productColumns = [
    { key: 'name', header: 'Product Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category' },
    {
      key: 'stock',
      header: 'Total Stock',
      render: (item: Product) => Object.values(item.stock).reduce((a, b) => a + b, 0),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Product) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            openModal(item);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <DataTable data={products} columns={productColumns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Product Name"
            id="name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
            required
            placeholder="Enter product name"
          />

          <FormField
            label="SKU"
            id="sku"
            value={formData.sku}
            onChange={(value) => setFormData({ ...formData, sku: value })}
            error={errors.sku}
            required
            placeholder="e.g., WM-001"
          />

          <FormField
            label="Category"
            id="category"
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            error={errors.category}
            required
            placeholder="e.g., Electronics"
          />

          <div>
            <h3 className="text-sm font-medium mb-3">Stock per Warehouse</h3>
            <div className="space-y-3">
              {warehouses.map(warehouse => (
                <FormField
                  key={warehouse.id}
                  label={warehouse.name}
                  id={`stock-${warehouse.id}`}
                  type="number"
                  value={formData.stock[warehouse.id] || 0}
                  onChange={(value) => setFormData({
                    ...formData,
                    stock: { ...formData.stock, [warehouse.id]: parseInt(value) || 0 }
                  })}
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
