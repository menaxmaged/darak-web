'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Building2, BadgeCheck } from 'lucide-react';
import { useListings } from '@/Modules/listings/listings';
import { ListingCard } from '@/components/listings/ListingCard';
import { Skeleton } from '@/components/ui/skeleton';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function BrokerSkeleton() {
  return (
    <div className="container-custom py-8 space-y-8">
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/5 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function BrokerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: listingsRes, isLoading } = useListings({
    advertiserId: id,
    listingStatus: 'approved',
    limit: 100,
  });
  const listings = listingsRes?.data ?? [];
  const broker = listings[0]?.Advertiser;

  if (isLoading) return <BrokerSkeleton />;

  if (!broker) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="text-2xl font-display font-bold mb-3">Broker not found</h1>
        <p className="text-muted-foreground mb-6">
          This broker has no active listings or doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-cta inline-flex">Back to Home</Link>
      </div>
    );
  }

  const name = `${broker.firstName} ${broker.lastName}`.trim();

  return (
    <div className="container-custom py-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      {/* Profile header */}
      <div className="border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-display font-bold shrink-0">
          {initials(name) || <Building2 className="w-8 h-8" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-bold truncate">{name || 'Broker'}</h1>
            <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            {broker.phone && (
              <a
                href={`tel:${broker.phone}`}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> {broker.phone}
              </a>
            )}
            {broker.email && (
              <a
                href={`mailto:${broker.email}`}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> {broker.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Listings */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Listings from {name || 'this broker'}
        </h2>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/40 rounded-xl">
            <p className="text-muted-foreground">No active listings right now.</p>
          </div>
        )}
      </section>
    </div>
  );
}
