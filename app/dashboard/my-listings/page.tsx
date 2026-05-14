'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingWizard } from '@/components/listings/wizard/ListingWizard';
import { useAuth } from '@/lib/providers/auth-provider';
import { useListings } from '@/Modules/listings/hooks';
import type { Listing } from '@/Modules/listings/types';

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  count,
  label,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  count: number;
  label: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Listing card with status badge ────────────────────────────────────────────

function MyListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <span className={`status-badge ${
          listing.listing_status === 'pending' ? 'status-pending' :
          listing.listing_status === 'approved' ? 'status-approved' :
          'status-rejected'
        }`}>
          {listing.listing_status}
        </span>
      </div>
      {listing.admin_comment && listing.listing_status === 'rejected' && (
        <div className="absolute bottom-0 inset-x-0 z-10 bg-red-50 border-t border-red-100 px-4 py-2 text-xs text-red-600 rounded-b-xl line-clamp-2">
          <span className="font-medium">Note: </span>{listing.admin_comment}
        </div>
      )}
      <ListingCard listing={listing} />
    </div>
  );
}

// ─── Inner content (needs useSearchParams) ─────────────────────────────────────

function MyListingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWizard, setShowWizard] = useState(searchParams.get('new') === 'true');

  const { data: listingsRes, isLoading } = useListings({
    advertiserId: user?.id ? String(user.id) : undefined,
  });
  const listings = listingsRes?.data ?? [];

  const pending = listings.filter((l) => l.listing_status === 'pending').length;
  const approved = listings.filter((l) => l.listing_status === 'approved').length;
  const rejected = listings.filter((l) => l.listing_status === 'rejected').length;

  const openWizard = () => {
    router.replace('/dashboard/my-listings?new=true');
    setShowWizard(true);
  };

  const closeWizard = () => {
    router.replace('/dashboard/my-listings');
    setShowWizard(false);
  };

  return (
    <>
      {showWizard && <ListingWizard onClose={closeWizard} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} iconBg="bg-secondary" iconColor="text-foreground" count={listings.length} label="Total Listings" />
        <StatCard icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600" count={pending} label="Pending" />
        <StatCard icon={CheckCircle} iconBg="bg-emerald-100" iconColor="text-emerald-600" count={approved} label="Approved" />
        <StatCard icon={XCircle} iconBg="bg-red-100" iconColor="text-red-600" count={rejected} label="Rejected" />
      </div>

      {/* Add button (top-right) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">My Listings</h2>
        <Button className="gradient-primary" onClick={openWizard}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/40 rounded-xl">
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-5">You haven&apos;t created any listings yet.</p>
          <Button className="gradient-primary" onClick={openWizard}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Listing
          </Button>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  return (
    <Suspense>
      <MyListingsContent />
    </Suspense>
  );
}
