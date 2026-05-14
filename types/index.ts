export interface ListMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message_en?: string;
  message_ar?: string;
  data?: T;
  meta?: ListMeta;
  pagination?: PaginationMeta;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name?: string;
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
