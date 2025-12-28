import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '', size = 20 }) => {
  const { theme, toggleTheme, isLight, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg transition-all duration-300 ease-in-out
        bg-slate-800 hover:bg-slate-700
        border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500
        group
        ${className}
      `}
      title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
    >
      <div className="relative">
        {/* Sun icon for light theme */}
        <Sun 
          size={size} 
          className={`
            absolute inset-0 transition-all duration-300 ease-in-out text-yellow-400
            ${isLight ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}
          `}
        />
        
        {/* Moon icon for dark theme */}
        <Moon 
          size={size} 
          className={`
            transition-all duration-300 ease-in-out text-blue-400
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}
          `}
        />
      </div>
    </button>
  );
};

export const ThemeToggleText = ({ className = '' }) => {
  const { theme, toggleTheme, isLight } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
        bg-slate-800 hover:bg-slate-700
        border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500
        text-slate-200 hover:text-white
        ${className}
      `}
    >
      {isLight ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm font-medium">
        {isLight ? 'Light' : 'Dark'} Theme
      </span>
    </button>
  );
};