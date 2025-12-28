import React from 'react';

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  className = '',
  required = false,
  disabled = false,
  ...props 
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-lg 
          bg-slate-700/50 border-2 
          ${error 
            ? 'border-red-500 focus:border-red-400' 
            : 'border-slate-600 focus:border-indigo-400'
          }
          text-slate-100 placeholder-slate-400
          focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-400/20' : 'focus:ring-indigo-400/20'}
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
