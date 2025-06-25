import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)',
        color: '#fee100',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <AdminLogin />;
}

export default ProtectedRoute;
