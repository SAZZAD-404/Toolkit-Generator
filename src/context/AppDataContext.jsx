import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AppDataContext = createContext({})

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }
  return context
}

export const AppDataProvider = ({ children }) => {
  const [generatedDataCount, setGeneratedDataCount] = useState(0)
  const [dataCountByType, setDataCountByType] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Welcome to Toolkit Generators!',
      message: 'Your account has been successfully created.',
      time: new Date().toISOString(),
      read: false
    }
  ])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fetch user data count
  const fetchDataCount = async () => {
    if (!user || !isSupabaseConfigured) {
      setGeneratedDataCount(0)
      setDataCountByType({})
      return
    }

    try {
      const { count, error } = await supabase
        .from('generated_data')
        .select('*', { count: 'exact', head: true })

      if (!error) {
        setGeneratedDataCount(count || 0)
      }

      // Fetch count by type
      const { data: typeData, error: typeError } = await supabase
        .from('generated_data')
        .select('data_type')

      if (!typeError && typeData) {
        const counts = typeData.reduce((acc, item) => {
          acc[item.data_type] = (acc[item.data_type] || 0) + 1
          return acc
        }, {})
        setDataCountByType(counts)
      }
    } catch (error) {
      console.error('Error fetching data count:', error)
      setGeneratedDataCount(0)
      setDataCountByType({})
    }
  }

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    if (!user || !isSupabaseConfigured) {
      setRecentActivity([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('generated_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error && data) {
        setRecentActivity(data)
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      setRecentActivity([])
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchDataCount()
      fetchRecentActivity()
    }
  }, [user])

  // Add new generated data with optimized updates (for UI updates only, database save handled separately)
  const addGeneratedData = useCallback((type, value, metadata = {}) => {
    // Update local counts immediately for better UX
    setGeneratedDataCount(prev => prev + 1)
    setDataCountByType(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }))
    
    // Add to recent activity with better performance
    const newActivity = {
      id: Date.now() + Math.random(), // Ensure unique ID
      data_type: type,
      data_value: value,
      metadata,
      created_at: new Date().toISOString()
    }
    
    setRecentActivity(prev => {
      const updated = [newActivity, ...prev];
      return updated.slice(0, 20); // Keep only last 20 items for performance
    })

    // Add notification based on type
    let notificationTitle = 'Data Generated'
    let notificationMessage = `New ${type} generated successfully`
    
    switch (type) {
      case 'email':
        notificationTitle = 'Email Generated'
        notificationMessage = 'New Gmail address created'
        break
      case 'user_agent':
        notificationTitle = 'User Agent Generated'
        notificationMessage = 'New user agent string created'
        break
      case 'ip':
        notificationTitle = 'IP Data Retrieved'
        notificationMessage = 'IP address information found'
        break
      case 'phone':
        notificationTitle = 'Phone Number Generated'
        notificationMessage = 'New phone number created'
        break
    }
    
    addNotification('generation', notificationTitle, notificationMessage)
  }, [])

  // Get data count by type with memoization
  const getDataCountByType = useCallback((type) => {
    return dataCountByType[type] || 0
  }, [dataCountByType])

  // Add notification
  const addNotification = (type, title, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Get time ago string
  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`
    return `${Math.floor(diffInSeconds / 86400)} day ago`
  }

  // Refresh today's data function
  const refreshTodayData = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const { count, error } = await supabase
        .from('generated_data')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart);

      if (!error) {
        // This will trigger a re-render in components using this context
        fetchDataCount();
        fetchRecentActivity();
      }
    } catch (error) {
      console.error('Error refreshing today data:', error);
    }
  }, [user, fetchDataCount, fetchRecentActivity]);

  const value = {
    // Data
    generatedDataCount,
    dataCountByType,
    recentActivity,
    notifications,
    isOnline,
    
    // Functions
    addGeneratedData,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    fetchDataCount,
    fetchRecentActivity,
    refreshTodayData,
    getTimeAgo,
    getDataCountByType,
    
    // Computed values
    unreadNotificationCount: notifications.filter(n => !n.read).length
  }

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}