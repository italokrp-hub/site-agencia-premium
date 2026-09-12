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

async function manuallyFixReservation() {
  const code = 'JRI-WX4UGY';
  console.log(`--- CORRIGINDO/GRAVANDO RESERVA ${code} NO SUPABASE ---`);

  // 1. Verificar se a reserva já existe
  const { data: existing } = await supabase
    .from('agency_reservations')
    .select('id, reservation_code')
    .eq('reservation_code', code)
    .maybeSingle();

  if (existing) {
    console.log(`Reserva ${code} encontrada com ID: ${existing.id}. Atualizando para confirmada / sinal_pago...`);
    const { data: updated, error: updErr } = await supabase
      .from('agency_reservations')
      .update({
        status: 'confirmada',
        reservation_status: 'confirmada',
        payment_status: 'sinal_pago',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    console.log('Resultado atualização:', updated, 'Erro:', updErr);
  } else {
    console.log(`Reserva ${code} não existia. Criando registro confirmado no Supabase...`);

    // Criar customer
    let customerId = null;
    try {
      const { data: newCust } = await supabase
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
    } catch (e) {
      console.error('Erro ao criar cliente:', e);
    }

    const reservationPayload = {
      customer_id: customerId || null,
      reservation_code: code,
      date: new Date().toISOString().split('T')[0],
      pax_adults: 2,
      pickup_location: 'Pousada / Hotel Jericoacoara (Pagamento via Pix confirmado no MP ID: 177705781981)',
      price_gross: 600.0,
      price_final: 600.0,
      payment_method: 'pix',
      payment_status: 'sinal_pago',
      reservation_status: 'confirmada',
      sale_source: 'Site Institucional (Mercado Pago)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newRes, error: insErr } = await supabase
      .from('agency_reservations')
      .insert([reservationPayload])
      .select('id')
      .single();

    console.log('Resultado criação reserva:', newRes, 'Erro:', insErr);

    if (newRes) {
      await supabase.from('agency_reservation_items').insert([
        {
          reservation_id: newRes.id,
          category: 'passeio',
          service_name: 'Passeio / Transfer Jericoacoara Premium',
          vehicle_type: 'buggy',
          trecho: 'privativo',
          date_start: new Date().toISOString().split('T')[0],
          pax_adults: 2,
          price_total: 600.0,
        },
      ]);
      console.log('Item criado com sucesso!');
    }
  }

  console.log('\n--- CONFIRMAÇÃO DE BUSCA VIA API ---');
  const { data: checkData } = await supabase
    .from('agency_reservations')
    .select('*')
    .eq('reservation_code', code)
    .maybeSingle();

  console.log('Registro final no Supabase para JRI-WX4UGY:', checkData);
}

manuallyFixReservation();
