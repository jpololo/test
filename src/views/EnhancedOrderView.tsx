import React, { useState } from 'react';
import { EnhancedPurchaseOrder } from '../types';
import { mockEnhancedOrder } from '../data/mockEnhancedOrder';
import PurchaseOrderTabs from '../components/PurchaseOrderTabs';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';

const EnhancedOrderView: React.FC = () => {
  const [order, setOrder] = useState<EnhancedPurchaseOrder>(mockEnhancedOrder);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleOrderUpdate = (updates: Partial<EnhancedPurchaseOrder>) => {
    setOrder(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate API call to save changes
    console.log('Saving order changes:', order);
    setHasChanges(false);
    setIsEditing(false);
    
    // Update the updatedAt timestamp
    setOrder(prev => ({
      ...prev,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleCancel = () => {
    // Reset to original order data
    setOrder(mockEnhancedOrder);
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Orders</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-sm text-orange-600 font-medium">
              Unsaved changes
            </span>
          )}
          
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <PurchaseOrderTabs
        order={order}
        onOrderUpdate={handleOrderUpdate}
        isEditable={isEditing}
      />
    </div>
  );
};

export default EnhancedOrderView;