import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey.length > 50

// Test connection to Supabase URL
let connectionStatus = 'unknown'
let connectionError = null

const testConnection = async () => {
  if (!hasValidCredentials) {
    connectionStatus = 'invalid_credentials'
    connectionError = 'Invalid Supabase credentials'
    return false
  }

  try {
    // Test if the URL resolves
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'apikey': supabaseAnonKey
      }
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok || response.status === 401) {
      // 401 is expected without proper auth, but means the server is reachable
      connectionStatus = 'connected'
      connectionError = null
      return true
    } else {
      connectionStatus = 'server_error'
      connectionError = `Server returned ${response.status}: ${response.statusText}`
      return false
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      connectionStatus = 'timeout'
      connectionError = 'Connection timeout - server not responding'
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      connectionStatus = 'network_error'
      connectionError = 'Network error - URL may not exist or DNS resolution failed'
    } else {
      connectionStatus = 'unknown_error'
      connectionError = error.message
    }
    return false
  }
}

// Create a mock client if credentials are not configured
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    getUser: () => Promise.resolve({ data: { user: null } })
  },
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => ({ select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } }) })
  })
})

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

export const isSupabaseConfigured = hasValidCredentials
export const getConnectionStatus = () => ({ status: connectionStatus, error: connectionError })
export { testConnection }