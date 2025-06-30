import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './MusicAdmin.css';

const MusicAdmin = () => {
  const { musicCatalog, purchases } = useMusic();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');

  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
  const totalSales = purchases.length;

  return (
    <div className="music-admin">
      <header className="admin-header">
        <div className="logo">
          <Link to="/">
            <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats-Logo" />
            <h1>Music Admin</h1>
          </Link>
        </div>
        
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/music">Music Store</Link></li>
            <li><Link to="/blog/admin">Blog Admin</Link></li>
            <li>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="admin-container">
        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Music Catalog ({musicCatalog.length})
          </button>
          <button 
            className={`tab ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales ({totalSales})
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="catalog-management">
            <div className="section-header">
              <h2>Music Catalog Management</h2>
              <button className="add-track-btn">Add New Track</button>
            </div>
            
            <div className="tracks-table">
              <div className="table-header">
                <div>Track</div>
                <div>Price</div>
                <div>Genre</div>
                <div>Actions</div>
              </div>
              
              {musicCatalog.map(track => (
                <div key={track.id} className="table-row">
                  <div className="track-info">
                    <img src={track.coverImage} alt={track.title} />
                    <div>
                      <h4>{track.title}</h4>
                      <p>{track.artist}</p>
                    </div>
                  </div>
                  <div className="price">${track.price}</div>
                  <div className="genre">{track.genre}</div>
                  <div className="actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="sales-management">
            <div className="section-header">
              <h2>Sales History</h2>
              <div className="sales-stats">
                <div className="stat">
                  <span className="stat-value">{totalSales}</span>
                  <span className="stat-label">Total Sales</span>
                </div>
                <div className="stat">
                  <span className="stat-value">${totalRevenue.toFixed(2)}</span>
                  <span className="stat-label">Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="sales-table">
              <div className="table-header">
                <div>Track</div>
                <div>Price</div>
                <div>Date</div>
                <div>Status</div>
              </div>
              
              {purchases.map((purchase, index) => (
                <div key={index} className="table-row">
                  <div className="track-info">
                    <div>
                      <h4>{purchase.title}</h4>
                      <p>{purchase.artist}</p>
                    </div>
                  </div>
                  <div className="price">${purchase.price}</div>
                  <div className="date">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </div>
                  <div className="status">
                    <span className="status-badge completed">Completed</span>
                  </div>
                </div>
              ))}
              
              {purchases.length === 0 && (
                <div className="no-sales">
                  <p>No sales yet. Tracks will appear here after purchases.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics">
            <div className="section-header">
              <h2>Analytics Dashboard</h2>
            </div>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue Overview</h3>
                <div className="big-number">${totalRevenue.toFixed(2)}</div>
                <p>Total Revenue</p>
              </div>
              
              <div className="analytics-card">
                <h3>Popular Tracks</h3>
                <div className="track-list">
                  {musicCatalog.slice(0, 3).map(track => (
                    <div key={track.id} className="popular-track">
                      <span>{track.title}</span>
                      <span>{track.genre}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Sales Metrics</h3>
                <div className="metrics">
                  <div className="metric">
                    <span className="metric-value">{totalSales}</span>
                    <span className="metric-label">Total Sales</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">
                      ${totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : '0.00'}
                    </span>
                    <span className="metric-label">Avg. Sale Value</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicAdmin;
