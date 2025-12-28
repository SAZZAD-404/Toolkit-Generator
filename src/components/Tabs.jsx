import React, { createContext, useContext } from 'react';

const TabsContext = createContext(undefined);

export function Tabs({ value, onValueChange, children, className = '' }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-xl bg-slate-900/50 p-1.5 shadow-inner shadow-black/30 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '' }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within a Tabs component');

  const isActive = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => context.onValueChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold ring-offset-slate-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50 scale-105' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'}
        ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within a Tabs component');

  const isActive = context.value === value;

  return isActive ? (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      className={`mt-2 ring-offset-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  ) : null;
}
