/**
 * ZPAREZ Role-Based Access Control (RBAC) Types
 * Defines the three-tier hierarchy: SUPER_ADMIN -> INTERNAL_SELLER -> VENDOR
 */

export enum UserRole {
  SUPER_ADMIN = 'admin',
  INTERNAL_SELLER = 'INTERNAL_SELLER', // The seller
  VENDOR = 'VENDOR', // The Merchant
}



