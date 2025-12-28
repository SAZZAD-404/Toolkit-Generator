import { useState } from 'react'
import { User, Mail, Calendar, Database, Save, Edit3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'

export default function AccountSettings() {
  const { user, userProfile } = useAuth()
  const { generatedDataCount } = useAppData()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: userProfile?.name || user?.email?.split('@')[0] || '',
    email: user?.email || ''
  })

  const handleSave = () => {
    // Here you would typically save to database
    setIsEditing(false)
    // Show success message
  }

  const getInitials = (email) => {
    if (userProfile?.name) {
      return userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email?.split('@')[0]?.slice(0, 2)?.toUpperCase() || 'TU'
  }

  const getMemberSince = (createdAt) => {
    const date = createdAt ? new Date(createdAt) : new Date()
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Full Screen Header */}
        <div className="bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-indigo-500/25">
                    {getInitials(user?.email)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 border-3 border-slate-800 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
                  <p className="text-slate-300 text-lg">Manage your profile and account information</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Active Session</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                      <span className="text-indigo-400 text-sm font-medium">Pro Account</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
              >
                <Edit3 size={20} />
                <span className="font-semibold">{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Profile Section - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Information Card */}
            <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <User size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <p className="text-slate-400">Update your personal details and preferences</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-900/80 border border-slate-600/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your display name"
                      />
                    ) : (
                      <div className="px-6 py-4 bg-slate-900/50 border border-slate-600/30 rounded-xl text-white text-lg font-medium">
                        {formData.displayName || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="px-6 py-4 bg-slate-900/50 border border-slate-600/30 rounded-xl text-slate-300 text-lg flex items-center gap-4">
                      <Mail size={20} className="text-slate-400" />
                      <span className="flex-1">{user?.email}</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full border border-green-500/30">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                      Member Since
                    </label>
                    <div className="px-6 py-4 bg-slate-900/50 border border-slate-600/30 rounded-xl text-slate-300 text-lg flex items-center gap-4">
                      <Calendar size={20} className="text-slate-400" />
                      <span>{getMemberSince(user?.created_at)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                      Account Status
                    </label>
                    <div className="px-6 py-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-green-400 text-lg flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold">Active & Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end mt-8 pt-6 border-t border-slate-700/50">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 font-semibold"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Sidebar - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Statistics */}
            <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                  <Database size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Statistics</h3>
                  <p className="text-slate-400 text-sm">Your account metrics</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                  <div className="text-3xl font-bold text-indigo-400 mb-2">{generatedDataCount}</div>
                  <div className="text-sm text-slate-400 font-medium">Total Generated</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                  <div className="text-sm text-slate-400 font-medium">Success Rate</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400 mb-2">Pro</div>
                  <div className="text-sm text-slate-400 font-medium">Account Type</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full p-4 bg-slate-900/50 hover:bg-slate-800/50 rounded-xl transition-all duration-300 text-left border border-slate-700/30 hover:border-slate-600/50 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <Database size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Export Data</div>
                      <div className="text-slate-400 text-sm">Download your data</div>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-4 bg-slate-900/50 hover:bg-slate-800/50 rounded-xl transition-all duration-300 text-left border border-slate-700/30 hover:border-slate-600/50 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                      <User size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Account Help</div>
                      <div className="text-slate-400 text-sm">Get support</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}