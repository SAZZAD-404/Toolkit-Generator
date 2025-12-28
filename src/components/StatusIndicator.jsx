import { Wifi, WifiOff, Database, Shield, TrendingUp } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

export default function StatusIndicator() {
  const { isOnline, generatedDataCount, recentActivity } = useAppData()

  // Calculate today's generation count
  const todayCount = recentActivity.filter(item => {
    const today = new Date().toDateString()
    const itemDate = new Date(item.created_at).toDateString()
    return today === itemDate
  }).length

  return (
    <div className="hidden lg:flex items-center gap-3">
      {/* Connection Status */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
        isOnline 
          ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
          : 'bg-red-500/10 border border-red-500/30 text-red-400'
      }`}>
        {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
        <span>{isOnline ? 'Connected' : 'Offline'}</span>
      </div>

      {/* Total Data Count */}
      <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-full text-xs font-medium">
        <Database size={12} />
        <span>{generatedDataCount.toLocaleString()} Total</span>
      </div>

      {/* Today's Count */}
      {todayCount > 0 && (
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-full text-xs font-medium">
          <TrendingUp size={12} />
          <span>{todayCount} Today</span>
        </div>
      )}

      {/* Security Status */}
      <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1.5 rounded-full text-xs font-medium">
        <Shield size={12} />
        <span>Secure</span>
      </div>
    </div>
  )
}