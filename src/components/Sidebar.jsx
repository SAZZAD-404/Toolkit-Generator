import { 
  Mail, Smartphone, Globe, Hash, User, Database, 
  ChevronLeft, ChevronRight, Zap, LogOut
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { generatedDataCount, getDataCountByType } = useAppData();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const dashboardItem = {
    id: 'dashboard',
    name: 'Dashboard',
    icon: User,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    description: 'Your overview'
  };

  const generatorItems = [
    {
      id: 'gmail',
      name: 'Email Generator',
      icon: Mail,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      count: getDataCountByType('email'),
      description: 'Generate Gmail addresses'
    },
    {
      id: 'useragent',
      name: 'User Agents',
      icon: Smartphone,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      count: getDataCountByType('user_agent'),
      description: 'Mobile & desktop agents'
    },
    {
      id: 'ipfinder',
      name: 'IP Tools',
      icon: Globe,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      count: getDataCountByType('ip'),
      description: 'IP lookup & analysis'
    },
    {
      id: 'numbergenerator',
      name: 'Phone Numbers',
      icon: Hash,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      count: getDataCountByType('phone'),
      description: 'Global phone numbers'
    }
  ];

  const managementItems = [
    {
      id: 'alldata',
      name: 'Data Archive',
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      description: 'All generated data'
    }
  ];

  const NavItem = ({ item, isActive }) => {
    const Icon = item.icon;
    
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? `${item.bgColor} ${item.color} border ${item.borderColor} shadow-lg`
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
        }`}
      >
        <div className={`flex-shrink-0 p-2 rounded-lg ${isActive ? item.bgColor : 'bg-slate-800/50'}`}>
          <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400'}`} />
        </div>
        
        {!collapsed && (
          <>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">{item.name}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
            
            {item.count !== undefined && item.count > 0 && (
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                isActive ? 'bg-white/20' : 'bg-slate-700'
              }`}>
                {item.count}
              </div>
            )}
          </>
        )}
        
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full"></div>
        )}
      </button>
    );
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-40 ${
      collapsed ? 'w-20' : 'w-80'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/favicon.svg" alt="Toolkit Generators" className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Toolkit Generators</h2>
                  <p className="text-xs text-slate-400">Professional tools for CPA</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Dashboard Section */}
            <div>
              <div className="space-y-2">
                <NavItem key={dashboardItem.id} item={dashboardItem} isActive={activeTab === dashboardItem.id} />
              </div>
            </div>

            {/* Generators Section */}
            <div>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                  Generators
                </h3>
              )}
              <div className="space-y-2">
                {generatorItems.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeTab === item.id} />
                ))}
              </div>
            </div>

            {/* Management Section */}
            <div>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                  Data Management
                </h3>
              )}
              <div className="space-y-2">
                {managementItems.map((item) => (
                  <NavItem key={item.id} item={item} isActive={activeTab === item.id} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Professional Footer */}
        <div className="relative p-4 border-t border-slate-700/30 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent backdrop-blur-xl">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_50%)]"></div>
          
          {!collapsed && (
            <div className="relative z-10 space-y-4">
              {/* Professional User Session Card */}
              {user && (
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-2xl border border-slate-600/40 hover:border-slate-500/60 p-4 shadow-2xl hover:shadow-slate-900/50 transition-all duration-500">
                  {/* Premium Glass Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02]"></div>
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    {/* Professional Avatar Section */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="group/avatar relative hover:scale-105 transition-all duration-300"
                        title="Account Settings"
                      >
                        {/* Premium Avatar with Multiple Rings */}
                        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 p-0.5 shadow-2xl shadow-indigo-500/25 group-hover/avatar:shadow-indigo-500/40 transition-all duration-300">
                          <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-600 flex items-center justify-center group-hover/avatar:from-indigo-300 group-hover/avatar:via-purple-400 group-hover/avatar:to-violet-500 transition-all duration-300">
                            <span className="text-white font-bold text-sm tracking-wide">
                              {user.email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Premium Status Indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 border-2 border-slate-900 shadow-lg">
                          <div className="absolute inset-0.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>

                        {/* Hover Ring Effect */}
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-400/0 group-hover/avatar:ring-indigo-400/30 transition-all duration-300"></div>
                      </button>
                      
                      {/* Professional Stats */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            <span className="text-xs font-semibold text-slate-300 tracking-wide">
                              {generatedDataCount.toLocaleString()} ITEMS
                            </span>
                          </div>
                          <div className="w-px h-3 bg-slate-600"></div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-xs font-semibold text-emerald-400 tracking-wide">
                              ACTIVE
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Session • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Premium Logout Button */}
                    <button
                      onClick={handleSignOut}
                      className="group/logout relative overflow-hidden p-2.5 rounded-xl bg-gradient-to-br from-red-500/10 via-red-600/10 to-red-700/10 hover:from-red-500/20 hover:via-red-600/20 hover:to-red-700/20 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                      title="End Session"
                    >
                      {/* Animated Background Shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent -translate-x-full group-hover/logout:translate-x-full transition-transform duration-700"></div>
                      
                      <LogOut className="relative z-10 w-4 h-4 text-red-400 group-hover/logout:text-red-300 transition-all duration-300 group-hover/logout:rotate-12" />
                    </button>
                  </div>
                </div>
              )}

              {/* Professional Branding */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
                    <span className="text-xs font-medium text-slate-400 tracking-wider">CRAFTED BY</span>
                  </div>
                  <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </div>
                
                <div className="text-sm font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                  SAZZAD ISLAM
                </div>
                
                {/* Professional Version Badge */}
                <div className="flex items-center justify-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/40">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="font-mono font-semibold text-slate-300">v2.1.0</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500 font-medium">© 2025</span>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed State - Ultra Professional */}
          {collapsed && (
            <div className="relative z-10 flex flex-col items-center space-y-4">
              {/* Premium Avatar - Collapsed */}
              {user && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className="group relative hover:scale-110 transition-all duration-300"
                  title="Account Settings"
                >
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 p-0.5 shadow-xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-600 flex items-center justify-center group-hover:from-indigo-300 group-hover:via-purple-400 group-hover:to-violet-500 transition-all duration-300">
                      <span className="text-white font-bold text-sm">
                        {user.email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></div>
                  
                  {/* Hover Ring Effect */}
                  <div className="absolute inset-0 rounded-xl ring-2 ring-indigo-400/0 group-hover:ring-indigo-400/40 transition-all duration-300"></div>
                  
                  {/* Premium Tooltip */}
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                    <div className="bg-slate-800/95 backdrop-blur-xl text-white text-xs rounded-xl px-3 py-2 border border-slate-600/50 shadow-2xl">
                      <div className="font-semibold">Account Settings</div>
                      <div className="text-slate-400">{generatedDataCount} Items • Active</div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-600/50 rotate-45"></div>
                    </div>
                  </div>
                </button>
              )}

              {/* Premium Logout - Collapsed */}
              <button
                onClick={handleSignOut}
                className="group relative p-2.5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                title="End Session"
              >
                <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-all duration-300 group-hover:rotate-12" />
                
                {/* Premium Tooltip */}
                <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                  <div className="bg-slate-800/95 backdrop-blur-xl text-white text-xs rounded-xl px-3 py-2 border border-slate-600/50 shadow-2xl whitespace-nowrap">
                    <div className="font-semibold text-red-300">End Session</div>
                    <div className="text-slate-400">Sign out securely</div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 border-l border-b border-slate-600/50 rotate-45"></div>
                  </div>
                </div>
              </button>

              {/* Minimal Branding */}
              <div className="w-px h-4 bg-gradient-to-b from-slate-600 to-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}