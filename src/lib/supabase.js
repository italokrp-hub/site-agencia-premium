import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) não foram configuradas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
