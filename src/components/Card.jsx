import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-800/90 text-slate-100 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl md:text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-slate-400 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}
