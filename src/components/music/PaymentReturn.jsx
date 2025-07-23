import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PaymentReturn = ({ onSuccess }) => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/api/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
          setLoading(false);
          
          // If payment is complete, call the success callback
          if (data.status === 'complete') {
            setTimeout(() => {
              onSuccess();
            }, 3000); // Give user time to see the success message
          }
        })
        .catch((error) => {
          console.error('Error fetching session status:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [onSuccess]);

  if (loading) {
    return (
      <div className="payment-return loading">
        <div className="spinner"></div>
        <p>Checking payment status...</p>
      </div>
    );
  }

  if (status === 'open') {
    return <Navigate to="/checkout" replace />;
  }

  if (status === 'complete') {
    return (
      <div className="payment-return success">
        <div className="success-icon">✅</div>
        <h2>Payment Successful!</h2>
        <p>
          Thank you for your purchase! A confirmation email has been sent to{' '}
          <strong>{customerEmail}</strong>.
        </p>
        <div className="success-details">
          <p>🎵 Your music downloads are now available</p>
          <p>📧 Check your email for download links</p>
          <p>❓ Questions? Contact support@justmalikbeats.com</p>
        </div>
        <div className="auto-redirect">
          <p>You'll be redirected automatically in a few seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-return error">
      <div className="error-icon">❌</div>
      <h2>Payment Error</h2>
      <p>There was an issue processing your payment. Please try again.</p>
      <button onClick={() => window.location.href = '/checkout'} className="retry-button">
        Try Again
      </button>
    </div>
  );
};

export default PaymentReturn;
