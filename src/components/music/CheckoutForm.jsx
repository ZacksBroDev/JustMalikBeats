import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useMusic } from '../../context/MusicContext';

const CheckoutForm = ({ cart, total, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addPurchase } = useMusic();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setPaymentError(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment intent on your backend
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, priceId: item.priceId })),
          amount: Math.round(parseFloat(total) * 100), // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('No client secret received');
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setPaymentError(confirmError.message);
      } else {
        // Payment successful
        addPurchase(cart);
        onSuccess();
      }
    } catch (err) {
      setPaymentError('Payment failed. Please try again.');
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#1a1a1a',
        '::placeholder': {
          color: '#666666',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-section">
        <h3>Payment Information</h3>
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>
        
        {paymentError && (
          <div className="payment-error">
            {paymentError}
          </div>
        )}
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
          type="submit" 
          className="pay-button"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay $${total}`}
        </button>
      </div>

      <div className="payment-info">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>💬 For questions, contact support@justmalikbeats.com</p>
      </div>
    </form>
  );
};

export default CheckoutForm;
