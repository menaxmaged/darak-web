export type ListingStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'inactive';
export type PropertyStatus = 'ready' | 'offplan';

export interface Listing {
  id: number;
  property_status: PropertyStatus;
  property_type: string;
  city: string;
  area_id: number | null;
  project_id: number | null;
  advertiser_id: number;
  title: string | null;
  description: string | null;
  price: number;
  built_up_area: number;
  bedrooms: number;
  bathrooms: number;
  finishing: string | null;
  delivery_year: number | null;
  down_payment_amount: number | null;
  installment_years: number | null;
  is_featured: boolean;
  listing_status: ListingStatus;
  images: string[];
  admin_comment: string | null;
  is_cash_only: boolean;
  created_at: string;
  updated_at: string;
  video_url: string;
  tour_url: string;
  contact_name: string;
  contact_phone: string;
  contact_whatsapp: string;
  Advertiser: { id: number; firstName: string; lastName: string; email: string; phone: string };
  Area: { id: number; name: string; city: string } | null;
  Project: { id: number; name: string; developer: string; city: string } | null;
}

export type ListingInsert = {
  property_status: string;
  property_type: string;
  city_id?: string;
  price: number;
  built_up_area: number;
  bedrooms: number;
  bathrooms: number;
  area_id?: number | null;
  project_id?: number | null;
  title?: string;
  description?: string;
  address?: string;
  finishing?: string;
  delivery_year?: number;
  down_payment_amount?: number;
  installment_years?: number;
  is_cash_only?: boolean;
  images?: string[];
  video_url?: string;
  tour_url?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  land_area?: number;
  floor?: string;
  view?: string;
};

export type ListingUpdate = Partial<ListingInsert>;

export interface ListingsFilters {
  propertyStatus?: PropertyStatus | 'for-sale';
  propertyType?: string;
  city?: string;
  areaId?: number;
  projectId?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  finishing?: string;
  deliveryYear?: number;
  minDownPayment?: number;
  maxDownPayment?: number;
  listingStatus?: ListingStatus | 'active';
  advertiserId?: string;
  isFeatured?: boolean;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'delivery' | 'price';
  page?: number;
  limit?: number;
}
