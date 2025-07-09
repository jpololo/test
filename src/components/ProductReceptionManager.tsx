import React, { useState } from 'react';
import { ProductReception, ReceivedItem, DeliveryInfo, ProductDelivery } from '../types';
import { 
  Package, 
  Plus, 
  X, 
  Calendar, 
  User, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Truck,
  Search,
  Edit,
  Save,
  Eye
} from 'lucide-react';

interface ProductReceptionManagerProps {
  receptions: ProductReception[];
  deliveries: DeliveryInfo[];
  onAddReception: (reception: Omit<ProductReception, 'id' | 'createdAt'>) => void;
  onUpdateReception: (receptionId: string, updates: Partial<ProductReception>) => void;
  onDeleteReception: (receptionId: string) => void;
  isEditable?: boolean;
}

const ProductReceptionManager: React.FC<ProductReceptionManagerProps> = ({
  receptions,
  deliveries,
  onAddReception,
  onUpdateReception,
  onDeleteReception,
  isEditable = false
}) => {
  const [isCreatingReception, setIsCreatingReception] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryInfo | null>(null);
  const [viewingReception, setViewingReception] = useState<ProductReception | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newReception, setNewReception] = useState<{
    deliveryId: string;
    deliveryName: string;
    receptionDate: string;
    receivedBy: string;
    notes: string;
    receivedItems: Omit<ReceivedItem, 'id'>[];
  }>({
    deliveryId: '',
    deliveryName: '',
    receptionDate: new Date().toISOString().split('T')[0],
    receivedBy: '',
    notes: '',
    receivedItems: []
  });

  // Filter deliveries that can have receptions (delivered status)
  const availableDeliveries = deliveries.filter(delivery => 
    delivery.status === 'delivered' && 
    delivery.productDeliveries && 
    delivery.productDeliveries.length > 0
  );

  const filteredReceptions = receptions.filter(reception =>
    reception.deliveryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reception.receivedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reception.receivedItems.some(item => 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSelectDelivery = (deliveryId: string) => {
    const delivery = availableDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    setSelectedDelivery(delivery);
    
    // Initialize received items based on delivery products
    const receivedItems = delivery.productDeliveries?.map(productDelivery => ({
      deliveryId: delivery.id,
      productId: productDelivery.variantId,
      productName: productDelivery.variantId, // This would be resolved from variants in real app
      quantityReceived: 0,
      quantityExpected: productDelivery.quantity,
      receivedDate: newReception.receptionDate + 'T' + new Date().toTimeString().split(' ')[0],
      receivedBy: newReception.receivedBy,
      condition: 'good' as const,
      notes: ''
    })) || [];

    setNewReception(prev => ({
      ...prev,
      deliveryId: delivery.id,
      deliveryName: `${delivery.deliveryLocation} - ${delivery.deliveryAddress.street}`,
      receivedItems
    }));
  };

  const handleUpdateReceivedItem = (index: number, updates: Partial<Omit<ReceivedItem, 'id'>>) => {
    setNewReception(prev => ({
      ...prev,
      receivedItems: prev.receivedItems.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    }));
  };

  const handleCreateReception = () => {
    if (!newReception.deliveryId || !newReception.receivedBy || newReception.receivedItems.length === 0) {
      return;
    }

    // Check if this is a complete or partial reception
    const totalExpected = newReception.receivedItems.reduce((sum, item) => sum + item.quantityExpected, 0);
    const totalReceived = newReception.receivedItems.reduce((sum, item) => sum + item.quantityReceived, 0);
    const status = totalReceived >= totalExpected ? 'complete' : 'partial';

    onAddReception({
      deliveryId: newReception.deliveryId,
      deliveryName: newReception.deliveryName,
      receptionDate: newReception.receptionDate + 'T' + new Date().toTimeString().split(' ')[0],
      receivedBy: newReception.receivedBy,
      notes: newReception.notes,
      status,
      receivedItems: newReception.receivedItems.map(item => ({
        ...item,
        id: `rec-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    });

    // Reset form
    setNewReception({
      deliveryId: '',
      deliveryName: '',
      receptionDate: new Date().toISOString().split('T')[0],
      receivedBy: '',
      notes: '',
      receivedItems: []
    });
    setSelectedDelivery(null);
    setIsCreatingReception(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-yellow-100 text-yellow-800';
      case 'defective': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recepción de Productos</h3>
          <p className="text-sm text-gray-600">
            Registra las recepciones de productos basadas en deliveries programados
          </p>
        </div>
        {isEditable && (
          <button
            onClick={() => setIsCreatingReception(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Recepción</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por delivery, responsable o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Receptions List */}
      <div className="space-y-4">
        {filteredReceptions.length > 0 ? (
          filteredReceptions.map((reception) => (
            <div key={reception.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Reception Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{reception.deliveryName}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(reception.receptionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{reception.receivedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(reception.status)}`}>
                      {reception.status === 'complete' ? 'Completa' : 'Parcial'}
                    </span>
                    <button
                      onClick={() => setViewingReception(reception)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {isEditable && (
                      <button
                        onClick={() => onDeleteReception(reception.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reception Summary */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Productos</div>
                    <div className="text-lg font-bold text-blue-900">
                      {reception.receivedItems.length}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Cantidad Recibida</div>
                    <div className="text-lg font-bold text-green-900">
                      {reception.receivedItems.reduce((sum, item) => sum + item.quantityReceived, 0)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 font-medium">Cantidad Esperada</div>
                    <div className="text-lg font-bold text-gray-900">
                      {reception.receivedItems.reduce((sum, item) => sum + item.quantityExpected, 0)}
                    </div>
                  </div>
                </div>

                {/* Products Summary */}
                <div className="space-y-2">
                  {reception.receivedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          Recibido: {item.quantityReceived} / {item.quantityExpected}
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition === 'good' ? 'Bueno' : 
                         item.condition === 'damaged' ? 'Dañado' : 'Defectuoso'}
                      </span>
                    </div>
                  ))}
                </div>

                {reception.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">Notas:</div>
                    <div className="text-sm text-blue-800">{reception.notes}</div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recepciones registradas</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No se encontraron recepciones con los criterios de búsqueda.' : 'Registra la primera recepción de productos.'}
            </p>
            {isEditable && !searchTerm && (
              <button
                onClick={() => setIsCreatingReception(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Crear Primera Recepción</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Reception Modal */}
      {isCreatingReception && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Nueva Recepción de Productos</h3>
              <button
                onClick={() => {
                  setIsCreatingReception(false);
                  setSelectedDelivery(null);
                  setNewReception({
                    deliveryId: '',
                    deliveryName: '',
                    receptionDate: new Date().toISOString().split('T')[0],
                    receivedBy: '',
                    notes: '',
                    receivedItems: []
                  });
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Step 1: Select Delivery */}
              {!selectedDelivery && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Delivery</h4>
                  <div className="space-y-3">
                    {availableDeliveries.length > 0 ? (
                      availableDeliveries.map((delivery) => (
                        <div
                          key={delivery.id}
                          onClick={() => handleSelectDelivery(delivery.id)}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{delivery.deliveryLocation}</div>
                              <div className="text-sm text-gray-600">{delivery.deliveryAddress.street}</div>
                              <div className="text-sm text-gray-500">
                                {delivery.productDeliveries?.length || 0} productos • 
                                Entregado: {delivery.actualDate ? new Date(delivery.actualDate).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Truck className="h-5 w-5 text-gray-400" />
                              <span className="text-sm text-green-600 font-medium">Entregado</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No hay deliveries entregados disponibles para recepción</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Reception Details */}
              {selectedDelivery && (
                <div className="space-y-6">
                  {/* Selected Delivery Info */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Delivery Seleccionado</h4>
                        <p className="text-blue-800">{selectedDelivery.deliveryLocation}</p>
                        <p className="text-sm text-blue-600">{selectedDelivery.deliveryAddress.street}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDelivery(null);
                          setNewReception(prev => ({
                            ...prev,
                            deliveryId: '',
                            deliveryName: '',
                            receivedItems: []
                          }));
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>

                  {/* Reception Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Recepción *</label>
                      <input
                        type="date"
                        value={newReception.receptionDate}
                        onChange={(e) => setNewReception(prev => ({ ...prev, receptionDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recibido por *</label>
                      <input
                        type="text"
                        value={newReception.receivedBy}
                        onChange={(e) => setNewReception(prev => ({ ...prev, receivedBy: e.target.value }))}
                        placeholder="Nombre del responsable"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Products to Receive */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos a Recibir</h4>
                    <div className="space-y-4">
                      {newReception.receivedItems.map((item, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                              <div className="p-2 bg-gray-50 rounded border text-sm text-gray-900">
                                {item.productName}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad Recibida *
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={item.quantityExpected}
                                value={item.quantityReceived}
                                onChange={(e) => handleUpdateReceivedItem(index, { 
                                  quantityReceived: parseInt(e.target.value) || 0 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Esperado: {item.quantityExpected}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                              <select
                                value={item.condition}
                                onChange={(e) => handleUpdateReceivedItem(index, { 
                                  condition: e.target.value as 'good' | 'damaged' | 'defective' 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              >
                                <option value="good">Bueno</option>
                                <option value="damaged">Dañado</option>
                                <option value="defective">Defectuoso</option>
                              </select>
                            </div>
                            <div className="md:col-span-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Notas del Producto</label>
                              <textarea
                                value={item.notes || ''}
                                onChange={(e) => handleUpdateReceivedItem(index, { notes: e.target.value })}
                                rows={2}
                                placeholder="Observaciones sobre este producto..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas Generales</label>
                    <textarea
                      value={newReception.notes}
                      onChange={(e) => setNewReception(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      placeholder="Observaciones generales sobre la recepción..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedDelivery && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsCreatingReception(false);
                    setSelectedDelivery(null);
                    setNewReception({
                      deliveryId: '',
                      deliveryName: '',
                      receptionDate: new Date().toISOString().split('T')[0],
                      receivedBy: '',
                      notes: '',
                      receivedItems: []
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateReception}
                  disabled={!newReception.receivedBy || newReception.receivedItems.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Registrar Recepción
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Reception Modal */}
      {viewingReception && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detalle de Recepción</h3>
                <p className="text-sm text-gray-600">{viewingReception.deliveryName}</p>
              </div>
              <button
                onClick={() => setViewingReception(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Reception Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Fecha de Recepción</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(viewingReception.receptionDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Recibido por</div>
                  <div className="text-lg font-semibold text-gray-900">{viewingReception.receivedBy}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Estado</div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingReception.status)}`}>
                    {viewingReception.status === 'complete' ? 'Completa' : 'Parcial'}
                  </span>
                </div>
              </div>

              {/* Received Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Productos Recibidos</h4>
                <div className="space-y-3">
                  {viewingReception.receivedItems.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Recibido: {item.quantityReceived} / {item.quantityExpected}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-gray-600 mt-2 italic">{item.notes}</div>
                          )}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                          {item.condition === 'good' ? 'Bueno' : 
                           item.condition === 'damaged' ? 'Dañado' : 'Defectuoso'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Notes */}
              {viewingReception.notes && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-900 mb-2">Notas Generales:</div>
                  <div className="text-sm text-blue-800">{viewingReception.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReceptionManager;