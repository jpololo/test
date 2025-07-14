import React from 'react';
import WarehousePurchaseOrderView from '../components/WarehousePurchaseOrderView';
import { mockWarehousePurchaseOrder } from '../data/mockWarehousePurchaseOrder';

const WarehousePurchaseOrderViewPage: React.FC = () => {
  const handleEdit = () => {
    console.log('Edit purchase order');
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF');
  };

  return (
    <WarehousePurchaseOrderView
      order={mockWarehousePurchaseOrder}
      onEdit={handleEdit}
      onDownloadPDF={handleDownloadPDF}
    />
  );
};

export default WarehousePurchaseOrderViewPage;