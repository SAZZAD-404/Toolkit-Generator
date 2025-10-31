import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, FileCode, Clock, User, GitCommit, Calendar } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    totalFiles: 0,
    recentEdits: 0,
    totalBackups: 0,
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch file count
      const { count: fileCount } = await supabase
        .from('code_files')
        .select('*', { count: 'exact', head: true });

      // Fetch backup count
      const { count: backupCount } = await supabase
        .from('code_backups')
        .select('*', { count: 'exact', head: true });

      // Fetch recent edits (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentCount } = await supabase
        .from('code_backups')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalFiles: fileCount || 0,
        recentEdits: recentCount || 0,
        totalBackups: backupCount || 0,
      });

      // Fetch activity logs (recent backups with file info)
      const { data: logs } = await supabase
        .from('code_backups')
        .select(`
          *,
          code_files (
            file_name,
            file_path
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      setActivityLogs(logs || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalFiles}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileCode className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Edits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.recentEdits}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Backups</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBackups}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <GitCommit className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {activityLogs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No activity yet</p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
                    <FileCode className="w-5 h-5 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.code_files?.file_name || 'Unknown File'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {log.code_files?.file_path || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(log.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <User className="w-3.5 h-3.5" />
                        <span>{log.updated_by || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Version {log.version}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
