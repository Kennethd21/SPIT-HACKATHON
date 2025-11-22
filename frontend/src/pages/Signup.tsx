"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormField from '@/components/Form/FormField';
import { validateEmail, validateRequired, validatePassword } from '@/utils/validation';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoading(false);
    // Navigate to OTP verification
    navigate('/verify-otp', { state: { email: formData.email, name: formData.name } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-primary">StockMaster</h1>
            <p className="text-sm text-muted-foreground">Inventory Management System</p>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to get started with StockMaster</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <FormField
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
              required
              placeholder="John Doe"
            />

            <FormField
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
              placeholder="john@example.com"
            />
            
            <FormField
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              error={errors.password}
              required
              placeholder="••••••••"
            />

            <FormField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              error={errors.confirmPassword}
              required
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <a 
                onClick={() => navigate('/login')}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
