import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './Card';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ComprehensiveDuplicateStatus() {
  const [stats, setStats] = useState({
    email: { total: 0, unique: 0 },
    user_agent: { total: 0, unique: 0 },
    phone: { total: 0, unique: 0 },
    ip: { total: 0, unique: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!isSupabaseConfigured || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const dataTypes = ['email', 'user_agent', 'phone', 'ip'];
      const newStats = {};

      for (const dataType of dataTypes) {
        // Get total count
        const { count: totalCount, error: totalError } = await supabase
          .from('generated_data')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('data_type', dataType);

        // Get unique count
        const { data: uniqueData, error: uniqueError } = await supabase
          .from('generated_data')
          .select('data_value')
          .eq('user_id', user.id)
          .eq('data_type', dataType);

        if (!totalError && !uniqueError) {
          const uniqueValues = new Set(uniqueData?.map(item => item.data_value) || []);
          newStats[dataType] = {
            total: totalCount || 0,
            unique: uniqueValues.size
          };
        } else {
          newStats[dataType] = { total: 0, unique: 0 };
        }
      }

      setStats(newStats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching duplicate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const getDataTypeInfo = (dataType) => {
    const info = {
      email: { name: 'Gmail Addresses', icon: '📧', color: 'text-red-400' },
      user_agent: { name: 'User Agents', icon: '📱', color: 'text-blue-400' },
      phone: { name: 'Phone Numbers', icon: '📞', color: 'text-purple-400' },
      ip: { name: 'IP Lookups', icon: '🌐', color: 'text-green-400' }
    };
    return info[dataType] || { name: dataType, icon: '📊', color: 'text-slate-400' };
  };

  const calculateDuplicateRate = (total, unique) => {
    if (total === 0) return 0;
    return ((total - unique) / total * 100).toFixed(1);
  };

  const getTotalStats = () => {
    const totals = Object.values(stats).reduce(
      (acc, curr) => ({
        total: acc.total + curr.total,
        unique: acc.unique + curr.unique
      }),
      { total: 0, unique: 0 }
    );
    return totals;
  };

  if (!isSupabaseConfigured || !user) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Database className="w-4 h-4" />
            <span className="text-sm">Database not configured or user not logged in</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalStats = getTotalStats();

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Duplicate Prevention Status</h3>
                <p className="text-sm text-slate-400">Database integrity monitoring</p>
              </div>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
              title="Refresh statistics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Overall Stats */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{totalStats.unique.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Unique Items</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-slate-300">{totalStats.total.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Generated</div>
              </div>
            </div>
            {totalStats.total > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(totalStats.unique / totalStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {((totalStats.unique / totalStats.total) * 100).toFixed(1)}% Unique
                </span>
              </div>
            )}
          </div>

          {/* Individual Data Type Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">By Data Type</h4>
            <div className="grid gap-3">
              {Object.entries(stats).map(([dataType, data]) => {
                const info = getDataTypeInfo(dataType);
                const duplicateRate = calculateDuplicateRate(data.total, data.unique);
                
                return (
                  <div
                    key={dataType}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{info.icon}</span>
                      <div>
                        <div className="font-medium text-slate-200">{info.name}</div>
                        <div className="text-xs text-slate-400">
                          {data.unique} unique of {data.total} total
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {data.total > 0 && (
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            duplicateRate === '0.0' ? 'text-green-400' :
                            duplicateRate < 10 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {duplicateRate}% duplicates
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        {data.total === 0 ? (
                          <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        ) : duplicateRate === '0.0' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : duplicateRate < 10 ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="text-xs text-slate-500 text-center">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}

          {/* Status Legend */}
          <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30">
            <div className="text-xs font-medium text-slate-300 mb-2">Status Legend</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-slate-400">No duplicates</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-400">Low duplicates</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span className="text-slate-400">High duplicates</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}