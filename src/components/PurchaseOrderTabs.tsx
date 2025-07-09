import React, { useState, useMemo } from 'react';
import { EnhancedPurchaseOrder, OrderType, ProductVariant, DeliveryInfo, ProductDelivery } from '../types';
import DeliveryChainManager from './DeliveryChainManager';
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
  CheckCircle,
  Plus,
  X,
  Search,
  Edit,
  Save,
  Trash2
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
    { id: 'delivery', name: 'Delivery Chains', icon: Truck },
// Mock system products for search
const mockSystemProducts = [
  { id: 'sys-001', name: 'Dell XPS 13 Laptop', price: 1299.99, sku: 'DELL-XPS13', supplier: 'Dell Technologies' },
  { id: 'sys-002', name: 'Logitech MX Master 3', price: 99.99, sku: 'LOGI-MX3', supplier: 'Logitech' },
  { id: 'sys-003', name: 'Samsung 27" Monitor', price: 449.99, sku: 'SAMS-27', supplier: 'Samsung' },
  { id: 'sys-004', name: 'Office Chair Ergonomic', price: 299.99, sku: 'CHAIR-ERG', supplier: 'Herman Miller' },
  { id: 'sys-005', name: 'Standing Desk Electric', price: 499.99, sku: 'DESK-STAND', supplier: 'Uplift Desk' },
];

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
      icon: Truck,
      badge: order.deliveries?.length || 0
    },
    { 
      id: 'receiving', 
      label: 'Warehouse Receiving', 
      icon: Warehouse,
      badge: order.receivedItems.length
    },
    { 
      id: 'fulfillment', 
      label: 'Warehouse Fulfillment', 
      icon: ShoppingCart,
      badge: order.warehouseAllocations.length
    },
    { 
      id: 'financial', 
      label: 'Financial Summary', 
      icon: DollarSign 
    }
  ];

  const handleDeliveryChainAdd = (chain: any) => {
    const newChain = {
      ...chain,
      id: `chain-${Date.now()}`
    };
    
    onOrderUpdate({
      deliveryChains: [...(order.deliveryChains || []), newChain]
    });
  };

  const handleDeliveryChainUpdate = (chainId: string, updates: any) => {
    onOrderUpdate({
      deliveryChains: order.deliveryChains?.map(chain =>
        chain.id === chainId ? { ...chain, ...updates } : chain
      ) || []
    });
  };

  const handleDeliveryChainDelete = (chainId: string) => {
    onOrderUpdate({
      deliveryChains: order.deliveryChains?.filter(chain => chain.id !== chainId) || []
    });
  };

  // Get available products for delivery chains
  const availableProducts = order.variants.map(variant => ({
    id: variant.id,
    name: variant.name,
    totalQuantity: variant.quantity
  }));

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
      case 'receiving':
        return <ReceivingTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
      case 'fulfillment':
        return <FulfillmentTab order={order} onUpdate={onOrderUpdate} isEditable={isEditable} />;
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
              <Truck className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Deliveries</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{order.deliveries?.length || 0}</p>
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
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystemProduct, setSelectedSystemProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    description: '',
    costPrice: 0,
    salePrice: 0,
    quantity: 1,
    isCustom: false,
    source: 'supplier' // 'supplier' or 'warehouse'
  });

  const filteredSystemProducts = useMemo(() => {
    return mockSystemProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddProduct = () => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: selectedSystemProduct?.id || `custom-${Date.now()}`,
      name: productForm.name,
      sku: productForm.sku,
      description: productForm.description,
      basePrice: productForm.costPrice,
      salePrice: productForm.salePrice,
      quantity: productForm.quantity,
      totalPrice: productForm.costPrice * productForm.quantity,
      isCustom: productForm.isCustom
    };

    onUpdate({
      variants: [...order.variants, newVariant]
    });

    // Reset form
    setProductForm({
      name: '',
      sku: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      quantity: 1,
      isCustom: false,
      source: 'supplier'
    });
    setSelectedSystemProduct(null);
    setSearchTerm('');
    setShowAddProduct(false);
  };

  const handleSystemProductSelect = (product: any) => {
    setSelectedSystemProduct(product);
    setProductForm(prev => ({
      ...prev,
      name: product.name,
      sku: product.sku,
      costPrice: product.price,
      salePrice: product.price * 1.3, // 30% markup as default
      isCustom: false
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Products & Variants</h3>
        {isEditable && (
          <button 
            onClick={() => setShowAddProduct(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Add Product Form */}
      {showAddProduct && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-blue-900">Add New Product</h4>
            <button
              onClick={() => setShowAddProduct(false)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Product Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">Search System Products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for existing products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            
            {searchTerm && filteredSystemProducts.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                {filteredSystemProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSystemProductSelect(product)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600">SKU: {product.sku} | ${product.price} | {product.supplier}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Product Name *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">SKU</label>
              <input
                type="text"
                value={productForm.sku}
                onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Enter SKU (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900 mb-1">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Cost Price *</label>
              <input
                type="number"
                step="0.01"
                value={productForm.costPrice}
                onChange={(e) => setProductForm(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Sale Price *</label>
              <input
                type="number"
                step="0.01"
                value={productForm.salePrice}
                onChange={(e) => setProductForm(prev => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                value={productForm.quantity}
                onChange={(e) => setProductForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Source Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">Product Source</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setProductForm(prev => ({ ...prev, source: 'supplier' }))}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  productForm.source === 'supplier'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Users className="h-6 w-6 mx-auto mb-1" />
                <div className="font-medium">From Supplier</div>
                <div className="text-xs">Order from external supplier</div>
              </button>
              <button
                onClick={() => setProductForm(prev => ({ ...prev, source: 'warehouse' }))}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  productForm.source === 'warehouse'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Warehouse className="h-6 w-6 mx-auto mb-1" />
                <div className="font-medium">From Warehouse</div>
                <div className="text-xs">Use existing warehouse stock</div>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={productForm.isCustom}
                onChange={(e) => setProductForm(prev => ({ ...prev, isCustom: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-blue-900">This is a custom product (not in system inventory)</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddProduct}
              disabled={!productForm.name || productForm.costPrice <= 0 || productForm.salePrice <= 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Package className="h-4 w-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setShowAddProduct(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-4">
        {order.variants.map((variant, index) => (
          <div key={variant.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900">{variant.name}</h4>
                  {variant.isCustom && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Custom
                    </span>
                  )}
                </div>
                {variant.description && (
                  <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
                )}
                {variant.sku && (
                  <p className="text-sm text-gray-500 mt-1">SKU: {variant.sku}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">${variant.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  Cost: ${variant.basePrice.toFixed(2)} × {variant.quantity}
                </p>
                {variant.salePrice && (
                  <p className="text-sm text-green-600">
                    Sale: ${variant.salePrice.toFixed(2)} × {variant.quantity} = ${(variant.salePrice * variant.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={variant.salePrice || 0}
                  readOnly={!isEditable}
                  className={`w-full px-3 py-2 text-sm border rounded-md ${
                    isEditable 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profit Margin</label>
                <input
                  type="text"
                  value={variant.salePrice ? `${(((variant.salePrice - variant.basePrice) / variant.basePrice) * 100).toFixed(1)}%` : 'N/A'}
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
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryLocation: '',
    estimatedDate: '',
    trackingNumber: '',
    deliveryCompany: '',
    specialInstructions: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    productDeliveries: [] as { variantId: string; quantity: number; deliveryNotes: string }[]
  });

  const getDeliveryStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddDelivery = () => {
    const newDelivery: DeliveryInfo = {
      id: `del-${Date.now()}`,
      estimatedDate: deliveryForm.estimatedDate,
      trackingNumber: deliveryForm.trackingNumber,
      deliveryCompany: deliveryForm.deliveryCompany,
      deliveryLocation: deliveryForm.deliveryLocation,
      deliveryAddress: deliveryForm.deliveryAddress,
      specialInstructions: deliveryForm.specialInstructions,
      status: 'pending',
      productDeliveries: deliveryForm.productDeliveries.map(pd => ({
        id: `pd-${Date.now()}-${pd.variantId}`,
        variantId: pd.variantId,
        quantity: pd.quantity,
        deliveryNotes: pd.deliveryNotes
      }))
    };

    onUpdate({
      deliveries: [...(order.deliveries || []), newDelivery]
    });

    // Reset form
    setDeliveryForm({
      deliveryLocation: '',
      estimatedDate: '',
      trackingNumber: '',
      deliveryCompany: '',
      specialInstructions: '',
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      productDeliveries: []
    });
    setShowAddDelivery(false);
  };

  const addProductToDelivery = () => {
    setDeliveryForm(prev => ({
      ...prev,
      productDeliveries: [...prev.productDeliveries, { variantId: '', quantity: 1, deliveryNotes: '' }]
    }));
  };

  const updateProductDelivery = (index: number, field: string, value: any) => {
    setDeliveryForm(prev => ({
      ...prev,
      productDeliveries: prev.productDeliveries.map((pd, i) => 
        i === index ? { ...pd, [field]: value } : pd
      )
    }));
  };

  const removeProductDelivery = (index: number) => {
    setDeliveryForm(prev => ({
      ...prev,
      productDeliveries: prev.productDeliveries.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Delivery & Logistics</h3>
        {isEditable && (
          <button 
            onClick={() => setShowAddDelivery(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Delivery</span>
          </button>
        )}
      </div>

      {/* Add Delivery Form */}
      {showAddDelivery && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-blue-900">Create New Delivery</h4>
            <button
              onClick={() => setShowAddDelivery(false)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Basic Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Delivery Location *</label>
              <select
                value={deliveryForm.deliveryLocation}
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryLocation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <option value="">Select delivery location...</option>
                <option value="Project Site 1">Project Site 1</option>
                <option value="Project Site 2">Project Site 2</option>
                <option value="Our Warehouse">Our Warehouse</option>
                <option value="Client Office">Client Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Estimated Date *</label>
              <input
                type="date"
                value={deliveryForm.estimatedDate}
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, estimatedDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Tracking Number</label>
              <input
                type="text"
                value={deliveryForm.trackingNumber}
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                placeholder="Enter tracking number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Delivery Company</label>
              <input
                type="text"
                value={deliveryForm.deliveryCompany}
                onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryCompany: e.target.value }))}
                placeholder="e.g., FedEx, UPS, DHL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-blue-900 mb-2">Delivery Address</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={deliveryForm.deliveryAddress.street}
                  onChange={(e) => setDeliveryForm(prev => ({ 
                    ...prev, 
                    deliveryAddress: { ...prev.deliveryAddress, street: e.target.value }
                  }))}
                  placeholder="Street Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={deliveryForm.deliveryAddress.city}
                  onChange={(e) => setDeliveryForm(prev => ({ 
                    ...prev, 
                    deliveryAddress: { ...prev.deliveryAddress, city: e.target.value }
                  }))}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          <DeliveryChainManager
            deliveryChains={order.deliveryChains || []}
            onAddChain={handleDeliveryChainAdd}
            onUpdateChain={handleDeliveryChainUpdate}
            onDeleteChain={handleDeliveryChainDelete}
            availableProducts={availableProducts}
            isEditable={isEditable}
          />

          {/* Products for this delivery */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-blue-900">Products for this Delivery</h5>
              <button
                onClick={addProductToDelivery}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
            
            {deliveryForm.productDeliveries.map((productDelivery, index) => (
              <div key={index} className="flex items-center space-x-3 mb-2 p-3 bg-white rounded border">
                <select
                  value={productDelivery.variantId}
                  onChange={(e) => updateProductDelivery(index, 'variantId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="">Select product...</option>
                  {order.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={productDelivery.quantity}
                  onChange={(e) => updateProductDelivery(index, 'quantity', parseInt(e.target.value) || 1)}
                  placeholder="Qty"
                  className="w-20 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <input
                  type="text"
                  value={productDelivery.deliveryNotes}
                  onChange={(e) => updateProductDelivery(index, 'deliveryNotes', e.target.value)}
                  placeholder="Notes (optional)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <button
                  onClick={() => removeProductDelivery(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-900 mb-1">Special Instructions</label>
            <textarea
              value={deliveryForm.specialInstructions}
              onChange={(e) => setDeliveryForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Add any special delivery instructions..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddDelivery}
              disabled={!deliveryForm.deliveryLocation || !deliveryForm.estimatedDate || deliveryForm.productDeliveries.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Truck className="h-4 w-4" />
              <span>Create Delivery</span>
            </button>
            <button
              onClick={() => setShowAddDelivery(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing Deliveries */}
      <div className="space-y-4">
        {order.deliveries?.map((delivery, index) => (
          <div key={delivery.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Delivery #{index + 1} - {delivery.deliveryLocation}
                </h4>
                <p className="text-sm text-gray-600">{delivery.deliveryAddress.street}</p>
                <p className="text-sm text-gray-600">
                  {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state} {delivery.deliveryAddress.zipCode}
                </p>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDeliveryStatusColor(delivery.status)}`}>
                {delivery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>

            {/* Products in this delivery */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Products</h5>
              {delivery.productDeliveries?.map((productDelivery) => {
                const variant = order.variants.find(v => v.id === productDelivery.variantId);
                if (!variant) return null;

                return (
                  <div key={productDelivery.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{variant.name}</span>
                      {productDelivery.deliveryNotes && (
                        <span className="text-sm text-gray-600 ml-2">- {productDelivery.deliveryNotes}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">Qty: {productDelivery.quantity}</span>
                  </div>
                );
              })}
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Estimated Date:</span>
                <p className="font-medium text-gray-900">
                  {delivery.estimatedDate ? new Date(delivery.estimatedDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              {delivery.trackingNumber && (
                <div>
                  <span className="text-sm text-gray-600">Tracking Number:</span>
                  <p className="font-medium text-gray-900 font-mono">{delivery.trackingNumber}</p>
                </div>
              )}
              {delivery.deliveryCompany && (
                <div>
                  <span className="text-sm text-gray-600">Delivery Company:</span>
                  <p className="font-medium text-gray-900">{delivery.deliveryCompany}</p>
                </div>
              )}
            </div>

            {delivery.specialInstructions && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <span className="text-sm font-medium text-blue-900">Special Instructions:</span>
                <p className="text-sm text-blue-800 mt-1">{delivery.specialInstructions}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {(!order.deliveries || order.deliveries.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries scheduled</h3>
          <p className="text-gray-600">Create delivery schedules to manage product distribution.</p>
        </div>
      )}
    </div>
  );
};

const ReceivingTab: React.FC<{
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

  // Only show deliveries to warehouse
  const warehouseDeliveries = order.deliveries?.filter(d => d.deliveryLocation === 'Our Warehouse') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Warehouse Receiving</h3>
        {isEditable && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Record Receipt
          </button>
        )}
      </div>

      {/* Expected Deliveries to Warehouse */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Expected Warehouse Deliveries</h4>
        
        {warehouseDeliveries.length > 0 ? (
          <div className="space-y-3">
            {warehouseDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-blue-900">Delivery to Warehouse</h5>
                    <p className="text-sm text-blue-700">
                      Expected: {delivery.estimatedDate ? new Date(delivery.estimatedDate).toLocaleDateString() : 'TBD'}
                    </p>
                    {delivery.trackingNumber && (
                      <p className="text-sm text-blue-700 font-mono">Tracking: {delivery.trackingNumber}</p>
                    )}
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <div className="space-y-2">
                  {delivery.productDeliveries?.map((productDelivery) => {
                    const variant = order.variants.find(v => v.id === productDelivery.variantId);
                    if (!variant) return null;

                    return (
                      <div key={productDelivery.id} className="flex items-center justify-between py-2 px-3 bg-white rounded">
                        <span className="font-medium text-gray-900">{variant.name}</span>
                        <span className="text-sm text-gray-600">Expected: {productDelivery.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Warehouse className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No deliveries scheduled for warehouse</p>
          </div>
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
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No items received yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FulfillmentTab: React.FC<{
  order: EnhancedPurchaseOrder;
  onUpdate: (updates: Partial<EnhancedPurchaseOrder>) => void;
  isEditable: boolean;
}> = ({ order, onUpdate, isEditable }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Warehouse Fulfillment</h3>
        {isEditable && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Set Allocation
          </button>
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
  const totalCost = order.variants.reduce((sum, variant) => sum + (variant.basePrice * variant.quantity), 0);
  const totalRevenue = order.variants.reduce((sum, variant) => sum + ((variant.salePrice || 0) * variant.quantity), 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total Cost</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">${totalCost.toFixed(2)}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-900">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-900">Total Profit</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">${totalProfit.toFixed(2)}</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-900">Profit Margin</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{profitMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Cost Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal (Cost):</span>
            <span className="font-medium text-gray-900">${totalCost.toFixed(2)}</span>
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

      {/* Product Financial Details */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Product Financial Details</h4>
        
        <div className="space-y-3">
          {order.variants.map((variant) => {
            const productCost = variant.basePrice * variant.quantity;
            const productRevenue = (variant.salePrice || 0) * variant.quantity;
            const productProfit = productRevenue - productCost;
            const productMargin = productRevenue > 0 ? (productProfit / productRevenue) * 100 : 0;

            return (
              <div key={variant.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{variant.name}</h5>
                  <span className="text-sm text-gray-600">Qty: {variant.quantity}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <p className="font-medium text-red-600">${productCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <p className="font-medium text-green-600">${productRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Profit:</span>
                    <p className="font-medium text-purple-600">${productProfit.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Margin:</span>
                    <p className="font-medium text-orange-600">{productMargin.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            );
          })}
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
    </div>
  );
};

export default PurchaseOrderTabs;