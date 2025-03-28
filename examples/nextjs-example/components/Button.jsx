import React from 'react';

/**
 * Button Component
 * A customizable button component with various styles and sizes.
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = '', 
  withIcon = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'button';
  const variantClass = variant ? `button-${variant}` : '';
  const sizeClass = size ? `button-${size}` : '';
  const iconClass = withIcon ? 'button-with-icon' : '';
  const loadingClass = loading ? 'button-loading' : '';
  
  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    iconClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button className={buttonClass} disabled={loading || props.disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;