import React, { useState, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import EmbeddedCheckoutForm from './EmbeddedCheckoutForm';
import PaymentReturn from './PaymentReturn';
import './EmbeddedCheckout.css';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EmbeddedCheckout = ({ cart, total, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create checkout session
  const fetchClientSecret = useMemo(() => {
    return async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart.map(item => ({
              name: item.title || item.name,
              description: item.description || 'Digital music download',
              price: item.price,
              quantity: 1,
            })),
            amount: Math.round(parseFloat(total) * 100),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setIsLoading(false);
        return data.clientSecret;
      } catch (err) {
        console.error('Error fetching client secret:', err);
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    };
  }, [cart, total]);

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#00d4ff',
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'Arial, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const handlePaymentSuccess = () => {
    setIsComplete(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  if (error) {
    return (
      <div className="checkout-error">
        <h3>Payment Error</h3>
        <p>{error}</p>
        <button onClick={onCancel} className="cancel-button">
          Go Back
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="payment-return success">
        <div className="success-icon">✅</div>
        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase!</p>
        <div className="auto-redirect">
          <p>Redirecting you back...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="embedded-checkout-container">
      <CheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          appearance,
        }}
      >
        <EmbeddedCheckoutForm 
          onCancel={onCancel}
          onSuccess={handlePaymentSuccess}
        />
      </CheckoutProvider>
    </div>
  );
};

export default EmbeddedCheckout;
