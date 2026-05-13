export type ContactType = 'call' | 'whatsapp';

export interface Lead {
  id: string;
  listing_id: string;
  advertiser_id: string;
  contact_type: ContactType;
  created_at: string;
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at'>;

export interface LeadsFilters {
  listingId?: string;
  advertiserId?: string;
  contactType?: ContactType;
}
