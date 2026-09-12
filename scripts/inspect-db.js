import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lnowzrgmzdmbijckxvrw.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_t7F-VeX21DiacNiJqBppjA_X_bqsIvv';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabase() {
  console.log('--- AUDITORIA DE RESERVAS NO SUPABASE ---');
  console.log('URL Supabase:', supabaseUrl);

  // 1. Buscar especificamente pelo código JRI-07NJS6 em todas as colunas possíveis
  console.log('\n[1] Buscando por JRI-07NJS6 em agency_reservations...');
  try {
    const { data: resByCode, error: errByCode } = await supabase
      .from('agency_reservations')
      .select('*')
      .eq('reservation_code', 'JRI-07NJS6');

    console.log('Resultado busca por reservation_code:', resByCode, 'Erro:', errByCode);
  } catch (e) {
    console.error('Erro na busca por código:', e.message);
  }

  // 2. Listar todas as reservas existentes na tabela para entender os registros que foram inseridos
  console.log('\n[2] Listando últimas 20 reservas registradas na tabela agency_reservations...');
  try {
    const { data: allRes, error: allErr } = await supabase
      .from('agency_reservations')
      .select('*')
      .order('id', { ascending: false })
      .limit(20);

    console.log(`Total encontradas: ${allRes?.length || 0}`);
    if (allRes && allRes.length > 0) {
      console.log('Estrutura/Amostra de registros:');
      allRes.forEach((r, idx) => {
        console.log(`  ${idx + 1}. ID: ${r.id} | Code: ${r.reservation_code || r.code} | Status: ${r.reservation_status || r.status} | Final Price: ${r.price_final} | Created: ${r.created_at}`);
      });
    } else {
      console.log('Nenhuma reserva encontrada na tabela agency_reservations!');
    }
  } catch (e) {
    console.error('Erro ao listar reservas:', e.message);
  }

  // 3. Verificar estrutura das tabelas agency_customers e agency_reservation_items
  console.log('\n[3] Listando últimas entradas em agency_customers...');
  try {
    const { data: custs } = await supabase.from('agency_customers').select('*').limit(5);
    console.log('Clientes:', custs);
  } catch (e) {
    console.error('Erro clientes:', e.message);
  }

  console.log('\n[4] Listando últimas entradas em agency_reservation_items...');
  try {
    const { data: items } = await supabase.from('agency_reservation_items').select('*').limit(5);
    console.log('Itens:', items);
  } catch (e) {
    console.error('Erro itens:', e.message);
  }
}

inspectDatabase();
