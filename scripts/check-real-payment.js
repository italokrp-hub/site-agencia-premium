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

async function checkRealPayment() {
  console.log('--- INSPEÇÃO DO PAGAMENTO REAL 177705781981 E VOUCHER JRI-WX4UGY ---');

  const paymentId = '177705781981';
  const voucherCode = 'JRI-WX4UGY';

  // 1. Tentar consultar Mercado Pago API
  const mpToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (mpToken) {
    console.log('[1] Consultando API do Mercado Pago para o paymentId:', paymentId);
    try {
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${mpToken}` }
      });
      if (res.ok) {
        const payment = await res.json();
        console.log('Dados do pagamento MP:');
        console.log('  - status:', payment.status);
        console.log('  - external_reference:', payment.external_reference);
        console.log('  - metadata:', payment.metadata);
        console.log('  - transaction_amount:', payment.transaction_amount);
      } else {
        console.log('API MP retornou erro HTTP:', res.status, await res.text());
      }
    } catch (e) {
      console.error('Erro na chamada MP:', e.message);
    }
  } else {
    console.log('[1] MP_ACCESS_TOKEN não está definido no ambiente local.');
  }

  // 2. Consultar Supabase para JRI-WX4UGY
  console.log('\n[2] Consultando Supabase para o código JRI-WX4UGY...');
  try {
    const { data: resByCode, error: errByCode } = await supabase
      .from('agency_reservations')
      .select('*')
      .eq('reservation_code', voucherCode);

    console.log('Busca por reservation_code:', resByCode, 'Erro:', errByCode);

    if (resByCode && resByCode.length > 0) {
      const row = resByCode[0];
      console.log('\nREGISTRO ENCONTRADO NO BANCO:');
      console.log('  - ID:', row.id);
      console.log('  - reservation_code:', row.reservation_code);
      console.log('  - status / reservation_status:', row.reservation_status);
      console.log('  - payment_status:', row.payment_status);
      console.log('  - price_gross:', row.price_gross);
      console.log('  - price_final:', row.price_final);
      console.log('  - updated_at:', row.updated_at);
    } else {
      console.log('\nReserva JRI-WX4UGY NÃO encontrada em agency_reservations!');
    }
  } catch (e) {
    console.error('Erro consulta Supabase:', e.message);
  }

  // 3. Listar últimas 10 reservas no Supabase para ver se o código foi gravado com outro nome
  console.log('\n[3] Listando últimas reservas salvas no Supabase...');
  try {
    const { data: allRes } = await supabase
      .from('agency_reservations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (allRes && allRes.length > 0) {
      allRes.forEach((r, idx) => {
        console.log(`  ${idx + 1}. Code: ${r.reservation_code} | Res Status: ${r.reservation_status} | Pay Status: ${r.payment_status} | Created: ${r.created_at}`);
      });
    }
  } catch (e) {}
}

checkRealPayment();
