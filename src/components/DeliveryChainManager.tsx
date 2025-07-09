import React, { useState } from 'react';
import { DeliveryInfo, ProductDelivery, Address } from '../types';
import { 
  Plus, 
  X, 
  MapPin, 
  Truck, 
  Package, 
  Calendar, 
  Building, 
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DeliveryStop {
  id: string;
  type: 'warehouse' | 'project_site' | 'client_location' | 'supplier';
  name: string;
  address: Address;
  estimatedDate?: string;
  actualDate?: string;
  trackingNumber?: string;
  deliveryCompany?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed';
  specialInstructions?: string;
  isIntermediate: boolean; // true if it's not the final destination
}

interface DeliveryChain {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  stops: DeliveryStop[];
  currentStopIndex: number;
  overallStatus: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

interface DeliveryChainManagerProps {
  deliveryChains: DeliveryChain[];
  onAddChain: (chain: Omit<DeliveryChain, 'id'>) => void;
  onUpdateChain: (chainId: string, updates: Partial<DeliveryChain>) => void;
  onDeleteChain: (chainId: string) => void;
  availableProducts: { id: string; name: string; totalQuantity: number; }[];
  isEditable?: boolean;
}

const DeliveryChainManager: React.FC<DeliveryChainManagerProps> = ({
  deliveryChains,
  onAddChain,
  onUpdateChain,
  onDeleteChain,
  availableProducts,
  isEditable = false
}) => {
  const [isCreatingChain, setIsCreatingChain] = useState(false);
  const [newChain, setNewChain] = useState<Partial<DeliveryChain>>({
    productId: '',
    productName: '',
    quantity: 1,
    stops: [],
    currentStopIndex: 0,
    overallStatus: 'pending'
  });

  const defaultLocations = [
    {
      type: 'warehouse' as const,
      name: 'Our Warehouse',
      address: {
        street: '789 Warehouse District',
        city: 'Queens',
        state: 'NY',
        zipCode: '11101',
        country: 'USA'
      }
    },
    {
      type: 'project_site' as const,
      name: 'Project Site 1',
      address: {
        street: '123 Business Plaza',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    {
      type: 'project_site' as const,
      name: 'Project Site 2',
      address: {
        street: '456 Corporate Ave',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        country: 'USA'
      }
    }
  ];

  const handleAddStop = () => {
    const newStop: DeliveryStop = {
      id: `stop-${Date.now()}`,
      type: 'warehouse',
      name: 'Our Warehouse',
      address: defaultLocations[0].address,
      status: 'pending',
      isIntermediate: true
    };

    setNewChain(prev => ({
      ...prev,
      stops: [...(prev.stops || []), newStop]
    }));
  };

  const handleUpdateStop = (stopIndex: number, updates: Partial<DeliveryStop>) => {
    setNewChain(prev => ({
      ...prev,
      stops: prev.stops?.map((stop, index) => 
        index === stopIndex ? { ...stop, ...updates } : stop
      ) || []
    }));
  };

  const handleRemoveStop = (stopIndex: number) => {
    setNewChain(prev => ({
      ...prev,
      stops: prev.stops?.filter((_, index) => index !== stopIndex) || []
    }));
  };

  const handleCreateChain = () => {
    if (!newChain.productId || !newChain.stops?.length) return;

    const selectedProduct = availableProducts.find(p => p.id === newChain.productId);
    if (!selectedProduct) return;

    // Mark the last stop as final destination
    const stopsWithFinalDestination = newChain.stops.map((stop, index) => ({
      ...stop,
      isIntermediate: index < newChain.stops!.length - 1
    }));

    onAddChain({
      productId: newChain.productId,
      productName: selectedProduct.name,
      quantity: newChain.quantity || 1,
      stops: stopsWithFinalDestination,
      currentStopIndex: 0,
      overallStatus: 'pending'
    });

    // Reset form
    setNewChain({
      productId: '',
      productName: '',
      quantity: 1,
      stops: [],
      currentStopIndex: 0,
      overallStatus: 'pending'
    });
    setIsCreatingChain(false);
  };

  const getStopIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return Building;
      case 'project_site': return MapPin;
      case 'client_location': return MapPin;
      case 'supplier': return Package;
      default: return MapPin;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in_transit': return Truck;
      case 'delayed': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delivery & Logistics</h3>
          <p className="text-sm text-gray-600">Manage multi-stop delivery chains for products</p>
        </div>
        {isEditable && (
          <button
            onClick={() => setIsCreatingChain(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Delivery Chain</span>
          </button>
        )}
      </div>

      {/* Existing Delivery Chains */}
      <div className="space-y-6">
        {deliveryChains.map((chain) => (
          <div key={chain.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Chain Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{chain.productName}</h4>
                  <p className="text-sm text-gray-600">Quantity: {chain.quantity} units</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(chain.overallStatus)}`}>
                    {chain.overallStatus.replace('_', ' ').toUpperCase()}
                  </span>
                  {isEditable && (
                    <button
                      onClick={() => onDeleteChain(chain.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Chain Visualization */}
            <div className="p-6">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Stops */}
                <div className="space-y-6">
                  {chain.stops.map((stop, index) => {
                    const StopIcon = getStopIcon(stop.type);
                    const StatusIcon = getStatusIcon(stop.status);
                    const isActive = index === chain.currentStopIndex;
                    const isCompleted = index < chain.currentStopIndex;
                    
                    return (
                      <div key={stop.id} className="relative flex items-start space-x-4">
                        {/* Stop Icon */}
                        <div className={`
                          relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-200
                          ${isCompleted 
                            ? 'bg-green-100 border-green-500' 
                            : isActive 
                              ? 'bg-blue-100 border-blue-500' 
                              : 'bg-gray-100 border-gray-300'
                          }
                        `}>
                          <StopIcon className={`
                            h-6 w-6
                            ${isCompleted 
                              ? 'text-green-600' 
                              : isActive 
                                ? 'text-blue-600' 
                                : 'text-gray-500'
                            }
                          `} />
                        </div>

                        {/* Stop Details */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{stop.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {stop.isIntermediate ? 'Intermediate Stop' : 'Final Destination'}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <StatusIcon className={`h-4 w-4 ${getStatusColor(stop.status).split(' ')[0]}`} />
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(stop.status)}`}>
                                  {stop.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            {/* Address */}
                            <div className="mb-3">
                              <p className="text-sm text-gray-900">{stop.address.street}</p>
                              <p className="text-sm text-gray-600">
                                {stop.address.city}, {stop.address.state} {stop.address.zipCode}
                              </p>
                            </div>

                            {/* Delivery Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              {stop.estimatedDate && (
                                <div>
                                  <span className="text-gray-600">Estimated:</span>
                                  <p className="font-medium text-gray-900">
                                    {new Date(stop.estimatedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {stop.trackingNumber && (
                                <div>
                                  <span className="text-gray-600">Tracking:</span>
                                  <p className="font-mono text-gray-900">{stop.trackingNumber}</p>
                                </div>
                              )}
                              {stop.deliveryCompany && (
                                <div>
                                  <span className="text-gray-600">Carrier:</span>
                                  <p className="font-medium text-gray-900">{stop.deliveryCompany}</p>
                                </div>
                              )}
                            </div>

                            {/* Special Instructions */}
                            {stop.specialInstructions && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">{stop.specialInstructions}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow to Next Stop */}
                        {index < chain.stops.length - 1 && (
                          <div className="absolute left-8 top-20 z-0">
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Chain Modal */}
      {isCreatingChain && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create Delivery Chain</h3>
              <button
                onClick={() => setIsCreatingChain(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
                  <select
                    value={newChain.productId || ''}
                    onChange={(e) => {
                      const selectedProduct = availableProducts.find(p => p.id === e.target.value);
                      setNewChain(prev => ({
                        ...prev,
                        productId: e.target.value,
                        productName: selectedProduct?.name || ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="">Select a product...</option>
                    {availableProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Available: {product.totalQuantity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={newChain.quantity || 1}
                    onChange={(e) => setNewChain(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Stops */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Delivery Stops</h4>
                  <button
                    onClick={handleAddStop}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Stop</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {newChain.stops?.map((stop, index) => (
                    <div key={stop.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">
                          Stop {index + 1} {index === (newChain.stops?.length || 0) - 1 && '(Final Destination)'}
                        </h5>
                        <button
                          onClick={() => handleRemoveStop(index)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
                          <select
                            value={stop.type}
                            onChange={(e) => {
                              const selectedLocation = defaultLocations.find(loc => loc.type === e.target.value);
                              handleUpdateStop(index, {
                                type: e.target.value as any,
                                name: selectedLocation?.name || '',
                                address: selectedLocation?.address || stop.address
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          >
                            <option value="warehouse">Our Warehouse</option>
                            <option value="project_site">Project Site</option>
                            <option value="client_location">Client Location</option>
                            <option value="supplier">Supplier</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                          <input
                            type="text"
                            value={stop.name}
                            onChange={(e) => handleUpdateStop(index, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Date</label>
                          <input
                            type="date"
                            value={stop.estimatedDate || ''}
                            onChange={(e) => handleUpdateStop(index, { estimatedDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                          <input
                            type="text"
                            value={stop.trackingNumber || ''}
                            onChange={(e) => handleUpdateStop(index, { trackingNumber: e.target.value })}
                            placeholder="Enter tracking number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                          <textarea
                            value={stop.specialInstructions || ''}
                            onChange={(e) => handleUpdateStop(index, { specialInstructions: e.target.value })}
                            rows={2}
                            placeholder="Any special delivery instructions..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {newChain.stops?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No delivery stops added yet. Click "Add Stop" to create the delivery chain.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsCreatingChain(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChain}
                disabled={!newChain.productId || !newChain.stops?.length}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Create Delivery Chain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {deliveryChains.length === 0 && !isCreatingChain && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery chains created</h3>
          <p className="text-gray-600 mb-4">
            Create delivery chains to track products through multiple stops before reaching their final destination.
          </p>
          {isEditable && (
            <button
              onClick={() => setIsCreatingChain(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Delivery Chain</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryChainManager;