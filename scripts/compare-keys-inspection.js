import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lnowzrgmzdmbijckxvrw.supabase.co';

const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_t7F-VeX21DiacNiJqBppjA_X_bqsIvv';
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

async function compareKeysInspection() {
  console.log('--- TESTE DE COMPARAÇÃO DE CHAVES E BUSCA DE JRI-WX4UGY ---');

  // 1. Teste com ANON / PUBLISHABLE KEY
  console.log('\n[1] Testando consulta com ANON / PUBLISHABLE KEY...');
  const supabaseAnon = createClient(supabaseUrl, anonKey);
  try {
    const { data: anonData, error: anonErr } = await supabaseAnon
      .from('agency_reservations')
      .select('*')
      .or('reservation_code.eq.JRI-WX4UGY,code.eq.JRI-WX4UGY');

    console.log('Resultado ANON KEY:');
    console.log('  - Data:', anonData);
    console.log('  - Error:', anonErr);
  } catch (e) {
    console.error('Exceção ANON KEY:', e.message);
  }

  // 2. Teste com SECRET KEY / SERVICE ROLE KEY (se disponível)
  if (secretKey) {
    console.log('\n[2] Testando consulta com SECRET / SERVICE ROLE KEY...');
    const supabaseSecret = createClient(supabaseUrl, secretKey);
    try {
      const { data: secretData, error: secretErr } = await supabaseSecret
        .from('agency_reservations')
        .select('*')
        .or('reservation_code.eq.JRI-WX4UGY,code.eq.JRI-WX4UGY');

      console.log('Resultado SECRET KEY:');
      console.log('  - Data:', secretData);
      console.log('  - Error:', secretErr);
    } catch (e) {
      console.error('Exceção SECRET KEY:', e.message);
    }
  } else {
    console.log('\n[2] SECRET_KEY não está definida nas variáveis de ambiente do terminal.');
  }

  // 3. Listar colunas da tabela agency_reservations
  console.log('\n[3] Inspecionando colunas da tabela agency_reservations...');
  try {
    const { data: sampleRow, error: sampleErr } = await supabaseAnon
      .from('agency_reservations')
      .select('*')
      .limit(1);

    console.log('Amostra de linha anon:', sampleRow, 'Erro:', sampleErr);
  } catch (e) {}
}

compareKeysInspection();
