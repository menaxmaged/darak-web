// User Management Types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  dialCode?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  role: 'admin' | 'user';
  image?: string | null;
  status: 'active' | 'inactive';
  isBanned: boolean;
  registrationFeePaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export type UsersListResponse = User[];

export interface BanUserRequest {
  username: string;
  is_banned: boolean;
}

export interface EditRoleRequest {
  username: string;
  role: 'admin' | 'user';
}

export interface EditStatusRequest {
  username: string;
  status: 'active' | 'inactive';
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  password: string;
}

// Property Types
export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: PropertyImage[];
  status: 'available' | 'booked' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface PropertiesListResponse {
  properties: Property[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  price: string;
  max_guests: string;
  bedrooms: string;
  bathrooms: string;
  price_unit: string;
  amenities: string[];
  images?: File[];
}

// Contact/Inquiry Types
export interface ContactInquiry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'reviewed' ;
  created_at: string;
  updated_at: string;
}

export type ContactsListResponse = ContactInquiry[];

export interface UpdateContactStatusRequest {
  id: number;
  status: 'pending' | 'reviewed' | 'responded';
}

// Newsletter Types
export interface NewsletterSubscriber {
  id: number;
  email: string;
  status: 'active' | 'inactive';
  subscribed_at: string;
}

export type NewsletterListResponse = NewsletterSubscriber[];
 