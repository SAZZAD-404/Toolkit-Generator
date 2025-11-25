import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/80 border border-slate-700 dark:border-slate-700 light:border-slate-300 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-100 transition-all duration-300 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon size={20} className="text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
