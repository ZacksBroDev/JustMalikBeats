import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import './NewBlogPost.css';

const NewBlogPost = () => {
  const navigate = useNavigate();
  const { addBlogPost } = useBlog();
  const { logout } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Production',
    content: '',
    tags: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Production', 'Education', 'Industry', 'Reviews', 'Personal'];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process tags (convert comma-separated string to array)
      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      // Format content with basic HTML paragraphs
      const processedContent = formData.content
        .split('\n\n')
        .filter(paragraph => paragraph.trim().length > 0)
        .map(paragraph => `<p>${paragraph.trim()}</p>`)
        .join('\n\n');

      // Handle image upload
      let imageUrl = '/src/assets/icons/294698_beats_icon.png'; // Default image
      
      if (formData.image) {
        // Convert file to base64 data URL for storage
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(formData.image);
        });
      }

      const newPost = {
        ...formData,
        content: processedContent,
        tags: processedTags,
        image: imageUrl
      };

      const newPostId = addBlogPost(newPost);
      navigate(`/blog/${newPostId}`);
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('There was an error creating your blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  return (
    <div className="new-blog-post">
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
            <li><Link to="/admin">Admin</Link></li>
            <li>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="new-blog-post-container">
        <header className="new-blog-post-header">
          <h1>Create New Blog Post</h1>
          <p>Share your thoughts, experiences, and insights with the community</p>
        </header>

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter your blog post title..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt *</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Write a brief summary of your post..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Featured Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                      document.getElementById('image').value = '';
                    }}
                    className="remove-image"
                  >
                    Remove
                  </button>
                </div>
              )}
              <small>Upload an image file (JPG, PNG, GIF, etc.)</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., production, beats, studio)"
            />
            <small>Separate multiple tags with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="15"
              placeholder="Write your blog post content here...

Use double line breaks to separate paragraphs.

You can write naturally and the formatting will be handled automatically."
            />
            <small>Use double line breaks to separate paragraphs. Basic formatting will be applied automatically.</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Creating Post...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBlogPost;
