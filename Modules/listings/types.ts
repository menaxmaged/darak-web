export type ListingStatus = 'pending' | 'approved' | 'rejected';
export type PropertyStatus = 'ready' | 'offplan';

export interface Listing {
  id: string;
  property_status: PropertyStatus;
  property_type: string;
  city: string;
  area: string;
  project_name?: string;
  title?: string;
  description?: string;
  price: number;
  built_up_area: number;
  bedrooms: number;
  bathrooms: number;
  finishing?: string;
  delivery_year?: number;
  down_payment_percentage?: number;
  installment_years?: number;
  advertiser_id: string;
  advertiser_name?: string;
  is_featured: boolean;
  listing_status: ListingStatus;
  images?: string[];
  approved_at?: string;
  rejected_at?: string;
  admin_comment?: string;
  is_cash_only?: boolean;
  created_at: string;
  updated_at?: string;
}

export type ListingInsert = Omit<
  Listing,
  'id' | 'created_at' | 'updated_at' | 'approved_at' | 'rejected_at' | 'listing_status'
>;
export type ListingUpdate = Partial<Listing>;

export interface ListingsFilters {
  propertyStatus?: PropertyStatus;
  propertyType?: string;
  city?: string;
  area?: string;
  project?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  finishing?: string;
  deliveryYear?: string;
  minDownPayment?: number;
  maxDownPayment?: number;
  listingStatus?: ListingStatus;
  advertiserId?: string;
  isFeatured?: boolean;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'delivery';
  page?: number;
  limit?: number;
}
