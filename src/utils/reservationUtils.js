/**
 * Helper para obter o nome do serviço de forma amigável e resolver "Serviço não definido".
 * 
 * @param {Object} reservation - Objeto da reserva
 * @returns {string} Nome formatado do serviço ou resumo do pacote
 */
export function getReservationServiceName(reservation) {
  if (!reservation) return 'Passeio / Transfer Jericoacoara';

  const items = reservation.items || reservation.agency_reservation_items || [];
  
  // Se houver nome de serviço definido na reserva pai e ele for válido
  const rawTitle = (reservation.service_name || reservation.title || '').trim();
  const isUndefined = !rawTitle || rawTitle.toLowerCase().includes('serviço não definido') || rawTitle.toLowerCase().includes('servico nao definido');

  if (!isUndefined) {
    return rawTitle;
  }

  // Se o título pai for nulo ou "Serviço não definido", busca nos itens vinculados
  if (items.length === 0) {
    return 'Passeio / Transfer Jericoacoara';
  }

  if (items.length === 1) {
    const singleItem = items[0];
    return singleItem.service_name || singleItem.title || singleItem.name || 'Passeio / Transfer Jericoacoara';
  }

  // Pacotes com múltiplos itens
  const itemNames = items
    .map((it) => it.title || it.service_name)
    .filter(Boolean);

  if (itemNames.length === 0) {
    return `Pacote (${items.length} itens)`;
  }

  return `Pacote (${items.length} itens): ${itemNames.join(' + ')}`;
}

/**
 * Sanitiza a linha de embarque (pickup_location).
 * Extrai o local físico real e separa os metadados (Trajeto, Canal de Venda e Saldo).
 * 
 * Exemplo de input: "Origem: Site Institucional | Ponto de Embarque: Estacionamento de Jijoca | Trajeto: Somente Volta | Saldo Restante no Embarque: R$ 25.00"
 * Output: {
 *   physicalLocation: "Estacionamento de Jijoca",
 *   route: "Somente Volta",
 *   channel: "Site",
 *   balanceToCollect: 25.00
 * }
 * 
 * @param {string} rawLocation - String original salva em pickup_location ou notes
 * @param {number} remainingBalance - Saldo pendente numérico da reserva
 * @param {string} saleSource - Fonte de venda (ex: "Site Institucional")
 * @returns {Object} Dados sanitizados para exibição na UI
 */
export function parsePickupLocation(rawLocation = '', remainingBalance = 0, saleSource = '') {
  const str = (rawLocation || '').trim();
  
  let physicalLocation = '';
  let route = null;
  let channel = saleSource && saleSource.toLowerCase().includes('site') ? 'Site' : (saleSource ? saleSource : null);
  let balanceToCollect = remainingBalance > 0 ? remainingBalance : 0;

  if (!str) {
    return {
      physicalLocation: 'A combinar com a equipe',
      route,
      channel: channel || 'Site',
      balanceToCollect,
    };
  }

  // Se contém delimitadores de pipe " | "
  const parts = str.split('|').map((p) => p.trim());
  const cleanPhysicalParts = [];

  for (const part of parts) {
    const lower = part.toLowerCase();

    if (lower.startsWith('origem:')) {
      const parsedChannel = part.replace(/^origem:\s*/i, '').trim();
      if (parsedChannel.toLowerCase().includes('site')) channel = 'Site';
      else if (parsedChannel.toLowerCase().includes('whatsapp')) channel = 'WhatsApp';
      else channel = parsedChannel;
    } else if (lower.startsWith('trajeto:')) {
      route = part.replace(/^trajeto:\s*/i, '').trim();
    } else if (lower.startsWith('ponto de embarque:') || lower.startsWith('ponto:')) {
      const loc = part.replace(/^(ponto de embarque|ponto):\s*/i, '').trim();
      if (loc) cleanPhysicalParts.push(loc);
    } else if (lower.includes('saldo restante') || lower.includes('saldo a pagar') || lower.includes('cobrar')) {
      // Tenta extrair o valor do saldo se presente na string
      const match = part.match(/r\$\s*([\d.,]+)/i);
      if (match && match[1]) {
        const parsedVal = parseFloat(match[1].replace('.', '').replace(',', '.'));
        if (!isNaN(parsedVal) && parsedVal > 0) {
          balanceToCollect = parsedVal;
        }
      }
    } else if (lower.startsWith('dados voo:') || lower.startsWith('voo:')) {
      // Dados de voo - opcionalmente mantemos ou ignoramos no pickup
    } else {
      // String genérica, provavelmente o local físico
      cleanPhysicalParts.push(part);
    }
  }

  if (cleanPhysicalParts.length > 0) {
    physicalLocation = cleanPhysicalParts.join(' • ');
  } else {
    physicalLocation = 'Ponto a combinar';
  }

  // Fallback para extrair Trajeto se não estava com prefixo "Trajeto:"
  if (!route) {
    if (str.toLowerCase().includes('somente volta')) route = 'Somente Volta';
    else if (str.toLowerCase().includes('somente ida')) route = 'Somente Ida';
    else if (str.toLowerCase().includes('ida e volta')) route = 'Ida e Volta';
  }

  // Fallback para canal
  if (!channel) {
    if (str.toLowerCase().includes('site')) channel = 'Site';
    else if (str.toLowerCase().includes('whatsapp')) channel = 'WhatsApp';
    else channel = 'Site';
  }

  return {
    physicalLocation,
    route,
    channel,
    balanceToCollect,
  };
}

