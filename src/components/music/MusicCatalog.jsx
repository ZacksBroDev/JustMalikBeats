import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useUser } from '../../context/UserContext';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../../config/stripe';
import CheckoutForm from './CheckoutForm';
import TestCheckout from './TestCheckout';
import PaymentSuccess from './PaymentSuccess';
import CartNotification from './CartNotification';
import './MusicCatalog.css';

const MusicCatalog = () => {
  const { musicCatalog, cart, addToCart, removeFromCart, getTotalPrice, clearCart } = useMusic();
  const { isLoggedIn, openLoginModal, hasPurchased } = useUser();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    if (!isLoggedIn) {
      setNotification({
        show: true,
        message: 'Please sign in to purchase tracks'
      });
      openLoginModal();
      return;
    }
    
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setShowSuccess(true);
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
  };

  const handleAddToCart = (track) => {
    addToCart(track);
    setNotification({
      show: true,
      message: `"${track.title}" added to cart!`
    });
  };

  const handleRemoveFromCart = (trackId, title) => {
    removeFromCart(trackId);
    setNotification({
      show: true,
      message: `"${title}" removed from cart!`
    });
  };

  const handlePlayPreview = (trackId) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
      // In a real app, you'd play the audio file here
      setTimeout(() => setCurrentlyPlaying(null), 3000); // Auto-stop after 3 seconds
    }
  };

  // Show success page after payment
  if (showSuccess) {
    return <PaymentSuccess onContinueShopping={handleContinueShopping} />;
  }

  if (showCheckout) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h2>Complete Your Purchase</h2>
          <button 
            className="back-button"
            onClick={handlePaymentCancel}
          >
            ← Back to Catalog
          </button>
        </div>
        
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map(track => (
            <div key={track.id} className="checkout-item">
              <span>{track.title}</span>
              <span>${track.price}</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Total: ${getTotalPrice()}</strong>
          </div>
        </div>

        {/* Check if Stripe is properly configured */}
        {stripePromise && process.env.NODE_ENV === 'production' ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              cart={cart}
              total={getTotalPrice()}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </Elements>
        ) : (
          <TestCheckout 
            cart={cart}
            total={getTotalPrice()}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </div>
    );
  }

  return (
    <div className="music-catalog">
      <div className="catalog-header">
        <h1>Music Catalog</h1>
        <div className="cart-summary">
          <span>Cart ({cart.length} items)</span>
          {cart.length > 0 && (
            <span className="cart-total">${getTotalPrice()}</span>
          )}
        </div>
      </div>

      <div className="catalog-grid">
        {musicCatalog.map(track => (
          <div key={track.id} className="track-card">
            <div className="track-image">
              <img src={track.coverImage} alt={track.title} />
              <div className="track-overlay">
                <button 
                  className="play-preview"
                  onClick={() => handlePlayPreview(track.id)}
                >
                  {currentlyPlaying === track.id ? '⏸' : '▶'}
                </button>
              </div>
            </div>
            
            <div className="track-info">
              <h3>{track.title}</h3>
              <p className="artist">{track.artist}</p>
              <p className="genre">{track.genre} • {track.duration}</p>
              <p className="description">{track.description}</p>
              
              <div className="track-actions">
                <span className="price">${track.price}</span>
                {hasPurchased(track.id) ? (
                  <button className="purchased-btn" disabled>
                    ✓ Purchased
                  </button>
                ) : cart.find(item => item.id === track.id) ? (
                  <button 
                    className="remove-from-cart"
                    onClick={() => handleRemoveFromCart(track.id, track.title)}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button 
                    className="add-to-cart"
                    onClick={() => handleAddToCart(track)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-section">
          <h3>Shopping Cart</h3>
          <div className="cart-items">
            {cart.map(track => (
              <div key={track.id} className="cart-item">
                <span>{track.title}</span>
                <span>${track.price}</span>
                <button onClick={() => removeFromCart(track.id)}>Remove</button>
              </div>
            ))}
          </div>
          
          <div className="cart-actions">
            <button className="clear-cart" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout - ${getTotalPrice()}
            </button>
          </div>
        </div>
      )}
      
      <CartNotification 
        message={notification.message}
        show={notification.show}
        onClose={() => setNotification({ show: false, message: '' })}
      />
    </div>
  );
};

export default MusicCatalog;
