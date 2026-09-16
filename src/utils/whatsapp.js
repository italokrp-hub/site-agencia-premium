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
 * @param {string|object} params - Mensagem em texto puro ou objeto com parâmetros (servico, text, data, pax, etc.)
 * @returns {string} Rota interna /obrigado
 */
export function buildObrigadoLink(params = '') {
  if (typeof params === 'string') {
    if (params.startsWith('?')) return `/obrigado${params}`;
    return `/obrigado${params ? `?text=${encodeURIComponent(params)}` : ''}`;
  }
  if (typeof params === 'object' && params !== null) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        search.set(key, val);
      }
    });
    const str = search.toString();
    return `/obrigado${str ? `?${str}` : ''}`;
  }
  return '/obrigado';
}

/**
 * Redireciona o usuário para a rota /obrigado (que dispara o evento de conversão do Google Ads e redireciona ao WhatsApp).
 * @param {string|object} params - Mensagem em texto puro ou objeto com parâmetros
 * @param {boolean} newTab - Se verdadeiro, abre /obrigado em nova aba/janela
 */
export function openWhatsApp(params = '', newTab = true) {
  const obrigadoUrl = buildObrigadoLink(params);
  if (newTab && typeof window !== 'undefined') {
    window.open(obrigadoUrl, '_blank');
  } else if (typeof window !== 'undefined') {
    window.location.href = obrigadoUrl;
  }
}

// Mensagens padrão reutilizáveis
export const WA_MESSAGES = {
  generic: 'Olá! Gostaria de informações sobre transfers e passeios em Jericoacoara.',
  helicopter: 'Olá! Gostaria de saber mais sobre a experiência de Helicóptero em Jericoacoara.',
  utv: 'Olá! Gostaria de saber mais sobre o passeio de UTV em Jericoacoara.',
  custom: (experience) =>
    `Olá! Gostaria de saber mais sobre a experiência de ${experience} em Jericoacoara.`,
  planner: ({ travelers, days, style, interests }) =>
    `Olá! Montei meu perfil de viagem pelo site da Jericoacoara Premium:\n\nViajantes: ${travelers}\nDuração: ${days}\nEstilo: ${style}\nInteresses: ${Array.isArray(interests) ? interests.join(', ') : interests}\n\nGostaria de receber um roteiro personalizado.`,
};

