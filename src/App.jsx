import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home/home';
import Blog from './pages/blog/Blog';
import BlogPost from './pages/blog/BlogPost';
import NewBlogPost from './pages/blog/NewBlogPost';
import BlogAdmin from './pages/blog/BlogAdmin';
import NavBar from './components/NavBar';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/new" element={
            <ProtectedRoute>
              <NewBlogPost />
            </ProtectedRoute>
          } />
          <Route path="/blog/admin" element={
            <ProtectedRoute>
              <BlogAdmin />
            </ProtectedRoute>
          } />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </BlogProvider>
    </AuthProvider>
  )
}

export default App
