import { Company } from '../types';

export const mockCompany: Company = {
  id: 'comp-001',
  name: 'Dura-Line LLC ACH',
  email: 'stephanie.watson@duraline.com',
  phone: '(800) 847-7661',
  website: 'https://www.duraline.com/',
  address: {
    street: '12 AL-12',
    city: 'Daleville',
    state: 'Alabama',
    zipCode: '36322',
    country: 'USA'
  },
  status: 'pending_approval',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z',
  representatives: [
    {
      id: 'rep-001',
      name: 'Stephanie Watson',
      email: 'stephanie.watson@duraline.com',
      phone: '(800) 847-7661',
      gender: 'female',
      position: 'Account Manager',
      isPrimary: true,
      isActive: true
    },
    {
      id: 'rep-002',
      name: 'Michael Johnson',
      email: 'michael.johnson@duraline.com',
      phone: '(800) 847-7662',
      gender: 'male',
      position: 'Sales Representative',
      isPrimary: false,
      isActive: true
    },
    {
      id: 'rep-003',
      name: 'Sarah Chen',
      email: 'sarah.chen@duraline.com',
      phone: '(800) 847-7663',
      gender: 'female',
      position: 'Technical Support',
      isPrimary: false,
      isActive: true
    }
  ],
  documents: [
    {
      id: 'doc-001',
      name: 'Business License',
      type: 'license',
      fileUrl: '/documents/business-license.pdf',
      uploadedAt: '2024-01-15T10:30:00Z',
      uploadedBy: 'Stephanie Watson',
      expirationDate: '2025-01-15',
      status: 'active'
    },
    {
      id: 'doc-002',
      name: 'Tax Exemption Certificate',
      type: 'tax_exemption',
      fileUrl: '/documents/tax-exemption.pdf',
      uploadedAt: '2024-01-15T10:35:00Z',
      uploadedBy: 'Stephanie Watson',
      expirationDate: '2024-12-31',
      status: 'active'
    },
    {
      id: 'doc-003',
      name: 'Insurance Certificate',
      type: 'insurance',
      fileUrl: '/documents/insurance-cert.pdf',
      uploadedAt: '2024-01-15T10:40:00Z',
      uploadedBy: 'Stephanie Watson',
      expirationDate: '2024-06-30',
      status: 'expired'
    }
  ],
  tradeReferences: [
    {
      id: 'ref-001',
      supplierCompanyName: 'PVC Schedule 80 Conduit – 10 Feet Length (1/2" to 6")',
      creditContactEmail: 'neuvbo9@gmail.com',
      creditContactPhone: '(878) 877-8775',
      accountNumber: '676206904948',
      relationshipYears: 5,
      creditLimit: 50000,
      status: 'active'
    },
    {
      id: 'ref-002',
      supplierCompanyName: 'PVC Schedule 40 Conduit 10\'',
      creditContactEmail: 'nuevo@yopmail.com',
      creditContactPhone: '(878) 877-8775',
      accountNumber: '676206904948',
      relationshipYears: 3,
      creditLimit: 25000,
      status: 'active'
    },
    {
      id: 'ref-003',
      supplierCompanyName: 'PVC Schedule 80 Conduit – 10 Feet Length (1/2" to 6")',
      creditContactEmail: 'sheilariles140999@gmail.com',
      creditContactPhone: '(000) 000-0000',
      accountNumber: '676206904948',
      relationshipYears: 2,
      creditLimit: 15000,
      status: 'active'
    }
  ],
  warehouses: [
    {
      id: 'wh-001',
      name: 'Main Distribution Center',
      address: {
        street: '500 Industrial Blvd',
        city: 'Daleville',
        state: 'Alabama',
        zipCode: '36322',
        country: 'USA'
      },
      contactPerson: 'Robert Martinez',
      contactPhone: '(800) 847-7665',
      contactEmail: 'warehouse@duraline.com',
      capacity: 100000,
      specialFeatures: ['Climate Controlled', 'Loading Dock', '24/7 Security'],
      isActive: true,
      assignedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'wh-002',
      name: 'Secondary Storage Facility',
      address: {
        street: '1200 Commerce Drive',
        city: 'Montgomery',
        state: 'Alabama',
        zipCode: '36104',
        country: 'USA'
      },
      contactPerson: 'Lisa Thompson',
      contactPhone: '(334) 555-0123',
      contactEmail: 'secondary@duraline.com',
      capacity: 50000,
      specialFeatures: ['Outdoor Storage', 'Crane Access'],
      isActive: true,
      assignedAt: '2024-01-20T09:15:00Z'
    }
  ]
};