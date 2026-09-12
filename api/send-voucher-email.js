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
    const { code, email } = req.body;

    if (!code || !email) {
      return res.status(400).json({ error: 'Código e E-mail são obrigatórios.' });
    }

    const voucherUrl = `https://jericoacoarapremium.com/voucher/${code}`;

    // Apenas simula o envio se não houver serviço de e-mail configurado
    // Expanda usando Resend, SendGrid ou Nodemailer no futuro
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Jericoacoara Premium <contato@jericoacoarapremium.com>',
          to: email,
          subject: `Sua Reserva Confirmada! Voucher Oficial - ${code}`,
          html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #2C7A7B;">Jericoacoara Premium</h1>
            <p>Olá! Seu pagamento foi recebido com sucesso e sua reserva <strong>${code}</strong> está confirmada.</p>
            <p>Acesse o seu voucher oficial no link abaixo para apresentar ao motorista/guia no dia do serviço:</p>
            <a href="${voucherUrl}" style="display: inline-block; padding: 12px 24px; background: #2C7A7B; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px;">Acessar Meu Voucher Oficial</a>
            <br/><br/>
            <p>Dúvidas? Entre em contato com nosso suporte via WhatsApp 24h.</p>
          </div>`
        })
      });
      return res.status(200).json({ success: true, message: 'Voucher enviado com sucesso via Resend.' });
    } else {
      console.log(`[Email Stub] Simulando envio de email para ${email}. Link: ${voucherUrl}`);
      return res.status(200).json({ success: true, message: 'Voucher "enviado" com sucesso (Stub - API não configurada).' });
    }
  } catch (err) {
    console.error('[Send Voucher Email] Erro:', err);
    return res.status(500).json({ error: 'Erro ao tentar enviar o voucher.' });
  }
}
