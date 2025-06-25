import React, { createContext, useContext, useState, useEffect } from 'react';
import { blogPosts as initialBlogPosts } from '../pages/blog/blogData';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState([]);

  // Load blog posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('justmalikbeats_blog_posts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setBlogPosts(parsedPosts);
      } catch (error) {
        console.error('Error parsing saved blog posts:', error);
        setBlogPosts(initialBlogPosts);
      }
    } else {
      setBlogPosts(initialBlogPosts);
    }
  }, []);

  // Save blog posts to localStorage whenever posts change
  useEffect(() => {
    if (blogPosts.length > 0) {
      localStorage.setItem('justmalikbeats_blog_posts', JSON.stringify(blogPosts));
    }
  }, [blogPosts]);

  const addBlogPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: Math.max(...blogPosts.map(post => post.id), 0) + 1,
      date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      author: 'JustMalikBeats'
    };
    setBlogPosts([postWithId, ...blogPosts]);
    return postWithId.id;
  };

  const updateBlogPost = (id, updatedPost) => {
    setBlogPosts(posts => 
      posts.map(post => 
        post.id === parseInt(id) ? { ...post, ...updatedPost } : post
      )
    );
  };

  const deleteBlogPost = (id) => {
    setBlogPosts(posts => posts.filter(post => post.id !== parseInt(id)));
  };

  const getBlogPost = (id) => {
    return blogPosts.find(post => post.id === parseInt(id));
  };

  const value = {
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPost
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
