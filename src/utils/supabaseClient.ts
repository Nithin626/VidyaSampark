//src\utils\supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnjdrmbzgqnnbpljofaz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuamRybWJ6Z3FubmJwbGpvZmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzM4NjcsImV4cCI6MjA2NzkwOTg2N30._T8QxKTHH2p4OrbCpvUfbFjSo-9L2mMt7_sP9k_tKV4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
