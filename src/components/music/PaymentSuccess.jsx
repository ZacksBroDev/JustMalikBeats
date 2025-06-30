import React from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import './PaymentSuccess.css';

const PaymentSuccess = ({ onContinueShopping }) => {
  const { purchases } = useMusic();

  return (
    <div className="payment-success">
      <div className="success-icon">
        <div className="checkmark">✓</div>
      </div>
      
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your tracks are ready to download.</p>
      
      <div className="purchased-tracks">
        <h3>Your Purchased Tracks:</h3>
        {purchases.slice(-3).map(track => (
          <div key={track.id} className="purchased-track">
            <div className="track-info">
              <h4>{track.title}</h4>
              <p>{track.artist} • {track.genre}</p>
            </div>
            <div className="download-actions">
              <button className="download-btn">
                Download MP3
              </button>
              <button className="download-btn stems">
                Download Stems
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="success-actions">
        <button 
          className="continue-shopping-btn"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
        <Link to="/" className="home-btn">
          Back to Home
        </Link>
      </div>
      
      <div className="support-info">
        <p>📧 Download links have been sent to your email</p>
        <p>❓ Questions? Contact support@justmalikbeats.com</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
