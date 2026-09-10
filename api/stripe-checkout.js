export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { title, unitPrice, quantity, payer, metadata } = req.body;

    if (!title || !unitPrice || !quantity) {
      return res.status(400).json({ error: 'Campos obrigatórios: title, unitPrice, quantity.' });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: 'STRIPE_SECRET_KEY não configurado no servidor.' });
    }

    const amountInCents = Math.round(Number(unitPrice) * 100);
    const domain = req.headers.origin || req.headers.referer || 'https://jericoacoarapremium.com';

    const params = new URLSearchParams();
    params.append('payment_method_types[0]', 'card');
    params.append('mode', 'payment');
    params.append('success_url', `${domain}/?status=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${domain}/?status=cancelled`);
    params.append('line_items[0][price_data][currency]', 'brl');
    params.append('line_items[0][price_data][unit_amount]', String(amountInCents));
    params.append('line_items[0][price_data][product_data][name]', title);
    params.append('line_items[0][quantity]', String(quantity));

    if (payer?.email) {
      params.append('customer_email', payer.email);
    }

    if (metadata && typeof metadata === 'object') {
      Object.keys(metadata).forEach((key) => {
        const val = metadata[key];
        if (val !== undefined && val !== null) {
          params.append(`metadata[${key}]`, String(val));
        }
      });
    }

    const stripeResp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${secretKey}`,
      },
      body: params.toString(),
    });

    const data = await stripeResp.json();

    if (!stripeResp.ok) {
      console.error('Stripe Checkout error:', data);
      return res.status(stripeResp.status).json({
        error: data.error?.message || 'Erro ao criar sessão no Stripe.',
        details: data,
      });
    }

    return res.status(200).json({
      id: data.id,
      url: data.url,
      client_secret: data.client_secret,
    });
  } catch (err) {
    console.error('Stripe endpoint error:', err);
    return res.status(500).json({ error: err.message || 'Erro interno no servidor.' });
  }
}
