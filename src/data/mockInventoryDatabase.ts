import { CompanyInventoryItem } from '../types';

// Simulated database of existing inventory items
export const mockInventoryDatabase: CompanyInventoryItem[] = [
  {
    id: 'inv-db-001',
    name: 'Dell XPS 13 Laptop',
    availableQuantity: 25,
    price: 1299.99,
    description: 'High-performance ultrabook with Intel Core i7',
    supplier: 'Dell Technologies',
    sku: 'DELL-XPS13-I7',
    category: 'Laptops',
    brand: 'Dell'
  },
  {
    id: 'inv-db-002',
    name: 'Gaming Laptop RTX 4080',
    availableQuantity: 8,
    price: 2399.99,
    description: 'High-end gaming laptop with RTX 4080 graphics',
    supplier: 'ASUS',
    sku: 'ASUS-ROG-4080',
    category: 'Laptops',
    brand: 'ASUS'
  },
  {
    id: 'inv-db-003',
    name: 'Professional Audio Microphone',
    availableQuantity: 15,
    price: 849.99,
    description: 'Studio-grade condenser microphone',
    supplier: 'Audio-Technica',
    sku: 'AT-2020USB',
    category: 'Audio Equipment',
    brand: 'Audio-Technica'
  },
  {
    id: 'inv-db-004',
    name: 'Microphone Recording Setup',
    availableQuantity: 5,
    price: 899.99,
    description: 'Complete professional microphone setup with accessories',
    supplier: 'Shure',
    sku: 'SHURE-SM7B-KIT',
    category: 'Audio Equipment',
    brand: 'Shure'
  },
  {
    id: 'inv-db-005',
    name: '3D Printer Filament PLA',
    availableQuantity: 50,
    price: 149.99,
    description: 'High-quality PLA filament for 3D printing',
    supplier: 'Hatchbox',
    sku: 'HATCH-PLA-1KG',
    category: '3D Printing',
    brand: 'Hatchbox'
  },
  {
    id: 'inv-db-006',
    name: 'Industrial Grade 3D Filament',
    availableQuantity: 30,
    price: 159.99,
    description: 'Professional grade PLA filament for industrial use',
    supplier: 'PolyMaker',
    sku: 'POLY-PLA-IND',
    category: '3D Printing',
    brand: 'PolyMaker'
  },
  {
    id: 'inv-db-007',
    name: 'Smart LED Lighting System',
    availableQuantity: 12,
    price: 1199.99,
    description: 'Automated LED lighting with smart controls',
    supplier: 'Philips Hue',
    sku: 'PHILIPS-HUE-PRO',
    category: 'Lighting',
    brand: 'Philips'
  },
  {
    id: 'inv-db-008',
    name: 'Office Smart Lighting',
    availableQuantity: 20,
    price: 1299.99,
    description: 'Smart office lighting system with automation',
    supplier: 'LIFX',
    sku: 'LIFX-OFFICE-KIT',
    category: 'Lighting',
    brand: 'LIFX'
  },
  {
    id: 'inv-db-009',
    name: 'Standing Desk Converter',
    availableQuantity: 18,
    price: 429.99,
    description: 'Ergonomic height-adjustable desk converter',
    supplier: 'Varidesk',
    sku: 'VARI-CONV-36',
    category: 'Office Furniture',
    brand: 'Varidesk'
  },
  {
    id: 'inv-db-010',
    name: 'Ergonomic Desk Converter',
    availableQuantity: 22,
    price: 449.99,
    description: 'Premium ergonomic standing desk converter',
    supplier: 'FlexiSpot',
    sku: 'FLEXI-E7',
    category: 'Office Furniture',
    brand: 'FlexiSpot'
  },
  {
    id: 'inv-db-011',
    name: '4K Security Camera System',
    availableQuantity: 10,
    price: 1799.99,
    description: '8-channel 4K security system with night vision',
    supplier: 'Hikvision',
    sku: 'HIK-8CH-4K',
    category: 'Security',
    brand: 'Hikvision'
  },
  {
    id: 'inv-db-012',
    name: 'Security Camera 8-Channel System',
    availableQuantity: 7,
    price: 1899.99,
    description: 'Professional 8-channel security camera system',
    supplier: 'Dahua',
    sku: 'DAHUA-8CH-PRO',
    category: 'Security',
    brand: 'Dahua'
  }
];