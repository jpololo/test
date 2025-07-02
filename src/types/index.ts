export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  trackingNumber?: string;
  supplier?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Quote {
  id: string;
  number: string;
  products: Product[];
  shippingAddress: Address;
  billingAddress: Address;
  freight: number;
  trackingNumber: string;
  date: string;
}

export interface CompanyInventoryItem {
  id: string;
  name: string;
  availableQuantity: number;
  price: number;
  description?: string;
  supplier?: string;
  sku?: string;
  category?: string;
  brand?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  type: 'quote' | 'inventory';
  products: Product[];
  shippingAddress?: Address;
  billingAddress: Address;
  freight: number;
  trackingNumber: string; // Main tracking number for backward compatibility
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  totalAmount: number;
  sourceId?: string; // Quote ID or inventory reference
  notes?: string;
}

export interface ManualProduct {
  id: string;
  name: string;
  price: number;
  sku?: string;
  description?: string;
  status: 'manual_pending' | 'approved' | 'rejected' | 'linked';
  createdFromQuoteId: string;
  quoteName: string;
  createdAt: string;
  updatedAt?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  linkedToInventoryId?: string; // ID of the inventory item this manual product is linked to
  linkedBy?: string;
  linkedAt?: string;
}

export type OrderType = 'quote' | 'inventory';