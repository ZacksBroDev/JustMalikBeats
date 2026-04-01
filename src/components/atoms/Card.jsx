import React from 'react';
import './Card.css';

const Card = ({ children, hoverable = true, className = '', ...props }) => {
  const classNames = [
    'card',
    hoverable && 'card--hoverable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export default Card;
