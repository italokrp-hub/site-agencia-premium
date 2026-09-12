import fs from 'fs';
import path from 'path';
import handler from '../api/booking-public.js';

// Carregar .env manualmente
try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn('Não foi possível carregar .env:', e.message);
}

if (process.argv[2]) {
  process.env.SUPABASE_SECRET_KEY = process.argv[2];
}

async function runTest() {
  console.log('--- TESTE DISPARO REAL: POST /api/booking-public ---');

  const testPayload = {
    code: 'JRI-TESTE01',
    client_name: 'Cliente Teste Integracao',
    client_phone: '85999998888',
    client_email: 'cliente.teste@example.com',
    service_type: 'passeio',
    vehicle: 'buggy',
    modality: 'privativo',
    date: '2026-09-15',
    time: '09:00',
    pax: 2,
    price_final: 450.00,
    amount_paid: 225.00,
    payment_method: 'pix',
    payment_status: 'pendente',
    reservation_status: 'pendente',
    notes: 'Origem: Site Institucional | Teste de Insercao',
    items: [
      {
        title: 'Passeio Leste Jericoacoara Teste',
        service_type: 'passeio',
        vehicle: 'buggy',
        modality: 'privativo',
        date: '2026-09-15',
        time: '09:00',
        pax: 2,
        unit_price: 450.00,
      },
    ],
  };

  let statusCode = 200;
  let responseData = null;

  const req = {
    method: 'POST',
    body: testPayload,
    query: {},
  };

  const res = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    end: () => res,
  };

  try {
    await handler(req, res);
    console.log(`HTTP Status: ${statusCode}`);
    console.log('Resposta da API:', JSON.stringify(responseData, null, 2));
  } catch (err) {
    console.error('Erro executando o handler:', err);
  }
}

runTest();
