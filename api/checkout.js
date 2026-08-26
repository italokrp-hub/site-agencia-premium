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

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado.' });
    }

    const preferenceBody = {
      items: [
        {
          id: metadata?.serviceId || 'service',
          title,
          unit_price: Math.round(unitPrice * 100) / 100,
          quantity: Number(quantity),
          currency_id: 'BRL',
        },
      ],
      metadata: metadata || {},
      payment_methods: {
        installments: 1,
        excluded_payment_types: [],
      },
      statement_descriptor: 'JERICOACOARA PREMIUM',
    };

    if (payer?.name) {
      preferenceBody.payer = {
        name: payer.name,
        ...(payer.email ? { email: payer.email } : {}),
        phone: payer.phone
          ? { number: payer.phone.replace(/\D/g, '') }
          : undefined,
      };
    }

    if (metadata?.date) {
      preferenceBody.items[0].description = `Data: ${metadata.date}${
        metadata.pickup ? ` | Ponto: ${metadata.pickup}` : ''
      } | Pessoas: ${metadata.passengers || 1}`;
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceBody),
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago checkout error:', JSON.stringify(data, null, 2));
      return res.status(mpResponse.status).json({
        error: data.message || 'Erro ao criar preferência no Mercado Pago.',
        details: data,
      });
    }

    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message || 'Erro interno no servidor.' });
  }
}
