import fetch from 'node-fetch';

const WEBHOOK_URL = 'http://localhost:3000/api/mercadopago-webhook';
// Para testar em prod, substitua por: 'https://jericoacoarapremium.com/api/mercadopago-webhook'

async function testWebhook() {
  // Simular um payload de notificação de pagamento do Mercado Pago
  const payload = {
    action: 'payment.updated',
    api_version: 'v1',
    data: {
      // Substitua pelo ID real de um pagamento do MP para o teste
      id: '1312918512' 
    },
    date_created: new Date().toISOString(),
    id: 123456789,
    live_mode: false,
    type: 'payment',
    user_id: 123456789
  };

  console.log('Disparando Webhook Local para:', WEBHOOK_URL);
  
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log(`Status HTTP: ${res.status}`);
    console.log(`Resposta: ${text}`);
    console.log('\nVerifique os logs do seu servidor (npm run dev) para acompanhar a execução interna da API.');
  } catch (error) {
    console.error('Erro ao disparar webhook:', error.message);
  }
}

testWebhook();
