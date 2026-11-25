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
  const rawVehicle = (item.vehicle || item.vehicle_type || '').trim();
  const vehicle = rawVehicle.toLowerCase();
  const modality = (item.modality || item.trecho || '').toLowerCase();

  // Verifica indicadores explícitos de Privativo vs Compartilhado
  const isExplicitPrivativo =
    modality.includes('privat') ||
    modality.includes('exclusiv') ||
    vehicle.includes('privat') ||
    vehicle.includes('exclusiv') ||
    title.includes('privat') ||
    title.includes('exclusiv');

  const isExplicitShared =
    modality.includes('compartilhad') ||
    modality.includes('shared') ||
    modality.includes('coletiv') ||
    vehicle.includes('compartilhad') ||
    vehicle.includes('shared') ||
    title.includes('compartilhad') ||
    title.includes('shared');

  let isShared = false;
  if (isExplicitShared && !isExplicitPrivativo) {
    isShared = true;
  } else if (isExplicitPrivativo) {
    isShared = false;
  } else {
    const isJijoca = title.includes('jijoca') || title.includes('estacionamento');
    if (isJijoca || modality.includes('compartilhad')) {
      isShared = true;
    }
  }

  const suffix = isShared ? '(Compartilhado)' : '(Privativo Exclusivo)';

  if (vehicle.includes('jardineira') || (!rawVehicle && title.includes('jardineira'))) {
    return `Jardineira 4x4 ${suffix}`;
  }

  if (vehicle.includes('utv') || vehicle.includes('can-am') || vehicle.includes('maverick') || (!rawVehicle && title.includes('utv'))) {
    return `UTV 4x4 ${suffix}`;
  }

  if (vehicle.includes('buggy') || (!rawVehicle && title.includes('buggy'))) {
    return `Buggy ${suffix}`;
  }

  if (vehicle.includes('quadri') || (!rawVehicle && title.includes('quadri'))) {
    return `Quadriciclo ${suffix}`;
  }

  if (vehicle.includes('sw4') || vehicle.includes('hilux') || (!rawVehicle && (title.includes('sw4') || title.includes('hilux')))) {
    return `SW4 / Hilux 4x4 ${suffix}`;
  }

  if (vehicle.includes('helicopter') || vehicle.includes('helicóptero') || (!rawVehicle && title.includes('helic'))) {
    return `Helicóptero ${suffix}`;
  }

  if (vehicle.includes('onibus') || vehicle.includes('ônibus') || vehicle.includes('van') || (!rawVehicle && title.includes('van'))) {
    return `Van / Ônibus ${suffix}`;
  }

  if (vehicle.includes('4x4') || (!rawVehicle && title.includes('4x4'))) {
    return `Veículo 4x4 ${suffix}`;
  }

  if (rawVehicle && !['privativo', 'compartilhado', 'ida_e_volta', 'ida e volta', 'somente_ida', 'somente_volta'].includes(vehicle)) {
    const hasModalityText = vehicle.includes('privat') || vehicle.includes('compartilhad') || vehicle.includes('exclusiv');
    return hasModalityText ? rawVehicle : `${rawVehicle} ${suffix}`;
  }

  return isShared ? 'Compartilhado' : 'Privativo Exclusivo';
}

const PAID_FULL_STATUSES = ['pago', 'pago_integral', 'quitado', 'paid', 'approved', 'concluida', 'full', 'integral'];
const CONFIRMED_RES_STATUSES = ['confirmada', 'confirmed', 'concluida', 'completed', 'approved', 'paid', 'quitado', 'pago'];
const DEPOSIT_STATUSES = ['sinal_pago', 'parcial', 'sinal', 'partial', 'deposit'];
const PENDING_STATUSES = ['pendente', 'pending', 'aguardando', 'aguardando_pagamento', 'waiting'];
const CANCELLED_STATUSES = ['cancelada', 'cancelled', 'canceled'];
const INVALID_PAYMENT_STATUSES = ['pendente', 'pending', 'cancelado', 'cancelled', 'canceled', 'rejected', 'recusado', 'failed', 'falhou', 'estornado', 'refunded', 'expired', 'expirado'];

