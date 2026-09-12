import { createClient } from '@supabase/supabase-js';

// Vercel / Node serverless config para o webhook
export const config = {
  api: {
    bodyParser: true,
  },
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Retorna HTTP 200 rapidamente
  res.status(200).json({ received: true });

  if (req.method !== 'POST') return;

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('[MP Webhook] MERCADO_PAGO_ACCESS_TOKEN não configurado.');
    return;
  }

  try {
    const { type, data, action } = req.body;
    const id = req.query.id || req.query['data.id'] || data?.id;

    // Apenas eventos de pagamento
    if (type !== 'payment' && req.body.topic !== 'payment' && action !== 'payment.updated' && action !== 'payment.created') {
      return;
    }

    if (!id) return;

    // Buscar status real na API do Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!mpResponse.ok) return;

    const paymentData = await mpResponse.json();
    const status = paymentData.status;

    if (status === 'approved') {
      const reservationCode = paymentData.external_reference || paymentData.metadata?.code;
      
      if (!reservationCode) {
        console.warn('[MP Webhook] Pagamento aprovado sem reservation_code (external_reference). ID:', id);
        return;
      }

      console.log(`[MP Webhook] Pagamento aprovado para reserva ${reservationCode}`);

      // Consultar reserva no banco
      const { data: resData, error: resError } = await supabase
        .from('agency_reservations')
        .select('*')
        .eq('reservation_code', reservationCode)
        .single();

      if (resError || !resData) {
        console.error('[MP Webhook] Reserva não encontrada:', reservationCode);
        return;
      }

      const isFullPayment = paymentData.transaction_amount >= resData.price_gross;
      const paymentStatus = isFullPayment ? 'pago_integral' : 'sinal_pago';

      // Atualizar status no Supabase
      await supabase
        .from('agency_reservations')
        .update({
          status: 'confirmada',
          reservation_status: 'confirmada',
          payment_status: paymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', resData.id);

      console.log(`[MP Webhook] Reserva ${reservationCode} atualizada com sucesso no banco.`);

      // Disparar envio de email (se existir)
      // Buscamos o email do customer caso ele exista
      if (resData.customer_id) {
        const { data: custData } = await supabase
          .from('agency_customers')
          .select('email')
          .eq('id', resData.customer_id)
          .single();

        if (custData && custData.email) {
          try {
            await fetch(`https://${req.headers.host || 'jericoacoarapremium.com'}/api/send-voucher-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: reservationCode,
                email: custData.email
              })
            });
            console.log(`[MP Webhook] E-mail de confirmação disparado para ${custData.email}`);
          } catch (e) {
            console.error('[MP Webhook] Erro ao disparar email:', e);
          }
        }
      }
    }
  } catch (err) {
    console.error('[MP Webhook] Erro interno:', err);
  }
}
