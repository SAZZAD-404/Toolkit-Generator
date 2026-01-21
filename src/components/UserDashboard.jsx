import { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Smartphone, Globe, Hash, TrendingUp, Activity, Clock, 
  Zap, Eye, Copy, Target, PieChart, LineChart, Users, Database,
  ArrowUp, ArrowDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  BarElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useToast } from '../context/ToastContext';
import { getAllGeneratedData } from '../utils/dataStorage';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function UserDashboard() {
  const [generatedData, setGeneratedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { toast } = useToast();

  // Force loading to false after 5 seconds as a safety measure
  useEffect(() => {
    const forceLoadTimeout = setTimeout(() => {
      if (loading) {
        console.log('⚠️ Force stopping dashboard loading after 5 seconds');
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(forceLoadTimeout);
  }, [loading]);

  // Get data counts from localStorage
  const getDataCountByType = (type) => {
    try {
      const data = JSON.parse(localStorage.getItem('generatedData') || '[]');
      return data.filter(item => item.dataType === type || item.data_type === type).length;
    } catch {
      return 0;
    }
  };

  const generatedDataCount = useMemo(() => {
    try {
      // Check both generatedData state and localStorage directly
      const localData = JSON.parse(localStorage.getItem('generatedData') || '[]');
      console.log('📊 LocalStorage data count:', localData.length);
      console.log('📊 State data count:', Array.isArray(generatedData) ? generatedData.length : 0);
      
      // Use the larger of the two counts
      const stateCount = Array.isArray(generatedData) ? generatedData.length : 0;
      const localCount = localData.length;
      
      return Math.max(stateCount, localCount);
    } catch {
      return Array.isArray(generatedData) ? generatedData.length : 0;
    }
  }, [generatedData, lastUpdate]);

  // Load data with timeout
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading dashboard data...');
        
        // Set a timeout for data loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Data loading timeout')), 3000)
        );
        
        const dataPromise = getAllGeneratedData();
        
        const data = await Promise.race([dataPromise, timeoutPromise]);
        console.log('📊 Dashboard loaded data:', data.length, 'items');
        console.log('📊 Sample data:', data.slice(0, 2));
        setGeneratedData(data);
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        
        // Fallback to localStorage directly
        try {
          const localData = JSON.parse(localStorage.getItem('generatedData') || '[]');
          console.log('📊 Using localStorage fallback:', localData.length, 'items');
          setGeneratedData(localData);
        } catch (localError) {
          console.error('❌ LocalStorage fallback failed:', localError);
          setGeneratedData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lastUpdate]);

  // Listen for generation events and also check localStorage periodically
  useEffect(() => {
    const handleGenerationComplete = () => {
      console.log('🎉 Generation complete event received');
      setLastUpdate(Date.now());
    };

    // Also check localStorage every 2 seconds for any changes
    const checkLocalStorage = () => {
      try {
        const localData = JSON.parse(localStorage.getItem('generatedData') || '[]');
        if (localData.length !== generatedData.length) {
          console.log('📊 LocalStorage data changed, updating dashboard');
          setLastUpdate(Date.now());
        }
      } catch (error) {
        console.error('Error checking localStorage:', error);
      }
    };

    window.addEventListener('generationComplete', handleGenerationComplete);
    const interval = setInterval(checkLocalStorage, 2000);
    
    return () => {
      window.removeEventListener('generationComplete', handleGenerationComplete);
      clearInterval(interval);
    };
  }, [generatedData.length]);

  // Calculate advanced statistics
  const advancedStats = useMemo(() => {
    // Ensure generatedData is an array, fallback to localStorage if needed
    let dataArray = Array.isArray(generatedData) ? generatedData : [];
    
    // If no data in state, try localStorage directly
    if (dataArray.length === 0) {
      try {
        const localData = JSON.parse(localStorage.getItem('generatedData') || '[]');
        dataArray = localData;
        console.log('📊 Using localStorage data for stats:', dataArray.length, 'items');
      } catch (error) {
        console.error('Error reading localStorage for stats:', error);
      }
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayData = dataArray.filter(item => {
      const itemDate = new Date(item.createdAt || item.created_at);
      return itemDate >= today;
    });

    const yesterdayData = dataArray.filter(item => {
      const itemDate = new Date(item.createdAt || item.created_at);
      return itemDate >= yesterday && itemDate < today;
    });

    const weekData = dataArray.filter(item => {
      const itemDate = new Date(item.createdAt || item.created_at);
      return itemDate >= weekAgo;
    });

    const monthData = dataArray.filter(item => {
      const itemDate = new Date(item.createdAt || item.created_at);
      return itemDate >= monthAgo;
    });

    // Calculate growth rates
    const todayGrowth = yesterdayData.length > 0 
      ? ((todayData.length - yesterdayData.length) / yesterdayData.length * 100)
      : 100;

    return {
      today: todayData.length,
      yesterday: yesterdayData.length,
      week: weekData.length,
      month: monthData.length,
      todayGrowth: todayGrowth,
      avgPerDay: weekData.length / 7
    };
  }, [generatedData, lastUpdate]);

  // Chart data for 7-day activity
  const chartData = useMemo(() => {
    // Ensure generatedData is an array
    const dataArray = Array.isArray(generatedData) ? generatedData : [];
    
    const last7Days = [];
    const dailyCounts = [];
    const dailyLabels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayData = dataArray.filter(item => {
        const itemDate = new Date(item.createdAt || item.created_at);
        return itemDate >= date && itemDate < nextDay;
      });
      
      dailyCounts.push(dayData.length);
      dailyLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    return {
      labels: dailyLabels,
      datasets: [{
        label: 'Generated Items',
        data: dailyCounts,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };
  }, [generatedData]);

  // Type distribution chart
  const typeDistribution = useMemo(() => {
    const types = {
      email: getDataCountByType('email'),
      user_agent: getDataCountByType('user_agent'),
      ip: getDataCountByType('ip'),
      phone: getDataCountByType('phone')
    };

    return {
      labels: ['Email', 'User Agents', 'IP Tools', 'Phone Numbers'],
      datasets: [{
        data: [types.email, types.user_agent, types.ip, types.phone],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(147, 51, 234, 0.8)'   // Purple
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(147, 51, 234)'
        ],
        borderWidth: 2
      }]
    };
  }, [generatedData, lastUpdate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1
      }
    }
  };

  const stats = [
    {
      title: 'Total Generated',
      value: generatedDataCount,
      change: advancedStats.todayGrowth,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Today',
      value: advancedStats.today,
      change: advancedStats.todayGrowth,
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'This Week',
      value: advancedStats.week,
      change: 12.5,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      change: 0.2,
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white font-medium">Loading Professional Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Professional Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Professional Dashboard
              </h1>
              <p className="text-slate-400 text-lg mb-2">Advanced Analytics & Data Generation Control Center</p>
              <p className="text-slate-500 text-sm">Real-time monitoring and comprehensive data insights</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-slate-300">System Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Data Synced</span>
                </div>
                <button
                  onClick={() => {
                    console.log('🔄 Manual refresh triggered');
                    setLastUpdate(Date.now());
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors text-sm"
                >
                  <Activity className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={() => {
                    // Add test data for debugging
                    const testData = {
                      id: Date.now().toString(),
                      dataType: 'user_agent',
                      dataValue: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                      createdAt: new Date().toISOString()
                    };
                    const existing = JSON.parse(localStorage.getItem('generatedData') || '[]');
                    existing.push(testData);
                    localStorage.setItem('generatedData', JSON.stringify(existing));
                    setLastUpdate(Date.now());
                    toast.success('Test data added!');
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600/50 hover:bg-green-500/50 rounded-lg text-green-300 hover:text-white transition-colors text-sm"
                >
                  <Database className="w-4 h-4" />
                  Test
                </button>
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{generatedDataCount.toLocaleString()}</div>
                  <div className="text-slate-400 text-sm mb-3">Total Items Generated</div>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <div className="flex items-center gap-1 text-green-400">
                      <ArrowUp className="w-3 h-3" />
                      <span>{advancedStats.todayGrowth > 0 ? '+' : ''}{advancedStats.todayGrowth.toFixed(1)}%</span>
                    </div>
                    <span className="text-slate-500">vs yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <div
                key={index}
                className={`relative overflow-hidden ${stat.bgColor} backdrop-blur-xl rounded-2xl border ${stat.borderColor} p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02]"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(stat.change).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LineChart className="w-6 h-6 text-indigo-400" />
                7-Day Activity Trend
              </h2>
              <div className="text-sm text-slate-400">
                Avg: {advancedStats.avgPerDay.toFixed(1)} items/day
              </div>
            </div>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-purple-400" />
              Data Distribution
            </h2>
            <div className="h-80">
              <Doughnut data={typeDistribution} options={doughnutOptions} />
            </div>
          </div>
        </div>



        {/* Quick Actions Panel */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'gmail' }))}
              className="group relative overflow-hidden bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Mail className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Generate Email</div>
                  <div className="text-red-300 text-sm">Create new emails</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'useragent' }))}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">User Agents</div>
                  <div className="text-blue-300 text-sm">Generate UA strings</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'ipfinder' }))}
              className="group relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">IP Tools</div>
                  <div className="text-green-300 text-sm">IP utilities</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'alldata' }))}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-500/30 rounded-xl p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">View All Data</div>
                  <div className="text-purple-300 text-sm">Data archive</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            Recent Activity
          </h2>
          {(() => {
            // Use generatedData from state, fallback to localStorage
            let displayData = Array.isArray(generatedData) ? generatedData : [];
            
            if (displayData.length === 0) {
              try {
                const localData = JSON.parse(localStorage.getItem('generatedData') || '[]');
                displayData = localData.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
                console.log('📊 Using localStorage data for recent activity:', displayData.length, 'items');
              } catch (error) {
                console.error('Error reading localStorage for recent activity:', error);
              }
            }
            
            return displayData.length > 0 ? (
            <div className="space-y-3">
              {displayData.slice(0, 8).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                          (item.dataType || item.data_type) === 'email' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                          (item.dataType || item.data_type) === 'user_agent' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                          (item.dataType || item.data_type) === 'ip' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                          (item.dataType || item.data_type) === 'phone' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }`}>
                          {(item.dataType || item.data_type || 'Unknown').replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {new Date(item.createdAt || item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-sm truncate">
                        {item.dataValue || item.data_value || 'No data'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      Success
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.dataValue || item.data_value);
                        toast.success('Copied to clipboard!');
                      }}
                      className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No Activity Yet</h3>
              <p className="text-slate-400 mb-6">Start using the generators to see real-time activity here</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'useragent' }))}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Generate User Agents
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'gmail' }))}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Generate Emails
                </button>
              </div>
            </div>
          );
          })()}
        </div>
      </div>
    </div>
  );
}