import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, testConnection, getConnectionStatus } from '../lib/supabase'

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
  const [userProfile, setUserProfile] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState({ status: 'unknown', error: null })

  // Test Supabase connection on startup
  useEffect(() => {
    const checkConnection = async () => {
      console.log('🔧 Testing Supabase connection...')
      console.log('🔧 Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('🔧 Supabase configured:', isSupabaseConfigured)
      
      if (!isSupabaseConfigured) {
        setConnectionStatus({ status: 'invalid_credentials', error: 'Supabase credentials not configured' })
        setLoading(false)
        return
      }

      const isConnected = await testConnection()
      const status = getConnectionStatus()
      setConnectionStatus(status)
      
      console.log('🔧 Connection test result:', status)
      
      if (!isConnected) {
        console.log('❌ Supabase connection failed:', status.error)
        setLoading(false)
        return
      }
      
      console.log('✅ Supabase connection successful')
    }

    checkConnection()
  }, [])

  useEffect(() => {
    // Check if user wants to use localStorage only
    const useLocalStorage = localStorage.getItem('useLocalStorage') === 'true';
    if (useLocalStorage) {
      console.log('🔧 Using localStorage mode');
      setLoading(false);
      return;
    }

    // Don't proceed with auth if connection failed
    if (connectionStatus.status !== 'unknown' && connectionStatus.status !== 'connected') {
      setLoading(false);
      return;
    }

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('⚠️ Authentication loading timeout, proceeding without auth');
      setLoading(false);
    }, 10000); // 10 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        if (!isSupabaseConfigured || connectionStatus.status !== 'connected') {
          console.log('⚠️ Supabase not ready, skipping authentication');
          setLoading(false);
          clearTimeout(loadingTimeout);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Auth session error:', error);
          setLoading(false);
          clearTimeout(loadingTimeout);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    // Only get session if we have a successful connection
    if (connectionStatus.status === 'connected') {
      getInitialSession();
    }

    // Only set up auth listener if Supabase is configured and connected
    if (isSupabaseConfigured && connectionStatus.status === 'connected') {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchUserProfile(session.user.id);
            } else {
              setUserProfile(null);
            }
            setLoading(false);
          }
        );

        return () => {
          subscription.unsubscribe();
          clearTimeout(loadingTimeout);
        };
      } catch (error) {
        console.error('❌ Error setting up auth listener:', error);
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    }

    return () => clearTimeout(loadingTimeout);
  }, [connectionStatus.status]);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        return { error }
      }

      // Create user profile
      if (data.user) {
        await createUserProfile(data.user.id, {
          email: data.user.email,
          ...metadata
        })
      }

      return { data, error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return { data, error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const createUserProfile = async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            ...profileData,
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Error creating user profile:', error)
      }

      return { data, error }
    } catch (error) {
      console.error('Error creating user profile:', error)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { error: { message: 'No user logged in' } }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)

      if (!error) {
        setUserProfile(prev => ({ ...prev, ...updates }))
      }

      return { data, error }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      return { data, error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    connectionStatus,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    isConfigured: isSupabaseConfigured,
    isConnected: connectionStatus.status === 'connected'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}