import React from 'react';
import { PurchaseOrder } from '../types';
import { X, Package, MapPin, CreditCard, Truck, Calendar, Download, FileText, User } from 'lucide-react';

interface OrderModalProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const handleExportPDF = () => {
    // Simulate PDF export
    alert('PDF export functionality would be implemented here');
  };

  // Get unique tracking numbers
  const uniqueTrackingNumbers = Array.from(new Set([
    order.trackingNumber,
    ...order.products.map(p => p.trackingNumber).filter(Boolean)
  ])).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">{order.orderNumber}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Created</span>
              </div>
              <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Type</span>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {order.type === 'quote' ? 'Quote Order' : 'Inventory Order'}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">Order Notes</h3>
              </div>
              <p className="text-blue-800 text-sm">{order.notes}</p>
            </div>
          )}

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
            <div className="space-y-4">
              {order.products.map((product) => (
                <div key={product.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Qty: <span className="font-medium text-gray-900">{product.quantity}</span></span>
                        <span>Unit Price: <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${(product.price * product.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Product-specific tracking and supplier info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                    {product.supplier && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Supplier:</span>
                        <span className="text-sm font-medium text-gray-900">{product.supplier}</span>
                      </div>
                    )}
                    {product.trackingNumber && (
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Tracking:</span>
                        <span className="text-sm font-mono text-blue-600">{product.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Tracking Numbers Summary */}
          {uniqueTrackingNumbers.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-medium text-purple-900">All Tracking Numbers</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {uniqueTrackingNumbers.map((trackingNumber, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded border border-purple-200">
                    <span className="text-sm font-mono text-purple-800">{trackingNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {order.shippingAddress && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{order.shippingAddress.street}</p>
                  <p className="text-gray-900">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-900">{order.shippingAddress.country}</p>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{order.billingAddress.street}</p>
                <p className="text-gray-900">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                </p>
                <p className="text-gray-900">{order.billingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${(order.totalAmount - order.freight).toFixed(2)}</span>
              </div>
              {order.freight > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Freight:</span>
                  <span className="text-gray-900">${order.freight.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;