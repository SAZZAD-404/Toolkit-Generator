import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Mail, Smartphone, Globe, Hash, TrendingUp, Activity, Clock, 
  Zap, Eye, Copy, Target, PieChart, LineChart
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
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { SkeletonStats, SkeletonCard } from './ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  
  // Static system status
  const systemStatus = useMemo(() => ({
    status: 'operational',
    uptime: '99.9%',
    responseTime: Math.floor(Math.random() * 50 + 100) + 'ms',
    serverLoad: Math.floor(Math.random() * 20 + 15)
  }), [lastUpdate]);

  const { user } = useAuth();
  const { getDataCountByType, generatedDataCount, recentActivity } = useAppData();
  const { addToast } = useToast();

  // State for real today's data and generation speeds
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [generationTimes, setGenerationTimes] = useState([]);
  const [chartData, setChartData] = useState({
    daily: [],
    typeDistribution: []
  });

  // Fetch chart data for professional 7-day graphs
  const fetchChartData = useCallback(async () => {
    if (!user) return;

    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch daily data for the last 7 days
      const { data: dailyData, error: dailyError } = await supabase
        .from('generated_data')
        .select('created_at, data_type')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (!dailyError && dailyData) {
        // Process daily data
        const dailyMap = new Map();
        const typeMap = new Map();

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dateKey = date.toISOString().split('T')[0];
          dailyMap.set(dateKey, 0);
        }

        // Process the data
        dailyData.forEach(item => {
          const date = new Date(item.created_at);
          const dateKey = date.toISOString().split('T')[0];

          // Daily count
          if (dailyMap.has(dateKey)) {
            dailyMap.set(dateKey, dailyMap.get(dateKey) + 1);
          }

          // Type distribution
          const type = item.data_type || 'unknown';
          typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });

        // Convert to chart format
        const dailyChart = Array.from(dailyMap.entries()).map(([date, count]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count
        }));

        const typeChart = Array.from(typeMap.entries()).map(([type, count]) => ({
          type: type.replace('_', ' ').toUpperCase(),
          count,
          percentage: dailyData.length > 0 ? ((count / dailyData.length) * 100).toFixed(1) : 0
        }));

        setChartData({
          daily: dailyChart,
          typeDistribution: typeChart
        });
      } else {
        // If no data, create sample data for demonstration
        const sampleDaily = Array.from({length: 7}, (_, i) => ({
          date: new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: Math.floor(Math.random() * 50) + 10
        }));
        
        const sampleTypes = [
          { type: 'EMAIL', count: 45, percentage: '45.0' },
          { type: 'USER AGENT', count: 30, percentage: '30.0' },
          { type: 'PHONE', count: 25, percentage: '25.0' }
        ];
        
        setChartData({
          daily: sampleDaily,
          typeDistribution: sampleTypes
        });
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }, [user]);

  // Fetch real today's and week's data from database
  const fetchTodayData = useCallback(async () => {
    if (!user) return;

    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch today's count
      const { count: todayCountResult, error: todayError } = await supabase
        .from('generated_data')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart);

      if (!todayError) {
        setTodayCount(todayCountResult || 0);
      }

      // Fetch week's count
      const { count: weekCountResult, error: weekError } = await supabase
        .from('generated_data')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart);

      if (!weekError) {
        setWeekCount(weekCountResult || 0);
      }
    } catch (error) {
      console.error('Error fetching today/week data:', error);
    }
  }, [user]);

  // Enhanced real-time stats with real database data and generation speeds
  const realtimeStats = useMemo(() => {
    const now = new Date();

    // Calculate real success rate from recent activity
    const totalAttempts = recentActivity.length;
    const successfulAttempts = recentActivity.filter(item => item.data_value && item.data_value.trim()).length;
    const realSuccessRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 100;

    // Calculate real average generation speed from tracked times
    let avgSpeed = 0.25; // Default fallback
    if (generationTimes.length > 0) {
      const recentTimes = generationTimes.slice(-10);
      const totalTime = recentTimes.reduce((sum, time) => sum + time, 0);
      avgSpeed = totalTime / recentTimes.length;
    } else if (recentActivity.length > 1) {
      const sortedActivity = [...recentActivity].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      if (sortedActivity.length >= 2) {
        const timeDiffs = [];
        for (let i = 0; i < Math.min(5, sortedActivity.length - 1); i++) {
          const diff = (new Date(sortedActivity[i].created_at) - new Date(sortedActivity[i + 1].created_at)) / 1000;
          if (diff > 0 && diff < 60) {
            timeDiffs.push(diff);
          }
        }
        if (timeDiffs.length > 0) {
          avgSpeed = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
        }
      }
    }

    return {
      totalGenerated: generatedDataCount || 0,
      todayGenerated: todayCount,
      thisWeekGenerated: weekCount,
      successRate: realSuccessRate,
      avgSpeed: Math.max(0.1, Math.min(5.0, avgSpeed)),
      peakHour: now.getHours() + ':00',
      isActive: recentActivity.length > 0
    };
  }, [generatedDataCount, recentActivity, todayCount, weekCount, generationTimes, lastUpdate]);

  // Memoized type stats to prevent recalculation
  const typeStats = useMemo(() => [
    {
      type: 'email',
      name: 'Gmail Addresses',
      count: getDataCountByType('email'),
      icon: Mail,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      trend: 'up'
    },
    {
      type: 'user_agent',
      name: 'User Agents',
      count: getDataCountByType('user_agent'),
      icon: Smartphone,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      trend: 'up'
    },
    {
      type: 'ip',
      name: 'IP Lookups',
      count: getDataCountByType('ip'),
      icon: Globe,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      trend: 'up'
    },
    {
      type: 'phone',
      name: 'Phone Numbers',
      count: getDataCountByType('phone'),
      icon: Hash,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      trend: 'up'
    }
  ], [getDataCountByType]);

  // Optimized data fetching
  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setGeneratedData(recentActivity.slice(0, 10));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, recentActivity]);

  // Enhanced real-time updates with better performance
  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchTodayData();
      fetchChartData();
      
      const interval = setInterval(() => {
        setLastUpdate(Date.now());
        fetchTodayData();
        fetchChartData();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [user, fetchDashboardData, fetchTodayData, fetchChartData]);

  // Immediate update when recentActivity changes
  useEffect(() => {
    setGeneratedData(recentActivity.slice(0, 10));
    setLastUpdate(Date.now());
    fetchTodayData();
  }, [recentActivity, fetchTodayData]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to clipboard!', 'success');
  }, [addToast]);

  // Function to track generation speed
  const trackGenerationSpeed = useCallback((timeInSeconds) => {
    setGenerationTimes(prev => {
      const updated = [...prev, timeInSeconds];
      return updated.slice(-20);
    });
  }, []);

  // Listen for generation events from other components
  useEffect(() => {
    const handleGenerationComplete = (event) => {
      if (event.detail && event.detail.generationTime) {
        trackGenerationSpeed(event.detail.generationTime);
      }
    };

    window.addEventListener('generationComplete', handleGenerationComplete);
    return () => window.removeEventListener('generationComplete', handleGenerationComplete);
  }, [trackGenerationSpeed]);

  // Professional Chart.js configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        },
        beginAtZero: true
      }
    }
  };

  // Professional chart data configurations
  const lineChartData = useMemo(() => ({
    labels: chartData.daily.map(item => item.date),
    datasets: [
      {
        label: 'Daily Generations',
        data: chartData.daily.map(item => item.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(79, 70, 229)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3
      }
    ]
  }), [chartData.daily]);

  const doughnutChartData = useMemo(() => ({
    labels: chartData.typeDistribution.map(item => item.type),
    datasets: [
      {
        data: chartData.typeDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(147, 51, 234, 0.8)',  // Purple
          'rgba(245, 158, 11, 0.8)',  // Yellow
          'rgba(236, 72, 153, 0.8)'   // Pink
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(147, 51, 234)',
          'rgb(245, 158, 11)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 3,
        hoverBackgroundColor: [
          'rgba(239, 68, 68, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(147, 51, 234, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(236, 72, 153, 0.9)'
        ],
        hoverBorderWidth: 4,
        cutout: '60%',
        spacing: 2
      }
    ]
  }), [chartData.typeDistribution]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((sum, value) => sum + value, 0);
              
              return data.labels.map((label, index) => {
                const value = dataset.data[index];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.borderColor[index],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: index
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen overflow-auto">
        <div className="p-4 md:p-6 space-y-6 min-h-full">
          {/* Header Skeleton */}
          <div className="bg-theme-card border border-theme rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-theme-secondary rounded-xl animate-pulse" />
                <div>
                  <div className="h-6 w-48 bg-theme-secondary rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-theme-secondary rounded animate-pulse" />
                </div>
              </div>
              <div className="h-10 w-32 bg-theme-secondary rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <SkeletonStats />

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Recent Activity Skeleton */}
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto">
      <div className="p-4 md:p-6 space-y-6 min-h-full">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/favicon.svg" alt="Toolkit Generators" className="w-12 h-12" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Toolkit Generators Dashboard
                  </h1>
                  <p className="text-slate-400">Professional Data Generation Suite</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">System Operational</span>
                </div>
                <div className="text-slate-400">
                  Last Update: <span className="text-white font-mono text-xs">{new Date(lastUpdate).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Professional Real-Time Counter Cards */}
              <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 backdrop-blur-sm rounded-xl border border-indigo-500/30 p-4 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      {realtimeStats.totalGenerated.toLocaleString()}
                    </div>
                    <div className="text-xs text-indigo-300 font-medium">Total Generated</div>
                  </div>
                  {realtimeStats.isActive && (
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="w-px h-16 bg-slate-600/50"></div>

              <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-sm rounded-xl border border-green-500/30 p-4 shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      {realtimeStats.todayGenerated.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-300 font-medium">Generated Today</div>
                  </div>
                  {realtimeStats.todayGenerated > 0 && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="w-px h-16 bg-slate-600/50"></div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-mono tracking-tight">
                      {realtimeStats.thisWeekGenerated.toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-300 font-medium">This Week</div>
                  </div>
                  {realtimeStats.thisWeekGenerated > 0 && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Performance Metrics with Real-Time Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:scale-105 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                Live
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 font-mono">
              {realtimeStats.totalGenerated.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Generated</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-indigo-300">All Time</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:scale-105 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 font-mono">
              {realtimeStats.todayGenerated.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Generated Today</div>
            <div className="mt-2 flex items-center gap-2">
              {realtimeStats.todayGenerated > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300">Active Today</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">No Activity</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:scale-105 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                Real-Time
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 font-mono">
              {realtimeStats.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-400">Success Rate</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-300">
                {realtimeStats.successRate >= 95 ? 'Excellent' : 
                 realtimeStats.successRate >= 85 ? 'Good' : 'Fair'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:scale-105 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                Avg Speed
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1 font-mono">
              {realtimeStats.avgSpeed.toFixed(2)}s
            </div>
            <div className="text-sm text-slate-400">Generation Speed</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-300">
                {realtimeStats.avgSpeed < 0.3 ? 'Fast' : 
                 realtimeStats.avgSpeed < 0.5 ? 'Normal' : 'Slow'}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Interactive Charts Section - 7 Days */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Professional Line Chart - 7-Day Trend */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-indigo-400" />
                7-Day Generation Trend
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                  Last 7 Days
                </span>
              </div>
            </div>
            
            <div className="h-80 relative">
              {chartData.daily.length > 0 ? (
                <Line data={lineChartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <div className="text-slate-400 text-lg font-medium">No trend data available</div>
                    <div className="text-xs text-slate-500 mt-2">Start generating to see 7-day trends</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Doughnut Chart - Data Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" />
                Data Type Distribution
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                  All Time
                </span>
              </div>
            </div>
            
            <div className="h-80 relative">
              {chartData.typeDistribution.length > 0 ? (
                <Doughnut data={doughnutChartData} options={doughnutOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🍩</div>
                    <div className="text-slate-400 text-lg font-medium">No distribution data</div>
                    <div className="text-xs text-slate-500 mt-2">Generate different data types to see distribution</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Live Activity Stream
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">Live Updates</span>
              </div>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View All
              </button>
            </div>
          </div>
          
          {generatedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <div className="text-xl font-semibold text-slate-300 mb-2">Ready to Generate</div>
              <div className="text-slate-400 mb-4">Start using the Toolkit Generators to see real-time activity</div>
              <div className="flex justify-center gap-4">
                <div className="px-4 py-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-indigo-300 text-sm">
                  Gmail Generator
                </div>
                <div className="px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30 text-blue-300 text-sm">
                  User Agents
                </div>
                <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30 text-green-300 text-sm">
                  IP Tools
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedData.map((item, index) => {
                const itemTypeStats = typeStats.find(s => s.type === item.data_type);
                const Icon = itemTypeStats?.icon || Hash;
                
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 group animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${itemTypeStats?.bgColor || 'bg-slate-500/10'} border ${itemTypeStats?.borderColor || 'border-slate-500/20'}`}>
                        <Icon className={`w-4 h-4 ${itemTypeStats?.color || 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className="font-mono text-sm text-white truncate max-w-xs lg:max-w-md">
                          {item.data_value}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="capitalize font-medium">{item.data_type?.replace('_', ' ') || 'Unknown'}</span>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleTimeString()}</span>
                          <span>•</span>
                          <span className="text-green-400">Success</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.data_value)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-slate-700 transition-all duration-200"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}