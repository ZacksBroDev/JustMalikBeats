import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import ProfileEditModal from '../../components/user/ProfileEditModal';
import DownloadHistoryModal from '../../components/user/DownloadHistoryModal';
import './UserAccount.css';

const UserAccount = () => {
  const { currentUser, getUserPurchases, getTotalSpent, logout } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const purchases = getUserPurchases();

  if (!currentUser) {
    return (
      <div className="user-account">
        <div className="account-container">
          <h1>Please log in to view your account</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="user-account">
      <div className="account-container">
        <div className="account-header">
          <div className="user-info">
            <h1>My Account</h1>
            <div className="user-details">
              <h2>Welcome, {currentUser.name}!</h2>
              <p className="user-email">{currentUser.email}</p>
              <p className="join-date">Member since {new Date(currentUser.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="edit-profile-btn" 
              onClick={() => setIsEditModalOpen(true)}
            >
              ✏️ Edit Profile
            </button>
            <button className="logout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="account-stats">
          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-info">
              <h3>{purchases.length}</h3>
              <p>Tracks Purchased</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${getTotalSpent().toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{Math.floor((Date.now() - new Date(currentUser.joinDate)) / (1000 * 60 * 60 * 24))}</h3>
              <p>Days as Member</p>
            </div>
          </div>
        </div>

        <div className="purchase-history">
          <h3>Purchase History</h3>
          
          {purchases.length === 0 ? (
            <div className="no-purchases">
              <div className="no-purchases-icon">🎼</div>
              <h4>No purchases yet</h4>
              <p>Start building your music collection by purchasing tracks from our catalog!</p>
              <a href="/music" className="browse-music-btn">
                Browse Music Catalog
              </a>
            </div>
          ) : (
            <div className="purchases-list">
              {purchases.map(purchase => (
                <div key={purchase.id} className="purchase-item">
                  <div className="purchase-info">
                    <h4>{purchase.trackTitle}</h4>
                    <p className="artist">{purchase.artist}</p>
                    <p className="purchase-date">
                      Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="purchase-details">
                    <span className="price">${purchase.price.toFixed(2)}</span>
                    <div className="download-links">
                      <a 
                        href={purchase.downloadUrl} 
                        className="download-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📥 Download Track
                      </a>
                      <a 
                        href={purchase.stemsUrl} 
                        className="download-btn stems"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🎛️ Download Stems
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="account-actions">
          <h3>Account Actions</h3>
          <div className="action-buttons">
            <a href="/music" className="action-btn">
              🎵 Browse Music
            </a>
            <button 
              className="action-btn secondary" 
              onClick={() => setIsEditModalOpen(true)}
            >
              ⚙️ Edit Profile
            </button>
            <button 
              className="action-btn secondary" 
              onClick={() => setIsDownloadModalOpen(true)}
            >
              📁 Download History
            </button>
          </div>
        </div>
      </div>

      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      
      <DownloadHistoryModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default UserAccount;
