import { EnhancedPurchaseOrder } from '../types';

export const mockEnhancedOrder: EnhancedPurchaseOrder = {
  // Basic Information
  id: 'po-enhanced-001',
  orderNumber: 'PO-2024-ENH-001',
  type: 'manual',
  status: 'approved',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T14:45:00Z',
  createdBy: 'John Smith',
  
  // Source Information
  sourceType: 'manual',
  sourceId: 'manual-001',
  quoteId: 'QT-2024-001',
  projectId: 'PROJ-2024-001',
  companyId: 'COMP-001',
  
  // Products and Variants
  variants: [
    {
      id: 'var-001',
      productId: 'prod-001',
      name: 'Dell XPS 13 Laptop - 16GB RAM',
      sku: 'DELL-XPS13-16GB',
      description: 'High-performance ultrabook with Intel Core i7 and 16GB RAM',
      specifications: {
        'Processor': 'Intel Core i7-1165G7',
        'RAM': '16GB LPDDR4x',
        'Storage': '512GB SSD',
        'Display': '13.3" FHD+',
        'Graphics': 'Intel Iris Xe'
      },
      basePrice: 1299.99,
      quantity: 5,
      totalPrice: 6499.95
    },
    {
      id: 'var-002',
      productId: 'prod-002',
      name: 'Logitech MX Master 3 Mouse',
      sku: 'LOGI-MX3',
      description: 'Advanced wireless mouse for productivity',
      specifications: {
        'Connectivity': 'Bluetooth, USB-C',
        'Battery': 'Up to 70 days',
        'DPI': 'Up to 4000',
        'Buttons': '7 customizable'
      },
      basePrice: 99.99,
      quantity: 5,
      totalPrice: 499.95
    },
    {
      id: 'var-003',
      productId: 'prod-003',
      name: 'Samsung 27" 4K Monitor',
      sku: 'SAMS-27-4K',
      description: 'Professional 4K monitor with USB-C connectivity',
      specifications: {
        'Size': '27 inches',
        'Resolution': '3840 x 2160',
        'Panel': 'IPS',
        'Refresh Rate': '60Hz',
        'Connectivity': 'USB-C, HDMI, DisplayPort'
      },
      basePrice: 449.99,
      quantity: 3,
      totalPrice: 1349.97
    }
  ],
  
  // Suppliers
  suppliers: [
    {
      id: 'sup-001',
      name: 'Dell Technologies',
      contactEmail: 'orders@dell.com',
      contactPhone: '+1-800-DELL-000',
      address: {
        street: '1 Dell Way',
        city: 'Round Rock',
        state: 'TX',
        zipCode: '78682',
        country: 'USA'
      },
      paymentTerms: 'Net 30',
      leadTime: 7,
      notes: 'Preferred supplier for laptops and workstations'
    },
    {
      id: 'sup-002',
      name: 'Logitech International',
      contactEmail: 'b2b@logitech.com',
      contactPhone: '+1-510-795-8500',
      address: {
        street: '7700 Gateway Blvd',
        city: 'Newark',
        state: 'CA',
        zipCode: '94560',
        country: 'USA'
      },
      paymentTerms: 'Net 15',
      leadTime: 3,
      notes: 'Fast delivery for peripherals'
    },
    {
      id: 'sup-003',
      name: 'Samsung Electronics',
      contactEmail: 'business@samsung.com',
      contactPhone: '+1-800-SAMSUNG',
      address: {
        street: '85 Challenger Rd',
        city: 'Ridgefield Park',
        state: 'NJ',
        zipCode: '07660',
        country: 'USA'
      },
      paymentTerms: 'Net 30',
      leadTime: 10,
      notes: 'Bulk pricing available for monitors'
    }
  ],
  
  // Variant Supplier Relations
  variantSupplierRelations: [
    {
      id: 'vsr-001',
      variantId: 'var-001',
      supplierId: 'sup-001',
      quotedPrice: 1299.99,
      quantity: 5,
      leadTime: 7,
      minimumOrder: 1,
      notes: 'Volume discount applied',
      isSelected: true
    },
    {
      id: 'vsr-002',
      variantId: 'var-002',
      supplierId: 'sup-002',
      quotedPrice: 99.99,
      quantity: 5,
      leadTime: 3,
      minimumOrder: 1,
      notes: 'Standard pricing',
      isSelected: true
    },
    {
      id: 'vsr-003',
      variantId: 'var-003',
      supplierId: 'sup-003',
      quotedPrice: 449.99,
      quantity: 3,
      leadTime: 10,
      minimumOrder: 1,
      notes: 'Professional series',
      isSelected: true
    }
  ],
  
  // Delivery Information
  deliveryInfo: {
    id: 'del-001',
    estimatedDate: '2024-01-25',
    actualDate: '2024-01-24',
    trackingNumber: 'TRK-001234567890',
    deliveryCompany: 'FedEx',
    deliveryAddress: {
      street: '123 Business Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    specialInstructions: 'Deliver to loading dock. Contact security at extension 1234.',
    status: 'delivered'
  },
  
  // Received Items
  receivedItems: [
    {
      id: 'rec-001',
      variantId: 'var-001',
      quantityReceived: 5,
      quantityExpected: 5,
      receivedDate: '2024-01-24T09:30:00Z',
      receivedBy: 'Mike Johnson',
      condition: 'good',
      notes: 'All laptops in perfect condition, serial numbers recorded'
    },
    {
      id: 'rec-002',
      variantId: 'var-002',
      quantityReceived: 5,
      quantityExpected: 5,
      receivedDate: '2024-01-24T09:35:00Z',
      receivedBy: 'Mike Johnson',
      condition: 'good',
      notes: 'Mice tested and working properly'
    },
    {
      id: 'rec-003',
      variantId: 'var-003',
      quantityReceived: 2,
      quantityExpected: 3,
      receivedDate: '2024-01-24T09:40:00Z',
      receivedBy: 'Mike Johnson',
      condition: 'good',
      notes: 'One monitor missing from shipment, supplier contacted'
    }
  ],
  
  // Warehouse Allocations
  warehouseAllocations: [
    {
      id: 'wa-001',
      variantId: 'var-001',
      quantityForClient: 3,
      quantityForWarehouse: 2,
      warehouseLocation: 'A-12-B',
      allocationNotes: 'Client gets 3 for immediate deployment, 2 for backup inventory'
    },
    {
      id: 'wa-002',
      variantId: 'var-002',
      quantityForClient: 3,
      quantityForWarehouse: 2,
      warehouseLocation: 'B-05-C',
      allocationNotes: 'Standard allocation for peripherals'
    },
    {
      id: 'wa-003',
      variantId: 'var-003',
      quantityForClient: 2,
      quantityForWarehouse: 0,
      warehouseLocation: 'C-08-A',
      allocationNotes: 'All monitors for client, waiting for missing unit'
    }
  ],
  
  // Financial Information
  subtotal: 8349.87,
  freight: 125.50,
  taxes: 668.03,
  totalAmount: 9143.40,
  
  // Additional Information
  notes: 'Urgent order for Q1 project deployment. All items needed by end of January.',
  internalNotes: 'Client has requested expedited delivery. Monitor supplier needs follow-up for missing unit.',
  
  // Approvals
  approvals: {
    internalApprovedBy: 'Sarah Wilson',
    internalApprovedAt: '2024-01-15T16:20:00Z',
    externalApprovedBy: 'David Chen',
    externalApprovedAt: '2024-01-16T10:15:00Z'
  }
};