/**
 * Formata a modalidade e tipo de veículo de um serviço para exibição.
 * Garante que transfer compartilhado de/para Jijoca exiba "Jardineira 4x4 (Compartilhado)".
 * 
 * @param {Object} item - Item da reserva (service_type, title, vehicle, modality, etc.)
 * @returns {string} Rótulo amigável da modalidade / veículo
 */
export function formatModalityLabel(item = {}) {
  const title = (item.title || item.service_name || '').toLowerCase();
  const vehicle = (item.vehicle || item.vehicle_type || '').toLowerCase();
  const modality = (item.modality || item.trecho || '').toLowerCase();

  // Verifica indicadores explícitos de Privativo vs Compartilhado
  const isExplicitPrivativo = 
    modality.includes('privat') || 
    modality.includes('exclusiv') || 
    title.includes('privat') || 
    title.includes('exclusiv');

  const isExplicitShared = 
    modality.includes('compartilhad') || 
    modality.includes('shared') || 
    title.includes('compartilhad') || 
    title.includes('shared');

  let isShared = false;
  if (isExplicitPrivativo) {
    isShared = false;
  } else if (isExplicitShared) {
    isShared = true;
  } else {
    // Fallback se não for explicitamente privativo: transfer de Jijoca por padrão é compartilhado
    const isJijoca = title.includes('jijoca') || title.includes('estacionamento');
    if (isJijoca || modality.includes('compartilhad')) {
      isShared = true;
    }
  }

  if (vehicle.includes('jardineira') || title.includes('jardineira')) {
    return isShared ? 'Jardineira 4x4 (Compartilhado)' : 'Jardineira 4x4 (Privativo Exclusivo)';
  }

  if (vehicle.includes('buggy') || title.includes('buggy')) {
    return isShared ? 'Buggy (Compartilhado)' : 'Buggy (Privativo Exclusivo)';
  }

  if (vehicle.includes('quadri') || title.includes('quadri')) {
    return isShared ? 'Quadriciclo (Compartilhado)' : 'Quadriciclo (Privativo Exclusivo)';
  }

  if (vehicle.includes('sw4') || vehicle.includes('hilux') || title.includes('sw4') || title.includes('hilux')) {
    return isShared ? 'SW4 / Hilux 4x4 (Compartilhado)' : 'SW4 / Hilux 4x4 (Privativo Exclusivo)';
  }

  if (vehicle.includes('onibus') || vehicle.includes('van') || title.includes('van')) {
    return isShared ? 'Van / Ônibus (Compartilhado)' : 'Van / Ônibus (Privativo Exclusivo)';
  }

  return isShared ? 'Compartilhado' : 'Privativo Exclusivo';
}
