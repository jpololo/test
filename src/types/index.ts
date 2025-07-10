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
  source?: 'supplier' | 'warehouse'; // New field to indicate product source
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

export interface ProductDelivery {
  id: string;
  variantId: string;
  quantity: number;
  deliveryNotes?: string;
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

export interface DeliveryStop {
  id: string;
  type: 'warehouse' | 'project_site' | 'client_location' | 'supplier';
  name: string;
  address: Address;
  estimatedDate?: string;
  actualDate?: string;
  trackingNumber?: string;
  deliveryCompany?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed';
  specialInstructions?: string;
  isIntermediate: boolean; // true if it's not the final destination
}

export interface DeliveryChain {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  stops: DeliveryStop[];
  currentStopIndex: number;
  overallStatus: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

export interface ReceivedItem {
  id: string;
  deliveryId: string;
  productId: string;
  productName: string;
  quantityReceived: number;
  quantityExpected: number;
  receivedDate: string;
  receivedBy: string;
  condition: 'good' | 'damaged' | 'defective';
  notes?: string;
}

export interface ProductReception {
  id: string;
  deliveryId: string;
  deliveryName: string;
  receptionDate: string;
  receivedBy: string;
  receivedItems: ReceivedItem[];
  notes?: string;
  status: 'partial' | 'complete';
  createdAt: string;
}

export interface WarehouseOutbound {
  id: string;
  outboundNumber: string;
  outboundDate: string;
  clientId: string;
  clientName: string;
  clientAddress: Address;
  responsibleUser: string;
  status: 'pending' | 'in_preparation' | 'ready_to_ship' | 'shipped' | 'delivered';
  outboundItems: WarehouseOutboundItem[];
  deliveryInfo?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDeliveryDate?: string;
    actualDeliveryDate?: string;
    specialInstructions?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  totalValue: number;
}

export interface WarehouseOutboundItem {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  quantityRequested: number;
  quantityAllocated: number;
  quantityShipped: number;
  unitPrice: number;
  totalPrice: number;
  warehouseLocation?: string;
  sourceType: 'supplier_delivery' | 'existing_stock';
  sourceId?: string; // ID of the original delivery or stock entry
  sourceReference?: string; // Reference to original PO, delivery, etc.
  notes?: string;
}

export interface WarehouseStock {
  id: string;
  productId: string;
  productName: string;
  sku?: string;
  availableQuantity: number;
  reservedQuantity: number;
  totalQuantity: number;
  unitPrice: number;
  warehouseLocation?: string;
  sourceType: 'supplier_delivery' | 'existing_stock' | 'manual_entry';
  sourceId?: string;
  sourceReference?: string;
  lastUpdated: string;
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
  
  // New Delivery Chain System
  deliveryChains?: DeliveryChain[];
  
  // Warehouse and Fulfillment
  receivedItems: ReceivedItem[];
  warehouseAllocations: WarehouseAllocation[];
  productReceptions?: ProductReception[];
  
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

// Company Details Types
export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  address: Address;
  status: 'active' | 'pending_approval' | 'suspended' | 'inactive';
  createdAt: string;
  updatedAt: string;
  representatives: CompanyRepresentative[];
  documents: CompanyDocument[];
  tradeReferences: TradeReference[];
  warehouses: CompanyWarehouse[];
}

export interface CompanyRepresentative {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  position?: string;
  isPrimary: boolean;
  isActive: boolean;
}

export interface CompanyDocument {
  id: string;
  name: string;
  type: 'certificate' | 'license' | 'tax_exemption' | 'insurance' | 'other';
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  expirationDate?: string;
  status: 'active' | 'expired' | 'pending_review';
}

export interface TradeReference {
  id: string;
  supplierCompanyName: string;
  creditContactEmail: string;
  creditContactPhone: string;
  accountNumber: string;
  relationshipYears?: number;
  creditLimit?: number;
  status: 'active' | 'inactive';
}

export interface CompanyWarehouse {
  id: string;
  name: string;
  address: Address;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  capacity?: number;
  specialFeatures?: string[];
  isActive: boolean;
  assignedAt: string;
}