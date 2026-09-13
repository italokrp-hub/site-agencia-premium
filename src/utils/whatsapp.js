// Utilitário centralizado para links WhatsApp
// Número oficial: +55 88 98846-3182
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5588988463182';

/**
 * Gera o link direto para a API do WhatsApp com mensagem pré-preenchida.
 * @param {string} message - Mensagem em texto puro (será codificada)
 * @returns {string} URL do WhatsApp
 */
export function buildWhatsAppLink(message = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/**
 * Gera o link interno para a página de conversão /obrigado que dispara a tag do Google Ads.
 * @param {string} message - Mensagem em texto puro
 * @returns {string} Rota interna /obrigado
 */
export function buildObrigadoLink(message = '') {
  return `/obrigado${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/**
 * Redireciona o usuário para a rota /obrigado (que dispara o evento de conversão do Google Ads e redireciona ao WhatsApp).
 * @param {string} message - Mensagem em texto puro
 * @param {boolean} newTab - Se verdadeiro, abre /obrigado em nova aba/janela
 */
export function openWhatsApp(message = '', newTab = true) {
  const obrigadoUrl = buildObrigadoLink(message);
  if (newTab && typeof window !== 'undefined') {
    window.open(obrigadoUrl, '_blank');
  } else if (typeof window !== 'undefined') {
    window.location.href = obrigadoUrl;
  }
}

// Mensagens padrão reutilizáveis
export const WA_MESSAGES = {
  generic: 'Olá! Gostaria de saber mais sobre os serviços da Jericoacoara Premium.',
  helicopter: 'Olá! Gostaria de saber mais sobre a experiência de Helicóptero em Jericoacoara.',
  utv: 'Olá! Gostaria de saber mais sobre o passeio de UTV em Jericoacoara.',
  custom: (experience) =>
    `Olá! Gostaria de saber mais sobre a experiência de ${experience} em Jericoacoara.`,
  planner: ({ travelers, days, style, interests }) =>
    `Olá! Montei meu perfil de viagem pelo site da Jericoacoara Premium:\n\nViajantes: ${travelers}\nDuração: ${days}\nEstilo: ${style}\nInteresses: ${Array.isArray(interests) ? interests.join(', ') : interests}\n\nGostaria de receber um roteiro personalizado.`,
};
