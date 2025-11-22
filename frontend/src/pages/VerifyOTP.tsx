"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || { email: '', name: '' };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification - any 6 digit code works
    localStorage.setItem('user', JSON.stringify({ email, name }));
    
    setLoading(false);
    navigate('/dashboard');
  };

  const handleResend = async () => {
    // Simulate resend OTP
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('OTP resent successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-primary">StockMaster</h1>
            <p className="text-sm text-muted-foreground">Inventory Management System</p>
          </div>
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to<br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Enter OTP</Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
              {error && <p className="text-sm text-destructive mt-2 text-center">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Resend OTP
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <a 
                onClick={() => navigate('/login')}
                className="text-primary hover:underline cursor-pointer"
              >
                Back to login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
