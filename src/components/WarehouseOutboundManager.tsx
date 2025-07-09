import React, { useState, useMemo } from 'react';
import { WarehouseOutbound, WarehouseOutboundItem, WarehouseStock, Address } from '../types';
import { 
  Package, 
  Plus, 
  X, 
  Calendar, 
  User, 
  Truck,
  MapPin,
  Search,
  Edit,
  Save,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  ArrowRight,
  Hash,
  DollarSign
} from 'lucide-react';

interface WarehouseOutboundManagerProps {
  outbounds: WarehouseOutbound[];
  warehouseStock: WarehouseStock[];
  onAddOutbound: (outbound: Omit<WarehouseOutbound, 'id' | 'createdAt'>) => void;
  onUpdateOutbound: (outboundId: string, updates: Partial<WarehouseOutbound>) => void;
  onDeleteOutbound: (outboundId: string) => void;
  isEditable?: boolean;
}

const WarehouseOutboundManager: React.FC<WarehouseOutboundManagerProps> = ({
  outbounds,
  warehouseStock,
  onAddOutbound,
  onUpdateOutbound,
  onDeleteOutbound,
  isEditable = false
}) => {
  const [isCreatingOutbound, setIsCreatingOutbound] = useState(false);
  const [viewingOutbound, setViewingOutbound] = useState<WarehouseOutbound | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [newOutbound, setNewOutbound] = useState<{
    outboundNumber: string;
    outboundDate: string;
    clientName: string;
    clientAddress: Address;
    responsibleUser: string;
    notes: string;
    outboundItems: Omit<WarehouseOutboundItem, 'id'>[];
  }>({
    outboundNumber: `OUT-${new Date().getFullYear()}-${String(outbounds.length + 1).padStart(3, '0')}`,
    outboundDate: new Date().toISOString().split('T')[0],
    clientName: '',
    clientAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    responsibleUser: '',
    notes: '',
    outboundItems: []
  });

  const filteredOutbounds = useMemo(() => {
    return outbounds.filter(outbound => {
      const matchesSearch = 
        outbound.outboundNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outbound.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outbound.responsibleUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outbound.outboundItems.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || outbound.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [outbounds, searchTerm, statusFilter]);

  const availableStock = useMemo(() => {
    return warehouseStock.filter(stock => stock.availableQuantity > 0);
  }, [warehouseStock]);

  const handleAddStockItem = (stockItem: WarehouseStock) => {
    const existingItemIndex = newOutbound.outboundItems.findIndex(
      item => item.productId === stockItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...newOutbound.outboundItems];
      const currentQuantity = updatedItems[existingItemIndex].quantityRequested;
      const maxQuantity = stockItem.availableQuantity;
      
      if (currentQuantity < maxQuantity) {
        updatedItems[existingItemIndex].quantityRequested += 1;
        updatedItems[existingItemIndex].quantityAllocated += 1;
        updatedItems[existingItemIndex].totalPrice = 
          updatedItems[existingItemIndex].quantityRequested * stockItem.unitPrice;
        
        setNewOutbound(prev => ({ ...prev, outboundItems: updatedItems }));
      }
    } else {
      // Add new item
      const newItem: Omit<WarehouseOutboundItem, 'id'> = {
        productId: stockItem.productId,
        productName: stockItem.productName,
        sku: stockItem.sku,
        quantityRequested: 1,
        quantityAllocated: 1,
        quantityShipped: 0,
        unitPrice: stockItem.unitPrice,
        totalPrice: stockItem.unitPrice,
        warehouseLocation: stockItem.warehouseLocation,
        sourceType: stockItem.sourceType,
        sourceId: stockItem.sourceId,
        sourceReference: stockItem.sourceReference
      };

      setNewOutbound(prev => ({
        ...prev,
        outboundItems: [...prev.outboundItems, newItem]
      }));
    }
  };

  const handleUpdateOutboundItem = (index: number, updates: Partial<Omit<WarehouseOutboundItem, 'id'>>) => {
    setNewOutbound(prev => ({
      ...prev,
      outboundItems: prev.outboundItems.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, ...updates };
          if (updates.quantityRequested !== undefined) {
            updatedItem.quantityAllocated = updates.quantityRequested;
            updatedItem.totalPrice = updatedItem.quantityRequested * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleRemoveOutboundItem = (index: number) => {
    setNewOutbound(prev => ({
      ...prev,
      outboundItems: prev.outboundItems.filter((_, i) => i !== index)
    }));
  };

  const handleCreateOutbound = () => {
    if (!newOutbound.clientName || !newOutbound.responsibleUser || newOutbound.outboundItems.length === 0) {
      return;
    }

    const totalValue = newOutbound.outboundItems.reduce((sum, item) => sum + item.totalPrice, 0);

    onAddOutbound({
      outboundNumber: newOutbound.outboundNumber,
      outboundDate: newOutbound.outboundDate + 'T' + new Date().toTimeString().split(' ')[0],
      clientId: `client-${Date.now()}`,
      clientName: newOutbound.clientName,
      clientAddress: newOutbound.clientAddress,
      responsibleUser: newOutbound.responsibleUser,
      status: 'pending',
      notes: newOutbound.notes,
      totalValue,
      outboundItems: newOutbound.outboundItems.map(item => ({
        ...item,
        id: `out-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    });

    // Reset form
    setNewOutbound({
      outboundNumber: `OUT-${new Date().getFullYear()}-${String(outbounds.length + 2).padStart(3, '0')}`,
      outboundDate: new Date().toISOString().split('T')[0],
      clientName: '',
      clientAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      responsibleUser: '',
      notes: '',
      outboundItems: []
    });
    setIsCreatingOutbound(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'ready_to_ship': return 'bg-purple-100 text-purple-800';
      case 'in_preparation': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'ready_to_ship': return Package;
      case 'in_preparation': return Clock;
      case 'pending': return AlertTriangle;
      default: return Clock;
    }
  };

  const getSourceTypeColor = (sourceType: string) => {
    switch (sourceType) {
      case 'supplier_delivery': return 'bg-blue-100 text-blue-800';
      case 'existing_stock': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Salidas de Almacén</h3>
          <p className="text-sm text-gray-600">
            Gestiona las salidas de productos desde el almacén hacia clientes
          </p>
        </div>
        {isEditable && (
          <button
            onClick={() => setIsCreatingOutbound(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Salida</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por número, cliente, responsable o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_preparation">En Preparación</option>
            <option value="ready_to_ship">Listo para Envío</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
          </select>
        </div>
      </div>

      {/* Outbounds List */}
      <div className="space-y-4">
        {filteredOutbounds.length > 0 ? (
          filteredOutbounds.map((outbound) => {
            const StatusIcon = getStatusIcon(outbound.status);
            
            return (
              <div key={outbound.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Outbound Header */}
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{outbound.outboundNumber}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{outbound.clientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(outbound.outboundDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{outbound.responsibleUser}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(outbound.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {outbound.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <button
                        onClick={() => setViewingOutbound(outbound)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {isEditable && (
                        <button
                          onClick={() => onDeleteOutbound(outbound.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Outbound Summary */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Total Productos</div>
                      <div className="text-lg font-bold text-blue-900">
                        {outbound.outboundItems.length}
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Cantidad Total</div>
                      <div className="text-lg font-bold text-green-900">
                        {outbound.outboundItems.reduce((sum, item) => sum + item.quantityRequested, 0)}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium">Enviado</div>
                      <div className="text-lg font-bold text-purple-900">
                        {outbound.outboundItems.reduce((sum, item) => sum + item.quantityShipped, 0)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 font-medium">Valor Total</div>
                      <div className="text-lg font-bold text-gray-900">
                        ${outbound.totalValue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Client Address */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Dirección de Entrega</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {outbound.clientAddress.street}<br />
                      {outbound.clientAddress.city}, {outbound.clientAddress.state} {outbound.clientAddress.zipCode}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {outbound.deliveryInfo && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Información de Envío</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {outbound.deliveryInfo.trackingNumber && (
                          <div>
                            <span className="text-blue-700">Tracking:</span>
                            <span className="ml-2 font-mono text-blue-900">{outbound.deliveryInfo.trackingNumber}</span>
                          </div>
                        )}
                        {outbound.deliveryInfo.carrier && (
                          <div>
                            <span className="text-blue-700">Transportista:</span>
                            <span className="ml-2 text-blue-900">{outbound.deliveryInfo.carrier}</span>
                          </div>
                        )}
                        {outbound.deliveryInfo.estimatedDeliveryDate && (
                          <div>
                            <span className="text-blue-700">Entrega Estimada:</span>
                            <span className="ml-2 text-blue-900">
                              {new Date(outbound.deliveryInfo.estimatedDeliveryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Products Summary */}
                  <div className="space-y-2">
                    {outbound.outboundItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-600">
                            Cantidad: {item.quantityRequested} • 
                            Enviado: {item.quantityShipped} • 
                            ${item.totalPrice.toLocaleString()}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceTypeColor(item.sourceType)}`}>
                              {item.sourceType === 'supplier_delivery' ? 'Desde Supplier' : 'Stock Existente'}
                            </span>
                            {item.warehouseLocation && (
                              <span className="text-xs text-gray-500">
                                Ubicación: {item.warehouseLocation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {outbound.outboundItems.length > 3 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        +{outbound.outboundItems.length - 3} productos más
                      </div>
                    )}
                  </div>

                  {outbound.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-sm font-medium text-yellow-900 mb-1">Notas:</div>
                      <div className="text-sm text-yellow-800">{outbound.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay salidas registradas</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron salidas con los criterios de búsqueda.' 
                : 'Registra la primera salida de almacén.'}
            </p>
            {isEditable && !searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setIsCreatingOutbound(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Crear Primera Salida</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Outbound Modal */}
      {isCreatingOutbound && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Nueva Salida de Almacén</h3>
              <button
                onClick={() => {
                  setIsCreatingOutbound(false);
                  setNewOutbound({
                    outboundNumber: `OUT-${new Date().getFullYear()}-${String(outbounds.length + 1).padStart(3, '0')}`,
                    outboundDate: new Date().toISOString().split('T')[0],
                    clientName: '',
                    clientAddress: {
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: 'USA'
                    },
                    responsibleUser: '',
                    notes: '',
                    outboundItems: []
                  });
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Salida</label>
                  <input
                    type="text"
                    value={newOutbound.outboundNumber}
                    onChange={(e) => setNewOutbound(prev => ({ ...prev, outboundNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Salida *</label>
                  <input
                    type="date"
                    value={newOutbound.outboundDate}
                    onChange={(e) => setNewOutbound(prev => ({ ...prev, outboundDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsable *</label>
                  <input
                    type="text"
                    value={newOutbound.responsibleUser}
                    onChange={(e) => setNewOutbound(prev => ({ ...prev, responsibleUser: e.target.value }))}
                    placeholder="Nombre del responsable"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Cliente *</label>
                    <input
                      type="text"
                      value={newOutbound.clientName}
                      onChange={(e) => setNewOutbound(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Nombre de la empresa o cliente"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={newOutbound.clientAddress.street}
                      onChange={(e) => setNewOutbound(prev => ({ 
                        ...prev, 
                        clientAddress: { ...prev.clientAddress, street: e.target.value }
                      }))}
                      placeholder="Dirección de entrega"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input
                      type="text"
                      value={newOutbound.clientAddress.city}
                      onChange={(e) => setNewOutbound(prev => ({ 
                        ...prev, 
                        clientAddress: { ...prev.clientAddress, city: e.target.value }
                      }))}
                      placeholder="Ciudad"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado / Código Postal</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newOutbound.clientAddress.state}
                        onChange={(e) => setNewOutbound(prev => ({ 
                          ...prev, 
                          clientAddress: { ...prev.clientAddress, state: e.target.value }
                        }))}
                        placeholder="Estado"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newOutbound.clientAddress.zipCode}
                        onChange={(e) => setNewOutbound(prev => ({ 
                          ...prev, 
                          clientAddress: { ...prev.clientAddress, zipCode: e.target.value }
                        }))}
                        placeholder="CP"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Stock */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Stock Disponible</h4>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {availableStock.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {availableStock.map((stock) => (
                        <div key={stock.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{stock.productName}</div>
                              <div className="text-sm text-gray-600">
                                SKU: {stock.sku} • Disponible: {stock.availableQuantity} • ${stock.unitPrice}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceTypeColor(stock.sourceType)}`}>
                                  {stock.sourceType === 'supplier_delivery' ? 'Desde Supplier' : 'Stock Existente'}
                                </span>
                                {stock.warehouseLocation && (
                                  <span className="text-xs text-gray-500">
                                    {stock.warehouseLocation}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddStockItem(stock)}
                              disabled={stock.availableQuantity === 0}
                              className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No hay stock disponible</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Items */}
              {newOutbound.outboundItems.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos Seleccionados</h4>
                  <div className="space-y-3">
                    {newOutbound.outboundItems.map((item, index) => {
                      const stockItem = availableStock.find(s => s.productId === item.productId);
                      const maxQuantity = stockItem?.availableQuantity || 0;
                      
                      return (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.productName}</div>
                              <div className="text-sm text-gray-600">
                                SKU: {item.sku} • ${item.unitPrice} c/u
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceTypeColor(item.sourceType)}`}>
                                  {item.sourceType === 'supplier_delivery' ? 'Desde Supplier' : 'Stock Existente'}
                                </span>
                                {item.warehouseLocation && (
                                  <span className="text-xs text-gray-500">
                                    {item.warehouseLocation}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max={maxQuantity}
                                  value={item.quantityRequested}
                                  onChange={(e) => handleUpdateOutboundItem(index, { 
                                    quantityRequested: parseInt(e.target.value) || 1 
                                  })}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <span className="text-xs text-gray-500">/ {maxQuantity}</span>
                              </div>
                              <div className="text-sm font-semibold text-green-600">
                                ${item.totalPrice.toLocaleString()}
                              </div>
                              <button
                                onClick={() => handleRemoveOutboundItem(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Total */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        ${newOutbound.outboundItems.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={newOutbound.notes}
                  onChange={(e) => setNewOutbound(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Observaciones sobre la salida..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsCreatingOutbound(false);
                  setNewOutbound({
                    outboundNumber: `OUT-${new Date().getFullYear()}-${String(outbounds.length + 1).padStart(3, '0')}`,
                    outboundDate: new Date().toISOString().split('T')[0],
                    clientName: '',
                    clientAddress: {
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: 'USA'
                    },
                    responsibleUser: '',
                    notes: '',
                    outboundItems: []
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOutbound}
                disabled={!newOutbound.clientName || !newOutbound.responsibleUser || newOutbound.outboundItems.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Crear Salida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Outbound Modal */}
      {viewingOutbound && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detalle de Salida</h3>
                <p className="text-sm text-gray-600">{viewingOutbound.outboundNumber}</p>
              </div>
              <button
                onClick={() => setViewingOutbound(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Outbound Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Cliente</div>
                  <div className="text-lg font-semibold text-gray-900">{viewingOutbound.clientName}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Fecha de Salida</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(viewingOutbound.outboundDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Responsable</div>
                  <div className="text-lg font-semibold text-gray-900">{viewingOutbound.responsibleUser}</div>
                </div>
              </div>

              {/* Client Address */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Dirección de Entrega</span>
                </div>
                <div className="text-sm text-blue-800">
                  {viewingOutbound.clientAddress.street}<br />
                  {viewingOutbound.clientAddress.city}, {viewingOutbound.clientAddress.state} {viewingOutbound.clientAddress.zipCode}
                </div>
              </div>

              {/* Delivery Info */}
              {viewingOutbound.deliveryInfo && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Información de Envío</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {viewingOutbound.deliveryInfo.trackingNumber && (
                      <div>
                        <span className="text-green-700">Tracking:</span>
                        <span className="ml-2 font-mono text-green-900">{viewingOutbound.deliveryInfo.trackingNumber}</span>
                      </div>
                    )}
                    {viewingOutbound.deliveryInfo.carrier && (
                      <div>
                        <span className="text-green-700">Transportista:</span>
                        <span className="ml-2 text-green-900">{viewingOutbound.deliveryInfo.carrier}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Outbound Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos</h4>
                <div className="space-y-3">
                  {viewingOutbound.outboundItems.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            SKU: {item.sku} • Cantidad: {item.quantityRequested} • 
                            Enviado: {item.quantityShipped}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceTypeColor(item.sourceType)}`}>
                              {item.sourceType === 'supplier_delivery' ? 'Desde Supplier' : 'Stock Existente'}
                            </span>
                            {item.warehouseLocation && (
                              <span className="text-xs text-gray-500">
                                Ubicación: {item.warehouseLocation}
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-gray-600 mt-2 italic">{item.notes}</div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-green-600">
                            ${item.totalPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${item.unitPrice} c/u
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${viewingOutbound.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewingOutbound.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm font-medium text-yellow-900 mb-2">Notas:</div>
                  <div className="text-sm text-yellow-800">{viewingOutbound.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseOutboundManager;