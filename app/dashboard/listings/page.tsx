'use client';

import { useState } from 'react';
import {
  Check, X, ExternalLink, Building2, Clock, CheckCircle, XCircle,
  MoreHorizontal, Eye, Phone, Mail, User, MapPin, Bed, Bath, Maximize2, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useListings, useApproveListing } from '@/Modules/listings/hooks';
import { formatPriceEGP, PROPERTY_TYPES } from '@/lib/constants';
import type { Listing, ListingStatus } from '@/Modules/listings/types';
import { TablePagination } from '@/components/ui/table-pagination';
import Link from 'next/link';

const PAGE_SIZE = 20;
const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

function getTypeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

function resolveImage(url: string | undefined) {
  if (!url) return FALLBACK;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

// ─── Stat / Filter Card ────────────────────────────────────────────────────────

function StatFilterCard({
  icon: Icon, iconBg, iconColor, count, label, active, onClick,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  count: number | undefined; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-card rounded-xl border p-4 text-left w-full transition-all ${
        active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{count ?? '—'}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Review Dialog ─────────────────────────────────────────────────────────────

function ReviewDialog({ listing, onClose }: { listing: Listing | null; onClose: () => void }) {
  const [comment, setComment] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const approveListing = useApproveListing();

  const handle = (approved: boolean) => {
    if (!listing) return;
    approveListing.mutate(
      { id: listing.id, approved, comment },
      { onSuccess: () => { onClose(); setComment(''); setActiveImg(0); } }
    );
  };

  const images = listing?.images?.length ? listing.images : [undefined];

  const statusStyles = {
    pending:  'bg-amber-500/90 text-white',
    approved: 'bg-emerald-500/90 text-white',
    rejected: 'bg-red-500/90 text-white',
    draft:    'bg-secondary text-foreground',
    inactive: 'bg-secondary text-foreground',
  } as const;

  return (
    <Dialog open={!!listing} onOpenChange={() => { onClose(); setActiveImg(0); }}>
      {/* p-0 + flex-col so we can build a fixed-header / scrollable-body / sticky-footer layout */}
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Visually hidden title for a11y */}
        <DialogTitle className="sr-only">Review Listing</DialogTitle>

        {listing && (
          <>
            {/* ── Hero image ── */}
            <div className="relative shrink-0 h-60 sm:h-72">
              <img
                src={resolveImage(images[activeImg])}
                alt={listing.title ?? ''}
                className="w-full h-full object-cover"
              />
              {/* Gradient: dark at top (for the built-in close ×) and bottom (for text) */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

              {/* Top-left: status badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                  statusStyles[listing.listing_status] ?? statusStyles.inactive
                }`}>
                  {listing.listing_status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  listing.property_status === 'ready' ? 'bg-emerald-500/90 text-white' : 'bg-blue-500/90 text-white'
                }`}>
                  {listing.property_status === 'ready' ? 'Ready' : 'Off-Plan'}
                </span>
              </div>

              {/* Top-right: external link (the built-in × sits here too) */}
              <Link
                href={`/property/${listing.id}`}
                target="_blank"
                className="absolute top-3.5 right-12 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              {/* Bottom: title / location / price */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <h3 className="font-display font-bold text-xl leading-snug drop-shadow line-clamp-2">
                  {listing.title}
                </h3>
                <p className="text-white/75 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {listing.Area?.name ? `${listing.Area.name}, ` : ''}{listing.city}
                </p>
                <p className="text-2xl font-bold mt-2 drop-shadow">
                  {formatPriceEGP(Number(listing.price))}
                </p>
              </div>
            </div>

            {/* ── Thumbnail strip ── */}
            {images.length > 1 && (
              <div className="flex gap-2 px-4 py-2.5 bg-secondary/70 overflow-x-auto scrollbar-hide shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg
                        ? 'border-primary scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">

              {/* Key stats row */}
              <div className="flex items-center divide-x divide-border overflow-x-auto">
                {[
                  { icon: Bed,       label: 'Beds',  value: listing.bedrooms },
                  { icon: Bath,      label: 'Baths', value: listing.bathrooms },
                  { icon: Maximize2, label: 'Area',  value: `${listing.built_up_area} m²` },
                  { icon: Building2, label: 'Type',  value: getTypeLabel(listing.property_type) },
                  ...(listing.finishing ? [{ icon: CheckCircle, label: 'Finishing', value: listing.finishing }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5 px-4 first:pl-0 last:pr-0 shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground leading-none">{label}</p>
                      <p className="font-semibold text-sm mt-0.5 capitalize">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two-column: details (left) + advertiser (right) */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">

                {/* Left column */}
                <div className="sm:col-span-3 space-y-4">
                  {/* Payment / delivery details */}
                  {(() => {
                    const extras: [string, string][] = [
                      ['Payment', listing.is_cash_only ? 'Cash only' : 'Cash & installments'],
                    ];
                    if (!listing.is_cash_only && listing.down_payment_percentage != null)
                      extras.push(['Down payment', `${listing.down_payment_percentage}%`]);
                    if (!listing.is_cash_only && listing.installment_years)
                      extras.push(['Installment', `${listing.installment_years} yrs`]);
                    if (listing.delivery_year)
                      extras.push(['Delivery', String(listing.delivery_year)]);
                    return (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {extras.map(([label, val]) => (
                          <div key={label} className="p-3 bg-secondary rounded-xl">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="font-semibold mt-0.5">{val}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Project */}
                  {listing.Project && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Project</p>
                        <p className="font-semibold">{listing.Project.name}</p>
                        {listing.Project.developer && (
                          <p className="text-xs text-muted-foreground">{listing.Project.developer}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {listing.description && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-widest">
                        Description
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="sm:col-span-2 space-y-3">
                  {/* Advertiser card */}
                  <div className="rounded-xl border border-border p-4 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Advertiser</p>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {listing.Advertiser.firstName} {listing.Advertiser.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">ID #{listing.Advertiser.id}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${listing.Advertiser.email}`}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{listing.Advertiser.email}</span>
                      </a>
                      {listing.Advertiser.phone && (
                        <a
                          href={`tel:${listing.Advertiser.phone}`}
                          className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          {listing.Advertiser.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Previous admin note */}
                  {listing.admin_comment && (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3.5">
                      <p className="text-xs font-semibold text-amber-600 mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" /> Previous note
                      </p>
                      <p className="text-sm text-amber-800 leading-relaxed">{listing.admin_comment}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin comment textarea */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Admin Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note for the advertiser (optional)..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* ── Sticky footer ── */}
            <div className="shrink-0 border-t border-border px-5 py-3.5 flex items-center justify-between gap-3 bg-card">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
                Cancel
              </Button>
              <div className="flex gap-2">
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
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListingsPage() {
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('pending');
  const [selected, setSelected] = useState<Listing | null>(null);
  const [page, setPage] = useState(1);
  const approveListing = useApproveListing();

  const setStatus = (v: ListingStatus | 'all') => { setStatusFilter(v); setPage(1); };

  const { data: listingsRes, isLoading } = useListings({
    listingStatus: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGE_SIZE,
  });
  const listings = listingsRes?.data ?? [];
  const meta = listingsRes?.meta;

  const { data: allRes }      = useListings({ limit: 1 });
  const { data: pendingRes }  = useListings({ listingStatus: 'pending',  limit: 1 });
  const { data: approvedRes } = useListings({ listingStatus: 'approved', limit: 1 });
  const { data: rejectedRes } = useListings({ listingStatus: 'rejected', limit: 1 });

  const quickApprove = (listing: Listing, approved: boolean) => {
    approveListing.mutate({ id: listing.id, approved, comment: '' });
  };

  return (
    <>
      {/* Stat / Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatFilterCard
          icon={Building2} iconBg="bg-secondary" iconColor="text-foreground"
          count={allRes?.meta?.totalItems} label="All Listings"
          active={statusFilter === 'all'} onClick={() => setStatus('all')}
        />
        <StatFilterCard
          icon={Clock} iconBg="bg-amber-100" iconColor="text-amber-600"
          count={pendingRes?.meta?.totalItems} label="Pending"
          active={statusFilter === 'pending'} onClick={() => setStatus('pending')}
        />
        <StatFilterCard
          icon={CheckCircle} iconBg="bg-emerald-100" iconColor="text-emerald-600"
          count={approvedRes?.meta?.totalItems} label="Approved"
          active={statusFilter === 'approved'} onClick={() => setStatus('approved')}
        />
        <StatFilterCard
          icon={XCircle} iconBg="bg-red-100" iconColor="text-red-600"
          count={rejectedRes?.meta?.totalItems} label="Rejected"
          active={statusFilter === 'rejected'} onClick={() => setStatus('rejected')}
        />
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
                  <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">Advertiser</th>
                  <th className="text-left p-4 text-sm font-medium">Price</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImage(listing.images?.[0])}
                          alt={listing.title ?? ''}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-sm line-clamp-1 max-w-40">{listing.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {listing.bedrooms}bd · {listing.bathrooms}ba · {listing.built_up_area} m²
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                      {getTypeLabel(listing.property_type)}
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                      <p>{listing.city}</p>
                      {listing.Area?.name && <p className="text-xs mt-0.5">{listing.Area.name}</p>}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                      <p>{listing.Advertiser.firstName} {listing.Advertiser.lastName}</p>
                      <p className="text-xs mt-0.5">{listing.Advertiser.email}</p>
                    </td>
                    <td className="p-4 text-sm font-semibold">
                      {formatPriceEGP(Number(listing.price))}
                    </td>
                    <td className="p-4">
                      <span className={`status-badge ${
                        listing.listing_status === 'pending'  ? 'status-pending'  :
                        listing.listing_status === 'approved' ? 'status-approved' : 'status-rejected'
                      }`}>
                        {listing.listing_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-secondary">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setSelected(listing)}
                            className="rounded-xl cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                            <Link href={`/property/${listing.id}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Public Page
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => quickApprove(listing, true)}
                            disabled={listing.listing_status === 'approved' || approveListing.isPending}
                            className="rounded-xl cursor-pointer text-emerald-600 focus:text-emerald-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Quick Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => quickApprove(listing, false)}
                            disabled={listing.listing_status === 'rejected' || approveListing.isPending}
                            className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Quick Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/40 rounded-xl">
          <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No {statusFilter !== 'all' ? statusFilter : ''} listings found.
          </p>
        </div>
      )}

      <TablePagination meta={meta} page={page} onPageChange={setPage} />
      <ReviewDialog listing={selected} onClose={() => setSelected(null)} />
    </>
  );
}
