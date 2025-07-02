import { Quote, CompanyInventoryItem, PurchaseOrder, Address } from '../types';

export const mockQuotes: Quote[] = [
  {
    id: 'quote-001',
    number: 'QT-2024-001',
    products: [
      { 
        id: 'p1', 
        name: 'Laptop Dell XPS 13', 
        quantity: 2, 
        price: 1299.99,
        trackingNumber: 'DELL001234567',
        supplier: 'Dell Technologies'
      },
      { 
        id: 'p2', 
        name: 'Wireless Mouse Logitech MX Master', 
        quantity: 2, 
        price: 99.99,
        trackingNumber: 'LOGI002345678',
        supplier: 'Logitech'
      },
      { 
        id: 'p3', 
        name: 'USB-C Hub Anker 7-in-1', 
        quantity: 2, 
        price: 59.99,
        trackingNumber: 'ANKR003456789',
        supplier: 'Anker'
      }
    ],
    shippingAddress: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '456 Corporate St',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    freight: 25.50,
    trackingNumber: 'MAIN001234567',
    date: '2024-01-15'
  },
  {
    id: 'quote-002',
    number: 'QT-2024-002',
    products: [
      { 
        id: 'p4', 
        name: 'Monitor Samsung 27" 4K', 
        quantity: 1, 
        price: 449.99,
        trackingNumber: 'SAMS004567890',
        supplier: 'Samsung'
      },
      { 
        id: 'p5', 
        name: 'Keyboard Mechanical RGB', 
        quantity: 1, 
        price: 159.99,
        trackingNumber: 'RAZR005678901',
        supplier: 'Razer'
      }
    ],
    shippingAddress: {
      street: '789 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    billingAddress: {
      street: '789 Tech Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    freight: 35.00,
    trackingNumber: 'MAIN002345678',
    date: '2024-01-20'
  }
];

export const mockInventory: CompanyInventoryItem[] = [
  { 
    id: 'inv-001', 
    name: 'Office Chair Ergonomic', 
    availableQuantity: 15, 
    price: 299.99, 
    description: 'Comfortable ergonomic office chair with lumbar support',
    supplier: 'Herman Miller'
  },
  { 
    id: 'inv-002', 
    name: 'Standing Desk Electric', 
    availableQuantity: 8, 
    price: 499.99, 
    description: 'Height adjustable electric standing desk',
    supplier: 'Uplift Desk'
  },
  { 
    id: 'inv-003', 
    name: 'Printer HP LaserJet Pro', 
    availableQuantity: 5, 
    price: 199.99, 
    description: 'Black and white laser printer',
    supplier: 'HP Inc.'
  },
  { 
    id: 'inv-004', 
    name: 'Webcam Logitech 4K', 
    availableQuantity: 12, 
    price: 129.99, 
    description: '4K webcam with auto-focus',
    supplier: 'Logitech'
  },
  { 
    id: 'inv-005', 
    name: 'Headphones Sony WH-1000XM4', 
    availableQuantity: 20, 
    price: 349.99, 
    description: 'Noise-canceling wireless headphones',
    supplier: 'Sony'
  },
  { 
    id: 'inv-006', 
    name: 'Tablet iPad Air', 
    availableQuantity: 6, 
    price: 599.99, 
    description: '10.9-inch iPad Air with Wi-Fi',
    supplier: 'Apple'
  }
];

export const mockOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    orderNumber: 'PO-2024-001',
    type: 'quote',
    products: mockQuotes[0].products,
    shippingAddress: mockQuotes[0].shippingAddress,
    billingAddress: mockQuotes[0].billingAddress,
    freight: mockQuotes[0].freight,
    trackingNumber: mockQuotes[0].trackingNumber,
    status: 'confirmed',
    createdAt: '2024-01-16T10:30:00Z',
    totalAmount: 2945.46,
    sourceId: 'quote-001',
    notes: 'Urgent delivery required for Q1 project launch. Please coordinate with IT department for setup.'
  },
  {
    id: 'po-002',
    orderNumber: 'PO-2024-002',
    type: 'inventory',
    products: [
      { 
        id: 'inv-001', 
        name: 'Office Chair Ergonomic', 
        quantity: 3, 
        price: 299.99,
        trackingNumber: 'HERM006789012',
        supplier: 'Herman Miller'
      },
      { 
        id: 'inv-004', 
        name: 'Webcam Logitech 4K', 
        quantity: 2, 
        price: 129.99,
        trackingNumber: 'LOGI007890123',
        supplier: 'Logitech'
      }
    ],
    billingAddress: {
      street: '321 Main St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    freight: 0,
    trackingNumber: 'MAIN003456789',
    status: 'shipped',
    createdAt: '2024-01-18T14:45:00Z',
    totalAmount: 1159.95,
    notes: 'Standard delivery to main office. Contact reception for delivery coordination.'
  }
];

export const defaultBillingAddress: Address = {
  street: '100 Company Plaza',
  city: 'Business City',
  state: 'NY',
  zipCode: '10001',
  country: 'USA'
};