import React, { useState } from 'react';
import { Company, CompanyRepresentative, CompanyDocument, TradeReference, CompanyWarehouse } from '../types';
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Edit, 
  Users, 
  FileText, 
  TrendingUp, 
  Warehouse,
  Plus,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  User,
  Shield,
  Clock,
  Package
} from 'lucide-react';

interface CompanyDetailsViewProps {
  company: Company;
  onEdit?: () => void;
  isEditable?: boolean;
}

const tabs = [
  { id: 'business', name: 'Business Details', icon: Building },
  { id: 'representatives', name: 'Representatives', icon: Users },
  { id: 'documents', name: 'Documents', icon: FileText },
  { id: 'trade-references', name: 'Trade References', icon: TrendingUp },
  { id: 'warehouses', name: 'Warehouses', icon: Warehouse }
];

const CompanyDetailsView: React.FC<CompanyDetailsViewProps> = ({ 
  company, 
  onEdit, 
  isEditable = false 
}) => {
  const [activeTab, setActiveTab] = useState('business');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending_approval': return Clock;
      case 'suspended': return XCircle;
      case 'inactive': return XCircle;
      case 'expired': return AlertTriangle;
      case 'pending_review': return Clock;
      default: return AlertTriangle;
    }
  };

  const renderBusinessDetails = () => (
    <div className="space-y-8">
      {/* Company Info & Address Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Company Info</h3>
            {isEditable && (
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{company.name}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href={`mailto:${company.email}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                  {company.email}
                </a>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href={`tel:${company.phone}`} className="text-gray-900">
                  {company.phone}
                </a>
              </div>
            </div>
            
            {company.website && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {company.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            {isEditable && (
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div className="text-gray-900">
              <div className="font-medium">{company.address.street}</div>
              <div className="text-gray-600">
                {company.address.city}, {company.address.state} {company.address.zipCode}
              </div>
              <div className="text-gray-600">{company.address.country}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status & Timestamps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Status & Timeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Current Status</label>
            <div className="flex items-center space-x-2">
              {React.createElement(getStatusIcon(company.status), { 
                className: `h-4 w-4 ${company.status === 'active' ? 'text-green-600' : 
                  company.status === 'pending_approval' ? 'text-yellow-600' : 'text-red-600'}`
              })}
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(company.status)}`}>
                {company.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Created</label>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Last Updated</label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{new Date(company.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRepresentatives = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Representatives</h3>
        {isEditable && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Representative</span>
          </button>
        )}
      </div>

      {company.representatives.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {company.representatives.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                            <span>{rep.name}</span>
                            {rep.isPrimary && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Primary
                              </span>
                            )}
                          </div>
                          {rep.position && (
                            <div className="text-sm text-gray-500">{rep.position}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`mailto:${rep.email}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        {rep.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a href={`tel:${rep.phone}`}>{rep.phone}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {rep.gender.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No representatives found</h3>
          <p className="text-gray-600">Add company representatives to manage communications.</p>
        </div>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Compliance Documents</h3>
          <p className="text-sm text-gray-600 mt-1">Add/select resale certificates, tax exemptions, or other docs you'd like to share</p>
        </div>
        {isEditable && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {company.documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {company.documents.map((doc) => {
            const StatusIcon = getStatusIcon(doc.status);
            
            return (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{doc.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className={`h-3 w-3 ${doc.status === 'active' ? 'text-green-600' : 
                        doc.status === 'expired' ? 'text-red-600' : 'text-yellow-600'}`} />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uploaded</span>
                    <span className="text-sm text-gray-900">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {doc.expirationDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Expires</span>
                      <span className="text-sm text-gray-900">{new Date(doc.expirationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">By {doc.uploadedBy}</span>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                      <Download className="h-3 w-3" />
                      <span className="text-xs">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
          <p className="text-gray-600">Upload compliance documents to complete your profile.</p>
        </div>
      )}
    </div>
  );

  const renderTradeReferences = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Trade Reference</h3>
        {isEditable && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Reference</span>
          </button>
        )}
      </div>

      {company.tradeReferences.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Company Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit or A/R Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit or A/R Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account #</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {company.tradeReferences.map((ref) => (
                  <tr key={ref.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ref.supplierCompanyName}</div>
                      {ref.relationshipYears && (
                        <div className="text-sm text-gray-500">{ref.relationshipYears} years relationship</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`mailto:${ref.creditContactEmail}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        {ref.creditContactEmail}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a href={`tel:${ref.creditContactPhone}`}>{ref.creditContactPhone}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{ref.accountNumber}</div>
                      {ref.creditLimit && (
                        <div className="text-sm text-gray-500">Limit: ${ref.creditLimit.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trade references</h3>
          <p className="text-gray-600">Add trade references to establish business credibility.</p>
        </div>
      )}
    </div>
  );

  const renderWarehouses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search warehouses by name ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {isEditable && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
            <span>Assign Warehouse</span>
          </button>
        )}
      </div>

      {company.warehouses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {company.warehouses
            .filter(warehouse => 
              warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              warehouse.address.city.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((warehouse) => (
              <div key={warehouse.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Warehouse className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{warehouse.name}</h4>
                      <div className="flex items-center space-x-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-sm text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-900">
                      <div>{warehouse.address.street}</div>
                      <div className="text-gray-600">
                        {warehouse.address.city}, {warehouse.address.state} {warehouse.address.zipCode}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <span className="text-gray-900 font-medium">{warehouse.contactPerson}</span>
                      <div className="text-gray-600">
                        <a href={`tel:${warehouse.contactPhone}`} className="hover:text-blue-600">
                          {warehouse.contactPhone}
                        </a>
                        {' • '}
                        <a href={`mailto:${warehouse.contactEmail}`} className="hover:text-blue-600">
                          {warehouse.contactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {warehouse.capacity && (
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        Capacity: {warehouse.capacity.toLocaleString()} sq ft
                      </span>
                    </div>
                  )}
                  
                  {warehouse.specialFeatures && warehouse.specialFeatures.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {warehouse.specialFeatures.map((feature, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Assigned {new Date(warehouse.assignedAt).toLocaleDateString()}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Warehouse className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses found</h3>
          <p className="text-gray-600 mb-6">No warehouses match your current search and filter criteria.</p>
          {isEditable && (
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
              <Plus className="h-4 w-4" />
              <span>Assign First Warehouse</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return renderBusinessDetails();
      case 'representatives':
        return renderRepresentatives();
      case 'documents':
        return renderDocuments();
      case 'trade-references':
        return renderTradeReferences();
      case 'warehouses':
        return renderWarehouses();
      default:
        return renderBusinessDetails();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          {isEditable && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Edit
            </button>
          )}
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(company.status)}`}>
            {company.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-xl">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 min-h-screen -mx-4 px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CompanyDetailsView;