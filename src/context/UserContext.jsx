import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Sample users data (in production, this would be in a database)
const sampleUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123', // In production, this would be hashed
    name: 'John Doe',
    joinDate: '2024-01-15',
    purchases: [
      {
        id: 'purchase_1',
        trackId: 1,
        trackTitle: 'Denver Nights',
        artist: 'JustMalikBeats',
        price: 2.99,
        purchaseDate: '2024-12-01T10:30:00Z',
        downloadUrl: 'https://example.com/downloads/track-1.mp3',
        stemsUrl: 'https://example.com/downloads/stems-1.zip'
      }
    ],
    downloadHistory: [
      {
        purchaseId: 'purchase_1',
        trackTitle: 'Denver Nights',
        artist: 'JustMalikBeats',
        fileType: 'track',
        downloadUrl: 'https://example.com/downloads/track-1.mp3',
        downloadDate: '2024-12-02T14:20:00Z'
      }
    ]
  }
];

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(sampleUsers);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('justmalikbeats_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('justmalikbeats_user');
      }
    }
  }, []);

  // Save user to localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('justmalikbeats_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('justmalikbeats_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoginModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const { email, password, name } = userData;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const newUser = {
      id: Date.now(),
      email,
      password, // In production, hash this password
      name,
      joinDate: new Date().toISOString().split('T')[0],
      purchases: [],
      downloadHistory: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoginModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updateData) => {
    if (!currentUser) {
      return { success: false, error: 'No user logged in' };
    }

    const { name, email, currentPassword, newPassword } = updateData;

    // Check if email is being changed and if it's already taken
    if (email !== currentUser.email) {
      const existingUser = users.find(u => u.email === email && u.id !== currentUser.id);
      if (existingUser) {
        return { success: false, error: 'Email is already taken by another user' };
      }
    }

    // If changing password, verify current password
    if (newPassword) {
      if (currentUser.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }
    }

    // Create updated user object
    const updatedUser = {
      ...currentUser,
      name: name || currentUser.name,
      email: email || currentUser.email,
      ...(newPassword && { password: newPassword })
    };

    // Update current user state
    setCurrentUser(updatedUser);

    // Update users array
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));

    return { success: true };
  };

  const addPurchaseToUser = (purchases) => {
    if (!currentUser) return;

    const newPurchases = purchases.map(track => ({
      id: `purchase_${Date.now()}_${track.id}`,
      trackId: track.id,
      trackTitle: track.title,
      artist: track.artist,
      price: track.price,
      purchaseDate: new Date().toISOString(),
      downloadUrl: `https://example.com/downloads/track-${track.id}.mp3`,
      stemsUrl: `https://example.com/downloads/stems-${track.id}.zip`
    }));

    const updatedUser = {
      ...currentUser,
      purchases: [...currentUser.purchases, ...newPurchases]
    };

    setCurrentUser(updatedUser);
    
    // Update users array
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));
  };

  const getUserPurchases = () => {
    return currentUser ? currentUser.purchases : [];
  };

  const getTotalSpent = () => {
    if (!currentUser) return 0;
    return currentUser.purchases.reduce((total, purchase) => total + purchase.price, 0);
  };

  const hasPurchased = (trackId) => {
    if (!currentUser) return false;
    return currentUser.purchases.some(purchase => purchase.trackId === trackId);
  };

  const getDownloadHistory = () => {
    return currentUser ? (currentUser.downloadHistory || []) : [];
  };

  const addDownloadRecord = (downloadData) => {
    if (!currentUser) return;

    const newDownload = {
      ...downloadData,
      downloadDate: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      downloadHistory: [...(currentUser.downloadHistory || []), newDownload]
    };

    setCurrentUser(updatedUser);
    
    // Update users array
    setUsers(prev => prev.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));
  };

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
    closeLoginModal
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
