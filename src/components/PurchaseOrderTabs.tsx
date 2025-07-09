import React, { useState, useMemo } from 'react';
import { EnhancedPurchaseOrder, OrderType, ProductVariant, DeliveryInfo, ProductDelivery } from '../types';
import DeliveryChainManager from './DeliveryChainManager';
import ProductReceptionManager from './ProductReceptionManager';
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

const tabs = [
  { id: 'general', name: 'General Information', icon: Info },
  { id: 'products', name: 'Products & Variants', icon: Package },
  { id: 'suppliers', name: 'Suppliers & Sourcing', icon: Users },
  { id: 'delivery', name: 'Delivery Chains', icon: Truck },
  { id: 'reception', name: 'Recepción de Productos', icon: Warehouse }
];

// Mock system products for search
const mockSystemProducts = [
  { id: 'sys-001', name: 'Dell XPS 13 Laptop', price: 1299.99, sku: 'DELL-XPS13', supplier: 'Dell Technologies' },
  { id: 'sys-002', name: 'Logitech MX Master 3', price: 99.99, sku: 'LOGI-MX3', supplier: 'Logitech' },
  { id: 'sys-003', name: 'Samsung 27" Monitor', price: 449.99, sku: 'SAMS-27', supplier: 'Samsung' },
  { id: 'sys-004', name: 'Office Chair Ergonomic', price: 299.99, sku: 'CHAIR-ERG', supplier: 'Herman Miller' },
  { id: 'sys-005', name: 'Standing Desk Electric', price: 499.99, sku: 'DESK-STAND', supplier: 'Uplift Desk' }
];

const PurchaseOrderTabs: React.FC<PurchaseOrderTabsProps> = ({ 
  order, 
  onOrderUpdate, 
  isEditable = false 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return mockSystemProducts;
    return mockSystemProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddProduct = (product: any) => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 1,
      specifications: {},
      supplier: product.supplier
    };

    onOrderUpdate({
      productVariants: [...(order.productVariants || []), newVariant]
    });
  };

  const handleUpdateVariant = (variantId: string, updates: Partial<ProductVariant>) => {
    const updatedVariants = order.productVariants?.map(variant =>
      variant.id === variantId ? { ...variant, ...updates } : variant
    ) || [];

    onOrderUpdate({ productVariants: updatedVariants });
  };

  const handleRemoveVariant = (variantId: string) => {
    const updatedVariants = order.productVariants?.filter(variant => variant.id !== variantId) || [];
    onOrderUpdate({ productVariants: updatedVariants });
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="font-mono text-sm">{order.orderNumber}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="capitalize">{order.type}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <span className="text-lg font-semibold text-green-600">
                ${order.totalAmount?.toLocaleString() || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
            <div className="p-3 bg-gray-50 rounded-md border">
              {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'TBD'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="space-y-6">
      {isEditable && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add Products</h3>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            <div className="grid gap-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">SKU: {product.sku} • ${product.price}</div>
                    <div className="text-xs text-gray-400">{product.supplier}</div>
                  </div>
                  <button
                    onClick={() => handleAddProduct(product)}
                    className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Selected Products</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {order.productVariants?.length || 0}
          </span>
        </div>
        
        {!order.productVariants?.length ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No products added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {order.productVariants.map((variant) => (
              <div key={variant.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{variant.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      SKU: {variant.sku} • Supplier: {variant.supplier}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Quantity:</label>
                        {isEditable && editingProduct === variant.id ? (
                          <input
                            type="number"
                            value={variant.quantity}
                            onChange={(e) => handleUpdateVariant(variant.id, { quantity: parseInt(e.target.value) || 1 })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="1"
                          />
                        ) : (
                          <span className="text-sm">{variant.quantity}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Price:</label>
                        <span className="text-sm font-semibold text-green-600">
                          ${(variant.price * variant.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {isEditable && (
                    <div className="flex items-center gap-2 ml-4">
                      {editingProduct === variant.id ? (
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingProduct(variant.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveVariant(variant.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSuppliersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Supplier Information</h3>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Supplier management coming soon</p>
        </div>
      </div>
    </div>
  );

  const renderDeliveryTab = () => (
    <div className="space-y-6">
      <DeliveryChainManager
        deliveryChains={order.deliveryChains || []}
        availableProducts={order.productVariants || []}
        onAddChain={(newChain) => {
          const updatedChains = [...(order.deliveryChains || []), newChain];
          onOrderUpdate({ deliveryChains: updatedChains });
        }}
        onUpdateChain={(chainId, updates) => {
          const updatedChains = order.deliveryChains?.map(chain =>
            chain.id === chainId ? { ...chain, ...updates } : chain
          ) || [];
          onOrderUpdate({ deliveryChains: updatedChains });
        }}
        onDeleteChain={(chainId) => {
          const updatedChains = order.deliveryChains?.filter(chain => chain.id !== chainId) || [];
          onOrderUpdate({ deliveryChains: updatedChains });
        }}
        isEditable={isEditable}
      />
    </div>
  );

  const renderReceptionTab = () => (
    <div className="space-y-6">
      <ProductReceptionManager
        receptions={order.productReceptions || []}
        deliveries={order.deliveries || []}
        onAddReception={(newReception) => {
          const updatedReceptions = [...(order.productReceptions || []), {
            ...newReception,
            id: `reception-${Date.now()}`,
            createdAt: new Date().toISOString()
          }];
          onOrderUpdate({ productReceptions: updatedReceptions });
        }}
        onUpdateReception={(receptionId, updates) => {
          const updatedReceptions = order.productReceptions?.map(reception =>
            reception.id === receptionId ? { ...reception, ...updates } : reception
          ) || [];
          onOrderUpdate({ productReceptions: updatedReceptions });
        }}
        onDeleteReception={(receptionId) => {
          const updatedReceptions = order.productReceptions?.filter(reception => 
            reception.id !== receptionId
          ) || [];
          onOrderUpdate({ productReceptions: updatedReceptions });
        }}
        isEditable={isEditable}
      />
    </div>
  );
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'products':
        return renderProductsTab();
      case 'suppliers':
        return renderSuppliersTab();
      case 'delivery':
        return renderDeliveryTab();
      case 'reception':
        return renderReceptionTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
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
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PurchaseOrderTabs;