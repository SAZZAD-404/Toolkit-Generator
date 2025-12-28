import { 
  Mail, Smartphone, Globe, Hash, User, Database, 
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { generatedDataCount, getDataCountByType } = useAppData();

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
              {/* Minimal Branding */}
              <div className="w-px h-4 bg-gradient-to-b from-slate-600 to-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}