import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Singleton instances
let supabaseInstance: any = null;
let supabaseAdminInstance: any = null;

// Standard client for guests
export const supabase = (() => {
  if (supabaseInstance) return supabaseInstance;
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  }
  return {} as any;
})();

// Admin client for backend (bypasses RLS). 
// Note: We use a getter or a function to ensure it's and not evaluated immediately on the client
export const getSupabaseAdmin = () => {
  if (supabaseAdminInstance) return supabaseAdminInstance;

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey);
    return supabaseAdminInstance;
  }
  
  console.warn('Supabase Service Key missing, falling back to anon client for admin tasks');
  return supabase;
};

// For backward compatibility in server code, but safer for client-side bundling
export const supabaseAdmin = typeof window === 'undefined' ? getSupabaseAdmin() : supabase;
