import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import './AccountDashboard.css';

const AccountDashboard = () => {
  const { user } = useUser();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  // Sample purchase history - replace with actual data
  const purchases = [
    {
      id: 1,
      title: "Dark Phonk Beat",
      date: "2024-01-15",
      price: 29.99,
      downloadUrl: "/downloads/dark-phonk-beat.zip"
    },
    {
      id: 2,
      title: "Trap Soul Beat",
      date: "2024-01-10",
      price: 34.99,
      downloadUrl: "/downloads/trap-soul-beat.zip"
    },
    {
      id: 3,
      title: "Neon Drill Beat",
      date: "2024-01-05",
      price: 24.99,
      downloadUrl: "/downloads/neon-drill-beat.zip"
    }
  ];

  const stats = {
    totalPurchases: purchases.length,
    totalSpent: purchases.reduce((sum, p) => sum + p.price, 0),
    totalDownloads: purchases.length * 2
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDownload = (downloadUrl) => {
    window.location.href = downloadUrl;
  };

  return (
    <div className="account">
      <div className="container">
        {/* Header with User Info */}
        <div className="account__header">
          <div className="account__user-info">
            <div className="account__avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1>{user?.name || 'User'}</h1>
              <p className="account__email">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="md"
            onClick={() => setShowProfileEdit(true)}
          >
            Edit Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="account__stats">
          <Card>
            <div className="stat-card">
              <div className="stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">{stats.totalPurchases}</div>
                <div className="stat-card__label">Purchases</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="stat-card">
              <div className="stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">${stats.totalSpent.toFixed(2)}</div>
                <div className="stat-card__label">Total Spent</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="stat-card">
              <div className="stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-card__content">
                <div className="stat-card__value">{stats.totalDownloads}</div>
                <div className="stat-card__label">Downloads</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Purchase History */}
        <section className="account__section">
          <h2>Purchase History</h2>
          
          {purchases.length > 0 ? (
            <Card>
              <div className="purchase-table">
                <div className="purchase-table__header">
                  <div>Track</div>
                  <div>Date</div>
                  <div>Price</div>
                  <div>Download</div>
                </div>
                
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="purchase-table__row">
                    <div className="purchase-table__title">{purchase.title}</div>
                    <div className="purchase-table__date">{formatDate(purchase.date)}</div>
                    <div className="purchase-table__price">${purchase.price.toFixed(2)}</div>
                    <div className="purchase-table__action">
                      <button
                        className="download-button"
                        onClick={() => handleDownload(purchase.downloadUrl)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.83334 8.33333L10 12.5L14.1667 8.33333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 12.5V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="account__empty">
              <p>No purchases yet</p>
              <Button variant="primary" size="md">Browse Catalog</Button>
            </div>
          )}
        </section>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="modal-overlay" onClick={() => setShowProfileEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Edit Profile</h2>
              <button 
                className="modal__close"
                onClick={() => setShowProfileEdit(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <form className="modal__content">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  defaultValue={user?.name}
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  defaultValue={user?.email}
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="modal__actions">
                <Button 
                  variant="ghost" 
                  size="md"
                  onClick={() => setShowProfileEdit(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDashboard;
