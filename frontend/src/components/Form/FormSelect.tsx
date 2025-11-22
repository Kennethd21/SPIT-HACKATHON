"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function FormSelect({
  label,
  id,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = 'Select an option',
  disabled,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
