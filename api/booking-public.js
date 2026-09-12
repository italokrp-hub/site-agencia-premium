import { createClient } from '@supabase/supabase-js';

const sendTelegramNotification = async (data) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) return;

    const text = `🚨 *Nova Reserva Recebida!*
• Cliente: ${data.customerName}
• Pacote/Serviço: ${data.itemsSummary}
• Valor: R$ ${data.totalValue.toFixed(2)}
• Origem: ${data.origin}
• Link: [Abrir Painel](${process.env.VITE_PANEL_URL || 'https://painel.jericoacoarapremium.com'})`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch (error) {
    console.error('[Telegram] Falha ao enviar:', error);
  }
};
function getSupabaseClient() {
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

  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  const supabase = getSupabaseClient();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const { code } = req.query;
      if (!code) return res.status(400).json({ error: 'Reservation code is required' });

      // 1. Busca tolerante da reserva principal
      const { data: booking, error: bErr } = await supabase
        .from('agency_reservations')
        .select('*')
        .eq('reservation_code', code)
        .maybeSingle();

      if (bErr) {
        console.error('[API booking-public GET] Erro de banco/RLS ao buscar reserva:', bErr, 'Código:', code);
      }

      if (bErr || !booking) {
        console.warn('[API booking-public GET] Reserva não localizada no Supabase:', code);
        return res.status(404).json({
          error: 'Booking not found',
          code,
          dbError: bErr?.message || bErr?.code || null,
        });
      }

      // 2. Busca tolerante do cliente
      let customer = null;
      if (booking.customer_id) {
        const { data: custData } = await supabase
          .from('agency_customers')
          .select('name, whatsapp, email')
          .eq('id', booking.customer_id)
          .maybeSingle();
        if (custData) customer = custData;
      }

      // 3. Busca tolerante dos itens
      let items = [];
      if (booking.id) {
        const { data: itemsData } = await supabase
          .from('agency_reservation_items')
          .select('category, service_name, vehicle_type, trecho, date_start, pax_adults, price_total')
          .eq('reservation_id', booking.id);
        if (itemsData && itemsData.length > 0) items = itemsData;
      }

      return res.status(200).json({
        success: true,
        booking: {
          ...booking,
          agency_customers: customer,
          agency_reservation_items: items,
        },
      });
    } catch (err) {
      console.error('[API booking-public GET] Erro:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = req.body || {};
    
    // Suporte amplo a alias de nomes de chaves do payload
    const clientName = (body.client_name || body.customer_name || body.name || 'Cliente Site').trim();
    const clientPhone = (body.client_phone || body.phone || body.whatsapp || '').trim();
    const clientEmail = (body.client_email || body.email || '').trim();
    const paymentMethod = (body.payment_method || body.paymentMethod || 'pix').toLowerCase();
    const amountPaid = Number(body.amount_paid ?? body.total_amount ?? body.price_final ?? body.chargePixTotal ?? body.chargeTotal ?? 0);
    const discount = Number(body.discount || 0);
    const notes = (body.notes || body.pickup_location || 'Origem: Site Institucional').trim();
    
    let rawItems = body.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      rawItems = [
        {
          service_type: body.service_type || body.category || 'passeio',
          title: body.title || body.service_name || 'Serviço Jericoacoara',
          vehicle: body.vehicle || body.vehicle_type || 'buggy',
          modality: body.modality || body.trecho || 'privativo',
          date: body.date || body.date_start || new Date().toISOString().split('T')[0],
          time: body.time || '12:00',
          pax: Number(body.pax || body.pax_adults || 1),
          unit_price: Number(body.unit_price || body.price_total || amountPaid || 0),
        },
      ];
    }

    if (!clientName && !clientPhone) {
      return res.status(400).json({ error: 'Dados do cliente (nome/telefone) são obrigatórios.' });
    }

    // Regra estrita de status: Ao criar a reserva na geração do Pix ou checkout, status DEVE SER 'pendente'.
    // NUNCA criar a reserva como 'confirmada' ou 'sinal_pago' antes da confirmação do gateway.
    const isConfirmedParam = Boolean(body.is_confirmed || body.isConfirmed);
    const rawPaymentStatus = (body.payment_status || body.paymentStatus || '').toLowerCase();
    const rawReservationStatus = (body.reservation_status || body.status || '').toLowerCase();

    const isConfirmed = isConfirmedParam && rawPaymentStatus !== 'pendente' && rawPaymentStatus !== 'pending';

    const reservationStatus = isConfirmed ? (rawReservationStatus || 'confirmada') : 'pendente';
    const paymentStatus = isConfirmed ? (rawPaymentStatus || 'sinal_pago') : 'pendente';

    // 1. Tabela agency_customers
    let customerId = null;
    try {
      if (clientPhone || clientEmail) {
        let query = supabase.from('agency_customers').select('id');
        if (clientPhone) {
          query = query.eq('whatsapp', clientPhone);
        } else if (clientEmail) {
          query = query.eq('email', clientEmail);
        }
        const { data: existing } = await query;
        if (existing && existing.length > 0) {
          customerId = existing[0].id;
          
          if (clientName && clientName !== 'Cliente Site') {
            await supabase
              .from('agency_customers')
              .update({ name: clientName })
              .eq('id', customerId);
          }
        }
      }

      if (!customerId) {
        const { data: newCust } = await supabase
          .from('agency_customers')
          .insert([
            {
              name: clientName,
              whatsapp: clientPhone || null,
              email: clientEmail || null,
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

    // 2. Gerar código de reserva único (ex: JRI-XXXXXX) ou usar o código enviado
    const providedCode = (body.code || body.reservation_code || '').trim();
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reservationCode = providedCode || `JRI-${randomCode}`;

    const mainItem = rawItems[0] || {};
    const fullPrice = mainItem.unit_price || amountPaid || 0;

    // 3. Tabela agency_reservations (Upsert limpo)
    let reservationId = null;
    try {
      const reservationPayload = {
        customer_id: customerId || null,
        reservation_code: reservationCode,
        date: mainItem.date || new Date().toISOString().split('T')[0],
        pax_adults: Number(mainItem.pax || 1),
        pickup_location: notes || null,
        price_gross: fullPrice,
        price_final: amountPaid || fullPrice,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        reservation_status: reservationStatus,
        status: reservationStatus,
        sale_source: notes.includes('Site') ? 'Site Institucional' : 'WhatsApp',
      };

      const { data: existingRes } = await supabase
        .from('agency_reservations')
        .select('id')
        .eq('reservation_code', reservationCode)
        .maybeSingle();

      if (existingRes) {
        reservationId = existingRes.id;
        await supabase
          .from('agency_reservations')
          .update(reservationPayload)
          .eq('id', reservationId);
      } else {
        const { data: newRes, error: insErr } = await supabase
          .from('agency_reservations')
          .insert([reservationPayload])
          .select('id')
          .single();

        if (newRes) {
          reservationId = newRes.id;
        } else if (insErr) {
          console.error('[API booking-public] Erro inserção reserva:', insErr);
        }
      }
    } catch (e) {
      console.error('[API booking-public] Erro etapa reserva:', e);
    }

    // 4. Tabela agency_reservation_items
    if (reservationId && rawItems.length > 0) {
      try {
        await supabase.from('agency_reservation_items').delete().eq('reservation_id', reservationId);
        
        const itemRows = rawItems.map((it) => ({
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

    // Disparar notificação Telegram de forma assíncrona
    sendTelegramNotification({
      customerName: clientName,
      itemsSummary: rawItems.map(i => i.title || i.service_name || 'Serviço').join(', '),
      totalValue: amountPaid || fullPrice,
      origin: 'Site Institucional',
      reservationId: reservationId,
    }).catch(() => {}); // Ignora falhas para não quebrar retorno

    return res.status(200).json({
      success: true,
      message: 'Reserva registrada com sucesso!',
      booking_id: reservationId || `bk_${Date.now()}`,
      reservation_id: reservationId || `bk_${Date.now()}`,
      reservation_code: reservationCode,
      reservation_status: reservationStatus,
      price_final: amountPaid || fullPrice,
      client: {
        name: clientName,
        phone: clientPhone,
      },
    });
  } catch (err) {
    console.error('[API booking-public] Erro geral interno:', err);
    return res.status(500).json({ error: 'Erro ao processar reserva no servidor. Tente novamente mais tarde.' });
  }
}
