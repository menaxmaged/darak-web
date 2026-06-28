'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin, Bed, Bath, Maximize, ArrowLeft, ChevronLeft, ChevronRight,
  Phone, MessageCircle, Calendar, CheckCircle, Clock, Tag,
  Home, Building2, Layers,
} from 'lucide-react';
import { useListing } from '@/Modules/listings/hooks';
import { formatPriceEGP } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { buildPropertySlug, parseListingId } from '@/lib/slug';
import type { Listing } from '@/Modules/listings/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LABEL: Record<string, string> = {
  villa: 'Villa', apartment: 'Apartment', duplex: 'Duplex', studio: 'Studio',
  townhouse: 'Townhouse', twin_house: 'Twin House', chalet: 'Chalet',
  office: 'Office', retail: 'Retail', warehouse: 'Warehouse',
  fully_finished: 'Fully Finished', semi_finished: 'Semi Finished',
  core_shell: 'Core & Shell', ultra_lux: 'Ultra Lux', super_lux: 'Super Lux',
};

function label(val: string | undefined) {
  if (!val) return '—';
  return LABEL[val] ?? val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Image Gallery ─────────────────────────────────────────────────────────────

function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const fallback = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';
  const imgs = (images.length ? images : [fallback]).map((img) =>
    img.startsWith('http://') || img.startsWith('https://')
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL}${img}`
  );

  const prev = () => setActive((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setActive((i) => (i + 1) % imgs.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
        <img
          src={imgs[active]}
          alt="Property"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {active + 1} / {imgs.length}
            </span>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Spec Item ─────────────────────────────────────────────────────────────────

function SpecItem({ icon: Icon, label: lbl, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-secondary rounded-xl text-center">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-xs text-muted-foreground">{lbl}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PropertySkeleton() {
  return (
    <div className="container-custom py-8 space-y-6">
      <Skeleton className="h-[420px] rounded-2xl" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Property Detail ──────────────────────────────────────────────────────────

function PropertyDetail({ listing }: { listing: Listing }) {
  const isReady = listing.property_status === 'ready';
  const hasPlan = !listing.is_cash_only && listing.down_payment_amount != null && listing.installment_years;
  const downAmount = hasPlan
    ? (listing.price * (listing.down_payment_amount! / 100))
    : null;

  return (
    <div className="container-custom pt-8 pb-28 lg:pb-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      {/* Gallery */}
      <div className="mb-8">
        <ImageGallery images={listing.images ?? []} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`chip ${isReady ? 'chip-ready' : 'chip-offplan'}`}>
                {isReady ? 'Ready' : 'Off-Plan'}
              </span>
              <span className="chip chip-secondary">{label(listing.property_type)}</span>
              {listing.is_featured && (
                <span className="chip chip-primary">Featured</span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
              {listing.title ?? label(listing.property_type)}
            </h1>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {[listing.Project?.name, listing.Area?.name, listing.city].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>

          {/* Specs grid */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Property Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {listing.property_type && (
                <SpecItem icon={Home} label="Type" value={label(listing.property_type)} />
              )}
              {listing.bedrooms > 0 && (
                <SpecItem icon={Bed} label="Bedrooms" value={listing.bedrooms} />
              )}
              <SpecItem icon={Bath} label="Bathrooms" value={listing.bathrooms} />
              <SpecItem icon={Maximize} label="Built-up" value={`${listing.built_up_area} m²`} />
              {listing.finishing && (
                <SpecItem icon={Layers} label="Finishing" value={label(listing.finishing)} />
              )}

              {listing.delivery_year && (
                <SpecItem icon={Calendar} label="Delivery" value={listing.delivery_year} />
              )}
            </div>
          </section>

          {/* Description */}
          {listing.description && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Description
              </h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </section>
          )}

          {/* Payment plan */}
          {hasPlan && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Payment Plan
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-8 bg-linear-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 mx-auto">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">Down Payment</p>
                  <p className="font-display font-bold text-3xl text-foreground mb-2">{formatPriceEGP(listing.down_payment_amount || 0)}</p>
                                     <p className="text-sm font-semibold text-blue-600">EGP</p>

                </div>
                <div className="p-8 bg-linear-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4 mx-auto">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-600 font-medium mb-2">Installment Period</p>
                  <p className="font-display font-bold text-3xl text-foreground">{listing.installment_years}</p>
                  <p className="text-sm text-emerald-600 font-semibold">Years</p>
                </div>
                <div className="p-8 bg-linear-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4 mx-auto">
                    <Building2 className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sm text-amber-600 font-medium mb-2">Remaining Amount</p>
                  <p className="font-display font-bold text-2xl mb-2 text-foreground">

                    {formatPriceEGP(listing.price - (listing.down_payment_amount ?? 0))}
                  </p>
                                                       <p className="text-sm font-semibold text-amber-600">EGP</p>

                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="sticky top-24 space-y-4">
            <div className="border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Total Price</p>
              <p className="font-display font-bold text-3xl text-primary mb-1">
                {formatPriceEGP(listing.price)}
              </p>
              {/* {listing.is_cash_only ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="w-3.5 h-3.5" /> Cash only
                </span>
              ) : hasPlan ? (
                <span className="text-xs text-muted-foreground">
                  From {listing.down_payment_amount}% down · {listing.installment_years} yrs
                </span>
              ) : null}

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isReady ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span>{isReady ? 'Ready for delivery' : `Delivery ${listing.delivery_year ?? 'TBD'}`}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>{listing.city}{listing.Area?.name ? `, ${listing.Area.name}` : ''}</span>
                </div>
              </div> */}
            </div>

            {/* Contact — desktop sidebar card */}
            <div className="hidden lg:block border border-border rounded-2xl p-5 space-y-3">
              <p className="font-semibold text-sm">Interested in this property?</p>
              <a
                href={`tel:${listing.contact_phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border bg-primary text-white hover:bg-secondary transition-colors text-sm font-medium"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={`https://wa.me/${listing.contact_whatsapp}?text=I'm%20interested%20in%20the%20property%20${encodeURIComponent(listing.title ?? '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact — mobile fixed bottom bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-border bg-background px-4 py-5"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <a
          href={`tel:${listing.contact_phone}`}
          className="flex flex-1 items-center justify-center gap-2 py-2.5  rounded-xl border border-border hover:bg-secondary transition-colors text-white bg-primary text-sm font-medium"
        >
          <Phone className="w-6 h-6" /> Call
        </a>
        <a
          href={`https://wa.me/${listing.contact_whatsapp}?text=I'm%20interested%20in%20the%20property%20${encodeURIComponent(listing.title ?? '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-6 h-6" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const id = parseListingId(slug);
  const { data, isLoading } = useListing(id ?? undefined);
  const listing = data?.data;

  // Keep the URL canonical: redirect bare-id or stale-slug URLs to `slug-id`.
  useEffect(() => {
    if (!listing) return;
    const canonical = buildPropertySlug(listing);
    if (slug !== canonical) {
      router.replace(`/property/${canonical}`);
    }
  }, [listing, slug, router]);

  if (isLoading) return <PropertySkeleton />;

  if (!listing) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="text-2xl font-display font-bold mb-3">Property not found</h1>
        <p className="text-muted-foreground mb-6">This listing may have been removed or doesn&apos;t exist.</p>
        <Link href="/" className="btn-cta inline-flex">Back to Home</Link>
      </div>
    );
  }

  return <PropertyDetail listing={listing} />;
}
