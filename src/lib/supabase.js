import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajapwfzkhjukfokwxpks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXB3ZnpraGp1a2Zva3d4cGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzE1OTYsImV4cCI6MjA3NzUwNzU5Nn0.BAuilK_6KaFb2Pk9JkUDOHx7Co5c_sgQ2KfgPn_uQEg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
