import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import './AddTrackForm.css';

const AddTrackForm = ({ onClose, onSuccess }) => {
  const { addTrack } = useMusic();
  const [formData, setFormData] = useState({
    title: '',
    artist: 'JustMalikBeats',
    price: '',
    genre: 'Hip-Hop',
    duration: '',
    description: '',
    coverImage: null,
    audioPreview: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = ['Hip-Hop', 'Trap', 'R&B', 'Pop', 'Electronic', 'Jazz', 'Rock', 'Other'];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        
        if (name === 'coverImage') {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
        }
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
      // Convert cover image to base64 if provided
      let coverImageUrl = '/294698_beats_icon.png'; // Default
      if (formData.coverImage) {
        const reader = new FileReader();
        coverImageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(formData.coverImage);
        });
      }

      // Create new track object
      const newTrack = {
        id: Date.now(), // Simple ID generation
        title: formData.title,
        artist: formData.artist,
        price: parseFloat(formData.price),
        priceId: `price_${Date.now()}`, // Generate Stripe price ID placeholder
        audioPreview: formData.audioPreview ? URL.createObjectURL(formData.audioPreview) : null,
        coverImage: coverImageUrl,
        genre: formData.genre,
        duration: formData.duration,
        description: formData.description
      };

      // Add track to catalog
      addTrack(newTrack);
      
      // Success notification
      onSuccess('Track added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding track:', error);
      alert('There was an error adding the track. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    onClose();
  };

  return (
    <div className="add-track-overlay">
      <div className="add-track-form">
        <div className="form-header">
          <h2>Add New Track</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="track-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Track Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter track title..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                placeholder="Artist name..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (USD) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="2.99"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Genre *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="3:24"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">Cover Image</label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
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
                      setFormData(prev => ({ ...prev, coverImage: null }));
                      document.getElementById('coverImage').value = '';
                    }}
                    className="remove-image"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="audioPreview">Audio Preview</label>
            <input
              type="file"
              id="audioPreview"
              name="audioPreview"
              accept="audio/*"
              onChange={handleChange}
              className="file-input"
            />
            <small>Upload a short preview (30 seconds recommended)</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe your track..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Adding Track...' : 'Add Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrackForm;
