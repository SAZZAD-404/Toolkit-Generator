import { useState } from 'react'
import { X } from 'lucide-react'
import Login from './Login'
import Register from './Register'

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-2 transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Register onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}