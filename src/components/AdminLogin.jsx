import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const success = login(password);
    
    if (!success) {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <h2>Admin Access</h2>
            <p>Enter your password to access the blog admin panel</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={isSubmitting || !password}
            >
              {isSubmitting ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>Secure access for JustMalikBeats admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
