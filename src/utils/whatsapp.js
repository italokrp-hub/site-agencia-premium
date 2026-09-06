// Utilitário centralizado para links WhatsApp
// Número oficial: +55 92 98103-8749
export const WHATSAPP_NUMBER = '5592981038749';

/**
 * Gera um link para abrir o WhatsApp com uma mensagem pré-preenchida.
 * @param {string} message - Mensagem em texto puro (será codificada)
 * @returns {string} URL do WhatsApp
 */
export function buildWhatsAppLink(message = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/**
 * Abre o WhatsApp com uma mensagem contextual.
 * @param {string} message - Mensagem em texto puro
 */
export function openWhatsApp(message = '') {
  window.open(buildWhatsAppLink(message), '_blank');
}

// Mensagens padrão reutilizáveis
export const WA_MESSAGES = {
  generic: 'Olá! Gostaria de saber mais sobre os serviços da Jericoacoara Premium.',
  helicopter: 'Olá! Gostaria de saber mais sobre a experiência de Helicóptero em Jericoacoara.',
  utv: 'Olá! Gostaria de saber mais sobre o passeio de UTV em Jericoacoara.',
  custom: (experience) =>
    `Olá! Gostaria de saber mais sobre a experiência de ${experience} em Jericoacoara.`,
  planner: ({ travelers, days, style, interests }) =>
    `Olá! Montei meu perfil de viagem pelo site:\nViajantes: ${travelers}\nDuração: ${days} dias\nEstilo: ${style}\nInteresses: ${interests}\nGostaria de receber um roteiro personalizado.`,
};
