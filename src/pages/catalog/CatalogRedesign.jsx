import React, { useState, useMemo } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useUser } from '../../context/UserContext';
import TrackCard from '../../components/molecules/TrackCard';
import Button from '../../components/atoms/Button';
import './CatalogRedesign.css';

const CatalogRedesign = () => {
  const { musicCatalog, cart, addToCart } = useMusic();
  const { isLoggedIn, openLoginModal } = useUser();
  const [sortBy, setSortBy] = useState('newest');
  const [previewingTrack, setPreviewingTrack] = useState(null);

  const getTotalPrice = () => {
    return cart.reduce((total, track) => total + parseFloat(track.price), 0).toFixed(2);
  };

  const isInCart = (trackId) => {
    return cart.some(item => item.id === trackId);
  };

  const handleAddToCart = (track) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    addToCart(track);
  };

  const handlePreview = (trackId) => {
    setPreviewingTrack(previewingTrack === trackId ? null : trackId);
  };

  const sortedCatalog = useMemo(() => {
    const sorted = [...musicCatalog];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        return sorted;
    }
  }, [musicCatalog, sortBy]);

  return (
    <div className="catalog">
      {/* Header */}
      <div className="catalog__header">
        <div className="container">
          <div className="catalog__header-content">
            <div>
              <h1>Beat Catalog</h1>
              <p>{musicCatalog.length} beats available</p>
            </div>
            
            {cart.length > 0 && (
              <div className="catalog__cart-summary">
                <div className="catalog__cart-info">
                  <span className="catalog__cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                  <span className="catalog__cart-total">${getTotalPrice()}</span>
                </div>
                <Button variant="primary" size="md">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="catalog__controls">
        <div className="container">
          <div className="catalog__controls-content">
            {/* Sort */}
            <div className="catalog__sort">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="catalog__select"
              >
                <option value="newest">Newest</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="catalog__grid">
        <div className="container">
          <div className="track-grid">
            {sortedCatalog.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onAddToCart={handleAddToCart}
                onPreview={handlePreview}
                isPreviewing={previewingTrack === track.id}
                isInCart={isInCart(track.id)}
              />
            ))}
          </div>

          {sortedCatalog.length === 0 && (
            <div className="catalog__empty">
              <h2>No beats found</h2>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogRedesign;
