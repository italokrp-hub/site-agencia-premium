import { createClient } from '@supabase/supabase-js';

// Vercel / Node serverless config para o webhook
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // 1. Parsing seguro do body (objeto ou string)
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('[MP Webhook] Erro ao parsear req.body como JSON:', e);
        body = {};
      }
    }

    // Extração flexível do ID do pagamento
    const paymentId = body?.data?.id || body?.id || req.query?.id || req.query?.['data.id'];

    if (!paymentId) {
      console.log('[MP Webhook] Notificação recebida sem ID de pagamento.');
      return res.status(200).json({ received: true, note: 'No payment ID found' });
    }

    // 2. Extração segura das variáveis de ambiente nas funções Serverless
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY;

    const mpToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey || !mpToken) {
      console.error('[MP Webhook] Configuração ausente/incompleta no ambiente Vercel:', {
        hasSupabaseUrl: Boolean(supabaseUrl),
        hasSupabaseKey: Boolean(supabaseKey),
        hasMpToken: Boolean(mpToken),
      });
      return res.status(200).json({
        received: true,
        note: 'Config missing',
        missing: {
          supabaseUrl: !supabaseUrl,
          supabaseKey: !supabaseKey,
          mpToken: !mpToken,
        },
      });
    }

    // Inicialização segura do cliente Supabase
    let supabaseAdmin;
    try {
      supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    } catch (sbInitErr) {
      console.error('[MP Webhook] Falha ao inicializar cliente Supabase:', sbInitErr);
      return res.status(200).json({ received: true, error: 'Supabase client init failed' });
    }

    // 3. Consulta à API oficial do Mercado Pago com token
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });

    if (!mpResponse.ok) {
      const errText = await mpResponse.text();
      console.error('[MP Webhook] Erro retornado pela API do Mercado Pago:', errText);
      return res.status(200).json({ received: true, error: errText });
    }

    const payment = await mpResponse.json();
    console.log('[MP Webhook] Status do pagamento:', payment.status, 'Ref:', payment.external_reference);

    if (payment.status === 'approved') {
      const reservationCode = payment.external_reference || payment.metadata?.code || payment.metadata?.reservation_code;

      if (reservationCode) {
        // Consultar reserva no Supabase
        const { data: resData, error: selectErr } = await supabaseAdmin
          .from('agency_reservations')
          .select('id, price_gross, price_final')
          .eq('reservation_code', reservationCode)
          .maybeSingle();

        if (selectErr) {
          console.error('[MP Webhook] Erro ao buscar reserva no Supabase:', selectErr);
        }

        let paymentStatus = 'sinal_pago';
        if (resData && payment.transaction_amount && payment.transaction_amount >= (resData.price_gross || resData.price_final)) {
          paymentStatus = 'pago_integral';
        }

        // Atualizar status da reserva
        const { error: updateErr } = await supabaseAdmin
          .from('agency_reservations')
          .update({
            status: 'confirmada',
            reservation_status: 'confirmada',
            payment_status: paymentStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('reservation_code', reservationCode);

        if (updateErr) {
          console.error('[MP Webhook] Erro ao atualizar reserva no Supabase:', updateErr);
        } else {
          console.log('[MP Webhook] Reserva confirmada com sucesso:', reservationCode);
        }

        // Enviar e-mail de confirmação (se customer tiver e-mail)
        if (resData?.id) {
          try {
            const { data: fullRes } = await supabaseAdmin
              .from('agency_reservations')
              .select('customer_id, agency_customers(email)')
              .eq('id', resData.id)
              .maybeSingle();

            const email = fullRes?.agency_customers?.email;
            if (email) {
              const host = req.headers.host || 'jericoacoarapremium.com';
              const protocol = host.includes('localhost') ? 'http' : 'https';
              await fetch(`${protocol}://${host}/api/send-voucher-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: reservationCode, email }),
              }).catch((e) => console.error('[MP Webhook] Erro envio email:', e));
            }
          } catch (e) {
            console.error('[MP Webhook] Erro ao buscar email:', e);
          }
        }
      } else {
        console.warn('[MP Webhook] Pagamento aprovado sem reservationCode. Payment ID:', paymentId);
      }
    }

    return res.status(200).json({ received: true, status: 'processed' });
  } catch (globalErr) {
    console.error('[MP Webhook] Exceção crítica global tratada:', globalErr);
    return res.status(200).json({ received: true, error: globalErr?.message || 'Internal server error' });
  }
}


