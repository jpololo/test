import React, { useState } from 'react';
import { EnhancedPurchaseOrder, OrderType } from '../types';
import { 
  FileText, 
  Package, 
  Users, 
  Truck, 
  Warehouse, 
  DollarSign,
  Info,
  ShoppingCart,
  Building,
  MapPin,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

interface PurchaseOrderTabsProps {
  order: EnhancedPurchaseOrder;
  onOrderUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable?: boolean;
}

const PurchaseOrderTabs: React.FC<PurchaseOrderTabsProps> = ({
  order,
  onOrderUpdate,
  isEditable = false
}) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs: Tab[] = [
    { 
      id: 'general', 
      label: 'General Information', 
      icon: Info 
    },
    { 
      id: 'products', 
      label: 'Products & Variants', 
      icon: Package,
      badge: order.variants.length
    },
    { 
      id: 'suppliers', 
      label: 'Suppliers & Sourcing', 
      icon: Users,
      badge: order.suppliers.length
    },
    { 
      id: 'delivery', 
      label: 'Delivery & Logistics', 
      icon: Truck 
    },
    { 
      id: 'warehouse', 
      label: 'Warehouse Fulfillment', 
      icon: Warehouse,
      badge: order.receivedItems.length
    },
    { 
      id: 'financial', 
      label: 'Financial Summary', 
      icon: DollarSign 
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      ordered: 'bg-purple-100 text-purple-800',
      partially_received: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: OrderType) => {
    const colors = {
      quote: 'bg-blue-50 text-blue-700 border-blue-200',
      inventory: 'bg-green-50 text-green-700 border-green-200',
      manual: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralInformationTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      case 'products':
        return <ProductsVariantsTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      case 'suppliers':
        return <SuppliersTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      case 'delivery':
        return <DeliveryTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      case 'warehouse':
        return <WarehouseTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      case 'financial':
        return <FinancialTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Created {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(order.type)}`}>
              {order.type.charAt(0).toUpperCase() + order.type.slice(1)} Order
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Products</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{order.variants.length}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Suppliers</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{order.suppliers.length}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Warehouse className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Received</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{order.receivedItems.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`
                    inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                    ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Tab Components
const GeneralInformationTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <input
              type="text"
              value={order.orderNumber}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
            <select
              value={order.type}
              disabled={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <option value="quote">Quote Order</option>
              <option value="inventory">Inventory Order</option>
              <option value="manual">Manual Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={order.status}
              disabled={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="partially_received">Partially Received</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Source Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Source Information</h3>
          
          {order.sourceId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source ID</label>
              <input
                type="text"
                value={order.sourceId}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
              />
            </div>
          )}

          {order.quoteId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quote ID</label>
              <input
                type="text"
                value={order.quoteId}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
            <input
              type="text"
              value={order.createdBy}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Notes & Comments</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Public Notes</label>
          <textarea
            value={order.notes || ''}
            readOnly={!isEditable}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg resize-none ${
              isEditable 
                ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
            placeholder="Add public notes visible to suppliers and clients..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
          <textarea
            value={order.internalNotes || ''}
            readOnly={!isEditable}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg resize-none ${
              isEditable 
                ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
            placeholder="Add internal notes for team use only..."
          />
        </div>
      </div>

      {/* Approvals Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Approvals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Internal Approval</h4>
            {order.approvals.internalApprovedBy ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Approved</span>
                </div>
                <p className="text-sm text-gray-600">By: {order.approvals.internalApprovedBy}</p>
                {order.approvals.internalApprovedAt && (
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.approvals.internalApprovedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Pending internal approval</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">External Approval</h4>
            {order.approvals.externalApprovedBy ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Approved</span>
                </div>
                <p className="text-sm text-gray-600">By: {order.approvals.externalApprovedBy}</p>
                {order.approvals.externalApprovedAt && (
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.approvals.externalApprovedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Pending external approval</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsVariantsTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Products & Variants</h3>
        {isEditable && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Add Product
          </button>
        )}
      </div>

      <div className="space-y-4">
        {order.variants.map((variant, index) => (
          <div key={variant.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{variant.name}</h4>
                {variant.description && (
                  <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
                )}
                {variant.sku && (
                  <p className="text-sm text-gray-500 mt-1">SKU: {variant.sku}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${variant.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-600">${variant.basePrice.toFixed(2)} × {variant.quantity}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={variant.quantity}
                  readOnly={!isEditable}
                  className={`w-full px-3 py-2 text-sm border rounded-md ${
                    isEditable 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={variant.basePrice}
                  readOnly={!isEditable}
                  className={`w-full px-3 py-2 text-sm border rounded-md ${
                    isEditable 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                <input
                  type="text"
                  value={`$${variant.totalPrice.toFixed(2)}`}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-600 rounded-md"
                />
              </div>
            </div>

            {variant.specifications && Object.keys(variant.specifications).length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Specifications</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(variant.specifications).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-600">{key}:</span>
                      <span className="ml-1 text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {order.variants.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products added</h3>
          <p className="text-gray-600">Add products to this purchase order to get started.</p>
        </div>
      )}
    </div>
  );
};

const SuppliersTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Suppliers & Sourcing</h3>
        {isEditable && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Add Supplier
          </button>
        )}
      </div>

      <div className="space-y-6">
        {order.suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{supplier.name}</h4>
                {supplier.contactEmail && (
                  <p className="text-sm text-gray-600">{supplier.contactEmail}</p>
                )}
                {supplier.contactPhone && (
                  <p className="text-sm text-gray-600">{supplier.contactPhone}</p>
                )}
              </div>
              <div className="text-right">
                {supplier.paymentTerms && (
                  <p className="text-sm text-gray-600">Terms: {supplier.paymentTerms}</p>
                )}
                {supplier.leadTime && (
                  <p className="text-sm text-gray-600">Lead Time: {supplier.leadTime} days</p>
                )}
              </div>
            </div>

            {/* Products from this supplier */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">Products</h5>
              {order.variantSupplierRelations
                .filter(relation => relation.supplierId === supplier.id)
                .map((relation) => {
                  const variant = order.variants.find(v => v.id === relation.variantId);
                  if (!variant) return null;

                  return (
                    <div key={relation.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{variant.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {relation.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${relation.quotedPrice.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">per unit</p>
                        </div>
                      </div>
                      {relation.notes && (
                        <p className="text-sm text-gray-600 mt-2">{relation.notes}</p>
                      )}
                    </div>
                  );
                })}
            </div>

            {supplier.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{supplier.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {order.suppliers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers added</h3>
          <p className="text-gray-600">Add suppliers to manage sourcing for this order.</p>
        </div>
      )}
    </div>
  );
};

const DeliveryTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  const getDeliveryStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Delivery & Logistics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Delivery Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
            <select
              value={order.deliveryInfo.status}
              disabled={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Delivery Date</label>
            <input
              type="date"
              value={order.deliveryInfo.estimatedDate || ''}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Delivery Date</label>
            <input
              type="date"
              value={order.deliveryInfo.actualDate || ''}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
            <input
              type="text"
              value={order.deliveryInfo.trackingNumber || ''}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg font-mono ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Company</label>
            <input
              type="text"
              value={order.deliveryInfo.deliveryCompany || ''}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            />
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Delivery Address</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={order.deliveryInfo.deliveryAddress.street}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border rounded-lg ${
                isEditable 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={order.deliveryInfo.deliveryAddress.city}
                readOnly={!isEditable}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditable 
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={order.deliveryInfo.deliveryAddress.state}
                readOnly={!isEditable}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditable 
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={order.deliveryInfo.deliveryAddress.zipCode}
                readOnly={!isEditable}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditable 
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={order.deliveryInfo.deliveryAddress.country}
                readOnly={!isEditable}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditable 
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
        <textarea
          value={order.deliveryInfo.specialInstructions || ''}
          readOnly={!isEditable}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg resize-none ${
            isEditable 
              ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
              : 'border-gray-200 bg-gray-50 text-gray-600'
          }`}
          placeholder="Add any special delivery instructions..."
        />
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Current Status:</span>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDeliveryStatusColor(order.deliveryInfo.status)}`}>
          {order.deliveryInfo.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>
    </div>
  );
};

const WarehouseTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  const getConditionColor = (condition: string) => {
    const colors = {
      good: 'bg-green-100 text-green-800',
      damaged: 'bg-yellow-100 text-yellow-800',
      defective: 'bg-red-100 text-red-800'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Warehouse Fulfillment</h3>
        {isEditable && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Record Receipt
          </button>
        )}
      </div>

      {/* Received Items */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Received Items</h4>
        
        {order.receivedItems.length > 0 ? (
          <div className="space-y-3">
            {order.receivedItems.map((item) => {
              const variant = order.variants.find(v => v.id === item.variantId);
              if (!variant) return null;

              return (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{variant.name}</h5>
                      <p className="text-sm text-gray-600">Received by: {item.receivedBy}</p>
                      <p className="text-sm text-gray-600">Date: {new Date(item.receivedDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Expected:</span>
                      <span className="ml-2 font-medium text-gray-900">{item.quantityExpected}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Received:</span>
                      <span className="ml-2 font-medium text-gray-900">{item.quantityReceived}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">{item.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Warehouse className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No items received yet</p>
          </div>
        )}
      </div>

      {/* Warehouse Allocations */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Warehouse Allocations</h4>
        
        {order.warehouseAllocations.length > 0 ? (
          <div className="space-y-3">
            {order.warehouseAllocations.map((allocation) => {
              const variant = order.variants.find(v => v.id === allocation.variantId);
              if (!variant) return null;

              return (
                <div key={allocation.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{variant.name}</h5>
                      {allocation.warehouseLocation && (
                        <p className="text-sm text-gray-600">Location: {allocation.warehouseLocation}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-600 font-medium">For Client</p>
                      <p className="text-lg font-semibold text-blue-900">{allocation.quantityForClient}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-green-600 font-medium">For Warehouse</p>
                      <p className="text-lg font-semibold text-green-900">{allocation.quantityForWarehouse}</p>
                    </div>
                  </div>

                  {allocation.allocationNotes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">{allocation.allocationNotes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No warehouse allocations set</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3">Fulfillment Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-900">{order.variants.length}</p>
            <p className="text-sm text-blue-700">Total Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900">{order.receivedItems.length}</p>
            <p className="text-sm text-blue-700">Items Received</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900">{order.warehouseAllocations.length}</p>
            <p className="text-sm text-blue-700">Allocations Set</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancialTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>

      {/* Cost Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Cost Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Freight:</span>
            <span className="font-medium text-gray-900">${order.freight.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Taxes:</span>
            <span className="font-medium text-gray-900">${order.taxes.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Costs */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Costs by Supplier</h4>
        
        {order.suppliers.map((supplier) => {
          const supplierRelations = order.variantSupplierRelations.filter(
            relation => relation.supplierId === supplier.id
          );
          const supplierTotal = supplierRelations.reduce(
            (sum, relation) => sum + (relation.quotedPrice * relation.quantity), 0
          );

          return (
            <div key={supplier.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">{supplier.name}</h5>
                <span className="text-lg font-semibold text-gray-900">${supplierTotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                {supplierRelations.map((relation) => {
                  const variant = order.variants.find(v => v.id === relation.variantId);
                  if (!variant) return null;

                  return (
                    <div key={relation.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{variant.name} × {relation.quantity}</span>
                      <span className="text-gray-900">${(relation.quotedPrice * relation.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Costs */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Costs by Product</h4>
        
        <div className="space-y-3">
          {order.variants.map((variant) => (
            <div key={variant.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">{variant.name}</h5>
                  <p className="text-sm text-gray-600">${variant.basePrice.toFixed(2)} × {variant.quantity}</p>
                </div>
                <span className="text-lg font-semibold text-gray-900">${variant.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Average Unit Cost</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            ${order.variants.length > 0 ? (order.subtotal / order.variants.reduce((sum, v) => sum + v.quantity, 0)).toFixed(2) : '0.00'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Total Units</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {order.variants.reduce((sum, variant) => sum + variant.quantity, 0)}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-900">Suppliers</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{order.suppliers.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderTabs;