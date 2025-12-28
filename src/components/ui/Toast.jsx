import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-600'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    borderColor: 'border-red-600'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    borderColor: 'border-yellow-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600'
  }
};

export const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  onClose,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const config = toastTypes[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      ${className}
    `}>
      <div className={`
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        border-l-4 rounded-lg shadow-lg p-4 mb-3
        max-w-sm w-full
        backdrop-blur-sm
      `}>
        <div className="flex items-start">
          <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-sm mb-1 truncate">
                {title}
              </h4>
            )}
            {message && (
              <p className="text-sm opacity-90 break-words">
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts = [], onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
};