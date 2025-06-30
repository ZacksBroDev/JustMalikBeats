import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useUser } from '../../context/UserContext';
import './TestCheckout.css';

const TestCheckout = ({ cart, total, onSuccess, onCancel }) => {
  const { addPurchase } = useMusic();
  const { addPurchaseToUser } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Add to global purchases (for admin tracking)
      addPurchase(cart);
      
      // Add to user's purchase history
      addPurchaseToUser(cart);
      
      setIsProcessing(false);
      onSuccess();
      alert('Test payment successful! Check your account to see your purchased tracks.');
    }, 2000);
  };

  return (
    <div className="test-checkout">
      <div className="test-notice">
        <h3>⚠️ Test Mode</h3>
        <p>Stripe is not configured. This is a test checkout.</p>
        <p>In production, this would process real payments.</p>
      </div>

      <div className="test-payment-form">
        <h3>Test Payment Information</h3>
        
        <div className="test-card-info">
          <div className="form-group">
            <label>Card Number</label>
            <input 
              type="text" 
              value="4242 4242 4242 4242" 
              disabled 
              className="test-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Expiry</label>
              <input 
                type="text" 
                value="12/28" 
                disabled 
                className="test-input"
              />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input 
                type="text" 
                value="123" 
                disabled 
                className="test-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="pay-button"
          onClick={handleTestPayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Test Payment...' : `Test Pay $${total}`}
        </button>
      </div>

      <div className="payment-info">
        <p>🧪 This is a test mode checkout</p>
        <p>💡 Configure Stripe keys for real payments</p>
      </div>
    </div>
  );
};

export default TestCheckout;
