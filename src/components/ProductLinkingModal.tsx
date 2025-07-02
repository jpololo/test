import React, { useState, useMemo } from 'react';
import { ManualProduct, CompanyInventoryItem } from '../types';
import { X, Search, Link, Package, DollarSign, Hash, Tag, Building, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProductLinkingModalProps {
  product: ManualProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onLink: (productId: string, inventoryItemId: string) => void;
  inventoryItems: CompanyInventoryItem[];
}

const ProductLinkingModal: React.FC<ProductLinkingModalProps> = ({
  product,
  isOpen,
  onClose,
  onLink,
  inventoryItems
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen && product) {
      setSearchTerm('');
      setSelectedInventoryId('');
      
      // Auto-suggest based on product name similarity
      const suggestions = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(product.name.toLowerCase()) ||
        product.name.toLowerCase().includes(item.name.toLowerCase())
      );
      
      if (suggestions.length > 0) {
        setSelectedInventoryId(suggestions[0].id);
      }
    }
  }, [isOpen, product, inventoryItems]);

  if (!isOpen || !product) return null;

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryItems, searchTerm]);

  const selectedItem = inventoryItems.find(item => item.id === selectedInventoryId);

  const handleLink = async () => {
    if (!selectedInventoryId) return;

    setIsSubmitting(true);
    try {
      await onLink(product.id, selectedInventoryId);
      onClose();
    } catch (error) {
      console.error('Error linking product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSimilarityScore = (item: CompanyInventoryItem): number => {
    let score = 0;
    const productName = product.name.toLowerCase();
    const itemName = item.name.toLowerCase();
    
    // Name similarity
    if (itemName.includes(productName) || productName.includes(itemName)) {
      score += 50;
    }
    
    // Price similarity (within 20%)
    const priceDiff = Math.abs(item.price - product.price) / product.price;
    if (priceDiff <= 0.2) {
      score += 30;
    }
    
    // Description similarity
    if (item.description && product.description) {
      const itemDesc = item.description.toLowerCase();
      const productDesc = product.description.toLowerCase();
      if (itemDesc.includes(productDesc) || productDesc.includes(itemDesc)) {
        score += 20;
      }
    }
    
    return score;
  };

  const sortedInventory = useMemo(() => {
    return [...filteredInventory].sort((a, b) => {
      const scoreA = getSimilarityScore(a);
      const scoreB = getSimilarityScore(b);
      return scoreB - scoreA;
    });
  }, [filteredInventory, product]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Link to Existing Product</h2>
            <p className="text-sm text-gray-600 mt-1">
              Connect "{product.name}" to an existing inventory item
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Manual Product Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Manual Product to Link</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Name:</span>
                <p className="text-blue-900">{product.name}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Price:</span>
                <p className="text-blue-900">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">From Quote:</span>
                <p className="text-blue-900">{product.quoteName}</p>
              </div>
            </div>
            {product.description && (
              <div className="mt-2">
                <span className="text-blue-700 font-medium text-sm">Description:</span>
                <p className="text-blue-900 text-sm">{product.description}</p>
              </div>
            )}
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Inventory Items
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, SKU, brand, category..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Inventory Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Inventory Item to Link ({sortedInventory.length} items found)
            </label>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              {sortedInventory.length > 0 ? (
                <div className="space-y-1">
                  {sortedInventory.map((item) => {
                    const similarityScore = getSimilarityScore(item);
                    const isSelected = selectedInventoryId === item.id;
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInventoryId(item.id)}
                        className={`p-4 cursor-pointer transition-colors duration-200 ${
                          isSelected
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                {item.name}
                              </h4>
                              {similarityScore > 50 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  High Match
                                </span>
                              )}
                              {similarityScore > 20 && similarityScore <= 50 && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Possible Match
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>${item.price.toFixed(2)}</span>
                              </div>
                              {item.sku && (
                                <div className="flex items-center space-x-1">
                                  <Hash className="h-3 w-3" />
                                  <span className="font-mono">{item.sku}</span>
                                </div>
                              )}
                              {item.brand && (
                                <div className="flex items-center space-x-1">
                                  <Building className="h-3 w-3" />
                                  <span>{item.brand}</span>
                                </div>
                              )}
                              {item.category && (
                                <div className="flex items-center space-x-1">
                                  <Tag className="h-3 w-3" />
                                  <span>{item.category}</span>
                                </div>
                              )}
                            </div>
                            
                            {item.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                            )}
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Available: {item.availableQuantity} units • Supplier: {item.supplier}
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Item Summary */}
          {selectedItem && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">Selected for Linking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-medium">Inventory Item:</span>
                  <p className="text-green-900">{selectedItem.name}</p>
                  <p className="text-green-700">Price: ${selectedItem.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Manual Product:</span>
                  <p className="text-green-900">{product.name}</p>
                  <p className="text-green-700">Price: ${product.price.toFixed(2)}</p>
                </div>
              </div>
              
              {Math.abs(selectedItem.price - product.price) > 0.01 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Price Difference Notice</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    The prices differ by ${Math.abs(selectedItem.price - product.price).toFixed(2)}. 
                    The manual product will be linked but keep its original price.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLink}
            disabled={!selectedInventoryId || isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Link className="h-4 w-4" />
            <span>{isSubmitting ? 'Linking...' : 'Link Products'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductLinkingModal;