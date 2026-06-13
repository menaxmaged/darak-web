export const COMMERCIAL_TYPES = ["office", "retail", "clinic", "warehouse"] as const;

export interface WizardData {
  // Step 1
  title: string;
  description: string;
  property_type: string;
  property_status: string;
  city_id: string;
  city?: string;
  area_id: string;
  project_id: string;
  address: string;
  // Step 2
  price: string;
  is_cash_only: boolean;
  down_payment_amount: string;
  installment_years: string;
  // Step 3
  built_up_area: string;
  land_area: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  finishing: string;
  delivery_year: string;
  view: string;
  // Step 4
  imageFiles: File[];
  images: string[];
  video_url: string;
  tour_url: string;
  contact_name: string;
  contact_phone: string;
  contact_whatsapp: string;
}

export type WizardOnChange = (field: string, value: string | boolean | string[] | File[]) => void;
