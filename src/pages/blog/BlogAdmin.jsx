import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import './BlogAdmin.css';

const BlogAdmin = () => {
  const { blogPosts, deleteBlogPost } = useBlog();
  const { logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDelete = (postId) => {
    deleteBlogPost(postId);
    setShowDeleteConfirm(null);
  };

  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="logo">
            <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats-Logo" />
            <h1>JustMalikBeats</h1>
        </div>
        
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/blog/admin" className="active">Admin</Link></li>
            <li>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="admin-hero">
        <h1>Blog Administration</h1>
        <p>Manage your blog posts and content</p>
        <Link to="/blog/new" className="create-post-btn">
          <span>+</span>
          Create New Post
        </Link>
      </div>

      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Posts</h3>
              <p>{blogPosts.length}</p>
            </div>
            <div className="stat-card">
              <h3>Categories</h3>
              <p>{new Set(blogPosts.map(post => post.category)).size}</p>
            </div>
            <div className="stat-card">
              <h3>Latest Post</h3>
              <p>{sortedPosts[0] ? new Date(sortedPosts[0].date).toLocaleDateString() : 'No posts'}</p>
            </div>
          </div>

          <div className="posts-management">
            <h2>Manage Posts</h2>
            <div className="posts-table">
              {sortedPosts.map(post => (
                <div key={post.id} className="post-row">
                  <div className="post-info">
                    <h3>
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <div className="post-meta">
                      <span className="category">{post.category}</span>
                      <span className="date">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <p className="excerpt">{post.excerpt}</p>
                  </div>
                  <div className="post-actions">
                    <Link to={`/blog/${post.id}`} className="btn-view">
                      View
                    </Link>
                    <button 
                      onClick={() => setShowDeleteConfirm(post.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="admin-footer">
        <div className="footer-content">
          <p>&copy; 2025 JustMalikBeats. All rights reserved.</p>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn-confirm-delete"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;
