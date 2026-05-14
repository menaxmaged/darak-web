'use client';

import { useParams, useRouter } from 'next/navigation';
import { ListingWizard } from '@/components/listings/wizard/ListingWizard';
import { useListing } from '@/Modules/listings/hooks';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: listingRes, isLoading } = useListing(id);

  const onClose = () => router.push('/dashboard/my-listings');

  if (isLoading) {
    return (
      <div className="container-custom py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-3 w-full max-w-xl" />
        <Skeleton className="h-100 w-full max-w-3xl mx-auto rounded-xl" />
      </div>
    );
  }

  const listing = listingRes?.data;

  if (!listing) {
    return (
      <div className="container-custom py-8 text-center text-muted-foreground">
        Listing not found.
      </div>
    );
  }

  return <ListingWizard listing={listing} onClose={onClose} />;
}
