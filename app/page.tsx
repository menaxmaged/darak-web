'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api-client';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = tokenManager.get();
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="text-center">
        <p className="text-brand-gray">Loading...</p>
      </div>
    </div>
  );
}
