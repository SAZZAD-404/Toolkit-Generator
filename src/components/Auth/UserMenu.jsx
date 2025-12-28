import { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings, Database, Crown, Mail, Calendar, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { generatedDataCount, recentActivity, getTimeAgo } = useAppData()
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

  // Get user initials for avatar
  const getInitials = (email) => {
    return email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'U'
  }

  // Get member since date
  const getMemberSince = (createdAt) => {
    return new Date(createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  // Get last activity
  const getLastActivity = () => {
    if (recentActivity.length === 0) return 'No recent activity'
    return getTimeAgo(recentActivity[0].created_at)
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
            {getInitials(user?.email)}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>
        </div>
        
        {/* User Info */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
            {user?.email?.split('@')[0]}
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(user?.email)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{user?.email?.split('@')[0]}</h3>
                  <Crown className="text-yellow-400" size={16} />
                </div>
                <div className="flex items-center gap-1 text-slate-300 text-sm">
                  <Mail size={12} />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                  <Calendar size={12} />
                  <span>Member since {getMemberSince(user?.created_at)}</span>
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
                // Navigate to settings tab
                window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'settings' }))
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-3 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Settings className="text-blue-400" size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Account Settings</div>
                <div className="text-xs text-slate-400">Manage your profile</div>
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
            
            <hr className="my-2 border-slate-600" />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <LogOut className="text-red-400" size={16} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-red-300/70">End your session</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}