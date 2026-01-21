import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

// Lazy load heavy components
const GmailGenerator = lazy(() => import('./components/GmailGenerator'));
const UserAgentGenerator = lazy(() => import('./components/UserAgentGenerator'));
const IpFinder = lazy(() => import('./components/IpFinder'));
const NumberGenerator = lazy(() => import('./components/NumberGenerator'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AllDataPage = lazy(() => import('./components/AllDataPage'));

// Main App Component with Authentication
function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading, isConfigured, isConnected, connectionStatus } = useAuth();

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

  // Listen for navigation events
  useEffect(() => {
    const handleNavigateToTab = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('navigate-to-tab', handleNavigateToTab);
    return () => window.removeEventListener('navigate-to-tab', handleNavigateToTab);
  }, []);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-white font-medium text-lg">Loading Toolkit Generators...</div>
          <div className="text-slate-400 text-sm mt-2">Checking database connection</div>
        </div>
      </div>
    );
  }

  // Show connection error if Supabase is not working
  if (!isConnected && connectionStatus.status !== 'unknown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
              <div className="text-red-400 text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-red-300 mb-4">Database Connection Failed</h2>
              
              {connectionStatus.status === 'network_error' && (
                <>
                  <p className="text-slate-300 mb-6">
                    The Supabase database URL is not reachable. This usually means:
                  </p>
                  <ul className="text-left text-slate-400 space-y-2 mb-6">
                    <li>• The Supabase project was deleted or paused</li>
                    <li>• The project URL in .env is incorrect</li>
                    <li>• DNS resolution is failing</li>
                    <li>• Network connectivity issues</li>
                  </ul>
                </>
              )}
              
              {connectionStatus.status === 'timeout' && (
                <>
                  <p className="text-slate-300 mb-6">
                    Connection to Supabase timed out. This could be due to:
                  </p>
                  <ul className="text-left text-slate-400 space-y-2 mb-6">
                    <li>• Slow network connection</li>
                    <li>• Supabase server overload</li>
                    <li>• Firewall blocking the connection</li>
                  </ul>
                </>
              )}
              
              {connectionStatus.status === 'server_error' && (
                <>
                  <p className="text-slate-300 mb-6">
                    Supabase server returned an error:
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                    <code className="text-sm text-red-400">{connectionStatus.error}</code>
                  </div>
                </>
              )}
              
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-300 mb-2">Current Supabase URL:</p>
                <code className="text-xs text-blue-400 break-all">{import.meta.env.VITE_SUPABASE_URL}</code>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors mr-4"
                >
                  Retry Connection
                </button>
                
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Solutions</h3>
                  
                  {connectionStatus.status === 'network_error' && (
                    <div className="text-left space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <h4 className="text-yellow-300 font-medium mb-2">🔧 Fix Database Connection</h4>
                        <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase Dashboard</a></li>
                          <li>Create a new project or check if your project exists</li>
                          <li>Copy the new project URL and API key</li>
                          <li>Update your .env file with the correct values</li>
                          <li>Refresh this page</li>
                        </ol>
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-blue-300 font-medium mb-2">📱 Continue with Local Storage</h4>
                        <p className="text-slate-400 text-sm mb-3">
                          Use the app without database (data saved locally only):
                        </p>
                        <button
                          onClick={() => {
                            localStorage.setItem('useLocalStorage', 'true');
                            window.location.reload();
                          }}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Continue with Local Storage
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {connectionStatus.status !== 'network_error' && (
                    <button
                      onClick={() => {
                        localStorage.setItem('useLocalStorage', 'true');
                        window.location.reload();
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg transition-colors"
                    >
                      Continue with Local Storage
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication page if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <AuthPage />
        </div>
      </div>
    );
  }

  // User is authenticated, show the main app

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
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserDashboard />
          </Suspense>
        );
    }
  };

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

// Root App Component with Providers
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppDataProvider>
            <MainApp />
          </AppDataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;