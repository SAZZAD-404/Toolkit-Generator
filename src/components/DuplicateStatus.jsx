import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Database } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getExistingDataValues } from '../utils/dataStorage'

export default function DuplicateStatus({ dataType = 'email' }) {
  const [existingCount, setExistingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchExistingCount = async () => {
      if (user) {
        try {
          const existingData = await getExistingDataValues(dataType)
          setExistingCount(existingData.length)
        } catch (error) {
          console.error('Error fetching existing data count:', error)
        }
      }
      setLoading(false)
    }

    fetchExistingCount()
  }, [user, dataType])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
        <span>Checking database...</span>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-slate-300">Database Status</span>
        </div>
        <div className="flex items-center gap-2">
          {existingCount > 0 ? (
            <>
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-green-400">{existingCount} existing</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-yellow-400" />
              <span className="text-sm text-yellow-400">No data yet</span>
            </>
          )}
        </div>
      </div>
      
      {existingCount > 0 && (
        <div className="mt-2 text-xs text-slate-400">
          ✅ Duplicate prevention active - new data will be unique
        </div>
      )}
    </div>
  )
}