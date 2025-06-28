import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
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
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/blog/admin">Admin</Link></li>
      </ul>
    </nav>
  </header>
  );
};

export default NavBar;