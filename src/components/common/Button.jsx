import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const baseClass = variant === 'ghost' ? 'btn-ghost' : 'btn-primary';
  
  return (
    <button className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