function toFiniteNumber(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

function firstPositiveNumber(...values) {
  for (const v of values) {
    const n = toFiniteNumber(v);
    if (n !== null && n > 0) return n;
  }
  return null;
}

/**
 * Calcula o estado financeiro real da reserva unificando valores (total, pago, saldo)
 * e status gravados pelo HotelOps ou gateways de pagamento.
 *
 * @param {Object} booking - Registro da reserva
 * @param {Array} items - Itens vinculados à reserva
 * @returns {Object} Resumo financeiro e estado operacional normalizado
 */
export function computeFinancialSummary(booking = {}, items = []) {
  const itemsSum = Array.isArray(items)
    ? items.reduce((sum, it) => sum + Number(it?.price_total ?? it?.unit_price ?? it?.valor_total ?? it?.valor ?? 0), 0)
    : 0;

  const explicitTotal = firstPositiveNumber(
    booking.valor_total,
    booking.price_final,
    booking.amount_total,
    booking.total_amount,
    booking.price_gross,
    itemsSum
  );
  const amountTotal = explicitTotal !== null ? explicitTotal : 0;
  const amountGross = firstPositiveNumber(booking.price_gross, amountTotal) ?? amountTotal;
  const discount = toFiniteNumber(booking.discount) ?? Math.max(0, Number((amountGross - amountTotal).toFixed(2)));

  const payments = Array.isArray(booking.agency_payments) ? booking.agency_payments : [];
  const validPayments = payments.filter((p) => {
    const st = String(p?.status || '').toLowerCase().trim();
    if (!st) return Number(p?.amount || 0) > 0;
    return !INVALID_PAYMENT_STATUSES.includes(st) && Number(p?.amount || 0) > 0;
  });

  const paidFromPayments = validPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const latestPaymentMethod = validPayments.find((p) => p?.method)?.method || null;

  const pStatus = String(booking.payment_status || '').toLowerCase().trim();
  const rStatus = String(booking.reservation_status || booking.status || '').toLowerCase().trim();

  const explicitPaid = firstPositiveNumber(booking.valor_pago, booking.amount_paid, booking.paid_amount);
  const explicitRemaining = toFiniteNumber(booking.saldo_restante ?? booking.remaining_balance);

  let amountPaid = 0;
  if (paidFromPayments > 0) {
    amountPaid = paidFromPayments;
  } else if (explicitPaid !== null) {
    amountPaid = explicitPaid;
  } else if (explicitRemaining !== null && amountTotal > 0 && explicitRemaining < amountTotal && explicitRemaining > 0) {
    amountPaid = amountTotal - explicitRemaining;
  } else if (PAID_FULL_STATUSES.includes(pStatus) || ['concluida', 'quitado', 'pago', 'paid', 'approved'].includes(rStatus)) {
    amountPaid = amountTotal;
  } else if (DEPOSIT_STATUSES.includes(pStatus)) {
    amountPaid = amountTotal * 0.5;
  } else if (explicitRemaining !== null && explicitRemaining <= 0 && amountTotal > 0 && CONFIRMED_RES_STATUSES.includes(rStatus) && !PENDING_STATUSES.includes(pStatus)) {
    amountPaid = amountTotal;
  }

  amountPaid = Number(Math.max(0, amountPaid).toFixed(2));
  const remainingBalance = (explicitRemaining !== null && explicitRemaining <= 0 && amountPaid >= amountTotal - 0.01)
    ? 0
    : Number(Math.max(0, amountTotal - amountPaid).toFixed(2));

  const isCancelled = CANCELLED_STATUSES.includes(rStatus) || CANCELLED_STATUSES.includes(pStatus);

  const isPaidInFull = !isCancelled && (
    (amountTotal > 0 && amountPaid >= amountTotal - 0.01) ||
    (amountPaid > 0 && remainingBalance <= 0.01) ||
    (explicitRemaining !== null && explicitRemaining <= 0 && (amountPaid > 0 || PAID_FULL_STATUSES.includes(pStatus))) ||
    (amountTotal === 0 && PAID_FULL_STATUSES.includes(pStatus))
  );

  const isPartialPaid = !isCancelled && !isPaidInFull && amountPaid > 0 && remainingBalance > 0.01;
  const paidPercentage = amountTotal > 0
    ? Math.min(100, Math.max(0, Math.round((amountPaid / amountTotal) * 100)))
    : (isPaidInFull ? 100 : 0);

  const isPaymentPendingStatus = !pStatus || PENDING_STATUSES.includes(pStatus);
  const isPending = !isCancelled && !isPaidInFull && !isPartialPaid && amountPaid <= 0 && (isPaymentPendingStatus || PENDING_STATUSES.includes(rStatus));

  const isConfirmed = !isCancelled && !isPending && (
    isPaidInFull ||
    isPartialPaid ||
    CONFIRMED_RES_STATUSES.includes(rStatus) ||
    PAID_FULL_STATUSES.includes(pStatus) ||
    DEPOSIT_STATUSES.includes(pStatus)
  );

  let effectivePaymentStatus = pStatus || 'pendente';
  if (isPaidInFull) effectivePaymentStatus = 'pago_integral';
  else if (isPartialPaid) effectivePaymentStatus = 'sinal_pago';

  let effectiveReservationStatus = rStatus || 'pendente';
  if (isCancelled) effectiveReservationStatus = 'cancelada';
  else if (isPaidInFull || isPartialPaid || isConfirmed) {
    effectiveReservationStatus = rStatus === 'concluida' ? 'concluida' : 'confirmada';
  }

  return {
    amountTotal,
    amountGross,
    discount,
    amountPaid,
    remainingBalance,
    paidPercentage,
    isPaidInFull,
    isPartialPaid,
    isPending,
    isConfirmed,
    isCancelled,
    effectivePaymentStatus,
    effectiveReservationStatus,
    latestPaymentMethod,
  };
}

/**
 * Formata o método de pagamento para exibição em PT ou EN.
 */
export function formatPaymentMethodLabel(rawMethod, isEnglish = false) {
  const m = String(rawMethod || '').toLowerCase().trim();
  if (!m) return isEnglish ? 'PIX' : 'PIX Instantâneo';
  if (m.includes('stripe') || m.includes('internacional')) {
    return isEnglish ? 'International Credit Card (Stripe)' : 'Cartão Internacional (Stripe)';
  }
  if (m.includes('pix')) {
    return isEnglish ? 'Instant PIX' : 'PIX Instantâneo';
  }
  if (m.includes('debito') || m.includes('débito') || m.includes('debit')) {
    return isEnglish ? 'Debit Card' : 'Cartão de Débito';
  }
  if (m.includes('cartao') || m.includes('cartão') || m.includes('credito') || m.includes('crédito') || m.includes('credit') || m.includes('card') || m.includes('mercado')) {
    return isEnglish ? 'Credit Card' : 'Cartão de Crédito';
  }
  if (m.includes('dinheiro') || m.includes('cash') || m.includes('especie') || m.includes('espécie')) {
    return isEnglish ? 'Cash' : 'Dinheiro';
  }
  if (m.includes('transfer') || m.includes('ted') || m.includes('doc')) {
    return isEnglish ? 'Bank Transfer' : 'Transferência Bancária';
  }
  if (m.includes('link')) {
    return isEnglish ? 'Payment Link' : 'Link de Pagamento';
  }
  return String(rawMethod).trim();
}

export function normalizeDateValue(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (!s) return null;
  // DD/MM/YYYY -> YYYY-MM-DD
  const brMatch = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (brMatch) {
    return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  }
  const isoPart = s.split('T')[0].split(' ')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoPart)) return isoPart;
  return null;
}

