import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AuthCallback from './components/AuthCallback';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load heavy components
const GmailGenerator = lazy(() => import('./components/GmailGenerator'));
const UserAgentGenerator = lazy(() => import('./components/UserAgentGenerator'));
const IpFinder = lazy(() => import('./components/IpFinder'));
const NumberGenerator = lazy(() => import('./components/NumberGenerator'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AccountSettings = lazy(() => import('./components/AccountSettings'));
const AllDataPage = lazy(() => import('./components/AllDataPage'));

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading } = useAuth();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for navigation events from UserMenu
  useEffect(() => {
    const handleNavigateToTab = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab);
    return () => window.removeEventListener('navigate-to-tab', handleNavigateToTab);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-theme-primary font-medium">Loading CPA Toolkit...</div>
          <div className="text-theme-secondary text-sm mt-2">Preparing your workspace</div>
        </div>
      </div>
    );
  }

  // Show landing page if user is not authenticated
  if (!user) {
    // Check if this is an auth callback
    if (window.location.pathname === '/auth/callback' || window.location.hash.includes('access_token')) {
      return <AuthCallback />;
    }
    return <LandingPage />;
  }

  const renderContent = () => {
    const LoadingFallback = () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white font-medium">Loading...</div>
        </div>
      </div>
    );

    switch (activeTab) {
      case 'gmail':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <GmailGenerator />
          </Suspense>
        );
      case 'useragent':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserAgentGenerator />
          </Suspense>
        );
      case 'ipfinder':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <IpFinder />
          </Suspense>
        );
      case 'numbergenerator':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <NumberGenerator />
          </Suspense>
        );
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserDashboard />
          </Suspense>
        );
      case 'alldata':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AllDataPage />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AccountSettings />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserDashboard />
          </Suspense>
        );
    }
  };

  // Show main application for authenticated users
  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Mobile Header */}
      {isMobile && (
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <>
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* Main Content */}
          <div className={`transition-all duration-300 ${
            sidebarCollapsed ? 'ml-20' : 'ml-80'
          }`}>
            <DashboardLayout>
              {renderContent()}
            </DashboardLayout>
          </div>
        </>
      )}

      {/* Mobile Content */}
      {isMobile && (
        <main className="pt-2 pb-20 px-2">
          <div className="max-w-full mx-auto">
            <div className="bg-theme-secondary/30 backdrop-blur-sm rounded-xl border border-theme shadow-2xl">
              {renderContent()}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;