import React from 'react';

export function Select({ label, options, className = '', ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <select
        className={`flex h-10 w-full rounded-lg border-2 border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 ring-offset-slate-900 transition-all duration-200 hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
