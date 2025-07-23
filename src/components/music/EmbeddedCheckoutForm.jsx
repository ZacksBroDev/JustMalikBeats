import React, { useState, useEffect } from 'react';
import { useCheckout } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

const validateEmail = async (email, checkout) => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  try {
    // Update the checkout session with the email
    await checkout.updateEmail(email);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: 'Error validating email' };
  }
};

const EmailInput = ({ email, setEmail, error, setError }) => {
  const checkout = useCheckout();

  const handleBlur = async () => {
    if (!email) {
      return;
    }

    const { isValid, message } = await validateEmail(email, checkout);
    if (!isValid) {
      setError(message);
    }
  };

  const handleChange = (e) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <div className="email-input-container">
      <label htmlFor="email">
        Email Address
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={error ? "error" : ""}
          placeholder="Enter your email"
          required
        />
      </label>
      {error && <div className="email-error" id="email-errors">{error}</div>}
    </div>
  );
};

const EmbeddedCheckoutForm = ({ onCancel, onSuccess }) => {
  const checkout = useCheckout();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Listen to checkout session changes
  useEffect(() => {
    if (checkout) {
      checkout.on('change', (session) => {
        console.log('Checkout session changed:', session);
        // Handle changes to the checkout session
        if (session.status === 'complete') {
          console.log('Payment completed!');
          onSuccess && onSuccess();
        }
      });
    }
  }, [checkout, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkout) {
      setMessage('Checkout not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Validate email
      const { isValid, message } = await validateEmail(email, checkout);
      if (!isValid) {
        setEmailError(message);
        setMessage(message);
        setIsLoading(false);
        return;
      }

      // Check if we can confirm the payment
      if (!checkout.canConfirm) {
        setMessage('Please fill in all required payment details.');
        setIsLoading(false);
        return;
      }

      // Confirm the payment
      const confirmResult = await checkout.confirm();

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`.
      if (confirmResult.type === 'error') {
        setMessage(confirmResult.error.message);
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setMessage('An error occurred while processing your payment. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="embedded-checkout-form">
      <div className="checkout-header">
        <h2>Complete Your Purchase</h2>
        <p>Secure payment powered by Stripe</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <EmailInput
          email={email}
          setEmail={setEmail}
          error={emailError}
          setError={setEmailError}
        />

        <div className="payment-section">
          <h3>Payment Information</h3>
          <div className="payment-element-container">
            <PaymentElement id="payment-element" />
          </div>
        </div>

        {message && (
          <div className="checkout-message">
            {message}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="pay-button"
            disabled={isLoading || !checkout}
          >
            {isLoading ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </form>

      <div className="security-info">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>💳 We accept all major credit cards</p>
      </div>
    </div>
  );
};

export default EmbeddedCheckoutForm;
