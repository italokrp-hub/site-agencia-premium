import handler from '../api/booking-public.js';

async function checkVoucherPublic() {
  console.log('--- BUSCANDO JRI-WX4UGY VIA API BOOKING-PUBLIC ---');

  const req = {
    method: 'GET',
    query: { code: 'JRI-WX4UGY' },
    headers: {},
  };

  const res = {
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

  await handler(req, res);
}

checkVoucherPublic().catch((e) => console.error('Erro:', e));
