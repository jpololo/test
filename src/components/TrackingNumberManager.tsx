import React from 'react';
import { Truck, Plus, X } from 'lucide-react';

export interface TrackingNumberEntry {
  id: string;
  trackingNumber: string;
  supplier: string;
  description?: string;
}

interface TrackingNumberManagerProps {
  trackingNumbers: TrackingNumberEntry[];
  onAdd: (entry: Omit<TrackingNumberEntry, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TrackingNumberEntry>) => void;
}

const TrackingNumberManager: React.FC<TrackingNumberManagerProps> = ({
  trackingNumbers,
  onAdd,
  onRemove,
  onUpdate
}) => {
  const [newEntry, setNewEntry] = React.useState({
    trackingNumber: '',
    supplier: '',
    description: ''
  });

  const handleAdd = () => {
    if (newEntry.trackingNumber.trim() && newEntry.supplier.trim()) {
      onAdd({
        trackingNumber: newEntry.trackingNumber.trim(),
        supplier: newEntry.supplier.trim(),
        description: newEntry.description.trim() || undefined
      });
      setNewEntry({ trackingNumber: '', supplier: '', description: '' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Truck className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Tracking Numbers Management</h3>
      </div>

      {/* Existing Tracking Numbers */}
      {trackingNumbers.length > 0 && (
        <div className="space-y-3 mb-6">
          {trackingNumbers.map((entry) => (
            <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={entry.trackingNumber}
                    onChange={(e) => onUpdate(entry.id, { trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={entry.supplier}
                    onChange={(e) => onUpdate(entry.id, { supplier: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={entry.description || ''}
                    onChange={(e) => onUpdate(entry.id, { description: e.target.value })}
                    placeholder="e.g., Express delivery"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => onRemove(entry.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                title="Remove tracking number"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Tracking Number */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Tracking Number</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tracking Number *</label>
            <input
              type="text"
              value={newEntry.trackingNumber}
              onChange={(e) => setNewEntry(prev => ({ ...prev, trackingNumber: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder="Enter tracking number"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Supplier *</label>
            <input
              type="text"
              value={newEntry.supplier}
              onChange={(e) => setNewEntry(prev => ({ ...prev, supplier: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder="Enter supplier name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={newEntry.description}
              onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder="Optional description"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={!newEntry.trackingNumber.trim() || !newEntry.supplier.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Tracking Number</span>
        </button>
      </div>
    </div>
  );
};

export default TrackingNumberManager;