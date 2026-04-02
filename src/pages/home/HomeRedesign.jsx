import React from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import Button from '../../components/atoms/Button';
import TrackCard from '../../components/molecules/TrackCard';
import { heroImages, ctaImages } from '../../assets/images/imageAssets';
import './HomeRedesign.css';

const HomeRedesign = () => {
  const { musicCatalog, addToCart, cart } = useMusic();

  const featuredTracks = musicCatalog.slice(0, 3);

  const handleAddToCart = (track) => {
    addToCart(track);
  };

  const isInCart = (trackId) => {
    return cart.some(item => item.id === trackId);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background" aria-hidden="true">
          <img
            src={heroImages.studio}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="hero__content">
          <h1 className="hero__title">
            Beats Built in Denver.
            <br />
            <span className="hero__accent">Made for You.</span>
          </h1>
          <p className="hero__subtitle">
            Underground production. Premium sound. License and download instantly.
          </p>
          <div className="hero__actions">
            <Link to="/catalog">
              <Button variant="primary" size="lg">Browse Catalog</Button>
            </Link>
            <a 
              href="https://open.spotify.com/artist/31qEeNT1N54KjOMpPh3OmA" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">Listen on Spotify</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Beats */}
      <section className="featured">
        <div className="container">
          <div className="section-header">
            <h2>Featured Beats</h2>
            <Link to="/catalog" className="section-link">View All →</Link>
          </div>

          <div className="track-grid">
            {featuredTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onAddToCart={handleAddToCart}
                onPreview={() => {}}
                isInCart={isInCart(track.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value">
        <div className="container">
          <div className="value-grid">
            <div className="value-card">
              <div className="value-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              </div>
              <h3>Instant Download</h3>
              <p>License and download immediately after purchase. No waiting, no hassle.</p>
            </div>

            <div className="value-card">
              <div className="value-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13M9 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/>
                </svg>
              </div>
              <h3>Studio Quality</h3>
              <p>Professional production, mixed and mastered to industry standards.</p>
            </div>

            <div className="value-card">
              <div className="value-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                </svg>
              </div>
              <h3>Exclusive Sound</h3>
              <p>Unique beats crafted for serious artists. Stand out from the crowd.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Work CTA */}
      <section className="custom-cta">
        <div className="container">
          <div className="custom-cta__content">
            <div className="custom-cta__text">
              <h2>Need a Custom Beat?</h2>
              <p>
                Let's collaborate. Get a one-of-a-kind production tailored specifically to your vision and style.
              </p>
              <a href="mailto:contact@malikbeats.com">
                <Button variant="primary" size="lg">Get in Touch</Button>
              </a>
            </div>
            <div className="custom-cta__visual">
              <img
                src={ctaImages.customBeat}
                alt="Custom beat concept visual with mountain landscape and production gear"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeRedesign;
