import React from 'react';

/**
 * Card Component
 * A versatile card component for displaying content in a contained format.
 */
const Card = ({ 
  children, 
  featured = false,
  horizontal = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'card';
  const featuredClass = featured ? 'card-featured' : '';
  const horizontalClass = horizontal ? 'card-horizontal' : '';
  
  const cardClass = [
    baseClass,
    featuredClass,
    horizontalClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
const CardHeader = ({ 
  children, 
  primary = false,
  centered = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'card-header';
  const primaryClass = primary ? 'card-header-primary' : '';
  const centeredClass = centered ? 'card-header-centered' : '';
  
  const headerClass = [
    baseClass,
    primaryClass,
    centeredClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={headerClass} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Body Component
 */
const CardBody = ({ 
  children, 
  padded = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'card-body';
  const paddedClass = padded ? 'card-body-padded' : '';
  
  const bodyClass = [
    baseClass,
    paddedClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={bodyClass} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Footer Component
 */
const CardFooter = ({ 
  children, 
  centered = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'card-footer';
  const centeredClass = centered ? 'card-footer-centered' : '';
  
  const footerClass = [
    baseClass,
    centeredClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={footerClass} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Image Component
 */
const CardImage = ({ src, alt, className = '', ...props }) => {
  return (
    <div className={`card-image ${className}`} {...props}>
      <img src={src} alt={alt || 'Card image'} />
    </div>
  );
};

/**
 * Card Media Component
 * For use with horizontal cards
 */
const CardMedia = ({ backgroundImage, className = '', style = {}, ...props }) => {
  const mediaStyle = {
    ...style,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined
  };
  
  return (
    <div 
      className={`card-media ${className}`} 
      style={mediaStyle}
      {...props} 
    />
  );
};

/**
 * Card Content Component
 * For use with horizontal cards
 */
const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Media = CardMedia;
Card.Content = CardContent;

export default Card;