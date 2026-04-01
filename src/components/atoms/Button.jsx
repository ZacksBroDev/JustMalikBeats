import React from 'react';
import './Button.css';

/**
 * Button Component — Obsidian Luxury Design System
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and full accessibility.
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost'} props.variant - Visual style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Size of the button
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state (shows spinner)
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {React.ReactNode} props.children - Button label/content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon = null,
  children, 
  onClick,
  className = '',
  ...props 
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    icon && 'btn--with-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames} 
      onClick={onClick} 
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="20"
            />
          </svg>
        </span>
      )}
      {!loading && icon && <span className="btn__icon" aria-hidden="true">{icon}</span>}
      <span className="btn__label">{children}</span>
    </button>
  );
};

export default Button;
