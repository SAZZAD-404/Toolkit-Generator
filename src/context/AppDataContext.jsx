import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'

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
  const [recentActivity, setRecentActivity] = useState([])
  const [dataCountByType, setDataCountByType] = useState({
    email: 0,
    phone: 0,
    user_agent: 0,
    ip: 0
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { user } = useAuth()

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

  // Fetch data count and recent activity
  const fetchDataCount = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      return
    }

    try {
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('generated_data')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!totalError) {
        setGeneratedDataCount(totalCount || 0)
      }

      // Get count by type
      const { data: typeData, error: typeError } = await supabase
        .from('generated_data')
        .select('data_type')
        .eq('user_id', user.id)

      if (!typeError && typeData) {
        const counts = typeData.reduce((acc, item) => {
          acc[item.data_type] = (acc[item.data_type] || 0) + 1
          return acc
        }, { email: 0, phone: 0, user_agent: 0, ip: 0 })
        
        setDataCountByType(counts)
      }

      // Get recent activity
      const { data: recentData, error: recentError } = await supabase
        .from('generated_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (!recentError && recentData) {
        setRecentActivity(recentData)
      }
    } catch (error) {
      console.error('Error fetching data count:', error)
    }
  }, [user])

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchDataCount()
    } else {
      // Reset data when user logs out
      setGeneratedDataCount(0)
      setRecentActivity([])
      setDataCountByType({ email: 0, phone: 0, user_agent: 0, ip: 0 })
    }
  }, [user, fetchDataCount])

  // Add new generated data to local state
  const addGeneratedData = useCallback((dataType, dataValue, metadata = {}) => {
    const newItem = {
      id: Date.now().toString(),
      data_type: dataType,
      data_value: dataValue,
      metadata,
      created_at: new Date().toISOString()
    }

    setRecentActivity(prev => [newItem, ...prev.slice(0, 9)])
    setGeneratedDataCount(prev => prev + 1)
    setDataCountByType(prev => ({
      ...prev,
      [dataType]: (prev[dataType] || 0) + 1
    }))
  }, [])

  // Get data count by type
  const getDataCountByType = useCallback((type) => {
    return dataCountByType[type] || 0
  }, [dataCountByType])

  // Format time ago
  const getTimeAgo = useCallback((dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }, [])

  const value = {
    generatedDataCount,
    recentActivity,
    dataCountByType,
    isOnline,
    addGeneratedData,
    getDataCountByType,
    fetchDataCount,
    getTimeAgo
  }

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}