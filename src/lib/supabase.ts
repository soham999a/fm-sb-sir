import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Demo mode for development/testing
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (!DEMO_MODE) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
  }
}

export const supabase = createClient(
  SUPABASE_URL || 'https://demo.supabase.co', 
  SUPABASE_ANON_KEY || 'demo-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit', // Changed from 'pkce' to 'implicit' for better compatibility
      storage: window?.localStorage,
    },
    global: {
      headers: {
        'X-Client-Info': 'frequency-house-web',
      },
    },
  }
);

// Demo authentication functions
export const demoAuth = {
  signIn: async (email: string, password: string) => {
    if (DEMO_MODE) {
      // Simulate successful sign in
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: { is_premium: false },
        created_at: new Date().toISOString(),
      };
      
      // Store in localStorage for demo
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      localStorage.setItem('demo_session', 'true');
      
      return { data: { user: demoUser }, error: null };
    }
    return supabase.auth.signInWithPassword({ email, password });
  },
  
  signUp: async (email: string, password: string) => {
    if (DEMO_MODE) {
      // Simulate successful sign up
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: { is_premium: false },
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      localStorage.setItem('demo_session', 'true');
      
      return { data: { user: demoUser }, error: null };
    }
    return supabase.auth.signUp({ email, password });
  },
  
  signOut: async () => {
    if (DEMO_MODE) {
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_session');
      return { error: null };
    }
    return supabase.auth.signOut();
  },
  
  getSession: () => {
    if (DEMO_MODE) {
      const demoUser = localStorage.getItem('demo_user');
      const demoSession = localStorage.getItem('demo_session');
      
      if (demoUser && demoSession) {
        return {
          data: {
            session: {
              user: JSON.parse(demoUser),
              access_token: 'demo-token',
            }
          }
        };
      }
      return { data: { session: null } };
    }
    return supabase.auth.getSession();
  }
};
