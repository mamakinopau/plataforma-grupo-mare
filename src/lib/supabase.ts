import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// Note: In Vite, we use import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
