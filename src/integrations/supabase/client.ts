
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rhfmsulkwpviongjaykv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZm1zdWxrd3B2aW9uZ2pheWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODA0MTIsImV4cCI6MjA1OTg1NjQxMn0.AAjc_ksdCfXcU5gM4andAYUBwDNpTzNe--VToKl2pkQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});
