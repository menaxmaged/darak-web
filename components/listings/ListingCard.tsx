import Link from "next/link";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { formatPriceEGP } from "@/lib/constants";
import type { Listing } from "@/Modules/listings/listings";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainImage = listing.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

  return (
    <Link href={`/property/${listing.id}`} className="card-listing group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`chip ${listing.property_status === "ready" ? "chip-ready" : "chip-offplan"}`}>
            {listing.property_status === "ready" ? "Ready" : "Off-Plan"}
          </span>
        </div>
        {listing.is_featured && (
          <span className="absolute top-3 right-3 chip chip-primary">Featured</span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-lg line-clamp-1">{listing.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{listing.area}, {listing.city}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> {listing.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {listing.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" /> {listing.built_up_area} m²
          </span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display font-bold text-xl text-primary">
              {formatPriceEGP(Number(listing.price))}
            </p>
            {!listing.is_cash_only && listing.down_payment_percentage && (
              <p className="text-xs text-muted-foreground">
                {listing.down_payment_percentage}% down · {listing.installment_years} years
              </p>
            )}
          </div>
          {listing.property_status === "offplan" && listing.delivery_year && (
            <span className="text-sm text-muted-foreground">
              Delivery {listing.delivery_year}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
