import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ClientView from './views/ClientView';
import AdminView from './views/AdminView';
import ManualProductsAdminView from './views/ManualProductsAdminView';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ClientView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/manual-products" element={<ManualProductsAdminView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;