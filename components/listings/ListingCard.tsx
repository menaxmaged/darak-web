import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Home, Building2, LandPlot } from "lucide-react";
import { formatPriceEGP } from "@/lib/constants";
import type { Listing } from "@/Modules/listings/listings";

interface ListingCardProps {
  listing: Listing;
}

function PropertyTypeIcon({ type }: { type: string }) {
  const normalizedType = String(type || "").toLowerCase();

  if (["apartment", "duplex", "penthouse", "studio"].includes(normalizedType)) {
    return <Building2 className="h-4 w-4" />;
  }

  if (["villa", "townhouse", "twin_house", "chalet"].includes(normalizedType)) {
    return <Home className="h-4 w-4" />;
  }

  if (["land", "plot"].includes(normalizedType)) {
    return <LandPlot className="h-4 w-4" />;
  }

  return <Home className="h-4 w-4" />;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";
  const mainImage = imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://") 
    ? imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
 
  return (
    <Link href={`/property/${listing.id}`} className="card-listing group flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <img
          src={mainImage}
          alt={listing.title ?? ""}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`chip ${listing.property_status === "ready" ? "chip-ready" : "chip-offplan"}`}>
            {listing.property_status === "ready" ? "Ready" : listing.delivery_year ? `Delivery ${listing.delivery_year}` : "Off-plan"}
          </span>
        </div>
        {listing.is_featured && (
          <span className="absolute top-3 right-3 chip chip-primary">Featured</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-lg line-clamp-1">{listing.title}</h3>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{listing.Project?.name ?? ""},</span>
          <span className="line-clamp-1">{listing.Area?.name ?? listing.city}</span>
        </div>

        <div className="flex justify-between gap-3 text-sm text-muted-foreground mt-auto">
          <span className="flex items-center gap-1 capitalize">
            <PropertyTypeIcon type={String(listing.property_type)} />
            {String(listing.property_type).replace(/_/g, "")}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> {listing.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {listing.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4 " /> {listing.built_up_area}m²
          </span>
        </div>

        <div className="flex items-end hidden justify-between">
          <div>
            <p className="font-display font-bold text-xl text-primary">
              {formatPriceEGP(Number(listing.price))}
            </p>
            {!listing.is_cash_only && listing.down_payment_amount && (
              <p className="text-xs text-muted-foreground">
                {listing.down_payment_amount}% down · {listing.installment_years} years
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
