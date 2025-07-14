import React, { useState } from 'react';
import { WarehousePurchaseOrder, WarehousePurchaseProduct, IncomingDelivery } from '../types';
import { 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Truck, 
  Calendar, 
  User, 
  MapPin, 
  Building, 
  FileText, 
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  Edit,
  Printer,
  DollarSign,
  Hash,
  Box
} from 'lucide-react';

interface WarehousePurchaseOrderViewProps {
  order: WarehousePurchaseOrder;
  onEdit?: () => void;
  onDownloadPDF?: () => void;
}

const WarehousePurchaseOrderView: React.FC<WarehousePurchaseOrderViewProps> = ({
  order,
  onEdit,
  onDownloadPDF
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'incoming' | 'slips'>('details');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set(['prod-001']));
  const [showAddIncoming, setShowAddIncoming] = useState(false);

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'partial': return AlertTriangle;
      default: return Clock;
    }
  };

  const renderOrderDetails = () => (
    <div className="space-y-8">
      {/* Order Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Purchase Order</h2>
            <p className="text-blue-600 font-medium">{order.orderNumber}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {React.createElement(getStatusIcon(order.status), { className: 'h-4 w-4 mr-1' })}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.subOrderNumber && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Sub-Order:</div>
                <div className="font-semibold text-gray-900">{order.subOrderNumber}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supplier and Order Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Supplier</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Company Name</div>
              <div className="font-medium text-gray-900">{order.supplier.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Address</div>
              <div className="text-gray-900">{order.supplier.address}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Order From</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Company</div>
              <div className="font-medium text-gray-900">{order.orderFrom.company}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Address</div>
              <div className="text-gray-900">{order.orderFrom.address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {order.products.length} items
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {order.products.map((product) => (
            <div key={product.id} className="transition-all duration-200">
              <div 
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleProductExpansion(product.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-2xl">{product.productImage}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                      {product.category && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Cost Price</div>
                      <div className="font-semibold text-gray-900">${product.costPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Quantity</div>
                      <div className="font-semibold text-gray-900">{product.quantity.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Taxes</div>
                      <div className="font-semibold text-gray-900">${product.taxes.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="font-bold text-green-600">${product.total.toLocaleString()}</div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {expandedProducts.has(product.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedProducts.has(product.id) && product.description && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-900">
                      <strong>Description:</strong> {product.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Taxes (included)</span>
            <span className="font-medium text-gray-900">${order.costSummary.taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">${order.costSummary.subtotal.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">${order.costSummary.shipping.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-green-600">${order.costSummary.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Resume order:</h4>
          <div className="text-sm text-gray-600 space-x-4">
            <span>Taxes (included): ${order.costSummary.taxes.toFixed(2)}</span>
            <span>Shipping: ${order.costSummary.shipping.toFixed(2)}</span>
            <span>Total items: {order.totalItems}</span>
            <span>Total cost: ${order.costSummary.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping price</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <span className="text-gray-900">${order.shippingPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Representative</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <span className="text-gray-900">{order.representative || 'Not assigned'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <span className="text-gray-900">{order.description || 'No description provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncomingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Truck className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Incoming Deliveries</h3>
        </div>
        <button
          onClick={() => setShowAddIncoming(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Incoming</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received By</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.incomingDeliveries?.map((delivery) => {
                const StatusIcon = getStatusIcon(delivery.status);
                return (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{delivery.productName}</div>
                      <div className="text-sm text-gray-500">ID: {delivery.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {delivery.receivedQuantity} of {delivery.expectedQuantity}
                      </div>
                      {delivery.status === 'partial' && (
                        <div className="text-sm text-yellow-600">
                          {delivery.expectedQuantity - delivery.receivedQuantity} pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(delivery.expectedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {delivery.receivedBy || 'Not received'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrderSlips = () => (
    <div className="space-y-6">
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-lg font-medium text-gray-900 mb-2">
          Drag and drop files here to upload purchase order documents
        </div>
        <button className="text-blue-600 hover:text-blue-800 underline">
          or click to select files
        </button>
      </div>

      {order.orderSlips && order.orderSlips.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {order.orderSlips.map((slip) => (
              <div key={slip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">{slip.fileName}</div>
                    <div className="text-sm text-gray-500">
                      {slip.fileSize} • Uploaded {new Date(slip.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-gray-500 mb-2">
            Purchase order &gt; {order.orderNumber}
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Order Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
          <button
            onClick={onDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-t-xl">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { id: 'details', name: 'ORDER DETAILS', icon: FileText },
            { id: 'incoming', name: 'INCOMING', icon: Truck },
            { id: 'slips', name: 'ORDER SLIPS', icon: Upload }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
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
        {activeTab === 'details' && renderOrderDetails()}
        {activeTab === 'incoming' && renderIncomingTab()}
        {activeTab === 'slips' && renderOrderSlips()}
      </div>
    </div>
  );
};

export default WarehousePurchaseOrderView;