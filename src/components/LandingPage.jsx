import { useState } from 'react'
import { Mail, Smartphone, Globe, Hash, Shield, Users, Database, Zap } from 'lucide-react'
import Login from './Auth/Login'
import Register from './Auth/Register'

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Professional Toolkit Generators
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Advanced tools for CPA professionals. Generate emails, user agents, IP addresses, and phone numbers with precision.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} className="text-blue-400" />
                <span>Professional Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <Database size={20} className="text-purple-400" />
                <span>Data History</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gmail Generator</h3>
              <p className="text-slate-400 text-sm">Generate country-specific Gmail usernames with availability prediction</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">User Agent Generator</h3>
              <p className="text-slate-400 text-sm">Real user agents for Android & iPhone with multiple browsers</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="text-purple-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">IP Finder</h3>
              <p className="text-slate-400 text-sm">Find your IP address and generate IPv4/IPv6 addresses</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hash className="text-orange-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Number Generator</h3>
              <p className="text-slate-400 text-sm">Generate phone numbers for 15+ countries with multiple formats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-slate-400">
              {isLogin ? 'Sign in to access your professional tools' : 'Create your account to start generating'}
            </p>
          </div>

          {isLogin ? (
            <Login onToggleMode={() => setIsLogin(false)} />
          ) : (
            <Register onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900/50 border-t border-slate-700">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built specifically for CPA professionals who need reliable, accurate data generation tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-400">Generate thousands of data points in seconds with our optimized algorithms.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-400">Your data is encrypted and stored securely. We never share your information.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Data History</h3>
              <p className="text-slate-400">Access your generation history anytime. Export, manage, and organize your data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 Toolkit Generators. Professional tools for CPA.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}