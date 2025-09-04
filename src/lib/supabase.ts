import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.error('Placeholder Supabase values detected');
  throw new Error('Supabase is using placeholder values. Please configure your actual Supabase credentials.');
}

// Create client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  }
});

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return !!(url && 
           key &&
           url !== 'https://placeholder.supabase.co' &&
           key !== 'placeholder-key' &&
           url.includes('supabase.co') &&
           url.startsWith('https://'));
};

// Test connection to Supabase with better error handling
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not properly configured');
    return false;
  }
  
  try {
    // Test with a simple query that should always work
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      // Check for specific error types
      if (error.message.includes('relation "users" does not exist')) {
        console.error('Users table does not exist. Please run migrations.');
        return false;
      }
      if (error.message.includes('Invalid API key')) {
        console.error('Invalid Supabase API key');
        return false;
      }
      if (error.message.includes('Project not found')) {
        console.error('Supabase project not found. Check your URL.');
        return false;
      }
      return false;
    }
    
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        console.error('Network error: Cannot reach Supabase. Check your internet connection and Supabase URL.');
      } else if (error.message.includes('CORS')) {
        console.error('CORS error: Check your Supabase project settings.');
      }
    }
    return false;
  }
};

// Helper function to get better error messages
export const getSupabaseErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error';
  
  if (typeof error === 'string') return error;
  
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('failed to fetch')) {
      return 'Network error: Unable to connect to Supabase. Please check your internet connection.';
    }
    
    if (message.includes('invalid api key') || message.includes('unauthorized')) {
      return 'Authentication error: Invalid API key. Please check your Supabase configuration.';
    }
    
    if (message.includes('project not found')) {
      return 'Configuration error: Supabase project not found. Please check your project URL.';
    }
    
    if (message.includes('cors')) {
      return 'CORS error: Please check your Supabase project settings and allowed origins.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred';
};