import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yhjcxjvxptprsqegcnku.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_88c_4gK5qDezKUSukDXrCA_6Xiq7S6W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
