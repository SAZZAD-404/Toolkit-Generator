import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'

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