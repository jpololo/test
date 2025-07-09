import { WarehouseStock, WarehouseOutbound } from '../types';

// Mock warehouse stock data
export const mockWarehouseStock: WarehouseStock[] = [
  {
    id: 'stock-001',
    productId: 'var-001',
    productName: 'Dell XPS 13 Laptop - 16GB RAM',
    sku: 'DELL-XPS13-16GB',
    availableQuantity: 15,
    reservedQuantity: 3,
    totalQuantity: 18,
    unitPrice: 1299.99,
    warehouseLocation: 'A-12-B',
    sourceType: 'supplier_delivery',
    sourceId: 'del-001',
    sourceReference: 'PO-2024-ENH-001',
    lastUpdated: '2024-01-24T14:30:00Z'
  },
  {
    id: 'stock-002',
    productId: 'var-002',
    productName: 'Logitech MX Master 3 Mouse',
    sku: 'LOGI-MX3',
    availableQuantity: 25,
    reservedQuantity: 5,
    totalQuantity: 30,
    unitPrice: 99.99,
    warehouseLocation: 'B-05-C',
    sourceType: 'supplier_delivery',
    sourceId: 'del-001',
    sourceReference: 'PO-2024-ENH-001',
    lastUpdated: '2024-01-24T14:30:00Z'
  },
  {
    id: 'stock-003',
    productName: 'Office Chair Ergonomic',
    productId: 'existing-001',
    sku: 'CHAIR-ERG-001',
    availableQuantity: 12,
    reservedQuantity: 2,
    totalQuantity: 14,
    unitPrice: 299.99,
    warehouseLocation: 'C-08-A',
    sourceType: 'existing_stock',
    sourceReference: 'Initial Inventory',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'stock-004',
    productName: 'Standing Desk Electric',
    productId: 'existing-002',
    sku: 'DESK-STAND-001',
    availableQuantity: 8,
    reservedQuantity: 1,
    totalQuantity: 9,
    unitPrice: 499.99,
    warehouseLocation: 'D-15-A',
    sourceType: 'existing_stock',
    sourceReference: 'Initial Inventory',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'stock-005',
    productName: 'Webcam Logitech 4K',
    productId: 'existing-003',
    sku: 'WEBCAM-4K-001',
    availableQuantity: 20,
    reservedQuantity: 0,
    totalQuantity: 20,
    unitPrice: 129.99,
    warehouseLocation: 'B-03-D',
    sourceType: 'existing_stock',
    sourceReference: 'Initial Inventory',
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'stock-006',
    productName: 'Custom Project Signage',
    productId: 'var-003',
    sku: 'CUSTOM-SIGN-001',
    availableQuantity: 2,
    reservedQuantity: 1,
    totalQuantity: 3,
    unitPrice: 449.99,
    warehouseLocation: 'E-20-B',
    sourceType: 'supplier_delivery',
    sourceId: 'del-003',
    sourceReference: 'PO-2024-ENH-001',
    lastUpdated: '2024-01-30T09:30:00Z'
  }
];

