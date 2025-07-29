import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  blur = 'md',
  ...props 
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-2xl' : '';

  return (
    <div
      className={`
        relative overflow-visible rounded-2xl
        bg-white/10 backdrop-blur-md
        border border-white/20
        shadow-xl
        transition-all duration-300 ease-out
        ${hoverClasses}
        ${blurClasses[blur]}
        ${className}
      `}
      {...props}
    >
      {/* Glassmorphism background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5"></div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

export default GlassCard; 