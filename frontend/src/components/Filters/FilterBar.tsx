"use client";

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/Form/FormField';
import FormSelect from '@/components/Form/FormSelect';
import { Card } from '@/components/ui/card';

export interface FilterOptions {
  documentType?: string;
  status?: string;
  warehouse?: string;
  category?: string;
  sku?: string;
  dateFrom?: string;
  dateTo?: string;
  quantityMin?: string;
  quantityMax?: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  showDocumentType?: boolean;
  showStatus?: boolean;
  showWarehouse?: boolean;
  showCategory?: boolean;
  showSKU?: boolean;
  showDateRange?: boolean;
  showQuantityRange?: boolean;
  documentTypeOptions?: Array<{ value: string; label: string }>;
  statusOptions?: Array<{ value: string; label: string }>;
  warehouseOptions?: Array<{ value: string; label: string }>;
  categoryOptions?: Array<{ value: string; label: string }>;
}

export default function FilterBar({
  onFilterChange,
  showDocumentType = false,
  showStatus = false,
  showWarehouse = false,
  showCategory = false,
  showSKU = false,
  showDateRange = false,
  showQuantityRange = false,
  documentTypeOptions = [],
  statusOptions = [],
  warehouseOptions = [],
  categoryOptions = [],
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t">
          {showDocumentType && (
            <FormSelect
              label="Document Type"
              id="documentType"
              value={filters.documentType || ''}
              onChange={(value) => updateFilter('documentType', value)}
              options={documentTypeOptions}
              placeholder="All Types"
            />
          )}

          {showStatus && (
            <FormSelect
              label="Status"
              id="status"
              value={filters.status || ''}
              onChange={(value) => updateFilter('status', value)}
              options={statusOptions}
              placeholder="All Statuses"
            />
          )}

          {showWarehouse && (
            <FormSelect
              label="Warehouse"
              id="warehouse"
              value={filters.warehouse || ''}
              onChange={(value) => updateFilter('warehouse', value)}
              options={warehouseOptions}
              placeholder="All Warehouses"
            />
          )}

          {showCategory && (
            <FormSelect
              label="Product Category"
              id="category"
              value={filters.category || ''}
              onChange={(value) => updateFilter('category', value)}
              options={categoryOptions}
              placeholder="All Categories"
            />
          )}

          {showSKU && (
            <FormField
              label="SKU Search"
              id="sku"
              value={filters.sku || ''}
              onChange={(value) => updateFilter('sku', value)}
              placeholder="Search by SKU"
            />
          )}

          {showDateRange && (
            <>
              <FormField
                label="Date From"
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(value) => updateFilter('dateFrom', value)}
              />
              <FormField
                label="Date To"
                id="dateTo"
                type="date"
                value={filters.dateTo || ''}
                onChange={(value) => updateFilter('dateTo', value)}
              />
            </>
          )}

          {showQuantityRange && (
            <>
              <FormField
                label="Quantity Min"
                id="quantityMin"
                type="number"
                value={filters.quantityMin || ''}
                onChange={(value) => updateFilter('quantityMin', value)}
                placeholder="Min quantity"
              />
              <FormField
                label="Quantity Max"
                id="quantityMax"
                type="number"
                value={filters.quantityMax || ''}
                onChange={(value) => updateFilter('quantityMax', value)}
                placeholder="Max quantity"
              />
            </>
          )}
        </div>
      )}
    </Card>
  );
}
