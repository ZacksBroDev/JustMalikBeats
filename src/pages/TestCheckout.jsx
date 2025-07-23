import React, { useState } from 'react';
import EmbeddedCheckout from '../components/music/EmbeddedCheckout';

const TestCheckout = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Mock cart data
  const mockCart = [
    {
      id: 1,
      title: 'Test Beat',
      name: 'Test Beat',
      description: 'A sample beat for testing',
      price: 29.99,
    },
  ];

  const handleSuccess = () => {
    setPaymentComplete(true);
    setShowCheckout(false);
  };

  const handleCancel = () => {
    setShowCheckout(false);
  };

  if (paymentComplete) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        background: '#1a1a1a', 
        color: '#ffffff',
        minHeight: '100vh'
      }}>
        <h2>🎉 Payment Successful!</h2>
        <p>Thank you for your purchase!</p>
        <button 
          onClick={() => setPaymentComplete(false)}
          style={{
            padding: '12px 24px',
            background: '#00d4ff',
            border: 'none',
            borderRadius: '8px',
            color: '#000000',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#0a0a0a', 
        minHeight: '100vh'
      }}>
        <EmbeddedCheckout
          cart={mockCart}
          total="29.99"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      background: '#1a1a1a', 
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1>Stripe Embedded Checkout Test</h1>
      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h3>Test Beat</h3>
        <p>A sample beat for testing Stripe integration</p>
        <p style={{ fontSize: '24px', color: '#00d4ff' }}>$29.99</p>
        <button 
          onClick={() => setShowCheckout(true)}
          style={{
            padding: '12px 24px',
            background: '#00d4ff',
            border: 'none',
            borderRadius: '8px',
            color: '#000000',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Buy Now
        </button>
      </div>
      <div style={{ 
        background: '#333333', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px',
        fontSize: '14px'
      }}>
        <p><strong>Test Card Numbers:</strong></p>
        <p>✅ Success: 4242 4242 4242 4242</p>
        <p>🔐 3D Secure: 4000 0025 0000 3155</p>
        <p>❌ Declined: 4000 0000 0000 9995</p>
        <p>Use any future date for expiry and any 3-digit CVC</p>
      </div>
    </div>
  );
};

export default TestCheckout;
