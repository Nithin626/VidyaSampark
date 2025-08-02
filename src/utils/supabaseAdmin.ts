import { createClient } from '@supabase/supabase-js';

// These variables are pulled from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This is your new admin client. It can bypass RLS.
// It should ONLY EVER be used in server-side code (Server Components, Route Handlers, Server Actions).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});