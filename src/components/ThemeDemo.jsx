import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle, ThemeToggleText } from './ThemeToggle';

export const ThemeDemo = () => {
  const { theme, isLight, isDark } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-theme-primary mb-2">
          Theme System Demo
        </h2>
        <p className="text-theme-secondary">
          Current theme: <span className="font-semibold text-primary">{theme}</span>
        </p>
      </div>

      {/* Theme Toggle Buttons */}
      <div className="flex items-center justify-center gap-4">
        <ThemeToggle />
        <ThemeToggleText />
      </div>

      {/* Color Palette Demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Background Colors */}
        <div className="space-y-3">
          <h3 className="font-semibold text-theme-primary">Background Colors</h3>
          <div className="space-y-2">
            <div className="h-12 bg-theme-primary rounded-lg border border-theme flex items-center justify-center">
              <span className="text-theme-primary text-sm font-medium">Primary</span>
            </div>
            <div className="h-12 bg-theme-secondary rounded-lg border border-theme flex items-center justify-center">
              <span className="text-theme-primary text-sm font-medium">Secondary</span>
            </div>
            <div className="h-12 bg-theme-card rounded-lg border border-theme flex items-center justify-center">
              <span className="text-theme-primary text-sm font-medium">Card</span>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="space-y-3">
          <h3 className="font-semibold text-theme-primary">Text Colors</h3>
          <div className="space-y-2 bg-theme-secondary p-4 rounded-lg">
            <p className="text-theme-primary font-medium">Primary Text</p>
            <p className="text-theme-secondary">Secondary Text</p>
            <p className="text-theme-muted">Muted Text</p>
          </div>
        </div>

        {/* Accent Colors */}
        <div className="space-y-3">
          <h3 className="font-semibold text-theme-primary">Accent Colors</h3>
          <div className="space-y-2">
            <div className="h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">Primary</span>
            </div>
            <div className="h-12 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">Secondary</span>
            </div>
            <div className="h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black text-sm font-medium">Accent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="space-y-4">
        <h3 className="font-semibold text-theme-primary">Interactive Elements</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-primary bg-primary-hover text-white rounded-lg transition-colors">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-secondary bg-secondary-hover text-white rounded-lg transition-colors">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-accent bg-accent-hover text-black rounded-lg transition-colors">
            Accent Button
          </button>
          <button className="px-4 py-2 bg-theme-secondary hover:bg-theme-card text-theme-primary border border-theme rounded-lg transition-colors">
            Outline Button
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-theme-card border border-theme rounded-lg p-4">
          <h4 className="font-semibold text-theme-primary mb-2">Theme Card</h4>
          <p className="text-theme-secondary text-sm">
            This card automatically adapts to the current theme using CSS custom properties.
          </p>
        </div>
        <div className="bg-theme-secondary border border-theme-light rounded-lg p-4">
          <h4 className="font-semibold text-theme-primary mb-2">Secondary Card</h4>
          <p className="text-theme-secondary text-sm">
            Different background shade for visual hierarchy.
          </p>
        </div>
      </div>

      {/* CSS Variables Info */}
      <div className="bg-theme-card border border-theme rounded-lg p-4">
        <h3 className="font-semibold text-theme-primary mb-3">Available CSS Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-primary mb-2">Background</h4>
            <ul className="space-y-1 text-theme-secondary">
              <li>--background-50 to --background-950</li>
              <li>--bg-primary (legacy)</li>
              <li>--bg-secondary (legacy)</li>
              <li>--bg-card (legacy)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-2">Text</h4>
            <ul className="space-y-1 text-theme-secondary">
              <li>--text-50 to --text-950</li>
              <li>--text-primary (legacy)</li>
              <li>--text-secondary (legacy)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-2">Colors</h4>
            <ul className="space-y-1 text-theme-secondary">
              <li>--primary-50 to --primary-950</li>
              <li>--secondary-50 to --secondary-950</li>
              <li>--accent-50 to --accent-950</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};