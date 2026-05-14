/**
 * Global shared types for ZPAREZ
 * Used across all features and modules
 */


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

export interface ListApiResponse extends ApiResponse {
  success: boolean;
  message_en?: string;
  message_ar?: string;
  data: unknown[];
  meta: ListMeta;
}


export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name: string; // For compatibility
  email: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  isBanned: boolean;
  createdAt: string;
  updatedAt?: string;
}


// export enum ProductStatus {
//   DRAFT = 'DRAFT',
//   ACTIVE = 'ACTIVE',
//   OUT_OF_STOCK = 'OUT_OF_STOCK',
//   DISCONTINUED = 'DISCONTINUED',
// }

// export interface VehicleCompatibility {
//   brand: string;
//   model: string;
//   year: number;
//   variant?: string;
// }


/**
 * ZPAREZ Analytics & Commission Types
 * GMV tracking and commission settlement structures
 */

export interface GMVAnalytics {
  totalGMV: number; // Gross Merchandise Value
  period: 'TODAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  previousPeriodGMV: number;
  growthPercentage: number;
  topPerformingVendors: VendorPerformance[];
  categoryBreakdown: CategoryGMV[];
  revenueByDay: DailyRevenue[];
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  gmv: number;
  orderCount: number;
  averageOrderValue: number;
  sellerId?: string;
  sellerName?: string;
}

export interface CategoryGMV {
  category: string;
  gmv: number;
  percentage: number;
  orderCount: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface CommissionSettings {
  id: string;
  sellerCommissionRate: number; // Percentage for internal sellers
  platformFeeRate: number; // Percentage charged to vendors
  paymentProcessingFee: number;
  minCommissionPayout: number;
  payoutFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  updatedAt: Date;
}

// export interface SettlementReport {
//   id: string;
//   vendorId: string;
//   period: {
//     start: Date;
//     end: Date;
//   };
//   totalSales: number;
//   platformFee: number;
//   sellerCommission: number;
//   netPayout: number;
//   status: 'PENDING' | 'PROCESSING' | 'PAID';
//   paymentMethod: string;
//   paidAt?: Date;
//   transactions: SettlementTransaction[];
// }

// export interface SettlementTransaction {
//   orderId: string;
//   orderNumber: string;
//   orderTotal: number;
//   platformFee: number;
//   sellerCommission: number;
//   vendorPayout: number;
//   date: Date;
// }

/**
 * ZPAREZ Order Lifecycle Types
 * Talabat-style operational speed with Amazon marketplace depth
 */

// export enum OrderStatus {
//   NEW = 'NEW',
//   ACCEPTED = 'ACCEPTED',
//   PREPARING = 'PREPARING',
//   READY_FOR_PICKUP = 'READY_FOR_PICKUP',
//   OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
//   DELIVERED = 'DELIVERED',
//   CANCELLED = 'CANCELLED',
//   REFUNDED = 'REFUNDED',
// }

// export interface Order {
//   id: string;
//   orderNumber: string;
//   customerId: string;
//   vendorId: string;
//   items: OrderItem[];
//   subtotal: number;
//   tax: number;
//   deliveryFee: number;
//   total: number;
//   status: OrderStatus;
//   paymentStatus: PaymentStatus;
//   deliveryAddress: DeliveryAddress;
//   estimatedDelivery?: Date;
//   actualDelivery?: Date;
//   statusHistory: OrderStatusHistory[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface OrderItem {
//   productId: string;
//   productName: string;
//   sku: string;
//   quantity: number;
//   price: number;
//   total: number;
//   vehicleInfo?: string; // e.g., "2020 Toyota Camry"
// }

// export enum PaymentStatus {
//   PENDING = 'PENDING',
//   AUTHORIZED = 'AUTHORIZED',
//   CAPTURED = 'CAPTURED',
//   FAILED = 'FAILED',
//   REFUNDED = 'REFUNDED',
// }

// export interface DeliveryAddress {
//   fullName: string;
//   phone: string;
//   street: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   coordinates?: {
//     lat: number;
//     lng: number;
//   };
// }

// export interface OrderStatusHistory {
//   status: OrderStatus;
//   timestamp: Date;
//   updatedBy: string;
//   notes?: string;
// }

// export interface OrderMetrics {
//   totalOrders: number;
//   pendingOrders: number;
//   completedOrders: number;
//   cancelledOrders: number;
//   totalRevenue: number;
//   averageOrderValue: number;
// }



/**
 * ZPAREZ Product & Vehicle Compatibility Types
 * Automotive marketplace-specific product structure
 */

// export interface VehicleCompatibility {
//   brand: string; // e.g., "Toyota", "BMW"
//   model: string; // e.g., "Camry", "X5"
//   year: number; // e.g., 2020
//   variant?: string; // e.g., "SE", "Sport"
// }

// export interface Product {
//   id: string;
//   vendorId: string;
//   sku: string;
//   name: string;
//   description: string;
//   category: ProductCategory;
//   price: number;
//   compareAtPrice?: number;
//   stock: number;
//   vehicleCompatibility: VehicleCompatibility[];
//   images: string[];
//   specifications: Record<string, string>;
//   status: ProductStatus;
//   reviewStatus: ProductReviewStatus;
//   reviewedBy?: string; // Internal Seller ID
//   createdAt: Date;
//   updatedAt: Date;
// }

// export enum ProductCategory {
//   ENGINE_PARTS = 'ENGINE_PARTS',
//   BRAKES = 'BRAKES',
//   SUSPENSION = 'SUSPENSION',
//   ELECTRICAL = 'ELECTRICAL',
//   INTERIOR = 'INTERIOR',
//   EXTERIOR = 'EXTERIOR',
//   TIRES_WHEELS = 'TIRES_WHEELS',
//   FLUIDS_CHEMICALS = 'FLUIDS_CHEMICALS',
//   TOOLS_EQUIPMENT = 'TOOLS_EQUIPMENT',
//   ACCESSORIES = 'ACCESSORIES',
// }


// export enum ProductReviewStatus {
//   PENDING = 'PENDING',
//   APPROVED = 'APPROVED',
//   REJECTED = 'REJECTED',
//   REVISION_REQUIRED = 'REVISION_REQUIRED',
// }

// export interface BulkProductUpload {
//   file: File;
//   vendorId: string;
//   totalRows: number;
//   processedRows: number;
//   errors: BulkUploadError[];
//   status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
// }

// export interface BulkUploadError {
//   row: number;
//   field: string;
//   message: string;
// }

export * from './roles';