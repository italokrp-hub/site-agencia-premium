import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const paymentId = req.query.paymentId || req.query.id;
    const code = req.query.code || req.query.reservationCode;

    if (!paymentId && !code) {
      return res.status(400).json({ error: 'paymentId ou code é obrigatório para verificar o status.' });
    }

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

    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    // 1. Verificar primeiro no Supabase se já consta como confirmado/aprovado pelo Webhook
    if (code && supabase) {
      const { data: resData } = await supabase
        .from('agency_reservations')
        .select('id, reservation_code, status, reservation_status, payment_status, price_gross, price_final')
        .ilike('reservation_code', String(code).trim())
        .limit(1)
        .maybeSingle();

      if (resData) {
        const pStatus = (resData.payment_status || '').toLowerCase();
        const rStatus = (resData.reservation_status || resData.status || '').toLowerCase();
        const isApprovedInDb =
          ['sinal_pago', 'pago_integral', 'pago', 'quitado'].includes(pStatus) ||
          ['confirmada', 'concluida'].includes(rStatus);

        if (isApprovedInDb) {
          return res.status(200).json({
            isPaid: true,
            status: 'approved',
            reservationStatus: rStatus,
            paymentStatus: pStatus,
            source: 'database',
          });
        }
      }
    }

    // 2. Se temos paymentId e mpToken, consultar a API oficial do Mercado Pago
    if (paymentId && mpToken) {
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${mpToken}` },
      });

      if (mpResponse.ok) {
        const payment = await mpResponse.json();
        const mpStatus = payment.status;

        if (mpStatus === 'approved') {
          // Atualizar o Supabase imediatamente para garantir sincronia instantânea
          const reservationCode = code || payment.external_reference || payment.metadata?.code;
          let paymentStatus = 'sinal_pago';

          if (supabase && reservationCode) {
            const { data: resData } = await supabase
              .from('agency_reservations')
              .select('id, price_gross, price_final')
              .ilike('reservation_code', String(reservationCode).trim())
              .maybeSingle();

            const isFullPayment = resData && payment.transaction_amount && payment.transaction_amount >= (resData.price_gross || resData.price_final);
            paymentStatus = isFullPayment ? 'pago_integral' : 'sinal_pago';

            if (resData) {
              await supabase
                .from('agency_reservations')
                .update({
                  status: 'confirmada',
                  reservation_status: 'confirmada',
                  payment_status: paymentStatus,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', resData.id);

              // Registrar o pagamento na tabela agency_payments
              try {
                await supabase.from('agency_payments').insert([
                  {
                    reservation_id: resData.id,
                    amount: payment.transaction_amount,
                    method: 'pix',
                    status: 'confirmado',
                    notes: `Confirmado via Verificação Pix MP (ID: ${paymentId})`,
                    created_at: new Date().toISOString(),
                  },
                ]);
              } catch (payErr) {
                console.warn('[pix-status] Erro ao registrar pagamento em agency_payments:', payErr);
              }
            }

            // Disparar envio de email de confirmação de forma isolada e não-bloqueante
            try {
              const host = req.headers.host || 'www.jericoacoarapremium.com';
              const protocol = host.includes('localhost') ? 'http' : 'https';
              fetch(`${protocol}://${host}/api/send-voucher-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  code: reservationCode,
                  amountPaid: payment.transaction_amount,
                  paymentMethod: 'PIX',
                  isEnglish: false,
                }),
              }).catch((mailErr) => console.error('[pix-status] Erro assíncrono no envio de e-mail:', mailErr));
            } catch (mailTriggerErr) {
              console.error('[pix-status] Falha ao acionar send-voucher-email:', mailTriggerErr);
            }
          }

          return res.status(200).json({
            isPaid: true,
            status: 'approved',
            paymentStatus,
            reservationStatus: 'confirmada',
            amountPaid: payment.transaction_amount,
            source: 'mercadopago_verified',
          });
        }

        return res.status(200).json({
          isPaid: false,
          status: mpStatus, // 'pending', 'in_process', 'rejected', 'cancelled'
          source: 'mercadopago',
        });
      }
    }

    // 3. Fallback se não foi aprovado
    return res.status(200).json({
      isPaid: false,
      status: 'pending',
    });
  } catch (err) {
    console.error('[API pix-status] Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno ao consultar status do pagamento Pix.' });
  }
}
