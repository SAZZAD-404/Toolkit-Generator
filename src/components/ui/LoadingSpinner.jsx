export const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      border-4 border-transparent 
      ${colorClasses[color]} 
      border-t-transparent 
      rounded-full 
      animate-spin
      ${className}
    `} />
  );
};

export const LoadingDots = ({ className = '' }) => (
  <div className={`flex space-x-1 ${className}`}>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

export const LoadingPulse = ({ className = '' }) => (
  <div className={`flex space-x-2 ${className}`}>
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
  </div>
);

export const LoadingBar = ({ progress = 0, className = '' }) => (
  <div className={`w-full bg-theme-secondary rounded-full h-2 ${className}`}>
    <div 
      className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);