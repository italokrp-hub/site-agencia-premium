const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function createStripeCheckout({ title, unitPrice, quantity = 1, payer, metadata }) {
  const response = await fetch(`${API_BASE}/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      unitPrice,
      quantity,
      payer,
      metadata,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Erro ${response.status} ao iniciar checkout Stripe.`);
  }

  return response.json();
}