// Mock warehouse outbound orders
export const mockWarehouseOutbounds: WarehouseOutbound[] = [
  {
    id: 'out-001',
    outboundNumber: 'OUT-2024-001',
    outboundDate: '2024-01-25T09:00:00Z',
    clientId: 'client-001',
    clientName: 'Tech Solutions Corp',
    clientAddress: {
      street: '123 Business Plaza',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    responsibleUser: 'Mike Johnson',
    status: 'shipped',
    totalValue: 2699.97,
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-01-25T15:45:00Z',
    deliveryInfo: {
      trackingNumber: 'OUT001234567',
      carrier: 'FedEx',
      estimatedDeliveryDate: '2024-01-27',
      specialInstructions: 'Deliver to IT department, contact John Smith ext. 1234'
    },
    notes: 'Urgent delivery for project deployment',
    outboundItems: [
      {
        id: 'out-item-001',
        productId: 'var-001',
        productName: 'Dell XPS 13 Laptop - 16GB RAM',
        sku: 'DELL-XPS13-16GB',
        quantityRequested: 2,
        quantityAllocated: 2,
        quantityShipped: 2,
        unitPrice: 1299.99,
        totalPrice: 2599.98,
        warehouseLocation: 'A-12-B',
        sourceType: 'supplier_delivery',
        sourceId: 'del-001',
        sourceReference: 'PO-2024-ENH-001',
        notes: 'Latest model with upgraded specs'
      },
      {
        id: 'out-item-002',
        productId: 'var-002',
        productName: 'Logitech MX Master 3 Mouse',
        sku: 'LOGI-MX3',
        quantityRequested: 1,
        quantityAllocated: 1,
        quantityShipped: 1,
        unitPrice: 99.99,
        totalPrice: 99.99,
        warehouseLocation: 'B-05-C',
        sourceType: 'supplier_delivery',
        sourceId: 'del-001',
        sourceReference: 'PO-2024-ENH-001'
      }
    ]
  },
  {
    id: 'out-002',
    outboundNumber: 'OUT-2024-002',
    outboundDate: '2024-01-26T10:30:00Z',
    clientId: 'client-002',
    clientName: 'Creative Agency LLC',
    clientAddress: {
      street: '456 Design Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'USA'
    },
    responsibleUser: 'Sarah Wilson',
    status: 'in_preparation',
    totalValue: 929.97,
    createdAt: '2024-01-26T10:00:00Z',
    notes: 'Office setup for new team',
    outboundItems: [
      {
        id: 'out-item-003',
        productId: 'existing-001',
        productName: 'Office Chair Ergonomic',
        sku: 'CHAIR-ERG-001',
        quantityRequested: 2,
        quantityAllocated: 2,
        quantityShipped: 0,
        unitPrice: 299.99,
        totalPrice: 599.98,
        warehouseLocation: 'C-08-A',
        sourceType: 'existing_stock',
        sourceReference: 'Initial Inventory'
      },
      {
        id: 'out-item-004',
        productId: 'existing-003',
        productName: 'Webcam Logitech 4K',
        sku: 'WEBCAM-4K-001',
        quantityRequested: 3,
        quantityAllocated: 3,
        quantityShipped: 0,
        unitPrice: 129.99,
        totalPrice: 389.97,
        warehouseLocation: 'B-03-D',
        sourceType: 'existing_stock',
        sourceReference: 'Initial Inventory'
      }
    ]
  },
  {
    id: 'out-003',
    outboundNumber: 'OUT-2024-003',
    outboundDate: '2024-01-27T14:15:00Z',
    clientId: 'client-003',
    clientName: 'Startup Hub Inc',
    clientAddress: {
      street: '789 Innovation Drive',
      city: 'Queens',
      state: 'NY',
      zipCode: '11101',
      country: 'USA'
    },
    responsibleUser: 'David Chen',
    status: 'pending',
    totalValue: 999.98,
    createdAt: '2024-01-27T14:00:00Z',
    notes: 'Mixed order - supplier delivery + existing stock',
    outboundItems: [
      {
        id: 'out-item-005',
        productId: 'existing-002',
        productName: 'Standing Desk Electric',
        sku: 'DESK-STAND-001',
        quantityRequested: 1,
        quantityAllocated: 1,
        quantityShipped: 0,
        unitPrice: 499.99,
        totalPrice: 499.99,
        warehouseLocation: 'D-15-A',
        sourceType: 'existing_stock',
        sourceReference: 'Initial Inventory'
      },
      {
        id: 'out-item-006',
        productId: 'var-003',
        productName: 'Custom Project Signage',
        sku: 'CUSTOM-SIGN-001',
        quantityRequested: 1,
        quantityAllocated: 1,
        quantityShipped: 0,
        unitPrice: 449.99,
        totalPrice: 449.99,
        warehouseLocation: 'E-20-B',
        sourceType: 'supplier_delivery',
        sourceId: 'del-003',
        sourceReference: 'PO-2024-ENH-001'
      }
    ]
  }
];