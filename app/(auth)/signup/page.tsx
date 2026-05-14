'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRegister } from '@/Modules/auth/auth';
import { getErrorMessage } from '@/lib/api-client';

const COUNTRIES = [
  { countryCode: 'EG', dialCode: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { countryCode: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { countryCode: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'UAE' },
  { countryCode: 'KW', dialCode: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { countryCode: 'QA', dialCode: '+974', flag: '🇶🇦', name: 'Qatar' },
  { countryCode: 'BH', dialCode: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { countryCode: 'OM', dialCode: '+968', flag: '🇴🇲', name: 'Oman' },
  { countryCode: 'JO', dialCode: '+962', flag: '🇯🇴', name: 'Jordan' },
  { countryCode: 'LB', dialCode: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { countryCode: 'IQ', dialCode: '+964', flag: '🇮🇶', name: 'Iraq' },
  { countryCode: 'LY', dialCode: '+218', flag: '🇱🇾', name: 'Libya' },
  { countryCode: 'SD', dialCode: '+249', flag: '🇸🇩', name: 'Sudan' },
  { countryCode: 'GB', dialCode: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { countryCode: 'US', dialCode: '+1',   flag: '🇺🇸', name: 'United States' },
  { countryCode: 'DE', dialCode: '+49',  flag: '🇩🇪', name: 'Germany' },
  { countryCode: 'FR', dialCode: '+33',  flag: '🇫🇷', name: 'France' },
];

const DEFAULT_COUNTRY = COUNTRIES[0];

export default function SignupPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [country,     setCountry]     = useState(DEFAULT_COUNTRY);
  const [phone,       setPhone]       = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender,      setGender]      = useState<'male' | 'female' | ''>('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');

  const handleCountryChange = (code: string) => {
    const found = COUNTRIES.find((c) => c.countryCode === code);
    if (found) setCountry(found);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
        countryCode:  phone ? country.countryCode : undefined,
        dialCode:     phone ? country.dialCode    : undefined,
        phone:        phone || undefined,
        dateOfBirth:  dateOfBirth || undefined,
        gender:       gender || undefined,
      });
      toast.success('Account created! You can now sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleGoogle = () => toast.info('Google sign-in coming soon.');

  return (
    <div className="min-h-screen flex">
      {/* ── Left — Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md py-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Start listing your properties on Egypt&apos;s premium marketplace.
            </p>
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

            {/* First & Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ahmed"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Hassan"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
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

            {/* Phone with dial code */}
            <div>
              <Label htmlFor="phone">
                Phone <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <div className="flex gap-2 mt-1">
                <Select value={country.countryCode} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-32 h-12 shrink-0">
                    <SelectValue>
                      <span className="flex items-center gap-1.5">
                        <span>{country.flag}</span>
                        <span className="text-sm">{country.dialCode}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.countryCode} value={c.countryCode}>
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.dialCode}</span>
                          <span className="text-muted-foreground text-xs">{c.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="1001234567"
                  className="h-12 flex-1"
                />
              </div>
            </div>

            {/* Date of birth & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="pl-10 h-12"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <Label>
                  Gender <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                  <SelectTrigger className="h-12 mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary font-semibold text-base"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right — Hero image ── */}
      <div className="hidden lg:sticky lg:top-0 lg:h-screen lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero z-10" />
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="font-display text-4xl font-bold mb-4">
              Join thousands of sellers on Darak
            </h2>
            <p className="text-lg opacity-80 max-w-md leading-relaxed">
              Reach buyers looking for properties across Egypt. List for free today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
