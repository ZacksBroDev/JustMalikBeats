import React, { useState } from 'react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import './TrackCard.css';

const TrackCard = ({ 
  track, 
  onAddToCart, 
  onPreview,
  isPreviewing = false,
  isInCart = false 
}) => {
  const [imageError, setImageError] = useState(false);

  const handlePreview = (e) => {
    e.stopPropagation();
    onPreview(track.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(track);
  };

  return (
    <Card className="track-card">
      <div className="track-card__image">
        <img 
          src={imageError ? '/placeholder-cover.jpg' : track.coverImage}
          alt={track.title}
          onError={() => setImageError(true)}
        />
        <div className="track-card__overlay">
          <button 
            className="track-card__play"
            onClick={handlePreview}
            aria-label={`Preview ${track.title}`}
          >
            {isPreviewing ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="track-card__content">
        <h3 className="track-card__title">{track.title}</h3>
        
        <div className="track-card__meta">
          <span>{track.bpm} BPM</span>
          <span>•</span>
          <span>{track.key}</span>
          {track.length && (
            <>
              <span>•</span>
              <span>{track.length}</span>
            </>
          )}
        </div>
        
        <div className="track-card__footer">
          <span className="track-card__price">${track.price}</span>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TrackCard;
