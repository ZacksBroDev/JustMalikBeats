import React from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import './PaymentSuccess.css';

const PaymentSuccess = ({ onContinueShopping }) => {
  const { purchases } = useMusic();
  const recentPurchases = purchases.slice(-3);

  const downloadReceipt = (track) => {
    const receipt = [
      'JustMalikBeats Demo Purchase',
      `Track: ${track.title}`,
      `Artist: ${track.artist}`,
      `Price: $${Number(track.price).toFixed(2)}`,
      `Purchased: ${new Date(track.purchaseDate).toLocaleString()}`,
      '',
      'This is a simulated demo purchase. No payment was processed.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([receipt], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="payment-success">
      <div className="success-icon">
        <div className="checkmark">✓</div>
      </div>
      
      <h1>Demo purchase complete</h1>
      <p>Your simulated order has been saved to your account.</p>
      
      <div className="purchased-tracks">
        <h3>Your Purchased Tracks:</h3>
        {recentPurchases.map(track => (
          <div key={track.id} className="purchased-track">
            <div className="track-info">
              <h4>{track.title}</h4>
              <p>{track.artist} • {track.genre}</p>
            </div>
            <div className="download-actions">
              <button className="download-btn" onClick={() => downloadReceipt(track)}>
                Download Receipt
              </button>
              <span className="download-unavailable">Audio not configured</span>
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
        <p>This demo does not process a real payment or deliver audio files.</p>
        <p>Audio downloads will appear here when licensed files are configured.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
