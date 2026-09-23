/**
 * Helper para obter o nome do serviço de forma amigável e resolver "Serviço não definido".
 * 
 * @param {Object} reservation - Objeto da reserva
 * @returns {string} Nome formatado do serviço ou resumo do pacote
 */
export function getReservationServiceName(reservation) {
  if (!reservation) return 'Serviço Jericoacoara';

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
    return singleItem.title || singleItem.service_name || 'Serviço Jericoacoara';
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

  const isJijoca = title.includes('jijoca') || title.includes('estacionamento');
  const isShared = modality.includes('compartilhad') || modality.includes('shared') || vehicle.includes('jardineira') || vehicle.includes('pau de arara');

  if (isJijoca && isShared) {
    return 'Jardineira 4x4 (Compartilhado)';
  }

  if (vehicle.includes('jardineira') && isShared) {
    return 'Jardineira 4x4 (Compartilhado)';
  }

  if (vehicle.includes('buggy')) return `Buggy (${isShared ? 'Compartilhado' : 'Privativo Exclusivo'})`;
  if (vehicle.includes('quadri')) return `Quadriciclo (${isShared ? 'Compartilhado' : 'Privativo'})`;
  if (vehicle.includes('sw4') || vehicle.includes('hilux')) return `SW4 / Hilux 4x4 (${isShared ? 'Compartilhado' : 'Privativo Exclusivo'})`;
  if (vehicle.includes('onibus') || vehicle.includes('van')) return `Van / Ônibus (${isShared ? 'Compartilhado' : 'Privativo'})`;

  if (isShared) return 'Jardineira 4x4 (Compartilhado)';
  return 'Privativo Exclusivo';
}
