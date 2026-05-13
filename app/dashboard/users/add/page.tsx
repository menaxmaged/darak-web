'use client';

import { useCreateUser } from '@/Modules/users/users';
import { getErrorMessage } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRY_OPTIONS = [
  { code: 'EG', dial: '+20', label: 'Egypt (+20)' },
  { code: 'SA', dial: '+966', label: 'Saudi Arabia (+966)' },
  { code: 'AE', dial: '+971', label: 'UAE (+971)' },
  { code: 'US', dial: '+1',  label: 'USA (+1)' },
  { code: 'GB', dial: '+44', label: 'UK (+44)' },
];

export default function AddUserPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: 'EG',
    dialCode: '+20',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'countryCode') {
      const country = COUNTRY_OPTIONS.find((c) => c.code === value);
      setForm((prev) => ({
        ...prev,
        countryCode: value,
        dialCode: country?.dial ?? prev.dialCode,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserMutation.mutateAsync(form);
      toast.success('User created successfully');
      router.push('/dashboard/users');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="border-none shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">
            Create User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="rounded-xl border-border"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="rounded-xl border-border"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="rounded-xl border-border"
              />
            </div>

            {/* Country + Phone */}
            <div className="space-y-1">
              <Label htmlFor="countryCode">Country</Label>
              <select
                id="countryCode"
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="rounded-xl border border-border w-full h-10 px-3 text-sm bg-background"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 rounded-xl border border-border bg-muted text-sm font-medium min-w-[70px]">
                  {form.dialCode}
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="1066953497"
                  className="rounded-xl border-border flex-1"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
                className="rounded-xl border-border"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="rounded-xl border border-border w-full h-10 px-3 text-sm bg-background"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="rounded-xl border-border"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => router.push('/dashboard/users')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
