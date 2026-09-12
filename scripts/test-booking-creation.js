import handler from '../api/booking-public.js';

async function testBookingCreation() {
  console.log('--- TESTANDO CRIAÇÃO E LEITURA DE RESERVA NO SUPABASE ---');

  const testCode = `JRI-TEST${Math.floor(1000 + Math.random() * 9000)}`;

  const postReq = {
    method: 'POST',
    body: {
      code: testCode,
      client_name: 'Teste Cliente Audit',
      client_phone: '88999998888',
      client_email: 'teste.audit@example.com',
      service_type: 'transfer',
      vehicle: 'sw4',
      modality: 'privativo',
      date: '2026-09-15',
      time: '14:00',
      pax: 3,
      price_final: 750.0,
      amount_paid: 375.0,
      payment_method: 'pix',
      payment_status: 'pendente',
      reservation_status: 'pendente',
      notes: 'Teste de auditoria automatizada',
    },
    headers: {},
  };

  let postResData = null;
  const postRes = {
    headers: {},
    statusCode: 200,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      postResData = data;
      console.log(`[POST RES ${this.statusCode}]:`, JSON.stringify(data, null, 2));
      return this;
    },
  };

  await handler(postReq, postRes);

  console.log(`\n[GET TEST] Consultando reserva criada: ${testCode}...`);
  const getReq = {
    method: 'GET',
    query: { code: testCode },
    headers: {},
  };

  const getRes = {
    headers: {},
    statusCode: 200,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log(`[GET RES ${this.statusCode}]:`, JSON.stringify(data, null, 2));
      return this;
    },
  };

  await handler(getReq, getRes);
}

testBookingCreation().catch((e) => console.error('Erro no teste:', e));
