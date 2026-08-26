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

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const paymentBody = {
      transaction_amount: Math.round(unitPrice * quantity * 100) / 100,
      description: title,
      payment_method_id: 'pix',
      payer: {
        email: payer?.email || 'comprador@email.com',
        first_name: payer?.name || 'Comprador',
        identification: { type: 'CPF', number: '00000000000' },
      },
      date_of_expiration: expiresAt.toISOString(),
      metadata: metadata || {},
    };

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentBody),
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago PIX error:', JSON.stringify(data, null, 2));
      return res.status(mpResponse.status).json({
        error: data.message || 'Erro ao gerar pagamento Pix.',
        details: data,
      });
    }

    return res.status(200).json({
      id: data.id,
      status: data.status,
      qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      qr_code: data.point_of_interaction?.transaction_data?.qr_code,
      ticket_url: data.point_of_interaction?.transaction_data?.ticket_url,
    });
  } catch (err) {
    console.error('PIX error:', err);
    return res.status(500).json({ error: err.message || 'Erro interno no servidor.' });
  }
}
