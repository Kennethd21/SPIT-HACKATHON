"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/Table/DataTable';
import Modal from '@/components/Modal/Modal';
import FormField from '@/components/Form/FormField';
import { fetchWarehouses, createWarehouse, updateWarehouse } from '@/mock/api';
import { Warehouse } from '@/mock/data';
import { validateRequired } from '@/utils/validation';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const warehousesData = await fetchWarehouses();
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({
        name: warehouse.name,
        code: warehouse.code,
        address: warehouse.address,
      });
    } else {
      setEditingWarehouse(null);
      setFormData({
        name: '',
        code: '',
        address: '',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Warehouse name is required';
    }

    if (!validateRequired(formData.code)) {
      newErrors.code = 'Warehouse code is required';
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, formData);
        setWarehouses(warehouses.map(w => 
          w.id === editingWarehouse.id ? { ...w, ...formData } : w
        ));
      } else {
        const newWarehouse = await createWarehouse(formData);
        setWarehouses([...warehouses, newWarehouse]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    } finally {
      setSaving(false);
    }
  };

  const warehouseColumns = [
    { key: 'name', header: 'Warehouse Name' },
    { key: 'code', header: 'Code' },
    { key: 'address', header: 'Address' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Warehouse) => (
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
          <p className="mt-4 text-muted-foreground">Loading warehouses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Warehouses</h2>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      <DataTable data={warehouses} columns={warehouseColumns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Warehouse Name"
            id="name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
            required
            placeholder="Enter warehouse name"
          />

          <FormField
            label="Code"
            id="code"
            value={formData.code}
            onChange={(value) => setFormData({ ...formData, code: value })}
            error={errors.code}
            required
            placeholder="e.g., MW-01"
          />

          <FormField
            label="Address"
            id="address"
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
            error={errors.address}
            required
            placeholder="Enter full address"
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingWarehouse ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
