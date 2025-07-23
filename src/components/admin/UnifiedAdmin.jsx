import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { useMusic } from '../../context/MusicContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AddTrackForm from './AddTrackForm';
import './UnifiedAdmin.css';

const UnifiedAdmin = () => {
  const { blogPosts, deleteBlogPost } = useBlog();
  const { musicCatalog, purchases, removeTrack } = useMusic();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTrackForm, setShowAddTrackForm] = useState(false);
  const [notification, setNotification] = useState('');

  // Calculate statistics
  const totalBlogPosts = blogPosts.length;
  const totalTracks = musicCatalog.length;
  const totalSales = purchases.length;
  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogPost(postId);
    }
  };

  const handleDeleteTrack = (trackId, trackTitle) => {
    if (window.confirm(`Are you sure you want to delete "${trackTitle}"?`)) {
      removeTrack(trackId);
      setNotification('Track deleted successfully');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleAddTrackSuccess = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="unified-admin">
      <div className="admin-container">
        <div className="admin-tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`tab ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
            Blog ({totalBlogPosts})
          </button>
          <button className={`tab ${activeTab === 'music' ? 'active' : ''}`} onClick={() => setActiveTab('music')}>
            Music ({totalTracks})
          </button>
          <button className={`tab ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
            Sales ({totalSales})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="section-header">
              <h2>Dashboard Overview</h2>
              <p>Welcome to your admin dashboard. Here's a quick overview of your site.</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{totalBlogPosts}</h3>
                  <p>Blog Posts</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🎵</div>
                <div className="stat-info">
                  <h3>{totalTracks}</h3>
                  <p>Music Tracks</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <h3>{totalSales}</h3>
                  <p>Total Sales</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/blog/new" className="action-btn">
                  ✏️ Create New Blog Post
                </Link>
                <button className="action-btn" onClick={() => setActiveTab('music')}>
                  🎵 Manage Music Catalog
                </button>
                <button className="action-btn" onClick={() => setActiveTab('sales')}>
                  📊 View Sales Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Management Tab */}
        {activeTab === 'blog' && (
          <div className="blog-section">
            <div className="section-header">
              <h2>Blog Management</h2>
              <Link to="/blog/new" className="add-btn">
                Create New Post
              </Link>
            </div>
            
            <div className="content-table">
              <div className="table-header">
                <div>Title</div>
                <div>Category</div>
                <div>Date</div>
                <div>Actions</div>
              </div>
              
              {blogPosts.map(post => (
                <div key={post.id} className="table-row">
                  <div className="post-info">
                    <h4>{post.title}</h4>
                    <p>{post.excerpt}</p>
                  </div>
                  <div className="category">{post.category}</div>
                  <div className="date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="actions">
                    <Link 
                      to={`/blog/${post.id}`}
                      className="view-btn"
                    >
                      View
                    </Link>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {blogPosts.length === 0 && (
                <div className="no-content">
                  <p>No blog posts yet. <Link to="/blog/new">Create your first post!</Link></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Music Management Tab */}
        {activeTab === 'music' && (
          <div className="music-section">
            <div className="section-header">
              <h2>Music Catalog Management</h2>
              <button 
                className="add-btn" 
                onClick={() => setShowAddTrackForm(true)}
              >
                Add New Track
              </button>
            </div>
            
            <div className="content-table">
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
                      <p>{track.artist} • {track.duration}</p>
                    </div>
                  </div>
                  <div className="price">${track.price}</div>
                  <div className="genre">{track.genre}</div>
                  <div className="actions">
                    <button className="edit-btn">Edit</button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteTrack(track.id, track.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sales Management Tab */}
        {activeTab === 'sales' && (
          <div className="sales-section">
            <div className="section-header">
              <h2>Sales & Revenue</h2>
              <div className="sales-stats">
                <div className="stat">
                  <span className="stat-value">{totalSales}</span>
                  <span className="stat-label">Total Sales</span>
                </div>
                <div className="stat">
                  <span className="stat-value">${totalRevenue.toFixed(2)}</span>
                  <span className="stat-label">Revenue</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    ${totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : '0.00'}
                  </span>
                  <span className="stat-label">Avg. Sale</span>
                </div>
              </div>
            </div>
            
            <div className="content-table">
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
                <div className="no-content">
                  <p>No sales yet. Sales will appear here after purchases are made.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Track Modal */}
      {showAddTrackForm && (
        <AddTrackForm 
          onClose={() => setShowAddTrackForm(false)}
          onSuccess={handleAddTrackSuccess}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className="admin-notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default UnifiedAdmin;
