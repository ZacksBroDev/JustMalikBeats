import React from 'react';
import { useUser } from '../context/UserContext';
import AdminLogin from './AdminLogin';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isLoggedIn, loading, openLoginModal } = useUser();

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

  if (!isLoggedIn) {
    return adminOnly ? (
      <AdminLogin />
    ) : (
      <div className="protected-route-message">
        <h1>Sign in to continue</h1>
        <button type="button" onClick={openLoginModal}>Sign In</button>
      </div>
    );
  }

  if (adminOnly && currentUser?.role !== 'admin') {
    return <div className="protected-route-message">Admin access required.</div>;
  }

  return children;
}

export default ProtectedRoute;
