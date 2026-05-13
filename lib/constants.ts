// Brand Colors (matching Via Stays design system)
export const COLORS = {
  RUST: '#A83D0F',
  CREAM: '#F9F8F6',
  WHITE: '#FFFFFF',
  CHARCOAL: '#1A1A1A',
  GRAY: '#717171',
  BORDER: '#E5E4E2',
} as const;

// Common amenities for properties
export const PROPERTY_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Heating',
  'Kitchen',
  'Washer',
  'Dryer',
  'TV',
  'Pool',
  'Parking',
  'Gym',
  'Hot Tub',
  'Fireplace',
  'Balcony',
  'Garden',
  'BBQ Grill',
  'Beach Access',
] as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// User status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Property status
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
} as const;

// Contact inquiry status
export const INQUIRY_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESPONDED: 'responded',
} as const;

// Newsletter subscriber status
export const SUBSCRIBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'AIM_admin_token',
  USER_ROLE: 'AIM_admin_role',
} as const;

// API endpoints (for reference)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Users
  LIST_USERS: '/admin/list-users',
  BAN_USER: '/admin/ban-user',
  EDIT_ROLE: '/admin/edit-role',
  EDIT_STATUS: '/admin/edit-status',
  
  // Properties
  LIST_PROPERTIES: '/property/list',
  ADD_PROPERTY: '/property/add',
  EDIT_PROPERTY: '/property/edit',
  
  // Contacts
  LIST_CONTACTS: '/contact/list',
  UPDATE_CONTACT: '/contact/update',
  
  // Newsletter
  LIST_SUBSCRIBERS: '/newsletter/list',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Image upload constraints
export const IMAGE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;


export const CITIES = [
  "Cairo",
  "Giza", 
  "New Capital",
  "Alexandria",
  "North Coast",
  "Ain Sokhna",
  "Suez",
  "Red Sea",
] as const;

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "twin_house", label: "Twin House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "duplex", label: "Duplex" },
  { value: "chalet", label: "Chalet" },
  { value: "studio", label: "Studio" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "clinic", label: "Clinic" },
  { value: "warehouse", label: "Warehouse" },
] as const;

export const FINISHING_TYPES = [
  { value: "fully_finished", label: "Fully Finished" },
  { value: "semi_finished", label: "Semi Finished" },
  { value: "core_shell", label: "Core & Shell" },
  { value: "super_lux", label: "Super Lux" },
  { value: "ultra_lux", label: "Ultra Lux" },
] as const;

export const FLOOR_TYPES = [
  { value: "ground", label: "Ground" },
  { value: "typical", label: "Typical" },
  { value: "penthouse", label: "Penthouse" },
  { value: "roof", label: "Roof" },
] as const;

export const VIEW_TYPES = [
  { value: "garden", label: "Garden" },
  { value: "pool", label: "Pool" },
  { value: "lagoon", label: "Lagoon" },
  { value: "sea", label: "Sea" },
  { value: "street", label: "Street" },
  { value: "open", label: "Open" },
] as const;

export const INSTALLMENT_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi_annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
] as const;

export const DELIVERY_YEARS = ["2025", "2026", "2027", "2028+"] as const;

export const QUICK_FILTERS = [
  { id: "immediate", label: "Immediate Delivery", icon: "🏠" },
  { id: "zero_down", label: "0% Down Payment", icon: "💰" },
  { id: "north_coast", label: "North Coast", icon: "🏖️" },
  { id: "new_cairo", label: "New Cairo", icon: "🏙️" },
  { id: "new_capital", label: "New Capital", icon: "🏛️" },
  { id: "6_october", label: "6th of October", icon: "🌆" },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    currency: "EGP",
    period: "month",
    features: [
      "Up to 10 listings",
      "Basic analytics",
      "Email support",
      "Standard visibility",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 2499,
    currency: "EGP",
    period: "month",
    features: [
      "Up to 50 listings",
      "Advanced analytics",
      "Priority support",
      "Featured listings",
      "WhatsApp integration",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 4999,
    currency: "EGP",
    period: "month",
    features: [
      "Unlimited listings",
      "Full analytics suite",
      "Dedicated account manager",
      "Premium placement",
      "API access",
      "Custom branding",
    ],
    popular: false,
  },
] as const;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceEGP(price: number): string {
  return `${formatPrice(price)} EGP`;
}

export function calculateInstallment(
  totalPrice: number,
  downPaymentPercentage: number,
  years: number,
  frequency: string
): number {
  const downPayment = (totalPrice * downPaymentPercentage) / 100;
  const remaining = totalPrice - downPayment;
  
  let paymentsPerYear = 12;
  if (frequency === "quarterly") paymentsPerYear = 4;
  if (frequency === "semi_annual") paymentsPerYear = 2;
  if (frequency === "annual") paymentsPerYear = 1;
  
  const totalPayments = years * paymentsPerYear;
  return Math.ceil(remaining / totalPayments);
}
