"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormField from '@/components/Form/FormField';
import { validateEmail, validateRequired } from '@/utils/validation';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData({
          name: user.name || '',
          email: user.email || '',
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(formData));
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <div>
              <CardTitle>{formData.name || 'User'}</CardTitle>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
              required
              placeholder="Enter your name"
            />

            <FormField
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
              placeholder="Enter your email"
            />

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium">Administrator</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Account Status</span>
            <span className="font-medium text-green-600 dark:text-green-400">Active</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
