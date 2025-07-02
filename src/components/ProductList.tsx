import React from 'react';
import { Product } from '../types';
import { Package, Truck } from 'lucide-react';
import { TrackingNumberEntry } from './TrackingNumberManager';

interface ProductListProps {
  products: Product[];
  title: string;
  editable?: boolean;
  onProductUpdate?: (productId: string, updates: Partial<Product>) => void;
  trackingNumbers?: TrackingNumberEntry[];
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  title, 
  editable = false, 
  onProductUpdate,
  trackingNumbers = []
}) => {
  const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  const handleTrackingChange = (productId: string, trackingNumberId: string) => {
    const selectedTracking = trackingNumbers.find(t => t.id === trackingNumberId);
    if (onProductUpdate && selectedTracking) {
      onProductUpdate(productId, { 
        trackingNumber: selectedTracking.trackingNumber,
        supplier: selectedTracking.supplier
      });
    }
  };

  const handleSupplierChange = (productId: string, supplier: string) => {
    if (onProductUpdate) {
      onProductUpdate(productId, { supplier });
    }
  };

  const getSelectedTrackingId = (product: Product): string => {
    const matchingTracking = trackingNumbers.find(t => 
      t.trackingNumber === product.trackingNumber && t.supplier === product.supplier
    );
    return matchingTracking?.id || '';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Qty: <span className="font-medium text-gray-900">{product.quantity}</span></span>
                  <span>Price: <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span></span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  ${(product.price * product.quantity).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Supplier and Tracking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
                {editable ? (
                  <input
                    type="text"
                    value={product.supplier || ''}
                    onChange={(e) => handleSupplierChange(product.id, e.target.value)}
                    placeholder="Enter supplier name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-900">
                    {product.supplier || 'Not specified'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Truck className="inline h-3 w-3 mr-1" />
                  Tracking Number
                </label>
                {editable && trackingNumbers.length > 0 ? (
                  <select
                    value={getSelectedTrackingId(product)}
                    onChange={(e) => handleTrackingChange(product.id, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="">Select tracking number...</option>
                    {trackingNumbers.map((tracking) => (
                      <option key={tracking.id} value={tracking.id}>
                        {tracking.trackingNumber} - {tracking.supplier}
                        {tracking.description && ` (${tracking.description})`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-md font-mono text-gray-900">
                    {product.trackingNumber || 'Not assigned'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
          <span className="text-xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductList;