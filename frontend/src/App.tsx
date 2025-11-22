"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import VerifyOTP from '@/pages/VerifyOTP';
import Logout from '@/pages/Logout';

// Protected pages
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Receipts from '@/pages/Receipts';
import Deliveries from '@/pages/Deliveries';
import Transfers from '@/pages/Transfers';
import Adjustments from '@/pages/Adjustments';
import Warehouses from '@/pages/Warehouses';
import Profile from '@/pages/Profile';
import Notifications from '@/pages/Notifications';
import MovementHistory from '@/pages/MovementHistory';
import PredictiveRestock from '@/pages/PredictiveRestock';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Products />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipts"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Receipts />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deliveries"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Deliveries />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Transfers />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/adjustments"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Adjustments />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/movement-history"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MovementHistory />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/predictive-restock"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PredictiveRestock />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Notifications />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/warehouses"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Warehouses />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}