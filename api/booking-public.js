import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = req.body || {};
    const {
      client_name,
      client_phone,
      client_email,
      payment_method,
      amount_paid = 0,
      discount = 0,
      notes = 'Origem: Site Institucional',
      items = [],
    } = body;

    if (!client_name && !client_phone) {
      return res.status(400).json({ error: 'Dados do cliente (nome/telefone) são obrigatórios.' });
    }

    // Regra estrita de status: Se o pagamento for pendente ou valor zerado, status = pendente
    const rawPaymentStatus = (body.payment_status || body.paymentStatus || '').toLowerCase();
    const rawReservationStatus = (body.reservation_status || body.status || '').toLowerCase();

    const isPending =
      rawPaymentStatus === 'pendente' ||
      rawPaymentStatus === 'pending' ||
      rawReservationStatus === 'pendente' ||
      rawReservationStatus === 'pending' ||
      !body.amount_paid ||
      Number(body.amount_paid) === 0;

    const reservationStatus = isPending ? 'pendente' : 'confirmada';
    const paymentStatus = isPending ? 'pendente' : (body.payment_status || 'sinal_pago');

    // 1. Tabela agency_customers
    let customerId = null;
    try {
      if (client_phone || client_email) {
        let query = supabase.from('agency_customers').select('id');
        if (client_phone) {
          query = query.eq('whatsapp', client_phone);
        } else if (client_email) {
          query = query.eq('email', client_email);
        }
        const { data: existing } = await query;
        if (existing && existing.length > 0) {
          customerId = existing[0].id;
        }
      }

      if (!customerId) {
        const { data: newCust } = await supabase
          .from('agency_customers')
          .insert([
            {
              name: (client_name || 'Cliente Site').trim(),
              whatsapp: client_phone ? client_phone.trim() : null,
              email: client_email ? client_email.trim() : null,
            },
          ])
          .select('id')
          .single();

        if (newCust) {
          customerId = newCust.id;
        }
      }
    } catch (e) {
      console.error('[API booking-public] Erro etapa cliente:', e);
    }

    // 2. Gerar código de reserva único (ex: JRI-XXXXXX)
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reservationCode = `JRI-${randomCode}`;

    const mainItem = items[0] || {};
    const fullPrice = mainItem.unit_price || amount_paid || 0;

    // 3. Tabela agency_reservations
    let reservationId = null;
    try {
      const reservationPayload = {
        customer_id: customerId || null,
        reservation_code: reservationCode,
        date: mainItem.date || new Date().toISOString().split('T')[0],
        pax_adults: Number(mainItem.pax || 1),
        pickup_location: notes || null,
        price_gross: fullPrice,
        price_final: amount_paid || fullPrice,
        payment_method: payment_method || 'pix',
        payment_status: paymentStatus,
        reservation_status: reservationStatus,
        sale_source: notes.includes('Site') ? 'Site Institucional' : 'WhatsApp',
      };

      const { data: newRes } = await supabase
        .from('agency_reservations')
        .insert([reservationPayload])
        .select('id')
        .single();

      if (newRes) {
        reservationId = newRes.id;
      }
    } catch (e) {
      console.error('[API booking-public] Erro etapa reserva:', e);
    }

    // 4. Tabela agency_reservation_items
    if (reservationId && items.length > 0) {
      try {
        const itemRows = items.map((it) => ({
          reservation_id: reservationId,
          category: it.service_type || 'passeio',
          service_name: it.title || 'Serviço',
          vehicle_type: it.vehicle || 'buggy',
          trecho: it.modality || 'privativo',
          date_start: it.date || new Date().toISOString().split('T')[0],
          pax_adults: Number(it.pax || 1),
          price_total: it.unit_price || 0,
        }));

        await supabase.from('agency_reservation_items').insert(itemRows);
      } catch (e) {
        console.error('[API booking-public] Erro etapa itens:', e);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Reserva registrada com sucesso!',
      booking_id: reservationId || `bk_${Date.now()}`,
      reservation_id: reservationId || `bk_${Date.now()}`,
      reservation_code: reservationCode,
      reservation_status: reservationStatus,
      price_final: amount_paid || fullPrice,
      client: {
        name: client_name,
        phone: client_phone,
      },
    });
  } catch (err) {
    console.error('[API booking-public] Erro geral interno:', err);
    return res.status(500).json({ error: 'Erro ao processar reserva no servidor. Tente novamente mais tarde.' });
  }
}
