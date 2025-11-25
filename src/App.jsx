import { useState } from 'react';
import { Mail, Smartphone, Globe, Hash, Zap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import GmailGenerator from './components/GmailGenerator';
import UserAgentGenerator from './components/UserAgentGenerator';
import IpFinder from './components/IpFinder';
import NumberGenerator from './components/NumberGenerator';
import { ToastProvider } from './context/ToastContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('gmail');

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative w-full py-4 bg-[#0d0d14]/80 border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Toolkit Pro
                </h1>
                <p className="text-xs text-slate-500">
                  Professional Generator Suite
                </p>
              </div>
            </div>
            
            {/* Navigation Tabs in Header */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
              <TabButton 
                active={activeTab === 'gmail'} 
                onClick={() => setActiveTab('gmail')}
                icon={<Mail size={16} />}
                label="Gmail"
              />
              <TabButton 
                active={activeTab === 'useragent'} 
                onClick={() => setActiveTab('useragent')}
                icon={<Smartphone size={16} />}
                label="User Agent"
              />
              <TabButton 
                active={activeTab === 'ipfinder'} 
                onClick={() => setActiveTab('ipfinder')}
                icon={<Globe size={16} />}
                label="IP Finder"
              />
              <TabButton 
                active={activeTab === 'numbergenerator'} 
                onClick={() => setActiveTab('numbergenerator')}
                icon={<Hash size={16} />}
                label="Numbers"
              />
            </nav>

            {/* Mobile indicator */}
            <div className="lg:hidden text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg">
              {activeTab === 'gmail' && 'Gmail Generator'}
              {activeTab === 'useragent' && 'User Agent'}
              {activeTab === 'ipfinder' && 'IP Finder'}
              {activeTab === 'numbergenerator' && 'Numbers'}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden sticky top-[65px] z-40 bg-[#0d0d14]/90 backdrop-blur-xl border-b border-slate-800/50 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <MobileTabButton 
            active={activeTab === 'gmail'} 
            onClick={() => setActiveTab('gmail')}
            icon={<Mail size={16} />}
            label="Gmail"
          />
          <MobileTabButton 
            active={activeTab === 'useragent'} 
            onClick={() => setActiveTab('useragent')}
            icon={<Smartphone size={16} />}
            label="Agent"
          />
          <MobileTabButton 
            active={activeTab === 'ipfinder'} 
            onClick={() => setActiveTab('ipfinder')}
            icon={<Globe size={16} />}
            label="IP"
          />
          <MobileTabButton 
            active={activeTab === 'numbergenerator'} 
            onClick={() => setActiveTab('numbergenerator')}
            icon={<Hash size={16} />}
            label="Number"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative flex-grow w-full">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-12 py-6 lg:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="gmail">Gmail</TabsTrigger>
              <TabsTrigger value="useragent">User Agent</TabsTrigger>
              <TabsTrigger value="ipfinder">IP Finder</TabsTrigger>
              <TabsTrigger value="numbergenerator">Number</TabsTrigger>
            </TabsList>

            <TabsContent value="gmail" className="mt-0 animate-fadeIn">
              <GmailGenerator />
            </TabsContent>

            <TabsContent value="useragent" className="mt-0 animate-fadeIn">
              <UserAgentGenerator />
            </TabsContent>

            <TabsContent value="ipfinder" className="mt-0 animate-fadeIn">
              <IpFinder />
            </TabsContent>

            <TabsContent value="numbergenerator" className="mt-0 animate-fadeIn">
              <NumberGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full py-4 border-t border-slate-800/50 bg-[#0d0d14]/50">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <p>© 2025 Toolkit Pro. All rights reserved.</p>
            <p>Built for professionals</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Desktop Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Mobile Tab Button Component
function MobileTabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
          : 'text-slate-400 bg-slate-800/30 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
