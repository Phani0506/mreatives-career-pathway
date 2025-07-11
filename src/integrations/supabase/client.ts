// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ioeiuteiqikypyhkmmps.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZWl1dGVpcWlreXB5aGttbXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNjY2NjUsImV4cCI6MjA2Njg0MjY2NX0.uWPOreTC2rHFzjbzqisYcuACbTV_f-bbcylDQFR7o4o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});