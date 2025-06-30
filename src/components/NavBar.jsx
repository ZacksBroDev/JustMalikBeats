import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { currentUser, isLoggedIn, openLoginModal, logout } = useUser();

  return (
    <header className="blog-header">
    <div className="logo">
      <Link to="/">
        <img src="/src/assets/icons/MALIKBEATSLOGO.jpg" alt="JustMalikBeats-Logo" />
        <h1>JustMalikBeats</h1>
      </Link>
    </div>
    
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/music">Music</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/account">My Account</Link></li>
            <li className="user-menu">
              <span className="user-name">Hi, {currentUser?.name?.split(' ')[0]}!</span>
              <button onClick={logout} className="logout-link">Sign Out</button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={openLoginModal} className="login-link">
              Sign In
            </button>
          </li>
        )}
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  </header>
  );
};

export default NavBar;