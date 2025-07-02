import { ManualProduct } from '../types';

export const mockManualProducts: ManualProduct[] = [
  {
    id: 'manual-001',
    name: 'Custom Gaming Laptop RTX 4080',
    price: 2499.99,
    sku: '',
    description: 'High-performance gaming laptop with RTX 4080 graphics card',
    status: 'manual_pending',
    createdFromQuoteId: 'quote-003',
    quoteName: 'QT-2024-003 - Tech Solutions Corp',
    createdAt: '2024-01-22T09:15:00Z'
  },
  {
    id: 'manual-002',
    name: 'Professional Microphone Setup',
    price: 899.50,
    sku: 'MIC-PRO-001',
    description: 'Complete professional microphone setup for recording studio',
    status: 'manual_pending',
    createdFromQuoteId: 'quote-004',
    quoteName: 'QT-2024-004 - Audio Productions LLC',
    createdAt: '2024-01-21T14:30:00Z'
  },
  {
    id: 'manual-003',
    name: 'Industrial 3D Printer Filament',
    price: 156.75,
    sku: '',
    description: 'High-grade PLA filament for industrial 3D printing applications',
    status: 'manual_pending',
    createdFromQuoteId: 'quote-005',
    quoteName: 'QT-2024-005 - Manufacturing Plus',
    createdAt: '2024-01-20T11:45:00Z'
  },
  {
    id: 'manual-004',
    name: 'Smart Office Lighting System',
    price: 1299.00,
    sku: 'LIGHT-SMART-002',
    description: 'Automated LED lighting system with smart controls',
    status: 'manual_pending',
    createdFromQuoteId: 'quote-006',
    quoteName: 'QT-2024-006 - Green Building Solutions',
    createdAt: '2024-01-19T16:20:00Z'
  },
  {
    id: 'manual-005',
    name: 'Ergonomic Standing Desk Converter',
    price: 449.99,
    sku: '',
    description: 'Height-adjustable desk converter for ergonomic workspace',
    status: 'manual_pending',
    createdFromQuoteId: 'quote-007',
    quoteName: 'QT-2024-007 - Wellness Workspace Inc',
    createdAt: '2024-01-18T10:10:00Z'
  },
  {
    id: 'manual-006',
    name: 'Security Camera System 8-Channel',
    price: 1899.99,
    sku: 'SEC-CAM-8CH',
    description: '8-channel 4K security camera system with night vision',
    status: 'manual_pending',
    createdFromQuoteId: 'quote-008',
    quoteName: 'QT-2024-008 - SecureSpace Technologies',
    createdAt: '2024-01-17T13:55:00Z'
  }
];