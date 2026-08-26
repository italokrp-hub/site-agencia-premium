const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, payload) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Erro ${response.status} ao criar pagamento.`);
  }

  return response.json();
}

export function createCheckout({ title, unitPrice, quantity, payer, metadata }) {
  return request('/checkout', { title, unitPrice, quantity, payer, metadata });
}

export function createPixPayment({ title, unitPrice, quantity, payer, metadata }) {
  return request('/pix', { title, unitPrice, quantity, payer, metadata });
}
