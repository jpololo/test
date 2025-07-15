import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ClientView from './views/ClientView';
import AdminView from './views/AdminView';
import ManualProductsAdminView from './views/ManualProductsAdminView';
import EnhancedOrderView from './views/EnhancedOrderView';
import CompanyView from './views/CompanyView';
import WarehousePurchaseOrderViewPage from './views/WarehousePurchaseOrderView';
import ErrorPageView from './views/ErrorPageView';
import NotificationSettingsView from './views/NotificationSettingsView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ClientView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/manual-products" element={<ManualProductsAdminView />} />
          <Route path="/enhanced-order" element={<EnhancedOrderView />} />
          <Route path="/company" element={<CompanyView />} />
          <Route path="/warehouse-purchase-order" element={<WarehousePurchaseOrderViewPage />} />
          <Route path="/error" element={<ErrorPageView />} />
          <Route path="/notifications" element={<NotificationSettingsView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;