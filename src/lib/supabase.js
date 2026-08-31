import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Variáveis de ambiente do Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) não foram configuradas.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export default supabase;
