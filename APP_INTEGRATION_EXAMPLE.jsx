// INTEGRATION EXAMPLE - Update your App.jsx with this structure

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { MusicProvider } from './context/MusicContext';

// Import redesigned organisms
import NavbarRedesign from './components/organisms/NavbarRedesign';
import FooterRedesign from './components/organisms/FooterRedesign';

// Import redesigned pages
import HomeRedesign from './pages/home/HomeRedesign';
import CatalogRedesign from './pages/catalog/CatalogRedesign';
import BlogRedesign from './pages/blog/BlogRedesign';
import AccountDashboard from './pages/account/AccountDashboard';

// Import existing components you want to keep
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/AdminLogin';
import UnifiedAdmin from './components/admin/UnifiedAdmin';

// Import design tokens
import './styles/tokens.css';
import './App.css';

function App() {
  return (
    <UserProvider>
      <MusicProvider>
        <Router>
          <div className="app">
            {/* Global Navigation */}
            <NavbarRedesign />
            
            {/* Main Content Area */}
            <main className="app__content">
              <Routes>
                {/* Public Routes - Redesigned */}
                <Route path="/" element={<HomeRedesign />} />
                <Route path="/catalog" element={<CatalogRedesign />} />
                <Route path="/blog" element={<BlogRedesign />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <AccountDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes (keep your existing admin) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <UnifiedAdmin />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Add other existing routes as needed */}
              </Routes>
            </main>
            
            {/* Global Footer */}
            <FooterRedesign />
          </div>
        </Router>
      </MusicProvider>
    </UserProvider>
  );
}

export default App;
