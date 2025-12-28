import { useState, useRef, useEffect } from 'react'
import { Bell, Check, Info, AlertCircle, X, Zap } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  
  const { 
    notifications, 
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    getTimeAgo
  } = useAppData()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="text-green-400" size={16} />
      case 'info': return <Info className="text-blue-400" size={16} />
      case 'warning': return <AlertCircle className="text-yellow-400" size={16} />
      case 'generation': return <Zap className="text-indigo-400" size={16} />
      default: return <Info className="text-blue-400" size={16} />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/30'
      case 'info': return 'bg-blue-500/10 border-blue-500/30'
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'generation': return 'bg-indigo-500/10 border-indigo-500/30'
      default: return 'bg-blue-500/10 border-blue-500/30'
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group"
      >
        <Bell className={`text-slate-300 group-hover:text-white transition-colors ${unreadNotificationCount > 0 ? 'animate-pulse' : ''}`} size={20} />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-bounce">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-600 bg-gradient-to-r from-slate-800 to-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadNotificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </div>
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                    !notification.read ? 'bg-slate-700/20 border-l-4 border-l-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            {getTimeAgo(notification.time)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-white transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title="Remove"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-600 bg-slate-800">
              <button className="w-full text-center text-indigo-400 hover:text-indigo-300 text-sm font-medium py-1 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}