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

export type OrderType = 'quote' | 'inventory' | 'manual';

// New enhanced types for the hybrid system
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  description?: string;
  specifications?: Record<string, any>;
  basePrice: number;
  salePrice?: number; // New field for sale price
  quantity: number;
  totalPrice: number;
  isCustom?: boolean; // New field to indicate custom products
}

export interface SupplierInfo {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: Address;
  paymentTerms?: string;
  leadTime?: number;
  notes?: string;
}

export interface VariantSupplierRelation {
  id: string;
  variantId: string;
  supplierId: string;
  quotedPrice: number;
  quantity: number;
  leadTime?: number;
  minimumOrder?: number;
  notes?: string;
  isSelected: boolean;
}

export interface DeliveryInfo {
  id: string;
  estimatedDate?: string;
  actualDate?: string;
  trackingNumber?: string;
  deliveryCompany?: string;
  deliveryAddress: Address;
  deliveryLocation: string; // New field for delivery location name
  specialInstructions?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed';
  productDeliveries?: ProductDelivery[]; // New field for products in this delivery
}

export interface ProductDelivery {
  id: string;
  variantId: string;
  quantity: number;
  deliveryNotes?: string;
}

export interface ReceivedItem {
  id: string;
  variantId: string;
  quantityReceived: number;
  quantityExpected: number;
  receivedDate: string;
  receivedBy: string;
  condition: 'good' | 'damaged' | 'defective';
  notes?: string;
}

export interface WarehouseAllocation {
  id: string;
  variantId: string;
  quantityForClient: number;
  quantityForWarehouse: number;
  warehouseLocation?: string;
  allocationNotes?: string;
}

export interface EnhancedPurchaseOrder {
  // Basic Information
  id: string;
  orderNumber: string;
  type: OrderType;
  status: 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partially_received' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Source Information
  sourceType: 'quote' | 'inventory' | 'manual';
  sourceId?: string;
  quoteId?: string;
  projectId?: string;
  companyId: string;
  
  // Products and Variants
  variants: ProductVariant[];
  
  // Suppliers
  suppliers: SupplierInfo[];
  variantSupplierRelations: VariantSupplierRelation[];
  
  // Multiple Deliveries (many-to-many with products)
  deliveries?: DeliveryInfo[];
  
  // Warehouse and Fulfillment
  receivedItems: ReceivedItem[];
  warehouseAllocations: WarehouseAllocation[];
  
  // Financial
  subtotal: number;
  freight: number;
  taxes: number;
  totalAmount: number;
  
  // Additional Information
  notes?: string;
  internalNotes?: string;
  approvals: {
    internalApprovedBy?: string;
    internalApprovedAt?: string;
    externalApprovedBy?: string;
    externalApprovedAt?: string;
  };
}