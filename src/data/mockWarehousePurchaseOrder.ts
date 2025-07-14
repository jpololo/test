import { WarehousePurchaseOrder } from '../types';

export const mockWarehousePurchaseOrder: WarehousePurchaseOrder = {
  id: 'wpo-001',
  orderNumber: 'Single Purchase Order',
  status: 'completed',
  subOrderNumber: '57',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-02-27T14:45:00Z',
  
  supplier: {
    id: 'sup-maclean',
    name: 'MacLean Senior Industries, LLC-ACH',
    address: 'MacLean Senior Industries, LLC-ACH PO Box 201494, Dallas, Texas, United States, 75320',
    contactInfo: 'contact@maclean.com'
  },
  
  orderFrom: {
    company: 'MacLean Senior Industries, LLC-ACH',
    address: 'PO Box 201494, Dallas, Texas, United States, 75320'
  },
  
  products: [
    {
      id: 'prod-001',
      name: '1/4" Deadend Grips for Guy Wire',
      description: 'High-quality deadend grips designed for guy wire applications',
      costPrice: 1.6,
      quantity: 500,
      taxes: 0,
      total: 800.00,
      productImage: '🔧',
      category: 'Hardware',
      isExpanded: true
    },
    {
      id: 'prod-002',
      name: '5/16" Deadend Grips for Guy Wire',
      description: 'Premium deadend grips for 5/16 inch guy wire',
      costPrice: 2.1,
      quantity: 400,
      taxes: 0,
      total: 840.00,
      productImage: '🔧',
      category: 'Hardware',
      isExpanded: false
    },
    {
      id: 'prod-003',
      name: '1/8" x 2" Square Washer for 5/8" Bolt',
      description: 'Square washers for bolt applications',
      costPrice: 0.75,
      quantity: 1000,
      taxes: 0,
      total: 750.00,
      productImage: '🔩',
      category: 'Fasteners',
      isExpanded: false
    },
    {
      id: 'prod-004',
      name: '1/2" x 4" Twist Drive Lag Screws',
      description: 'Heavy-duty twist drive lag screws',
      costPrice: 3.2,
      quantity: 800,
      taxes: 0,
      total: 2560.00,
      productImage: '🔩',
      category: 'Fasteners',
      isExpanded: false
    }
  ],
  
  costSummary: {
    subtotal: 243991.65,
    taxes: 0.00,
    shipping: 1.00,
    total: 243992.65
  },
  
  shippingPrice: 1.00,
  representative: 'John Smith',
  description: 'Bulk order for Q1 inventory replenishment',
  totalItems: 29,
  
  incomingDeliveries: [
    {
      id: 'inc-001',
      productId: 'prod-004',
      productName: '1/2" x 4" Twist Drive Lag Screws',
      expectedQuantity: 800,
      receivedQuantity: 800,
      expectedDate: '2025-02-27',
      deliveryDate: '2025-02-27T14:07:00Z',
      receivedBy: 'Eidel Ruben Matos Carpio',
      status: 'completed'
    },
    {
      id: 'inc-002',
      productId: 'prod-001',
      productName: '1/4" Deadend Grips for Guy Wire',
      expectedQuantity: 500,
      receivedQuantity: 250,
      expectedDate: '2025-02-28',
      status: 'partial'
    },
    {
      id: 'inc-003',
      productId: 'prod-002',
      productName: '5/16" Deadend Grips for Guy Wire',
      expectedQuantity: 400,
      receivedQuantity: 0,
      expectedDate: '2025-03-01',
      status: 'pending'
    }
  ],
  
  orderSlips: [
    {
      id: 'slip-001',
      fileName: 'purchase_order_receipt.pdf',
      fileUrl: '/documents/purchase_order_receipt.pdf',
      uploadedAt: '2024-02-27T10:30:00Z',
      fileSize: '2.4 MB',
      fileType: 'PDF'
    },
    {
      id: 'slip-002',
      fileName: 'delivery_confirmation.pdf',
      fileUrl: '/documents/delivery_confirmation.pdf',
      uploadedAt: '2024-02-27T15:20:00Z',
      fileSize: '1.8 MB',
      fileType: 'PDF'
    }
  ]
};