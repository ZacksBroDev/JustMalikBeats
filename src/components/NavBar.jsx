import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './NavBar.css';
import malikLogo from '../assets/icons/MALIKBEATSLOGO.jpg';

const NavBar = () => {
  const { currentUser, isLoggedIn, openLoginModal, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="blog-header">
      <div className="logo">
        <Link to="/" onClick={closeMobileMenu}>
          <img
            src={malikLogo}
            alt="JustMalikBeats-Logo"
          />
          <h1>JustMalikBeats</h1>
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu}></div>
      )}

      <nav className={`navbar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/music" onClick={closeMobileMenu}>
              Music
            </Link>
          </li>
          <li>
            <Link to="/blog" onClick={closeMobileMenu}>
              Blog
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/account" onClick={closeMobileMenu}>
                  My Account
                </Link>
              </li>
              <li className="user-menu">
                <span className="user-name">
                  Hi, {currentUser?.name?.split(" ")[0]}!
                </span>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="logout-link"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => {
                  openLoginModal();
                  closeMobileMenu();
                }}
                className="login-link"
              >
                Sign In
              </button>
            </li>
          )}
          <li>
            <Link to="/admin" onClick={closeMobileMenu}>
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;