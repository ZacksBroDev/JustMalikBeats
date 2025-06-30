import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home/home';
import Blog from './pages/blog/Blog';
import BlogPost from './pages/blog/BlogPost';
import NewBlogPost from './pages/blog/NewBlogPost';
import Music from './pages/music/Music';
import UserAccount from './pages/account/UserAccount';
import UnifiedAdmin from './components/admin/UnifiedAdmin';
import NavBar from './components/NavBar';
import UserModal from './components/user/UserModal';

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <BlogProvider>
          <MusicProvider>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/new" element={
                <ProtectedRoute>
                  <NewBlogPost />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <UnifiedAdmin />
                </ProtectedRoute>
              } />
              {/* Redirect old admin routes to new unified admin */}
              <Route path="/blog/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/music/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/music" element={<Music />} />
              <Route path="/account" element={<UserAccount />} />
            </Routes>
            <UserModal />
          </MusicProvider>
        </BlogProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
