'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLogin } from '@/Modules/auth/auth';
import { useAuth } from '@/lib/providers/auth-provider';
import { getErrorMessage } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result?.user && result?.token) {
        login(result);
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      if (axiosError?.response?.status === 403) {
        const reason = axiosError.response.data?.reason;
        if (reason === 'account_inactive') {
          router.push(`/activate-account?email=${encodeURIComponent(email)}`);
          return;
        }
      }
      toast.error(getErrorMessage(error));
    }
  };

  const handleGoogle = () => toast.info('Google sign-in coming soon.');

  return (
    <div className="min-h-screen flex">
      {/* ── Left — Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to manage your listings.</p>
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 h-12"
            onClick={handleGoogle}
          >
            <svg className="h-5 w-5 mr-2 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/reset-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary font-semibold text-base"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right — Hero image ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero z-10" />
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="font-display text-4xl font-bold mb-4">
              List your property with Darak
            </h2>
            <p className="text-lg opacity-80 max-w-md leading-relaxed">
              Reach thousands of buyers looking for properties across Egypt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
