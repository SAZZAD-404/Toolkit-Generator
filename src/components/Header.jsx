import { useState } from 'react';
import { Menu, X, Zap, TrendingUp, Shield, Users, Heart } from 'lucide-react';
import UserMenu from './Auth/UserMenu';
import StatusIndicator from './StatusIndicator';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { useAppData } from '../context/AppDataContext';

export default function Header({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { generatedDataCount } = useAppData();

  const navigation = [
    { id: 'gmail', name: 'Email Generator', icon: '📧', description: 'Generate Gmail addresses' },
    { id: 'useragent', name: 'User Agents', icon: '🤖', description: 'Mobile & desktop agents' },
    { id: 'ipfinder', name: 'IP Tools', icon: '🌐', description: 'IP lookup & analysis' },
    { id: 'numbergenerator', name: 'Phone Numbers', icon: '📱', description: 'Global phone numbers' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Your overview' },
    { id: 'alldata', name: 'Data Archive', icon: '🗄️', description: 'All generated data' },
    { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Account settings' },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-theme-primary/95 backdrop-blur-xl border-b border-theme shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:shadow-purple-500/40 group-hover:scale-105">
                  <img src="/favicon.svg" alt="Toolkit Generators" className="w-8 h-8" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-theme-primary animate-pulse shadow-lg shadow-green-500/50"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Toolkit Generators
                </h1>
                <p className="text-sm text-theme-secondary font-medium">
                  Professional Data Generation Suite
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    {item.name}
                  </span>
                  {activeTab === item.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Stats Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-theme-secondary/50 rounded-full border border-theme">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-theme-primary">{generatedDataCount}</span>
                <span className="text-xs text-theme-secondary">Generated</span>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Status & Notifications */}
              <StatusIndicator />
              <NotificationBell />
              
              {/* User Menu */}
              <UserMenu />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-theme bg-theme-primary/98 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`group p-4 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-theme-secondary/50 text-theme-secondary hover:bg-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold text-sm">{item.name}</span>
                    </div>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Navigation for Additional Tools */}
      <div className="bg-theme-secondary/30 border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-theme-secondary">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-theme-secondary">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Multi-User Support</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {navigation.slice(4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden xl:inline">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}