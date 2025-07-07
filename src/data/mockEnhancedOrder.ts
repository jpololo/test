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
      salePrice: 1599.99,
      quantity: 5,
      totalPrice: 6499.95,
      isCustom: false
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
      salePrice: 129.99,
      quantity: 5,
      totalPrice: 499.95,
      isCustom: false
    },
    {
      id: 'var-003',
      productId: 'custom-001',
      name: 'Custom Project Signage',
      sku: 'CUSTOM-SIGN-001',
      description: 'Custom branded signage for project site',
      specifications: {
        'Material': 'Aluminum composite',
        'Size': '4x8 feet',
        'Finish': 'Weather resistant coating'
      },
      basePrice: 449.99,
      salePrice: 699.99,
      quantity: 3,
      totalPrice: 1349.97,
      isCustom: true
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
      name: 'Local Sign Company',
      contactEmail: 'orders@localsigns.com',
      contactPhone: '+1-555-SIGNS-1',
      address: {
        street: '123 Industrial Blvd',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentTerms: 'Net 15',
      leadTime: 14,
      notes: 'Custom fabrication specialist'
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
      leadTime: 14,
      minimumOrder: 1,
      notes: 'Custom fabrication',
      isSelected: true
    }
  ],
  
  // Multiple Deliveries
  deliveries: [
    {
      id: 'del-001',
      estimatedDate: '2024-01-25',
      actualDate: '2024-01-24',
      trackingNumber: 'TRK-001234567890',
      deliveryCompany: 'FedEx',
      deliveryLocation: 'Project Site 1',
      deliveryAddress: {
        street: '123 Business Plaza',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      specialInstructions: 'Deliver to loading dock. Contact security at extension 1234.',
      status: 'delivered',
      productDeliveries: [
        {
          id: 'pd-001',
          variantId: 'var-001',
          quantity: 3,
          deliveryNotes: 'For immediate deployment'
        },
        {
          id: 'pd-002',
          variantId: 'var-002',
          quantity: 3,
          deliveryNotes: 'Accessories for laptops'
        }
      ]
    },
    {
      id: 'del-002',
      estimatedDate: '2024-01-28',
      trackingNumber: 'TRK-002345678901',
      deliveryCompany: 'UPS',
      deliveryLocation: 'Project Site 2',
      deliveryAddress: {
        street: '456 Corporate Ave',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        country: 'USA'
      },
      specialInstructions: 'Deliver to main entrance during business hours.',
      status: 'in_transit',
      productDeliveries: [
        {
          id: 'pd-003',
          variantId: 'var-003',
          quantity: 2,
          deliveryNotes: 'Install immediately upon delivery'
        }
      ]
    },
    {
      id: 'del-003',
      estimatedDate: '2024-01-30',
      deliveryLocation: 'Our Warehouse',
      deliveryAddress: {
        street: '789 Warehouse District',
        city: 'Queens',
        state: 'NY',
        zipCode: '11101',
        country: 'USA'
      },
      specialInstructions: 'Standard warehouse receiving procedures.',
      status: 'pending',
      productDeliveries: [
        {
          id: 'pd-004',
          variantId: 'var-001',
          quantity: 2,
          deliveryNotes: 'Backup inventory'
        },
        {
          id: 'pd-005',
          variantId: 'var-002',
          quantity: 2,
          deliveryNotes: 'Warehouse stock'
        },
        {
          id: 'pd-006',
          variantId: 'var-003',
          quantity: 1,
          deliveryNotes: 'Spare signage'
        }
      ]
    }
  ],
  
  // Received Items (only for warehouse deliveries)
  receivedItems: [
    {
      id: 'rec-001',
      variantId: 'var-001',
      quantityReceived: 2,
      quantityExpected: 2,
      receivedDate: '2024-01-30T09:30:00Z',
      receivedBy: 'Mike Johnson',
      condition: 'good',
      notes: 'Laptops received in perfect condition, added to warehouse inventory'
    },
    {
      id: 'rec-002',
      variantId: 'var-002',
      quantityReceived: 2,
      quantityExpected: 2,
      receivedDate: '2024-01-30T09:35:00Z',
      receivedBy: 'Mike Johnson',
      condition: 'good',
      notes: 'Mice tested and working properly, stored in accessories section'
    }
  ],
  
  // Warehouse Allocations (only for items that come to warehouse)
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
      quantityForWarehouse: 1,
      warehouseLocation: 'C-08-A',
      allocationNotes: 'Most signage goes directly to sites, 1 spare for warehouse'
    }
  ],
  
  // Financial Information
  subtotal: 8349.87,
  freight: 125.50,
  taxes: 668.03,
  totalAmount: 9143.40,
  
  // Additional Information
  notes: 'Multi-site deployment order with custom signage. Coordinate deliveries with project managers.',
  internalNotes: 'Client has requested expedited delivery for Project Site 1. Custom signage requires 2-week lead time.',
  
  // Approvals
  approvals: {
    internalApprovedBy: 'Sarah Wilson',
    internalApprovedAt: '2024-01-15T16:20:00Z',
    externalApprovedBy: 'David Chen',
    externalApprovedAt: '2024-01-16T10:15:00Z'
  }
};