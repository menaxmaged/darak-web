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
