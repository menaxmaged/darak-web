'use client';

import { useState } from 'react';
import { Check, X, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useListings, useApproveListing } from '@/Modules/listings/hooks';
import { formatPriceEGP, PROPERTY_TYPES } from '@/lib/constants';
import type { Listing, ListingStatus } from '@/Modules/listings/types';
import { TablePagination } from '@/components/ui/table-pagination';
import Link from 'next/link';

const PAGE_SIZE = 20;

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=80';

function getTypeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

// ─── Review Dialog ─────────────────────────────────────────────────────────────

function ReviewDialog({
  listing,
  onClose,
}: {
  listing: Listing | null;
  onClose: () => void;
}) {
  const [comment, setComment] = useState('');
  const approveListing = useApproveListing();

  const handle = (approved: boolean) => {
    if (!listing) return;
    approveListing.mutate(
      { id: listing.id, approved, comment },
      { onSuccess: () => { onClose(); setComment(''); } }
    );
  };

  return (
    <Dialog open={!!listing} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Listing</DialogTitle>
        </DialogHeader>

        {listing && (
          <div className="space-y-5">
            {/* Preview */}
            <div className="flex gap-4">
              <img
                src={listing.images?.[0] ?? FALLBACK}
                alt={listing.title ?? ''}
                className="w-32 h-32 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-display font-bold text-lg line-clamp-2">{listing.title}</h3>
                <p className="text-muted-foreground text-sm">{listing.area}, {listing.city}</p>
                <p className="font-bold text-primary mt-2">{formatPriceEGP(Number(listing.price))}</p>
                <Link
                  href={`/property/${listing.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> View public page
                </Link>
              </div>
            </div>

            {/* Details grid */}
            {(() => {
              const details: [string, string | number][] = [
                ['Type', getTypeLabel(listing.property_type)],
                ['Status', listing.property_status],
                ['Bedrooms', listing.bedrooms],
                ['Bathrooms', listing.bathrooms],
                ['Area', `${listing.built_up_area} m²`],
                ['Finishing', listing.finishing ?? '—'],
              ];
              if (listing.delivery_year) details.push(['Delivery', listing.delivery_year]);
              if (listing.down_payment_percentage != null) details.push(['Down', `${listing.down_payment_percentage}%`]);
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {details.map(([label, val]) => (
                    <div key={label} className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium mt-0.5">{String(val)}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Description */}
            {listing.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
            )}

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Admin Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a note for the advertiser (optional)..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => handle(false)}
            disabled={approveListing.isPending}
          >
            <X className="h-4 w-4 mr-1.5" /> Reject
          </Button>
          <Button
            onClick={() => handle(true)}
            disabled={approveListing.isPending}
            className="gradient-primary"
          >
            <Check className="h-4 w-4 mr-1.5" /> Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListingsPage() {
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('pending');
  const [selected, setSelected] = useState<Listing | null>(null);
  const [page, setPage] = useState(1);

  const setStatus = (v: ListingStatus | 'all') => { setStatusFilter(v); setPage(1); };

  const { data: listingsRes, isLoading } = useListings({
    listingStatus: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGE_SIZE,
  });
  const listings = listingsRes?.data ?? [];
  const meta = listingsRes?.meta;

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? '…' : (meta?.totalItems ?? listings.length)} listing{(meta?.totalItems ?? listings.length) !== 1 ? 's' : ''}
        </p>
        <Select value={statusFilter} onValueChange={(v) => setStatus(v as ListingStatus | 'all')}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Listings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Property</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Type</th>
                  <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Location</th>
                  <th className="text-left p-4 text-sm font-medium">Price</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images?.[0] ?? FALLBACK}
                          alt={listing.title ?? ''}
                          className="w-11 h-11 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-medium text-sm line-clamp-1 max-w-40">
                          {listing.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                      {getTypeLabel(listing.property_type)}
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                      {listing.city}
                    </td>
                    <td className="p-4 text-sm font-semibold">
                      {formatPriceEGP(Number(listing.price))}
                    </td>
                    <td className="p-4">
                      <span className={`status-badge ${
                        listing.listing_status === 'pending' ? 'status-pending' :
                        listing.listing_status === 'approved' ? 'status-approved' :
                        'status-rejected'
                      }`}>
                        {listing.listing_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(listing)}
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-xl">
          <p className="text-muted-foreground">No {statusFilter !== 'all' ? statusFilter : ''} listings found.</p>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />

      <ReviewDialog listing={selected} onClose={() => setSelected(null)} />
    </>
  );
}
