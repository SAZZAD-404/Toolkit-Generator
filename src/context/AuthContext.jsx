import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // For testing purposes, create a mock user when Supabase is not configured
      const mockUser = {
        id: 'test-user-123',
        email: 'test@example.com',
        created_at: new Date().toISOString()
      };
      setUser(mockUser);
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Please configure Supabase credentials first' } }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email_confirm: true
        }
      }
    })
    
    // If signup successful but user needs to confirm email
    if (data?.user && !data?.user?.email_confirmed_at) {
      return { 
        data, 
        error: null,
        message: 'Please check your email and click the confirmation link to complete registration.'
      }
    }
    
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Please configure Supabase credentials first' } }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Please configure Supabase credentials first' } }
    }
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const resendConfirmation = async (email) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Please configure Supabase credentials first' } }
    }
    
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmation,
    isConfigured: isSupabaseConfigured,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}