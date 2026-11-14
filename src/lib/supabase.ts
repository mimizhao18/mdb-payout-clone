import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';
import { authStorage } from './storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'Missing Supabase settings. Copy .env.example to .env.local and fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
  );
}

/**
 * The one Supabase client the whole app shares. The publishable key is safe to
 * ship in the app: what a user can actually read or change is decided by the
 * Row Level Security policies in the database, not by hiding this key.
 */
export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    // Saves the login session on the device so users stay signed in.
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: authStorage !== undefined,
    detectSessionInUrl: false,
  },
});
