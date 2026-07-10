import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.includes('ebjjrkefogdytnyaapbc')) {
  supabaseUrl = 'https://jmmlncqtukxvwicueahl.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbWxuY3F0dWt4dndpY3VlYWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTQyMjEsImV4cCI6MjA5OTI3MDIyMX0.7Y4ve4x4uN5hEnik75Uuq-0_aBWvyOrh622pvzW5Vx8';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
