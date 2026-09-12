import handler from '../api/mercadopago-webhook.js';

async function testDirectHandler() {
  const req = {
    method: 'POST',
    body: {
      action: 'payment.updated',
      data: { id: '177636458621' },
      type: 'payment',
    },
    headers: { host: 'localhost:3000' },
  };

  const res = {
    headers: {},
    statusCode: 200,
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log(`[TEST RES] HTTP ${this.statusCode} JSON:`, JSON.stringify(data, null, 2));
      return this;
    },
    send(data) {
      console.log(`[TEST RES] HTTP ${this.statusCode} SEND:`, data);
      return this;
    },
  };

  console.log('--- TESTANDO HANDLER MERCADOPAGO WEBHOOK COM ID 177636458621 ---');
  await handler(req, res);
  console.log('--- TESTE CONCLUÍDO SEM EXCEÇÃO NÃO CAPTURADA ---');
}

testDirectHandler().catch((err) => {
  console.error('[CRASH NO TESTE DIRECTO]:', err);
});
