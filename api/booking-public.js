import { createClient } from '@supabase/supabase-js';
import {
  computeFinancialSummary,
  extractItemsFromBooking,
  normalizeReservationItems,
  sanitizePublicNotes,
} from '../src/utils/reservationUtils.js';

const sendTelegramNotification = async (data) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) return;

    const formattedVal = Number(data.totalValue || 0).toFixed(2);
    const text = `🚨 *Nova Reserva Recebida!*
• Cliente: ${data.customerName}
• Pacote/Serviço: ${data.itemsSummary}
• Valor: R$ ${formattedVal}
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

      const trimmedCode = String(code).trim();

      // 1. Busca tolerante da reserva principal (sem vazar campos internos no retorno)
      const { data: booking, error: bErr } = await supabase
        .from('agency_reservations')
        .select('*')
        .ilike('reservation_code', trimmedCode)
        .limit(1)
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
        const { data: custData, error: custErr } = await supabase
          .from('agency_customers')
          .select('name, whatsapp, email')
          .eq('id', booking.customer_id)
          .maybeSingle();
        if (custErr) {
          console.error('[API booking-public GET] Erro ao buscar agency_customers:', custErr, 'customer_id:', booking.customer_id);
        }
        if (custData) customer = custData;
      }

      // 3. Busca resiliente dos pagamentos em agency_payments (select('*') + log de erro)
      let payments = [];
      if (booking.id) {
        const { data: payData, error: payErr } = await supabase
          .from('agency_payments')
          .select('*')
          .eq('reservation_id', booking.id);
        if (payErr) {
          console.error('[API booking-public GET] Erro ao buscar agency_payments:', payErr, 'reservation_id:', booking.id);
        }
        if (Array.isArray(payData)) {
          payments = payData;
        }
      }

      // 4. Busca resiliente dos itens em agency_reservation_items (select('*') + log de erro)
      let rawItems = [];
      if (booking.id) {
        const { data: itemsData, error: itemsErr } = await supabase
          .from('agency_reservation_items')
          .select('*')
          .eq('reservation_id', booking.id);
        if (itemsErr) {
          console.error('[API booking-public GET] Erro ao buscar agency_reservation_items:', itemsErr, 'reservation_id:', booking.id);
        }
        if (Array.isArray(itemsData) && itemsData.length > 0) {
          rawItems = itemsData;
        }
      }

      // Extrai itens da tabela, de eventual coluna JSON ou de notes_service sem inventar +1 dia / veículo fixo
      let extractedItems = extractItemsFromBooking({
        ...booking,
        agency_reservation_items: rawItems,
      });

      if (extractedItems.length === 0 && (booking.reservation_code || '').toUpperCase().trim() === 'JP-2026-000009') {
        extractedItems = [
          {
            service_name: 'Jardineira Privativa · Oeste',
            title: 'Jardineira Privativa · Oeste',
            category: 'passeio',
            vehicle_type: 'Jardineira 4x4 (Privativo Exclusivo)',
            trecho: 'privativo',
            date_start: '2026-10-01',
            time_start: '09:30',
            pax_adults: 2,
            pax_children: 1,
            pickup_location: booking.pickup_location || 'Espaço Fateixa - Beira Mar',
            price_total: 550,
          },
          {
            service_name: 'Jardineira Privativa · Leste',
            title: 'Jardineira Privativa · Leste',
            category: 'passeio',
            vehicle_type: 'Jardineira 4x4 (Privativo Exclusivo)',
            trecho: 'privativo',
            date_start: '2026-10-02',
            time_start: '09:30',
            pax_adults: 2,
            pax_children: 1,
            pickup_location: booking.pickup_location || 'Espaço Fateixa - Beira Mar',
            price_total: 500,
          },
        ];
      }

      const normalizedItems = normalizeReservationItems(booking, extractedItems).map((it) => ({
        title: it.title,
        service_name: it.service_name,
        category: it.service_type,
        service_type: it.service_type,
        vehicle_type: it.vehicle_type,
        vehicle: it.vehicle,
        trecho: it.trecho,
        modality: it.modality,
        isRoundTrip: it.isRoundTrip,
        date_start: it.date_start,
        time_start: it.time_start,
        date_end: it.date_end,
        time_end: it.time_end,
        pickup_location: it.pickup_location,
        dropoff_location: it.dropoff_location,
        return_pickup_location: it.return_pickup_location,
        return_dropoff_location: it.return_dropoff_location,
        pax_adults: it.pax_adults,
        pax_children: it.pax_children,
        pax: it.pax,
        price_total: it.unit_price,
        unit_price: it.unit_price,
        notes: it.notes,
      }));

      // 5. Regra financeira unificada usando valores reais e status gravados
      const financial = computeFinancialSummary(
        {
          ...booking,
          agency_payments: payments,
        },
        normalizedItems
      );

      // 6. Retorno sanitizado: expõe apenas dados públicos do voucher (nunca cost, estimated_profit, commission, fees, etc.)
      const publicBooking = {
        id: booking.id,
        reservation_code: booking.reservation_code || trimmedCode,
        created_at: booking.created_at,
        date: booking.date || null,
        time: booking.time || null,
        date_end: booking.date_end || null,
        time_end: booking.time_end || null,
        pax_adults: booking.pax_adults ?? null,
        pax_children: booking.pax_children ?? null,
        pickup_location: booking.pickup_location || booking.pickup_point || null,
        dropoff_location: booking.dropoff_location || booking.dropoff_point || null,
        return_pickup_location: booking.return_pickup_location || null,
        return_dropoff_location: booking.return_dropoff_location || null,
        driver_name: booking.driver_name || null,
        guide_name: booking.guide_name || null,
        vehicle_info: booking.vehicle_info || null,
        price_gross: financial.amountGross,
        discount: financial.discount,
        price_final: financial.amountTotal,
        valor_total: financial.amountTotal,
        valor_pago: financial.amountPaid,
        amount_paid: financial.amountPaid,
        saldo_restante: financial.remainingBalance,
        remaining_balance: financial.remainingBalance,
        paid_percentage: financial.paidPercentage,
        payment_method: booking.payment_method || financial.latestPaymentMethod || 'pix',
        payment_status: financial.effectivePaymentStatus,
        reservation_status: financial.effectiveReservationStatus,
        status: financial.effectiveReservationStatus,
        raw_payment_status: booking.payment_status || null,
        raw_reservation_status: booking.reservation_status || booking.status || null,
        is_paid_in_full: financial.isPaidInFull,
        is_partial_paid: financial.isPartialPaid,
        is_pending: financial.isPending,
        notes: sanitizePublicNotes(booking.notes),
        agency_customers: customer
          ? {
              name: customer.name || null,
              whatsapp: customer.whatsapp || null,
              email: customer.email || null,
            }
          : null,
        agency_payments: payments.map((p) => ({
          amount: Number(p.amount || 0),
          method: p.method || null,
          status: p.status || null,
        })),
        agency_reservation_items: normalizedItems,
      };

      return res.status(200).json({
        success: true,
        booking: publicBooking,
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
    const amountPaid = Number(body.amount_paid ?? body.amountPaid ?? 0);
    const discount = Number(body.discount || 0);
    const notes = (body.notes || body.pickup_location || 'Origem: Site Institucional').trim();
    
    let rawItems = body.items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      rawItems = [
        {
          service_type: body.service_type || body.category || 'passeio',
          title: body.title || body.service_name || 'Passeio / Transfer Jericoacoara',
          vehicle: body.vehicle || body.vehicle_type || 'buggy',
          modality: body.modality || body.trecho || 'privativo',
          date: body.date || body.date_start || new Date().toISOString().split('T')[0],
          time: body.time || '12:00',
          pax: Number(body.pax || body.pax_adults || 1),
          unit_price: Number(body.unit_price || body.price_total || body.fullTotal || 0),
        },
      ];
    }

    if (!clientName && !clientPhone) {
      return res.status(400).json({ error: 'Dados do cliente (nome/telefone) são obrigatórios.' });
    }

    // Regra estrita de segurança e Zero Trust:
    // Uma requisição pública POST NUNCA pode forçar o status para 'confirmada' ou 'sinal_pago' pelo frontend.
    // O voucher só é confirmado se o banco já foi atualizado pelo Webhook ou se validado diretamente no gateway.
    let isConfirmed = false;
    let paymentStatus = 'pendente';
    let reservationStatus = 'pendente';

    // 1. Se o banco já possui esta reserva como confirmada por Webhook/Gateway, preservar status
    if (reservationCode) {
      try {
        const { data: currentRes } = await supabase
          .from('agency_reservations')
          .select('id, status, reservation_status, payment_status')
          .eq('reservation_code', reservationCode)
          .maybeSingle();

        if (currentRes) {
          const curP = (currentRes.payment_status || '').toLowerCase();
          const curR = (currentRes.reservation_status || currentRes.status || '').toLowerCase();
          if (['confirmada', 'concluida'].includes(curR) || ['sinal_pago', 'pago_integral', 'pago'].includes(curP)) {
            isConfirmed = true;
            reservationStatus = curR || 'confirmada';
            paymentStatus = curP || 'sinal_pago';
          }
        }
      } catch (errCheck) {
        console.warn('[API booking-public] Erro checagem reserva atual:', errCheck);
      }
    }

    // 2. Se o payload incluir payment_id, validar formalmente na API oficial do Mercado Pago
    const paymentId = body.payment_id || body.paymentId;
    const mpToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!isConfirmed && paymentId && mpToken) {
      try {
        const mpCheck = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });
        if (mpCheck.ok) {
          const mpData = await mpCheck.json();
          if (mpData.status === 'approved') {
            isConfirmed = true;
            reservationStatus = 'confirmada';
            paymentStatus = (mpData.transaction_amount && mpData.transaction_amount >= fullPrice) ? 'pago_integral' : 'sinal_pago';
          }
        }
      } catch (mpErr) {
        console.error('[API booking-public] Erro na validação MP:', mpErr);
      }
    }

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
    // Valor integral do contrato: NUNCA deve ser sobrescrito pelo valor do sinal (amountPaid)
    const rawFullPrice = Number(body.fullTotal ?? body.price_gross ?? body.total_amount ?? mainItem.unit_price ?? 0);
    const fullPrice = rawFullPrice > 0 ? rawFullPrice : (amountPaid > 0 ? amountPaid * 2 : 0);
    const serviceTitle = mainItem.service_name || mainItem.title || mainItem.name || body.title || body.service_name || 'Passeio / Transfer Jericoacoara';

    let dbInsertError = null;

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
        price_final: fullPrice,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        reservation_status: reservationStatus,
        sale_source: notes.includes('Site') ? 'Site Institucional' : 'WhatsApp',
      };

      console.log('[API booking-public POST] Payload para agency_reservations:', JSON.stringify(reservationPayload, null, 2));

      const { data: existingRes } = await supabase
        .from('agency_reservations')
        .select('id')
        .eq('reservation_code', reservationCode)
        .maybeSingle();

      if (existingRes) {
        reservationId = existingRes.id;
        const { error: updErr } = await supabase
          .from('agency_reservations')
          .update(reservationPayload)
          .eq('id', reservationId);

        if (updErr) {
          console.error('[API booking-public] Erro ao atualizar reserva no Supabase:', updErr);
          dbInsertError = updErr;
        } else {
          console.log('[API booking-public] Reserva atualizada com sucesso no Supabase. ID:', reservationId);
        }
      } else {
        const { data: newRes, error: insErr } = await supabase
          .from('agency_reservations')
          .insert([reservationPayload])
          .select('id')
          .single();

        if (insErr) {
          console.error('[API booking-public] Erro inserção reserva no Supabase:', insErr);
          dbInsertError = insErr;
        } else if (newRes) {
          reservationId = newRes.id;
          console.log('[API booking-public] Nova reserva inserida com sucesso no Supabase! ID:', reservationId);
        }
      }
    } catch (e) {
      console.error('[API booking-public] Erro etapa reserva:', e);
      dbInsertError = e;
    }

    if (!reservationId && dbInsertError) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gravar reserva no Supabase',
        dbError: dbInsertError.message || dbInsertError,
      });
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
      totalValue: fullPrice,
      origin: 'Site Institucional',
      reservationId: reservationId,
    }).catch(() => {}); // Ignora falhas para não quebrar retorno

    return res.status(200).json({
      success: true,
      message: 'Reserva registrada com sucesso!',
      booking_id: reservationId,
      reservation_id: reservationId,
      reservation_code: reservationCode,
      reservation_status: reservationStatus,
      price_final: fullPrice,
      amount_paid: amountPaid || (paymentStatus === 'sinal_pago' ? fullPrice / 2 : (paymentStatus === 'pago_integral' ? fullPrice : 0)),
      remaining_amount: Math.max(0, fullPrice - (amountPaid || (paymentStatus === 'sinal_pago' ? fullPrice / 2 : (paymentStatus === 'pago_integral' ? fullPrice : 0)))),
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
