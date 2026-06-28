'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, Clock, CheckCircle, XCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ListingCard } from '@/components/listings/ListingCard';
import { useAuth } from '@/lib/providers/auth-provider';
import { useMyListings } from '@/Modules/listings/hooks';
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

// ─── Listing card with status badge + edit button ──────────────────────────────

function MyListingCard({ listing, onEdit }: { listing: Listing; onEdit: (l: Listing) => void }) {
  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={(e) => { e.preventDefault(); onEdit(listing); }}
          className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
          title="Edit listing"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
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
  console.log('Rendering MyListingsContent for user:', user);
  const { data: listingsRes, isLoading } = useMyListings({
    advertiserId: user?.id ? String(user.id) : undefined,
  });
  const listings = listingsRes?.data ?? [];

  const pending  = listings.filter((l) => l.listing_status === 'pending').length;
  const approved = listings.filter((l) => l.listing_status === 'approved').length;
  const rejected = listings.filter((l) => l.listing_status === 'rejected').length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} iconBg="bg-secondary"    iconColor="text-foreground"   count={listings.length} label="Total Listings" />
        <StatCard icon={Clock}     iconBg="bg-amber-100"    iconColor="text-amber-600"    count={pending}         label="Pending" />
        <StatCard icon={CheckCircle} iconBg="bg-emerald-100" iconColor="text-emerald-600" count={approved}        label="Approved" />
        <StatCard icon={XCircle}   iconBg="bg-red-100"      iconColor="text-red-600"      count={rejected}        label="Rejected" />
      </div>

      {/* Header + Add button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">My Listings</h2>
        <Button className="gradient-primary" onClick={() => router.push('/dashboard/my-listings/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Listing
        </Button>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/5 rounded-xl" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <MyListingCard
              key={listing.id}
              listing={listing}
              onEdit={(l) => router.push(`/dashboard/my-listings/${l.id}/edit`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/40 rounded-xl">
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-5">You haven&apos;t created any listings yet.</p>
          <Button className="gradient-primary" onClick={() => router.push('/dashboard/my-listings/new')}>
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
