import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ebjjrkefogdytnyaapbc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GC7XDyM5tvEfc3wO2gXcJQ_kObRgQtx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
