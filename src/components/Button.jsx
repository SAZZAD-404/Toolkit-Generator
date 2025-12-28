import React from 'react';

export function Button({ children, variant = 'default', size = 'default', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium ring-offset-slate-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-900/50 hover:shadow-lg hover:shadow-indigo-900/60',
    outline: 'border-2 border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 text-slate-100',
    destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-900/50 hover:shadow-lg',
    ghost: 'hover:bg-slate-700 hover:text-slate-100 text-slate-400',
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-12 rounded-lg px-8 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
