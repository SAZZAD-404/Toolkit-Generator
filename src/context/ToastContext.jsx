import { createContext, useContext, useState, useCallback } from 'react';

// Simple Toast Component (fallback)
const SimpleToast = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-[400px]
            transform transition-all duration-300 ease-in-out
            ${toast.type === 'success' ? 'bg-green-600 text-white' :
              toast.type === 'error' ? 'bg-red-600 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500 text-black' :
              'bg-blue-600 text-white'}
          `}
        >
          <span className="text-lg">
            {toast.type === 'success' ? '✓' :
             toast.type === 'error' ? '✕' :
             toast.type === 'warning' ? '⚠' : 'ℹ'}
          </span>
          <div className="flex-1">
            {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
            {toast.message && <div className="text-sm opacity-90">{toast.message}</div>}
          </div>
          <button
            onClick={() => onRemove?.(toast.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = {
    success: (title, message, options = {}) => 
      addToast({ type: 'success', title, message, ...options }),
    
    error: (title, message, options = {}) => 
      addToast({ type: 'error', title, message, ...options }),
    
    warning: (title, message, options = {}) => 
      addToast({ type: 'warning', title, message, ...options }),
    
    info: (title, message, options = {}) => 
      addToast({ type: 'info', title, message, ...options }),
    
    custom: (options) => addToast(options)
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    toast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SimpleToast toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};
