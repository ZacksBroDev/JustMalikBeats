import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import { useUser } from '../../context/UserContext';
import TrackCard from '../../components/molecules/TrackCard';
import Button from '../../components/atoms/Button';
import './CatalogRedesign.css';

const CatalogRedesign = () => {
  const {
    musicCatalog,
    cart,
    addToCart,
    catalogLoading,
    catalogError,
    loadCatalog,
  } = useMusic();
  const { isLoggedIn, openLoginModal } = useUser();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('newest');
  const [previewingTrack, setPreviewingTrack] = useState(null);
  const [previewErrorTrackId, setPreviewErrorTrackId] = useState(null);
  const activeAudioRef = useRef(null);

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

  const clearActivePreview = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.src = '';
      activeAudioRef.current.onended = null;
      activeAudioRef.current.onerror = null;
      activeAudioRef.current = null;
    }

    setPreviewingTrack(null);
  };

  const hasPreviewSource = (track) => {
    return typeof track.audioPreview === 'string' && track.audioPreview.trim().length > 0;
  };

  const handlePreview = async (track) => {
    if (!track || !track.id) {
      return;
    }

    if (!hasPreviewSource(track)) {
      clearActivePreview();
      setPreviewErrorTrackId(track.id);
      return;
    }

    if (previewingTrack === track.id) {
      clearActivePreview();
      setPreviewErrorTrackId(null);
      return;
    }

    clearActivePreview();

    const previewAudio = new Audio(track.audioPreview);
    activeAudioRef.current = previewAudio;
    previewAudio.onended = () => {
      clearActivePreview();
      setPreviewErrorTrackId(null);
    };
    previewAudio.onerror = () => {
      clearActivePreview();
      setPreviewErrorTrackId(track.id);
    };

    try {
      await previewAudio.play();
      setPreviewingTrack(track.id);
      setPreviewErrorTrackId(null);
    } catch {
      clearActivePreview();
      setPreviewErrorTrackId(track.id);
    }
  };

  useEffect(() => {
    return () => {
      clearActivePreview();
    };
  }, []);

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
              <p>{catalogLoading ? 'Loading beats...' : `${musicCatalog.length} beats available`}</p>
            </div>
            
            {cart.length > 0 && (
              <div className="catalog__cart-summary">
                <div className="catalog__cart-info">
                  <span className="catalog__cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                  <span className="catalog__cart-total">${getTotalPrice()}</span>
                </div>
                <Button variant="primary" size="md" onClick={() => navigate('/checkout')}>
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
          {catalogLoading && (
            <div className="catalog__status" role="status">
              <h2>Loading the catalog</h2>
              <p>Preparing the latest beats.</p>
            </div>
          )}

          {!catalogLoading && catalogError && (
            <div className="catalog__status catalog__status--error" role="alert">
              <h2>We could not load the catalog</h2>
              <p>{catalogError}</p>
              <Button variant="primary" size="md" onClick={loadCatalog}>
                Try Again
              </Button>
            </div>
          )}

          {!catalogLoading && !catalogError && sortedCatalog.length > 0 && (
            <div className="track-grid">
              {sortedCatalog.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onAddToCart={handleAddToCart}
                  onPreview={handlePreview}
                  previewMessage={previewErrorTrackId === track.id ? 'Preview unavailable' : null}
                  isPreviewing={previewingTrack === track.id}
                  isInCart={isInCart(track.id)}
                />
              ))}
            </div>
          )}

          {!catalogLoading && !catalogError && sortedCatalog.length === 0 && (
            <div className="catalog__status" role="status">
              <h2>No beats available yet</h2>
              <p>Check back soon for new releases.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogRedesign;
