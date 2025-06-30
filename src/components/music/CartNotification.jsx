import React, { useState, useEffect } from 'react';
import './CartNotification.css';

const CartNotification = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="cart-notification">
      <div className="notification-content">
        <span className="notification-icon">🎵</span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default CartNotification;
