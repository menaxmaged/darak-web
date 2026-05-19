import { PROPERTY_TYPES, FINISHING_TYPES, FLOOR_TYPES, VIEW_TYPES, formatPriceEGP, calculateInstallment } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Bath, Maximize, Calendar, Phone, MessageCircle } from "lucide-react";
import type { WizardData } from "./wizard-types";

interface ListingPreviewProps {
  data: WizardData;
  previewImages?: string[];
  areaName?: string;
  projectName?: string;
}

export function ListingPreview({ data, previewImages, areaName, projectName }: ListingPreviewProps) {
  const allImages = (previewImages ?? data.images).map(img => 
    img.startsWith('http://') || img.startsWith('https://') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`
  );
  const price = Number(data.price) || 0;
  const downPaymentPercent = Number(data.down_payment_amount) || 0;
  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const years = Number(data.installment_years) || 0;
  const installmentAmount = price && !data.is_cash_only && years
    ? calculateInstallment(price, downPaymentPercent, years, "monthly")
    : 0;

  const propertyTypeLabel = PROPERTY_TYPES.find(t => t.value === data.property_type)?.label || data.property_type;
  const finishingLabel = FINISHING_TYPES.find(f => f.value === data.finishing)?.label || data.finishing;
  const floorLabel = FLOOR_TYPES.find(f => f.value === data.floor)?.label || data.floor;
  const viewLabel = VIEW_TYPES.find(v => v.value === data.view)?.label || data.view;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-2">Preview Your Listing</h2>
        <p className="text-muted-foreground text-sm">Review how your listing will appear to buyers</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Image Gallery Preview */}
        <div className="relative aspect-video bg-secondary">
          {allImages.length > 0 ? (
            <img src={allImages[0]} alt={data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No images uploaded
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={data.property_status === "ready" ? "default" : "secondary"}>
              {data.property_status === "ready" ? "Ready to Move" : "Off-Plan"}
            </Badge>
          </div>
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 text-white text-sm rounded">
              +{allImages.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Location */}
          <h3 className="font-display text-2xl font-bold mb-2">{data.title || "Untitled Listing"}</h3>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{[projectName, areaName, data.city].filter(Boolean).join(", ") || "Location not specified"}</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-primary">{price ? formatPriceEGP(price) : "Price not set"}</p>
            {!data.is_cash_only && installmentAmount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatPriceEGP(downPaymentAmount)} down payment • {formatPriceEGP(installmentAmount)}/month for {years} years
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Maximize className="h-5 w-5 text-muted-foreground" />
              <span>{data.built_up_area || "—"} m²</span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-muted-foreground" />
              <span>{data.bedrooms === "0" ? "Studio" : `${data.bedrooms || "—"} Beds`}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-muted-foreground" />
              <span>{data.bathrooms || "—"} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{data.property_status === "ready" ? "Delivered" : data.delivery_year || "—"}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2 font-medium">{propertyTypeLabel}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Finishing:</span>
              <span className="ml-2 font-medium">{finishingLabel}</span>
            </div>
            {data.floor && (
              <div>
                <span className="text-muted-foreground">Floor:</span>
                <span className="ml-2 font-medium">{floorLabel}</span>
              </div>
            )}
            {data.view && (
              <div>
                <span className="text-muted-foreground">View:</span>
                <span className="ml-2 font-medium">{viewLabel}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {data.description && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground text-sm">{data.description}</p>
            </div>
          )}

          {/* Contact Preview */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary rounded-lg font-medium">
              <Phone className="h-5 w-5" />
              Call {data.contact_name || "Agent"}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-lg font-medium">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
