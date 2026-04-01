import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useMusic } from '../../context/MusicContext';
import './NavbarRedesign.css';

const NavbarRedesign = () => {
  const { currentUser, isLoggedIn, openLoginModal, logout } = useUser();
  const { cart } = useMusic();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar__logo-mark">MB</div>
          <span className="navbar__logo-text">MALIK BEATS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__nav">
          <Link 
            to="/" 
            className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/catalog" 
            className={`navbar__link ${isActive('/catalog') || isActive('/music') ? 'navbar__link--active' : ''}`}
          >
            Catalog
          </Link>
          <Link 
            to="/blog" 
            className={`navbar__link ${isActive('/blog') ? 'navbar__link--active' : ''}`}
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Cart */}
          <Link to="/catalog" className="navbar__cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {cart.length > 0 && (
              <span className="navbar__cart-badge">{cart.length}</span>
            )}
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="navbar__user">
              <Link to="/account" className="navbar__user-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="navbar__user-name">{currentUser?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="navbar__logout">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={openLoginModal} className="navbar__sign-in">
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar__mobile-toggle ${mobileMenuOpen ? 'navbar__mobile-toggle--active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="navbar__mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <nav className="navbar__mobile-menu">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>Catalog</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            {isLoggedIn ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}>Sign In</button>
            )}
          </nav>
        </>
      )}
    </header>
  );
};

export default NavbarRedesign;
