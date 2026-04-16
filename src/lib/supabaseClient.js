import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Authentication features will be limited.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: (callback) => {
          // Immediately notify the listener that we are ready with no session
          setTimeout(() => callback('SIGNED_OUT', null), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
        signUp: async () => ({ error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null } }),
      },
      from: () => ({
        select: () => ({ order: () => ({ data: [], error: null }) }),
        insert: () => ({ select: () => ({ data: [], error: null }) }),
        update: () => ({ eq: () => ({ error: null }) }),
        delete: () => ({ eq: () => ({ error: null }) }),
      })
    };
