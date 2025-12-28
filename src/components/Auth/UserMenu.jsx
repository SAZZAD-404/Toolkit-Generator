import { useState, useRef, useEffect } from 'react'
import { User, Settings, Database, Activity, Zap, LogOut } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { generatedDataCount, recentActivity, getTimeAgo } = useAppData()
  const { user, userProfile, signOut } = useAuth()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  // Get last activity
  const getLastActivity = () => {
    if (recentActivity.length === 0) return 'No recent activity'
    return getTimeAgo(recentActivity[0].created_at)
  }

  const getUserInitials = () => {
    if (userProfile?.name) {
      return userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = () => {
    return userProfile?.name || user?.email?.split('@')[0] || 'User'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {getUserInitials()}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
        </div>
        
        {/* User Info */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
            {getUserDisplayName()}
          </div>
          <div className="text-xs text-slate-400">
            {generatedDataCount} items generated
          </div>
        </div>

        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 border-b border-slate-600">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {getUserInitials()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{getUserDisplayName()}</h3>
                  <Zap className="text-yellow-400" size={16} />
                </div>
                <div className="text-slate-300 text-sm">
                  {user?.email}
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  Member since {new Date(user?.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-white">{generatedDataCount}</div>
                <div className="text-xs text-slate-400">Total Generated</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-indigo-400">{recentActivity.length}</div>
                <div className="text-xs text-slate-400">Recent Items</div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="p-3 border-b border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">RECENT ACTIVITY</span>
              </div>
              <div className="text-xs text-slate-300">
                Last activity: {getLastActivity()}
              </div>
            </div>
          )}
          
          {/* Menu Items */}
          <div className="p-2">
            <button 
              onClick={() => {
                // Navigate to dashboard tab
                window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'dashboard' }))
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Settings className="text-blue-400" size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Dashboard</div>
                <div className="text-xs text-slate-400">View your overview</div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                // Navigate to all data tab
                window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'alldata' }))
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Database className="text-purple-400" size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">All Generated Data</div>
                <div className="text-xs text-slate-400">{generatedDataCount} items saved</div>
              </div>
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-3 text-slate-300 hover:bg-red-500/10 rounded-lg transition-colors group mt-2 border-t border-slate-600"
            >
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <LogOut className="text-red-400" size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-red-400">Sign Out</div>
                <div className="text-xs text-slate-400">End your session</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}