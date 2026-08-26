import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../config/api';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('justmalik_demo_purchases') || '[]');
    } catch {
      return [];
    }
  });
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  const loadCatalog = async () => {
    setCatalogLoading(true);
    setCatalogError(null);

    try {
      const result = await apiRequest('/api/tracks');
      const tracks = result.tracks.map(track => ({
        ...track,
        id: track._id || track.id,
        coverImage: track.coverImageUrl || track.coverImage,
        audioPreview: track.audioPreviewUrl || track.audioPreview,
        length: track.duration || track.length,
      }));
      setCatalog(tracks);
    } catch (error) {
      setCatalogError(error.message);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    localStorage.setItem('justmalik_demo_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const addToCart = (track) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === track.id);
      if (existing) {
        return prev;
      }
      return [...prev, { ...track, quantity: 1 }];
    });
  };

  const removeFromCart = (trackId) => {
    setCart(prev => prev.filter(item => item.id !== trackId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addPurchase = (tracks) => {
    const purchaseData = tracks.map(track => ({
      ...track,
      purchaseDate: new Date().toISOString(),
      isDemoPurchase: true,
    }));
    setPurchases(prev => [...prev, ...purchaseData]);
    clearCart();
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const addTrack = (track) => {
    setCatalog(prev => [...prev, track]);
  };

  const removeTrack = (trackId) => {
    setCatalog(prev => prev.filter(track => track.id !== trackId));
  };

  const value = {
    musicCatalog: catalog,
    cart,
    purchases,
    addToCart,
    removeFromCart,
    clearCart,
    addPurchase,
    getTotalPrice,
    addTrack,
    removeTrack,
    catalogLoading,
    catalogError,
    loadCatalog
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
