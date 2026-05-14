'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useVerifyOtp, useResendOtp } from '@/Modules/auth/auth';
import { getErrorMessage } from '@/lib/api-client';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

function ActivateAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const focusNext = (index: number) => {
    inputRefs.current[index + 1]?.focus();
  };

  const focusPrev = (index: number) => {
    inputRefs.current[index - 1]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char) focusNext(index);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index]) focusPrev(index);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) {
      toast.error('Please enter the 6-digit code.');
      return;
    }
    try {
      await verifyMutation.mutateAsync({ email, otp });
      toast.success('Account activated! You can now sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendMutation.isPending) return;
    try {
      await resendMutation.mutateAsync({ email });
      toast.success('A new code has been sent to your email.');
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md"
    >
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Activate your account</h1>
        <p className="text-muted-foreground">
          We sent a 6-digit code to{' '}
          <span className="text-foreground font-medium">{email || 'your email'}</span>.
          Enter it below to activate your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3 justify-center">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-semibold border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full h-12 gradient-primary font-semibold text-base"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resendMutation.isPending}
          className="text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
        >
          {resendMutation.isPending
            ? 'Sending…'
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : 'Resend code'}
        </button>
      </div>
    </motion.div>
  );
}

export default function ActivateAccountPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left — Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Suspense fallback={<div className="w-full max-w-md animate-pulse h-64 rounded-lg bg-muted" />}>
          <ActivateAccountForm />
        </Suspense>
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
              One step away from Darak
            </h2>
            <p className="text-lg opacity-80 max-w-md leading-relaxed">
              Verify your email to start listing properties across Egypt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
