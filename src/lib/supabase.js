import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) não foram encontradas.');
}

export const supabase = createClient(
  supabaseUrl || 'https://lnowzrgmzdmbijckxvrw.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxub3d6cmdtemRtYmlqY2t4dnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzU4MDgsImV4cCI6MjA5MDExMTgwOH0.6SsF31zKpW7r6HQ2U6ryfwTYnmBL7jV3zY7hTLVBtU8'
);

export default supabase;
