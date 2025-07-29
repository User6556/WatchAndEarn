import React from 'react';

const ProgressBar = ({ 
  progress, 
  max = 100, 
  variant = 'primary',
  animated = true,
  showLabel = true,
  className = '' 
}) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200"></div>
        
        {/* Progress bar */}
        <div
          className={`
            relative h-full rounded-full transition-all duration-1000 ease-out
            ${variants[variant]}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 