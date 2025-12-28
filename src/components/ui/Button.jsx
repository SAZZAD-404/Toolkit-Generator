import { LoadingSpinner } from './LoadingSpinner';

const buttonVariants = {
  primary: 'bg-primary hover:bg-primary-hover text-white border-primary',
  secondary: 'bg-secondary hover:bg-secondary-hover text-white border-secondary',
  outline: 'bg-transparent hover:bg-theme-secondary text-theme-primary border-theme hover:border-primary',
  ghost: 'bg-transparent hover:bg-theme-secondary text-theme-primary border-transparent',
  danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
  success: 'bg-green-500 hover:bg-green-600 text-white border-green-500'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg border
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-[1.02] active:scale-[0.98]
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${isDisabled ? 'pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" color="white" className="mr-2" />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

export const IconButton = ({
  children,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        rounded-lg border transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-95
        ${buttonVariants[variant]}
        ${iconSizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" color="white" />
      ) : (
        children
      )}
    </button>
  );
};