import { createClient } from '@supabase/supabase-js';

const secretKeyArg = process.argv[2];

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lnowzrgmzdmbijckxvrw.supabase.co';
const supabaseKey =
  secretKeyArg ||
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

async function insertJriWx4ugy() {
  console.log('--- INSERÇÃO DA RESERVA JRI-WX4UGY NO SUPABASE ---');
  console.log('URL:', supabaseUrl);
  console.log('Key usada (primeiros 15 chars):', supabaseKey.substring(0, 15) + '...');

  const code = 'JRI-WX4UGY';
  const today = new Date().toISOString().split('T')[0];

  // 1. Criar ou buscar cliente em agency_customers
  let customerId = null;
  try {
    const { data: existingCust } = await supabase
      .from('agency_customers')
      .select('id')
      .eq('email', 'contato@jericoacoarapremium.com')
      .maybeSingle();

    if (existingCust) {
      customerId = existingCust.id;
    } else {
      const { data: newCust, error: custErr } = await supabase
        .from('agency_customers')
        .insert([
          {
            name: 'Cliente Jericoacoara Premium',
            whatsapp: '5588988463182',
            email: 'contato@jericoacoarapremium.com',
          },
        ])
        .select('id')
        .single();

      if (newCust) customerId = newCust.id;
      if (custErr) console.log('Log criação cliente (pode ser ignorado se RLS):', custErr);
    }
  } catch (e) {
    console.log('Log etapa cliente:', e.message);
  }

  // 2. Inserção / Upsert em agency_reservations
  const reservationPayload = {
    customer_id: customerId || null,
    reservation_code: code,
    date: today,
    pax_adults: 2,
    pickup_location: 'Confirmado via Pix (Mercado Pago ID: 177705781981)',
    price_gross: 150.0,
    price_final: 150.0,
    payment_method: 'pix',
    payment_status: 'sinal_pago',
    reservation_status: 'confirmada',
    sale_source: 'Site Institucional (Mercado Pago)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('\n[1] Executando Insert/Upsert na tabela agency_reservations...');
  const { data: existingRes } = await supabase
    .from('agency_reservations')
    .select('id')
    .eq('reservation_code', code)
    .maybeSingle();

  let reservationId = null;
  if (existingRes) {
    reservationId = existingRes.id;
    const { data: updData, error: updErr } = await supabase
      .from('agency_reservations')
      .update(reservationPayload)
      .eq('id', reservationId)
      .select();

    console.log('Resultado Update:', updData, 'Erro:', updErr);
  } else {
    const { data: insData, error: insErr } = await supabase
      .from('agency_reservations')
      .insert([reservationPayload])
      .select();

    console.log('Resultado Insert:', insData, 'Erro:', insErr);
    if (insData && insData.length > 0) {
      reservationId = insData[0].id;
    }
  }

  // 3. Inserção do Item
  if (reservationId) {
    console.log('\n[2] Inserindo item da reserva na tabela agency_reservation_items...');
    await supabase.from('agency_reservation_items').delete().eq('reservation_id', reservationId);
    const { data: itemData, error: itemErr } = await supabase
      .from('agency_reservation_items')
      .insert([
        {
          reservation_id: reservationId,
          category: 'passeio',
          service_name: 'Passeio Jericoacoara Premium',
          vehicle_type: 'buggy',
          trecho: 'privativo',
          date_start: today,
          pax_adults: 2,
          price_total: 150.0,
        },
      ])
      .select();

    console.log('Resultado Item:', itemData, 'Erro:', itemErr);
  }

  // 4. Consulta de confirmação imediata
  console.log('\n[3] Consulta de confirmação imediata por reservation_code = JRI-WX4UGY:');
  const { data: confirmData, error: confirmErr } = await supabase
    .from('agency_reservations')
    .select(`
      *,
      agency_customers (name, whatsapp, email),
      agency_reservation_items (category, service_name, vehicle_type, trecho, date_start, pax_adults, price_total)
    `)
    .eq('reservation_code', code)
    .maybeSingle();

  console.log('Registro final confirmado:', JSON.stringify(confirmData, null, 2));
  console.log('Erro consulta final:', confirmErr);
}

insertJriWx4ugy();
