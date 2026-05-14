'use client';

import { useRouter } from 'next/navigation';
import { ListingWizard } from '@/components/listings/wizard/ListingWizard';

export default function NewListingPage() {
  const router = useRouter();
  return <ListingWizard onClose={() => router.push('/dashboard/my-listings')} />;
}
