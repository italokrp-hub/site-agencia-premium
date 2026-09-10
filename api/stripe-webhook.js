import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Vercel / Node serverless config: desabilita o bodyParser padrão para que o raw body possa ser lido na validação da assinatura
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper para ler o raw body como Buffer para validação HMAC da Stripe
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    console.error('[Stripe Webhook] Erro: STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET não configurados.');
    return res.status(500).json({ error: 'Stripe webhook environment variables not configured.' });
  }

  const stripe = new Stripe(stripeSecret);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header.' });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Erro ao validar assinatura do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Tratar especificamente o evento checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('[Stripe Webhook] Processando evento checkout.session.completed:', session.id);

    try {
      const metadata = session.metadata || {};
      
      const clientName = (
        session.customer_details?.name ||
        metadata.name ||
        metadata.client_name ||
        'Cliente Stripe'
      ).trim();

      const clientPhone = (
        session.customer_details?.phone ||
        metadata.phone ||
        metadata.whatsapp ||
        metadata.client_phone ||
        ''
      ).trim();

      const clientEmail = (
        session.customer_details?.email ||
        session.customer_email ||
        metadata.email ||
        metadata.client_email ||
        ''
      ).trim();

      const amountPaid = session.amount_total ? session.amount_total / 100 : Number(metadata.chargeTotal || metadata.fullTotal || 0);
      const isDeposit = metadata.paymentMode === '50';
      const paymentStatus = isDeposit ? 'sinal_pago' : 'pago_integral';
      const reservationStatus = 'confirmada';

      // 3. Atualizar/Inserir no Supabase (agency_customers e agency_reservations)
      let customerId = null;
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

      let reservationId = metadata.reservation_id || metadata.booking_id || null;
      let reservationCode = metadata.reservation_code || null;

      if (!reservationId && customerId) {
        const serviceDate = metadata.date || new Date().toISOString().split('T')[0];
        const { data: existingRes } = await supabase
          .from('agency_reservations')
          .select('id, reservation_code')
          .eq('customer_id', customerId)
          .eq('date', serviceDate)
          .order('id', { ascending: false })
          .limit(1);

        if (existingRes && existingRes.length > 0) {
          reservationId = existingRes[0].id;
          reservationCode = existingRes[0].reservation_code;
        }
      }

      if (reservationId) {
        await supabase
          .from('agency_reservations')
          .update({
            payment_status: paymentStatus,
            reservation_status: reservationStatus,
            payment_method: 'stripe',
            price_final: amountPaid,
          })
          .eq('id', reservationId);

        console.log('[Stripe Webhook] Reserva existente atualizada para confirmada/paga. ID:', reservationId);
      } else {
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        reservationCode = `JRI-${randomCode}`;
        const serviceDate = metadata.date || new Date().toISOString().split('T')[0];

        const notesParts = ['Origem: Site Institucional (Stripe Webhook)'];
        if (metadata.pickup) notesParts.push(`Embarque: ${metadata.pickup}`);
        if (metadata.flightDetails) notesParts.push(`Voo: ${metadata.flightDetails}`);
        if (session.payment_intent) notesParts.push(`Stripe PI: ${session.payment_intent}`);

        const reservationPayload = {
          customer_id: customerId || null,
          reservation_code: reservationCode,
          date: serviceDate,
          pax_adults: Number(metadata.passengers || 1),
          pickup_location: notesParts.join(' | '),
          price_gross: Number(metadata.fullTotal || amountPaid),
          price_final: amountPaid,
          payment_method: 'stripe',
          payment_status: paymentStatus,
          reservation_status: reservationStatus,
          sale_source: 'Site Institucional (Stripe)',
        };

        const { data: newRes } = await supabase
          .from('agency_reservations')
          .insert([reservationPayload])
          .select('id')
          .single();

        if (newRes) {
          reservationId = newRes.id;
        }

        if (reservationId) {
          await supabase.from('agency_reservation_items').insert([
            {
              reservation_id: reservationId,
              category: metadata.category || 'passeio',
              service_name: metadata.serviceId || 'Serviço Jericoacoara',
              vehicle_type: metadata.vehicle || 'buggy',
              trecho: metadata.optionType === 'shared' ? 'compartilhado' : 'privativo',
              date_start: serviceDate,
              pax_adults: Number(metadata.passengers || 1),
              price_total: Number(metadata.fullTotal || amountPaid),
            },
          ]);
        }

        console.log('[Stripe Webhook] Nova reserva criada e confirmada via Webhook:', reservationCode);
      }
    } catch (dbErr) {
      console.error('[Stripe Webhook] Erro ao atualizar banco de dados no Supabase:', dbErr);
    }
  }

  return res.status(200).json({ received: true });
}
