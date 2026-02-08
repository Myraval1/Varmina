import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { PublicCatalog } from './pages/PublicCatalog';
import { AdminDashboard } from './pages/AdminDashboard';
import { Layout, ProtectedRoute } from './components/Layout';

const App = () => {
  const location = useLocation();
  const isViewAdmin = location.pathname.startsWith('/admin');
  const view = isViewAdmin ? 'admin' : 'public';

  return (
    <Layout view={view}>
      <Routes>
        <Route path="/" element={<PublicCatalog />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
