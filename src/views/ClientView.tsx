import React, { useState } from 'react';
import { OrderType, Quote, CompanyInventoryItem, Product, Address, PurchaseOrder } from '../types';
import { mockQuotes, mockInventory, defaultBillingAddress } from '../data/mockData';
import AddressForm from '../components/AddressForm';
import ProductList from '../components/ProductList';
import TrackingNumberManager, { TrackingNumberEntry } from '../components/TrackingNumberManager';
import { FileText, Package, CheckCircle, StickyNote } from 'lucide-react';

const ClientView: React.FC = () => {
  const [orderType, setOrderType] = useState<OrderType>('quote');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<{ item: CompanyInventoryItem; quantity: number }[]>([]);
  const [billingAddress, setBillingAddress] = useState<Address>(defaultBillingAddress);
  const [customTrackingNumber, setCustomTrackingNumber] = useState('');
  const [orderGenerated, setOrderGenerated] = useState<PurchaseOrder | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [inventoryProducts, setInventoryProducts] = useState<Product[]>([]);
  const [quoteProducts, setQuoteProducts] = useState<Product[]>([]);
  const [trackingNumbers, setTrackingNumbers] = useState<TrackingNumberEntry[]>([]);

  const handleQuoteChange = (quoteId: string) => {
    const quote = mockQuotes.find(q => q.id === quoteId);
    setSelectedQuote(quote || null);
    if (quote) {
      setBillingAddress(quote.billingAddress);
      setQuoteProducts([...quote.products]); // Create a copy for editing
      
      // Initialize tracking numbers from quote products
      const quoteTrackingNumbers: TrackingNumberEntry[] = [];
      quote.products.forEach((product, index) => {
        if (product.trackingNumber && product.supplier) {
          const existingTracking = quoteTrackingNumbers.find(t => 
            t.trackingNumber === product.trackingNumber && t.supplier === product.supplier
          );
          if (!existingTracking) {
            quoteTrackingNumbers.push({
              id: `quote-tracking-${index}`,
              trackingNumber: product.trackingNumber,
              supplier: product.supplier,
              description: 'From quote'
            });
          }
        }
      });
      setTrackingNumbers(quoteTrackingNumbers);
    } else {
      setQuoteProducts([]);
      setTrackingNumbers([]);
    }
  };

  const handleInventoryItemToggle = (item: CompanyInventoryItem, quantity: number) => {
    const existingIndex = selectedInventoryItems.findIndex(selected => selected.item.id === item.id);
    
    if (existingIndex >= 0) {
      if (quantity === 0) {
        setSelectedInventoryItems(prev => prev.filter((_, index) => index !== existingIndex));
        setInventoryProducts(prev => prev.filter(p => p.id !== item.id));
      } else {
        setSelectedInventoryItems(prev => 
          prev.map((selected, index) => 
            index === existingIndex ? { ...selected, quantity } : selected
          )
        );
        setInventoryProducts(prev => 
          prev.map(p => p.id === item.id ? { ...p, quantity } : p)
        );
      }
    } else if (quantity > 0) {
      setSelectedInventoryItems(prev => [...prev, { item, quantity }]);
      const newProduct: Product = {
        id: item.id,
        name: item.name,
        quantity,
        price: item.price,
        description: item.description,
        supplier: item.supplier,
        trackingNumber: ''
      };
      setInventoryProducts(prev => [...prev, newProduct]);
    }
  };

  const handleInventoryProductUpdate = (productId: string, updates: Partial<Product>) => {
    setInventoryProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  const handleQuoteProductUpdate = (productId: string, updates: Partial<Product>) => {
    setQuoteProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  const handleTrackingNumberAdd = (entry: Omit<TrackingNumberEntry, 'id'>) => {
    const newEntry: TrackingNumberEntry = {
      ...entry,
      id: `tracking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTrackingNumbers(prev => [...prev, newEntry]);
  };

  const handleTrackingNumberRemove = (id: string) => {
    setTrackingNumbers(prev => prev.filter(t => t.id !== id));
    
    // Remove tracking from products that were using this tracking number
    const trackingToRemove = trackingNumbers.find(t => t.id === id);
    if (trackingToRemove) {
      setInventoryProducts(prev => 
        prev.map(p => 
          p.trackingNumber === trackingToRemove.trackingNumber && p.supplier === trackingToRemove.supplier
            ? { ...p, trackingNumber: '', supplier: p.supplier }
            : p
        )
      );
      setQuoteProducts(prev => 
        prev.map(p => 
          p.trackingNumber === trackingToRemove.trackingNumber && p.supplier === trackingToRemove.supplier
            ? { ...p, trackingNumber: '', supplier: p.supplier }
            : p
        )
      );
    }
  };

  const handleTrackingNumberUpdate = (id: string, updates: Partial<TrackingNumberEntry>) => {
    const oldTracking = trackingNumbers.find(t => t.id === id);
    setTrackingNumbers(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );

    // Update products that were using this tracking number
    if (oldTracking && updates.trackingNumber && updates.supplier) {
      setInventoryProducts(prev => 
        prev.map(p => 
          p.trackingNumber === oldTracking.trackingNumber && p.supplier === oldTracking.supplier
            ? { ...p, trackingNumber: updates.trackingNumber!, supplier: updates.supplier! }
            : p
        )
      );
      setQuoteProducts(prev => 
        prev.map(p => 
          p.trackingNumber === oldTracking.trackingNumber && p.supplier === oldTracking.supplier
            ? { ...p, trackingNumber: updates.trackingNumber!, supplier: updates.supplier! }
            : p
        )
      );
    }
  };

  const getSelectedProducts = (): Product[] => {
    if (orderType === 'quote' && selectedQuote) {
      return quoteProducts;
    } else if (orderType === 'inventory') {
      return inventoryProducts;
    }
    return [];
  };

  const generateOrder = () => {
    const products = getSelectedProducts();
    if (products.length === 0) return;

    const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const freight = orderType === 'quote' && selectedQuote ? selectedQuote.freight : 0;
    const trackingNumber = orderType === 'quote' && selectedQuote 
      ? selectedQuote.trackingNumber 
      : customTrackingNumber || `MAIN${Date.now()}`;

    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      orderNumber: `PO-2024-${String(Date.now()).slice(-3)}`,
      type: orderType,
      products,
      shippingAddress: orderType === 'quote' && selectedQuote ? selectedQuote.shippingAddress : undefined,
      billingAddress,
      freight,
      trackingNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalAmount: subtotal + freight,
      sourceId: orderType === 'quote' && selectedQuote ? selectedQuote.id : undefined,
      notes: orderNotes.trim() || undefined
    };

    setOrderGenerated(newOrder);
    
    // Simulate API call
    console.log('Generated Order:', JSON.stringify(newOrder, null, 2));
  };

  const resetForm = () => {
    setOrderGenerated(null);
    setSelectedQuote(null);
    setSelectedInventoryItems([]);
    setInventoryProducts([]);
    setQuoteProducts([]);
    setBillingAddress(defaultBillingAddress);
    setCustomTrackingNumber('');
    setOrderNotes('');
    setTrackingNumbers([]);
  };

  if (orderGenerated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Generated Successfully!</h2>
          <p className="text-gray-600 mb-6">Order Number: <span className="font-semibold text-blue-600">{orderGenerated.orderNumber}</span></p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="text-left space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{orderGenerated.type === 'quote' ? 'Quote Order' : 'Inventory Order'}</span>
              </div>
              <div className="flex justify-between">
                <span>Products:</span>
                <span className="font-medium">{orderGenerated.products.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-blue-600">${orderGenerated.totalAmount.toFixed(2)}</span>
              </div>
              {orderGenerated.trackingNumber && (
                <div className="flex justify-between">
                  <span>Main Tracking:</span>
                  <span className="font-mono text-sm">{orderGenerated.trackingNumber}</span>
                </div>
              )}
              {orderGenerated.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Notes:</span>
                  <p className="text-sm text-gray-900 mt-1">{orderGenerated.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Purchase Order</h1>
        <p className="text-gray-600">Generate orders from quotes or company inventory</p>
      </div>

      {/* Order Type Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setOrderType('quote')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              orderType === 'quote'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">From Quote</h3>
            <p className="text-sm mt-1">Create order from existing quotation</p>
          </button>
          <button
            onClick={() => setOrderType('inventory')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              orderType === 'inventory'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <Package className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">From Inventory</h3>
            <p className="text-sm mt-1">Select products from company inventory</p>
          </button>
        </div>
      </div>

      {/* Quote Selection */}
      {orderType === 'quote' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Quote</h2>
          <select
            value={selectedQuote?.id || ''}
            onChange={(e) => handleQuoteChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="">Select a quote...</option>
            {mockQuotes.map((quote) => (
              <option key={quote.id} value={quote.id}>
                {quote.number} - ${quote.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Inventory Selection */}
      {orderType === 'inventory' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Products</h2>
          <div className="space-y-4">
            {mockInventory.map((item) => {
              const selectedItem = selectedInventoryItems.find(selected => selected.item.id === item.id);
              const selectedQuantity = selectedItem?.quantity || 0;

              return (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Price: <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span></span>
                      <span>Available: <span className="font-medium text-gray-900">{item.availableQuantity}</span></span>
                      {item.supplier && (
                        <span>Supplier: <span className="font-medium text-gray-900">{item.supplier}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <input
                      type="number"
                      min="0"
                      max={item.availableQuantity}
                      value={selectedQuantity}
                      onChange={(e) => handleInventoryItemToggle(item, parseInt(e.target.value) || 0)}
                      className="w-20 p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tracking Numbers Management */}
      {getSelectedProducts().length > 0 && (
        <TrackingNumberManager
          trackingNumbers={trackingNumbers}
          onAdd={handleTrackingNumberAdd}
          onRemove={handleTrackingNumberRemove}
          onUpdate={handleTrackingNumberUpdate}
        />
      )}

      {/* Products Display */}
      {getSelectedProducts().length > 0 && (
        <ProductList
          products={getSelectedProducts()}
          title={orderType === 'quote' ? 'Quote Products' : 'Selected Products'}
          editable={true}
          onProductUpdate={orderType === 'inventory' ? handleInventoryProductUpdate : handleQuoteProductUpdate}
          trackingNumbers={trackingNumbers}
        />
      )}

      {/* Addresses */}
      {getSelectedProducts().length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orderType === 'quote' && selectedQuote && (
            <AddressForm
              address={selectedQuote.shippingAddress}
              onChange={() => {}} // Read-only for quote orders
              readonly={true}
              title="Shipping Address"
            />
          )}
          <AddressForm
            address={billingAddress}
            onChange={setBillingAddress}
            readonly={orderType === 'quote'}
            title="Billing Address"
          />
        </div>
      )}

      {/* Additional Info */}
      {getSelectedProducts().length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Freight Cost</label>
              <input
                type="text"
                value={orderType === 'quote' && selectedQuote ? `$${selectedQuote.freight.toFixed(2)}` : '$0.00'}
                readOnly
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Tracking Number</label>
              {orderType === 'quote' && selectedQuote ? (
                <input
                  type="text"
                  value={selectedQuote.trackingNumber}
                  readOnly
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 cursor-not-allowed"
                />
              ) : (
                <input
                  type="text"
                  value={customTrackingNumber}
                  onChange={(e) => setCustomTrackingNumber(e.target.value)}
                  placeholder="Enter main tracking number (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              )}
            </div>
          </div>
          
          {/* Order Notes */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <StickyNote className="h-4 w-4" />
              <span>Order Notes</span>
            </label>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Add any special instructions or notes for this order..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Generate Order Button */}
      {getSelectedProducts().length > 0 && (
        <div className="text-center">
          <button
            onClick={generateOrder}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Generate Purchase Order
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientView;