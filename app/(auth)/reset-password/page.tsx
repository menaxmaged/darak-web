'use client';

import { useState } from 'react';
import { useResetPassword } from '@/Modules/auth/auth';
import { getErrorMessage } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const resetMutation = useResetPassword();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await resetMutation.mutateAsync({ email });
      toast.success(result.message_en || 'Password reset link sent to your email');
      setIsSubmitted(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-none">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="flex justify-center mb-4">
            <h1 className="font-serif text-5xl text-brand-rust tracking-tight">
eyoot             </h1>
          </div>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            Reset Password
          </CardTitle>
          <CardDescription className="text-brand-gray">
            {isSubmitted 
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-charcoal font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@eyoot.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border focus:border-brand-rust focus:ring-brand-rust"
                />
              </div>

              <Button
                type="submit"
                disabled={resetMutation.isPending}
                className="w-full h-12 bg-brand-rust hover:bg-brand-rust/90 text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all"
              >
                {resetMutation.isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 text-sm text-brand-gray hover:text-brand-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-brand-cream/50 p-4 rounded-xl text-center">
                <p className="text-brand-charcoal">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              
              <Link 
                href="/auth/login" 
                className="flex items-center justify-center gap-2 text-sm text-brand-rust hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
