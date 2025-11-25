import { useState } from 'react';
import { BarChart3, Mail, Smartphone, Globe, Hash, Trash2, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { useStats } from '../context/StatsContext';
import { useToast } from '../context/ToastContext';
import { formatNumber, formatRelativeTime } from '../utils/formatters';

// Generator type configurations with icons and colors
const GENERATOR_CONFIG = {
  gmail: {
    name: 'Gmail Generator',
    icon: Mail,
    color: 'text-red-400',
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-700'
  },
  useragent: {
    name: 'User Agent Generator',
    icon: Smartphone,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900/30',
    borderColor: 'border-indigo-700'
  },
  ipfinder: {
    name: 'IP Finder',
    icon: Globe,
    color: 'text-green-400',
    bgColor: 'bg-green-900/30',
    borderColor: 'border-green-700'
  },
  numbergenerator: {
    name: 'Number Generator',
    icon: Hash,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/30',
    borderColor: 'border-yellow-700'
  }
};

function StatCard({ generatorType, stats }) {
  const config = GENERATOR_CONFIG[generatorType];
  if (!config) return null;

  const Icon = config.icon;
  const { totalCount, todayCount, lastUsed } = stats || { totalCount: 0, todayCount: 0, lastUsed: null };

  return (
    <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor} transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
          <Icon size={20} className={config.color} />
        </div>
        <h4 className="font-semibold text-slate-100">{config.name}</h4>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Total Generated</span>
          <span className={`text-lg font-bold ${config.color}`}>{formatNumber(totalCount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Today</span>
          <span className="text-sm font-medium text-slate-200">{formatNumber(todayCount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Last Used</span>
          <span className="text-xs text-slate-300">{formatRelativeTime(lastUsed)}</span>
        </div>
      </div>
    </div>
  );
}


function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fadeIn">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function StatsDashboard({ onClose }) {
  const { stats, clearStats } = useStats();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearStats = () => {
    clearStats();
    setShowConfirm(false);
    addToast('All statistics have been cleared', 'success');
  };

  // Calculate total across all generators
  const totalGenerated = Object.values(stats).reduce((sum, s) => sum + (s?.totalCount || 0), 0);
  const totalToday = Object.values(stats).reduce((sum, s) => sum + (s?.todayCount || 0), 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={24} className="text-indigo-400" />
              Statistics Dashboard
            </CardTitle>
            <CardDescription>
              Track your generation history and usage patterns
            </CardDescription>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
              aria-label="Close dashboard"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-400">{formatNumber(totalGenerated)}</p>
              <p className="text-sm text-slate-400">Total Generated</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{formatNumber(totalToday)}</p>
              <p className="text-sm text-slate-400">Generated Today</p>
            </div>
          </div>

          {/* Generator Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(GENERATOR_CONFIG).map((type) => (
              <StatCard
                key={type}
                generatorType={type}
                stats={stats[type]}
              />
            ))}
          </div>

          {/* Clear Statistics Button */}
          <div className="pt-4 border-t border-slate-700">
            <Button
              variant="destructive"
              onClick={() => setShowConfirm(true)}
              className="w-full h-11 gap-2"
              disabled={totalGenerated === 0}
            >
              <Trash2 size={16} />
              Clear All Statistics
            </Button>
            {totalGenerated === 0 && (
              <p className="text-xs text-slate-500 text-center mt-2">
                No statistics to clear
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={handleClearStats}
        onCancel={() => setShowConfirm(false)}
        title="Clear All Statistics?"
        message="This will permanently reset all generation counts and history. This action cannot be undone."
      />
    </Card>
  );
}
