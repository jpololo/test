import React, { useState } from 'react';
import { ManualProduct } from '../types';
import { mockManualProducts } from '../data/mockManualProducts';
import { mockInventoryDatabase } from '../data/mockInventoryDatabase';
import ProductsManualPendingList from '../components/ProductsManualPendingList';
import ManualProductEditModal from '../components/ManualProductEditModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ProductLinkingModal from '../components/ProductLinkingModal';
import { Package, CheckCircle, XCircle, Clock, TrendingUp, Link } from 'lucide-react';

const ManualProductsAdminView: React.FC = () => {
  const [products, setProducts] = useState<ManualProduct[]>(mockManualProducts);
  const [selectedProduct, setSelectedProduct] = useState<ManualProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Statistics
  const pendingProducts = products.filter(p => p.status === 'manual_pending');
  const linkedProducts = products.filter(p => p.status === 'linked');
  const totalValue = pendingProducts.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = pendingProducts.length > 0 ? totalValue / pendingProducts.length : 0;

  const handleEdit = (product: ManualProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: ManualProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleLink = (product: ManualProduct) => {
    setSelectedProduct(product);
    setIsLinkModalOpen(true);
  };

  const handleQuickApprove = (product: ManualProduct) => {
    // Quick approve without editing
    handleSaveProduct(product.id, {
      status: 'approved',
      approvedBy: 'Current Admin',
      updatedAt: new Date().toISOString()
    });
  };

  const handleSaveProduct = (productId: string, updates: Partial<ManualProduct>) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, ...updates }
          : p
      )
    );
    
    // Simulate API call
    console.log('Saving product:', { productId, updates });
  };

  const handleApproveProduct = (productId: string, updates: Partial<ManualProduct>) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, ...updates, status: 'approved' as const }
          : p
      )
    );
    
    // Simulate API call to add to inventory
    console.log('Approving and adding to inventory:', { productId, updates });
  };

  const handleDeleteProduct = (productId: string, reason?: string) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              status: 'rejected' as const,
              rejectedBy: 'Current Admin',
              rejectionReason: reason,
              updatedAt: new Date().toISOString()
            }
          : p
      )
    );
    
    // Simulate API call
    console.log('Rejecting product:', { productId, reason });
  };

  const handleLinkProduct = (productId: string, inventoryItemId: string) => {
    const inventoryItem = mockInventoryDatabase.find(item => item.id === inventoryItemId);
    
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              status: 'linked' as const,
              linkedToInventoryId: inventoryItemId,
              linkedBy: 'Current Admin',
              linkedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    );
    
    // Simulate API call to link products
    console.log('Linking product to inventory:', { 
      productId, 
      inventoryItemId, 
      inventoryItem: inventoryItem?.name 
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Products Administration</h1>
        <p className="text-gray-600">Review, approve, and link manually entered products from quotes</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Link className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Linked</p>
              <p className="text-2xl font-bold text-gray-900">{linkedProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">${avgPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <ProductsManualPendingList
        products={pendingProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickApprove={handleQuickApprove}
        onLink={handleLink}
      />

      {/* Edit Modal */}
      <ManualProductEditModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        onApprove={handleApproveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        product={selectedProduct}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
      />

      {/* Product Linking Modal */}
      <ProductLinkingModal
        product={selectedProduct}
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setSelectedProduct(null);
        }}
        onLink={handleLinkProduct}
        inventoryItems={mockInventoryDatabase}
      />
    </div>
  );
};

export default ManualProductsAdminView;