export function normalizeTimeValue(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (!s) return null;
  const match = s.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    return `${match[1].padStart(2, '0')}:${match[2]}`;
  }
  return s;
}

function inferVehicleFromText(text) {
  const t = String(text || '').toLowerCase();
  if (t.includes('hilux')) return 'Hilux 4x4';
  if (t.includes('sw4')) return 'SW4 4x4';
  if (t.includes('utv') || t.includes('maverick') || t.includes('can-am')) return 'UTV 4x4';
  if (t.includes('buggy')) return 'Buggy';
  if (t.includes('quadri')) return 'Quadriciclo';
  if (t.includes('jardineira')) return 'Jardineira 4x4';
  if (t.includes('helic')) return 'Helicóptero';
  if (t.includes('van') || t.includes('onibus') || t.includes('ônibus')) return 'Van / Ônibus';
  if (t.includes('4x4')) return 'Veículo 4x4';
  return '';
}

function parseJsonArrayField(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Extrai os itens brutos da reserva a partir de `agency_reservation_items`,
 * colunas JSON eventuais na reserva pai, ou (em último caso) linhas de `notes_service`
 * sem inventar datas (+1 dia), horários ou veículo padrão.
 */
export function extractItemsFromBooking(booking = {}, explicitItems = null) {
  const tableItems = Array.isArray(explicitItems)
    ? explicitItems
    : Array.isArray(booking.agency_reservation_items)
    ? booking.agency_reservation_items
    : [];

  if (tableItems.length > 0) {
    return [...tableItems].sort((a, b) => {
      const da = normalizeDateValue(a.date_start || a.date || a.data || a.service_date) || '9999-12-31';
      const db = normalizeDateValue(b.date_start || b.date || b.data || b.service_date) || '9999-12-31';
      if (da !== db) return da.localeCompare(db);
      const ta = normalizeTimeValue(a.time_start || a.time || a.horario || a.departure_time) || '99:99';
      const tb = normalizeTimeValue(b.time_start || b.time || b.horario || b.departure_time) || '99:99';
      return ta.localeCompare(tb);
    });
  }

  for (const field of ['items', 'itens', 'services', 'servicos', 'pacote_itens', 'reservation_items']) {
    const jsonItems = parseJsonArrayField(booking[field]);
    if (jsonItems.length > 0) return jsonItems;
  }

  if (booking.notes_service) {
    const lines = String(booking.notes_service)
      .split(/\r?\n|\|/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length > 0) {
      return lines.map((line, idx) => {
        const cleanedName = line.replace(/^\[.*?\]\s*/, '').trim();
        const isFirst = idx === 0;
        const isTransfer = line.toLowerCase().includes('transfer');
        return {
          service_name: cleanedName,
          title: cleanedName,
          category: isTransfer ? 'transfer' : 'passeio',
          vehicle_type: inferVehicleFromText(cleanedName),
          trecho: cleanedName.toLowerCase().includes('ida e volta')
            ? 'ida_e_volta'
            : cleanedName.toLowerCase().includes('compartilhad')
            ? 'compartilhado'
            : 'privativo',
          date_start: isFirst ? normalizeDateValue(booking.date) : null,
          time_start: isFirst ? normalizeTimeValue(booking.time) : null,
          pickup_location: isFirst ? (booking.pickup_location || booking.pickup_point || null) : null,
          dropoff_location: isFirst ? (booking.dropoff_location || booking.dropoff_point || null) : null,
          pax_adults: Number(booking.pax_adults || 1),
          pax_children: Number(booking.pax_children || 0),
          price_total: null,
        };
      });
    }
  }

  return [];
}

export function isTransferService(item = {}) {
  const cat = String(item.service_type || item.category || item.tipo || '').toLowerCase().trim();
  if (cat.includes('passeio') || cat.includes('tour') || cat.includes('experienc')) return false;
  if (cat.includes('transfer') || cat.includes('translado') || cat.includes('traslado')) return true;
  const title = String(item.service_name || item.title || item.name || '').toLowerCase();
  return title.includes('transfer') || title.includes('translado') || title.includes('traslado');
}

export function getDistinctDropoff(pickup, dropoff) {
  const d = String(dropoff || '').trim();
  if (!d) return null;
  const p = String(pickup || '').trim().toLowerCase();
  if (p && d.toLowerCase() === p) return null;
  return d;
}

/**
 * Normaliza os itens de uma reserva preservando todos os dados individuais de cada serviço.
 */
export function normalizeReservationItems(booking = {}, rawItems = []) {
  const sourceItems = rawItems.length > 0 ? rawItems : [{}];
  const isMultiItem = sourceItems.length > 1;

  return sourceItems.map((it) => {
    const itemTitle =
      it.service_name ||
      it.title ||
      it.name ||
      it.servico ||
      it.nome_servico ||
      it.description ||
      booking.service_name ||
      booking.title ||
      'Passeio Jericoacoara';

    const titleLower = itemTitle.toLowerCase();
    const categoryRaw = String(it.category || it.service_type || it.tipo || (!isMultiItem ? booking.service_type : '') || '').toLowerCase().trim();
    const explicitTourCategory = categoryRaw.includes('passeio') || categoryRaw.includes('tour') || categoryRaw.includes('experienc');
    const isTransfer =
      !explicitTourCategory &&
      (categoryRaw.includes('transfer') ||
        categoryRaw.includes('translado') ||
        categoryRaw.includes('traslado') ||
        titleLower.includes('transfer') ||
        titleLower.includes('translado') ||
        titleLower.includes('traslado'));

    const rawTrecho = String(
      it.trecho ||
        it.modality ||
        it.modalidade ||
        it.trip_type ||
        it.route_type ||
        (isTransfer && !isMultiItem ? booking.trecho : '') ||
        ''
    ).trim();

    const dateStart = normalizeDateValue(
      it.date_start ||
        it.date ||
        it.data ||
        it.data_saida ||
        it.service_date ||
        it.departure_date ||
        (!isMultiItem ? booking.date : null)
    );

    const timeStart = normalizeTimeValue(
      it.time_start ||
        it.time ||
        it.horario ||
        it.hora ||
        it.horario_saida ||
        it.departure_time ||
        it.pickup_time ||
        (!isMultiItem ? booking.time : null)
    );

    const dateEnd = isTransfer
      ? normalizeDateValue(
          it.date_end ||
            it.return_date ||
            it.data_volta ||
            it.data_retorno ||
            (!isMultiItem ? booking.date_end : null)
        )
      : null;

    const timeEnd = isTransfer
      ? normalizeTimeValue(
          it.time_end ||
            it.return_time ||
            it.horario_volta ||
            it.hora_volta ||
            it.return_departure_time ||
            (!isMultiItem ? booking.time_end : null)
        )
      : null;

    const pickupLocation =
      it.pickup_location ||
      it.pickup_point ||
      it.pickup ||
      it.embarque ||
      it.local_embarque ||
      it.origin ||
      it.origem ||
      (!isMultiItem ? (booking.pickup_location || booking.pickup_point) : null) ||
      null;

    const rawDropoffLocation =
      it.dropoff_location ||
      it.dropoff_point ||
      it.dropoff ||
      it.desembarque ||
      it.local_desembarque ||
      it.destination ||
      it.destino ||
      (!isMultiItem ? (booking.dropoff_location || booking.dropoff_point) : null) ||
      null;

    const dropoffLocation = isTransfer
      ? rawDropoffLocation
      : getDistinctDropoff(pickupLocation, rawDropoffLocation);

    const explicitReturnPickup =
      it.return_pickup_location ||
      it.return_pickup ||
      it.embarque_volta ||
      it.local_embarque_volta ||
      it.volta_embarque ||
      (isTransfer && !isMultiItem ? booking.return_pickup_location : null) ||
      null;

    const explicitReturnDropoff =
      it.return_dropoff_location ||
      it.return_dropoff ||
      it.desembarque_volta ||
      it.local_desembarque_volta ||
      it.volta_desembarque ||
      (isTransfer && !isMultiItem ? booking.return_dropoff_location : null) ||
      null;

    const trechoLower = rawTrecho.toLowerCase();
    const hasDistinctReturnRoute = Boolean(
      (dateEnd && dateEnd !== dateStart) ||
      (timeEnd && timeEnd !== timeStart) ||
      (explicitReturnPickup && explicitReturnDropoff)
    );

    const isRoundTrip =
      isTransfer &&
      (trechoLower.includes('ida_e_volta') ||
        trechoLower.includes('ida e volta') ||
        trechoLower.includes('round') ||
        titleLower.includes('ida e volta') ||
        titleLower.includes('ida & volta') ||
        Boolean(dateEnd || timeEnd) ||
        hasDistinctReturnRoute);

    const returnPickupLocation = isRoundTrip
      ? (explicitReturnPickup || dropoffLocation || null)
      : null;

    const returnDropoffLocation = isRoundTrip
      ? (explicitReturnDropoff || pickupLocation || null)
      : null;

    const vehicleRaw =
      it.vehicle_type ||
      it.vehicle ||
      it.veiculo ||
      it.tipo_veiculo ||
      it.car_type ||
      (!isMultiItem ? (booking.vehicle_type || booking.vehicle_info) : null) ||
      inferVehicleFromText(itemTitle);

    const paxAdults = Number(it.pax_adults ?? it.adultos ?? booking.pax_adults ?? 0);
    const paxChildren = Number(it.pax_children ?? it.criancas ?? booking.pax_children ?? 0);
    const paxTotal = paxAdults + paxChildren > 0 ? paxAdults + paxChildren : Number(it.pax ?? it.passengers ?? booking.pax ?? 1);

    return {
      title: itemTitle,
      service_name: it.service_name || itemTitle,
      service_type: isTransfer ? 'transfer' : (categoryRaw || 'passeio'),
      vehicle: vehicleRaw || '',
      vehicle_type: vehicleRaw || '',
      modality: it.modality || (isRoundTrip ? 'ida_e_volta' : rawTrecho) || (titleLower.includes('compartilhad') ? 'compartilhado' : 'privativo'),
      trecho: isTransfer ? (rawTrecho || (isRoundTrip ? 'ida_e_volta' : 'somente_ida')) : (rawTrecho || 'privativo'),
      isRoundTrip,
      date: dateStart,
      date_start: dateStart,
      time: timeStart,
      time_start: timeStart,
      date_end: isRoundTrip ? dateEnd : null,
      time_end: isRoundTrip ? timeEnd : null,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      return_pickup_location: returnPickupLocation,
      return_dropoff_location: returnDropoffLocation,
      pax: paxTotal,
      pax_adults: paxAdults,
      pax_children: paxChildren,
      unit_price: Number(it.price_total ?? it.unit_price ?? it.valor_total ?? it.valor ?? it.price ?? 0),
      notes: it.notes || it.observacoes || it.obs || null,
    };
  });
}

/**
 * Remove tags internas de controle (ex.: [EMAIL_VOUCHER_ENVIADO:...]) antes de exibir notas ao cliente.
 */
export function sanitizePublicNotes(rawNotes) {
  if (!rawNotes) return '';
  return String(rawNotes)
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part && !/^\[EMAIL_VOUCHER_/i.test(part))
    .join(' | ');
}

function stripAccentsLower(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const PORTUGUESE_LOWER_WORDS = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'a', 'o', 'as', 'os']);
const PRESERVED_UPPER_ACRONYMS = new Set(['JJD', 'FOR', 'UTV', 'VIP', 'CE']);

