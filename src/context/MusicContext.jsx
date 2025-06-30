import React, { createContext, useContext, useState } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

// Sample music catalog
const musicCatalog = [
  {
    id: 1,
    title: "Denver Nights",
    artist: "JustMalikBeats",
    price: 2.99,
    priceId: "price_1234567890", // Stripe Price ID
    audioPreview: "/audio/previews/denver-nights-preview.mp3",
    coverImage: "/294698_beats_icon.png",
    genre: "Hip-Hop",
    duration: "3:24",
    description: "A smooth hip-hop beat inspired by Denver's nightlife."
  },
  {
    id: 2,
    title: "Mountain High",
    artist: "JustMalikBeats", 
    price: 3.99,
    priceId: "price_0987654321",
    audioPreview: "/audio/previews/mountain-high-preview.mp3",
    coverImage: "/294698_beats_icon.png",
    genre: "Trap",
    duration: "2:56",
    description: "High-energy trap beat with Colorado mountain vibes."
  },
  {
    id: 3,
    title: "Studio Sessions",
    artist: "JustMalikBeats",
    price: 4.99,
    priceId: "price_1122334455",
    audioPreview: "/audio/previews/studio-sessions-preview.mp3",
    coverImage: "/294698_beats_icon.png",
    genre: "R&B",
    duration: "4:12",
    description: "Smooth R&B instrumental perfect for late-night sessions."
  }
];

export const MusicProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [catalog, setCatalog] = useState(musicCatalog);

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
      downloadUrl: `https://example.com/downloads/track-${track.id}.mp3`,
      stemsUrl: `https://example.com/downloads/stems-${track.id}.zip`
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
    removeTrack
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
