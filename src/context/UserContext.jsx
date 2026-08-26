import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../config/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('justmalik_auth_token')) {
      setLoading(false);
      return;
    }
    apiRequest('/api/auth/me')
      .then(result => setCurrentUser(result?.user || null))
      .catch(() => localStorage.removeItem('justmalik_auth_token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('justmalik_auth_token', token);
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const login = async (email, password) => {
    try {
      saveSession(await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuthRedirect: true,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async ({ email, password, name }) => {
    try {
      saveSession(await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
        skipAuthRedirect: true,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const adminLogin = async (password) => {
    try {
      saveSession(await apiRequest('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ password }),
        skipAuthRedirect: true,
      }));
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // Clear the local session when the server is unavailable.
    }
    localStorage.removeItem('justmalik_auth_token');
    localStorage.removeItem('justmalik_user_data');
    setCurrentUser(null);
  };

  const updateUserProfile = () => ({ success: false, error: 'Profile editing is not available yet' });
  const addPurchaseToUser = () => {};
  const getUserPurchases = () => currentUser?.purchases || [];
  const getTotalSpent = () => getUserPurchases().reduce((total, purchase) => total + purchase.price, 0);
  const hasPurchased = (trackId) => getUserPurchases().some(purchase => purchase.trackId === trackId);
  const getDownloadHistory = () => currentUser?.downloadHistory || [];
  const addDownloadRecord = () => {};

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    isLoginModalOpen,
    login,
    register,
    logout,
    updateUserProfile,
    addPurchaseToUser,
    getUserPurchases,
    getTotalSpent,
    hasPurchased,
    getDownloadHistory,
    addDownloadRecord,
    openLoginModal,
    closeLoginModal,
    adminLogin,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
