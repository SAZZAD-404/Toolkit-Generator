import { useState, useEffect } from 'react'
import { Mail, Smartphone, Globe, Hash, Calendar, Search, Filter, Download, Eye, Copy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { useToast } from '../context/ToastContext'

export default function AllDataPage() {
  const [generatedData, setGeneratedData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedItems, setSelectedItems] = useState([])
  const { user } = useAuth()
  const { fetchDataCount, getTimeAgo } = useAppData()
  const { addToast } = useToast()

  useEffect(() => {
    if (user) {
      fetchGeneratedData()
    }
  }, [user, filter, sortBy, sortOrder])

  const fetchGeneratedData = async () => {
    try {
      let query = supabase
        .from('generated_data')
        .select('*')

      if (filter !== 'all') {
        query = query.eq('data_type', filter)
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) throw error
      setGeneratedData(data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const dataToExport = selectedItems.length > 0 
      ? generatedData.filter(item => selectedItems.includes(item.id))
      : filteredData

    const csvContent = [
      ['Type', 'Value', 'Created At', 'Metadata'],
      ...dataToExport.map(item => [
        item.data_type,
        item.data_value,
        new Date(item.created_at).toLocaleString(),
        JSON.stringify(item.metadata)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-data-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    addToast('Data exported successfully', 'success')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    addToast('Copied to clipboard', 'success')
  }

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedItems(filteredData.map(item => item.id))
  }

  const deselectAll = () => {
    setSelectedItems([])
  }

  const getIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={16} className="text-blue-400" />
      case 'user_agent': return <Smartphone size={16} className="text-green-400" />
      case 'ip': return <Globe size={16} className="text-purple-400" />
      case 'phone': return <Hash size={16} className="text-orange-400" />
      default: return <Hash size={16} className="text-gray-400" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'email': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'user_agent': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'ip': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'phone': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const filteredData = generatedData.filter(item =>
    item.data_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-auto">
      <div className="p-4 md:p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">All Generated Data</h1>
            <p className="text-slate-400">Manage and export your generated content</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Export Selected
                </button>
              </>
            )}
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-lg">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="user_agent">User Agent</option>
            <option value="ip">IP Address</option>
            <option value="phone">Phone Number</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created_at">Date Created</option>
            <option value="data_type">Type</option>
            <option value="data_value">Value</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAll}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              Select All ({filteredData.length})
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={deselectAll}
                className="text-slate-400 hover:text-slate-300 text-sm font-medium"
              >
                Deselect All
              </button>
            )}
          </div>
          <div className="text-slate-400 text-sm">
            {filteredData.length} items • {selectedItems.length} selected
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-lg flex-1 min-h-0">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-xl font-semibold text-slate-300 mb-2">No Data Found</div>
            <div className="text-slate-400 mb-4">
              {searchTerm ? 'No data matches your search criteria.' : 'Start generating data to see it here.'}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-full">
                <thead className="bg-slate-700/50 border-b border-slate-600 sticky top-0 backdrop-blur-sm">
                  <tr>
                    <th className="py-3 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                        onChange={selectedItems.length === filteredData.length ? deselectAll : selectAll}
                        className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Generated Data
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-700/30 transition-colors ${
                        selectedItems.includes(item.id) ? 'bg-indigo-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.data_type)}`}>
                          {getIcon(item.data_type)}
                          {item.data_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-mono text-sm max-w-md truncate">
                          {item.data_value}
                        </div>
                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                          <div className="text-slate-400 text-xs mt-1">
                            {Object.entries(item.metadata).slice(0, 2).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300 text-sm">
                          {getTimeAgo(item.created_at)}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(item.data_value)}
                            className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}