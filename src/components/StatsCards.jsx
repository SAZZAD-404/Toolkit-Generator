import { TrendingUp, Clock, Target, Zap, Users, Globe, Shield, Star } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export function StatsCards({ activeTab }) {
  const { getDataCountByType, generatedDataCount, getTimeAgo } = useAppData();

  const getStatsForTab = (tab) => {
    const baseStats = [
      {
        id: 'total',
        name: 'Total Generated',
        value: getDataCountByType(tab === 'gmail' ? 'email' : tab === 'useragent' ? 'user_agent' : tab === 'ipfinder' ? 'ip' : 'phone'),
        icon: TrendingUp,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        change: '+12%',
        changeType: 'positive'
      },
      {
        id: 'today',
        name: 'Generated Today',
        value: Math.floor(Math.random() * 50) + 10, // Mock data
        icon: Clock,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        change: '+5%',
        changeType: 'positive'
      },
      {
        id: 'success',
        name: 'Success Rate',
        value: '99.8%',
        icon: Target,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        change: '+0.2%',
        changeType: 'positive'
      },
      {
        id: 'speed',
        name: 'Avg. Speed',
        value: '0.3s',
        icon: Zap,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        change: '-0.1s',
        changeType: 'positive'
      }
    ];

    // Add tab-specific stats
    const tabSpecificStats = {
      gmail: [
        {
          id: 'countries',
          name: 'Countries',
          value: '20+',
          icon: Globe,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20'
        }
      ],
      useragent: [
        {
          id: 'devices',
          name: 'Device Types',
          value: '50+',
          icon: Users,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20'
        }
      ],
      ipfinder: [
        {
          id: 'locations',
          name: 'Locations',
          value: '195+',
          icon: Globe,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20'
        }
      ],
      numbergenerator: [
        {
          id: 'formats',
          name: 'Formats',
          value: '15+',
          icon: Shield,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500/20'
        }
      ]
    };

    return [...baseStats.slice(0, 3), ...(tabSpecificStats[tab] || []), baseStats[3]];
  };

  const stats = getStatsForTab(activeTab);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`relative overflow-hidden rounded-xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm p-6 hover:scale-105 transition-all duration-200 group`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                
                {stat.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {stat.name}
                </div>
              </div>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-indigo-600/5 group-hover:via-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300" />
          </div>
        );
      })}
      
      {/* Premium Badge */}
      <div className="relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm p-6 hover:scale-105 transition-all duration-200 group">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-xs font-bold text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
              PRO
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Premium
            </div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              Account Status
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}