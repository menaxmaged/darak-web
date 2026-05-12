'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLogin } from '@/Modules/auth/auth';
import { getErrorMessage } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { DASHBOARD_CONFIG } from '@/lib/config/dashboard-config';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        console.log('About to call login mutation with:', formData);

      const result = await loginMutation.mutateAsync(formData);
      console.log('Login successful:', result);
     toast.success(result.message_en || 'Login successful');
     router.push('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-none py-6 ">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="flex justify-center mb-4">
            <Image src={DASHBOARD_CONFIG.brand.logo} alt={DASHBOARD_CONFIG.brand.name} width={100} height={100} className="w-20 h-auto" />
          </div>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-brand-gray">
            Sign in to manage your luxury properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-charcoal font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 rounded-xl border-border focus:border-brand-rust focus:ring-brand-rust"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-charcoal font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-12 rounded-xl border-border focus:border-brand-rust focus:ring-brand-rust"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link 
                href="/auth/reset-password" 
                className="text-sm text-brand-rust hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 bg-branding-dark hover:bg-branding-dark/90 text-black rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