function normalizePortugueseCasing(text) {
  const s = String(text || '').trim();
  if (!s) return '';
  // Só re-capitaliza se estiver todo em maiúsculas (ou quase todo em maiúsculas)
  const letters = s.replace(/[^A-Za-zÀ-ÿ]/g, '');
  const isAllUpper = letters.length > 0 && letters === letters.toUpperCase();
  if (!isAllUpper) return s;

  return s
    .split(/\s+/)
    .map((word, idx) => {
      const cleanUpper = word.toUpperCase();
      if (PRESERVED_UPPER_ACRONYMS.has(cleanUpper)) return cleanUpper;
      if (/^\d+x\d+$/i.test(word)) return word.toLowerCase();
      const lower = word.toLowerCase();
      if (idx > 0 && PORTUGUESE_LOWER_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

const REDUNDANT_VEHICLE_MODALITY_PATTERNS = [
  /\bsw4\s*\/\s*hilux\s*4x4\b/gi,
  /\bhilux\s*4x4\b/gi,
  /\bjardineira\s*4x4\b/gi,
  /\butv\s*4x4\b/gi,
  /\bve[ií]culo\s*4x4\b/gi,
  /\bvan\s*\/\s*[oô]nibus\b/gi,
  /\b(?:hilux|sw4|buggy|quadriciclo|jardineira|utv|can-am|maverick)\b/gi,
  /\b4x4\b/gi,
  /\b(?:privativ[oa]s?\s*exclusiv[oa]s?|privativ[oa]s?|exclusiv[oa]s?|compartilhad[oa]s?|coletiv[oa]s?)\b/gi,
];

function stripRedundantVehicleTokens(segment) {
  const original = String(segment || '').trim();
  let out = original;
  for (const rx of REDUNDANT_VEHICLE_MODALITY_PATTERNS) {
    out = out.replace(rx, ' ');
  }
  out = out
    .replace(/^[\s\-–—·•:,/|]+|[\s\-–—·•:,/|]+$/g, '')
    .replace(/\s*[-–—]+\s*$/g, '')
    .replace(/^\s*[-–—]+\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Evita quebrar frases como "Passeio de Buggy" deixando preposição solta no final ("Passeio de")
  if (/\b(?:de|do|da|dos|das|em|no|na|nos|nas|com|para|por)$/i.test(out)) {
    return original;
  }
  return out;
}

function containsKeyword(haystack, needle) {
  const h = stripAccentsLower(haystack);
  const n = stripAccentsLower(needle);
  if (!h || !n) return false;
  if (h === n) return true;
  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`).test(h);
}

/**
 * Limpa e padroniza o título de exibição de um serviço para evitar repetições de sufixos,
 * redundância com a tag de veículo/modalidade e textos inteiramente em caixa alta.
 *
 * @param {Object|string} itemOrTitle - Objeto do item ou string do título principal
 * @param {string} [extraSuffix] - Sufixo/subcategoria opcional
 * @param {boolean|null} [forceIsTransfer] - Força classificação de transfer se informado
 * @returns {string} Título limpo e formatado
 */
export function formatCleanServiceTitle(itemOrTitle, extraSuffix = '', forceIsTransfer = null) {
  const isObj = itemOrTitle && typeof itemOrTitle === 'object';
  const rawTitle = isObj
    ? (itemOrTitle.service_name || itemOrTitle.title || itemOrTitle.name || '')
    : String(itemOrTitle || '');
  const rawSuffix = isObj
    ? (itemOrTitle.subcategory || itemOrTitle.subcategoria || extraSuffix || '')
    : String(extraSuffix || '');

  const isTransfer = forceIsTransfer !== null
    ? Boolean(forceIsTransfer)
    : isObj
    ? isTransferService(itemOrTitle)
    : /transfer|translado|traslado/i.test(stripAccentsLower(`${rawTitle} ${rawSuffix}`));

  const rawParts = [...String(rawTitle).split(/[·|]/), ...String(rawSuffix).split(/[·|]/)]
    .map((p) => p.replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean);

  if (rawParts.length === 0) {
    return isTransfer ? 'Transfer Jericoacoara' : 'Passeio Jericoacoara';
  }

  // Deduplica sufixos já presentes no título acumulado (case-insensitive e sem acentos)
  const dedupedParts = [];
  for (const part of rawParts) {
    const accumulated = dedupedParts.join(' ');
    if (dedupedParts.length === 0 || !containsKeyword(accumulated, part)) {
      dedupedParts.push(part);
    }
  }

  // Remove tokens redundantes de veículo/modalidade de cada segmento
  const cleanedParts = dedupedParts
    .map((p) => normalizePortugueseCasing(stripRedundantVehicleTokens(p)))
    .filter(Boolean);

  // Deduplica novamente após limpeza (ex: "OESTE - HILUX 4X4" -> "Oeste" e sufixo "Oeste")
  const finalParts = [];
  for (const part of cleanedParts) {
    const accumulated = finalParts.join(' ');
    if (finalParts.length === 0 || !containsKeyword(accumulated, part)) {
      finalParts.push(part);
    }
  }

  if (finalParts.length === 0) {
    return normalizePortugueseCasing(dedupedParts.join(' · '));
  }

  let joined = finalParts.join(' ');

  // Padronização amigável para passeios e transfers conhecidos sem redundância
  if (!isTransfer) {
    const norm = stripAccentsLower(joined);
    if (norm === 'oeste' || norm === 'lado oeste') return 'Passeio Lado Oeste';
    if (norm === 'leste' || norm === 'lado leste') return 'Passeio Lado Leste';
    if (!/^(passeio|roteiro|experi[eê]ncia|trilha|tour|voo)\b/i.test(norm)) {
      return `Passeio ${joined}`;
    }
    return joined;
  }

  // Para transfers: se o prefixo ficou exatamente "Transfer" e há destino/origem depois, concatena limpo
  if (finalParts.length > 1 && stripAccentsLower(finalParts[0]) === 'transfer') {
    joined = `Transfer ${finalParts.slice(1).join(' ')}`;
  }

  return joined.replace(/\s{2,}/g, ' ').trim();
}
