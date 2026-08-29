import { format } from 'date-fns';

const HOTEL_OPS_ENDPOINT = 'https://hotelops-rh.vercel.app/api/booking-public';

/**
 * Normaliza o tipo de veículo para um dos valores aceitos pelo CRM HotelOps:
 * 'buggy' | 'quadriciclo' | 'sw4' | 'jardineira' | 'onibus'
 */
function normalizeVehicle(rawVehicle, serviceType, optionType) {
  const v = (rawVehicle || '').toLowerCase();
  if (v.includes('buggy') || v.includes('bugi')) return 'buggy';
  if (v.includes('quadri') || v.includes('quad') || v.includes('atv')) return 'quadriciclo';
  if (v.includes('jardineira') || v.includes('pau de arara')) return 'jardineira';
  if (v.includes('onibus') || v.includes('ônibus') || v.includes('van') || v.includes('micro')) return 'onibus';
  if (
    v.includes('sw4') ||
    v.includes('hilux') ||
    v.includes('spin') ||
    v.includes('corolla') ||
    v.includes('sedan') ||
    v.includes('4x4') ||
    v.includes('carro') ||
    v.includes('privativo')
  ) {
    return 'sw4';
  }

  if (serviceType === 'transfer') return 'sw4';
  if (optionType === 'shared') return 'jardineira';
  return 'buggy';
}

/**
 * Dispara uma requisição POST com tratamento de erro silencioso para o backend central do CRM HotelOps.
 * 
 * @param {Object} formData - Dados preenchidos pelo cliente no formulário
 * @param {Object} itemData - Dados do item (transfer/passeio)
 * @param {Object} paymentInfo - Dados financeiros e de pagamento (fullTotal, chargeTotal, chargePixTotal, paymentMethod, paymentMode, vehicle, isWhatsAppOnly, etc)
 * @returns {Promise<{ success: boolean, data?: any, error?: any }>}
 */
export async function sendBookingToHotelOps(formData = {}, itemData = {}, paymentInfo = {}) {
  try {
    const isTransfer = itemData?.category === 'transfer' || Boolean(itemData?.options?.private?.tiers);
    const serviceType = isTransfer ? 'transfer' : 'passeio';
    const modality = formData.optionType === 'shared' ? 'compartilhado' : 'privativo';

    // Normalização do método de pagamento (pix | cartao | mercado_pago)
    let paymentMethod = (paymentInfo.paymentMethod || '').toLowerCase();
    if (paymentMethod.includes('pix')) {
      paymentMethod = 'pix';
    } else if (
      paymentMethod.includes('cart') ||
      paymentMethod.includes('crédito') ||
      paymentMethod.includes('credito') ||
      paymentMethod.includes('mercado')
    ) {
      paymentMethod = 'cartao';
    } else {
      paymentMethod = 'pix';
    }

    // O status inicial ao abrir o checkout/gerar Pix/cotação DEVE ser 'pendente'
    // O status só deve mudar para 'sinal_pago' ou 'pago_integral' se houver confirmação real do pagamento (ex: webhook/gateways)
    const isConfirmed = Boolean(paymentInfo.isConfirmed);
    const paymentStatus = isConfirmed ? (paymentInfo.paymentStatus || 'sinal_pago') : 'pendente';
    const reservationStatus = isConfirmed ? (paymentInfo.reservationStatus || 'confirmada') : 'pendente';

    // Cálculo do valor pago e desconto
    let amountPaid = 0;
    let discount = 0;

    if (paymentMethod === 'pix') {
      amountPaid = paymentInfo.chargePixTotal ?? paymentInfo.chargeTotal ?? paymentInfo.fullTotal ?? 0;
      if (paymentInfo.chargeTotal && paymentInfo.chargePixTotal && paymentInfo.chargeTotal > paymentInfo.chargePixTotal) {
        discount = Number((paymentInfo.chargeTotal - paymentInfo.chargePixTotal).toFixed(2));
      } else if (paymentInfo.fullTotal && paymentInfo.fullPixTotal && paymentInfo.fullTotal > paymentInfo.fullPixTotal) {
        discount = Number((paymentInfo.fullTotal - paymentInfo.fullPixTotal).toFixed(2));
      }
    } else {
      amountPaid = paymentInfo.chargeTotal ?? paymentInfo.fullTotal ?? 0;
    }

    if (paymentInfo.isWhatsAppOnly) {
      amountPaid = 0;
      discount = 0;
    }

    // Formatação da data para YYYY-MM-DD
    let formattedDate = '';
    if (formData.date) {
      try {
        formattedDate = typeof formData.date === 'string' ? formData.date.split('T')[0] : format(formData.date, 'yyyy-MM-dd');
      } catch (e) {
        formattedDate = new Date(formData.date).toISOString().split('T')[0];
      }
    } else {
      formattedDate = format(new Date(), 'yyyy-MM-dd');
    }

    // Título do Serviço
    const serviceTitle = itemData?.title || (isTransfer ? 'Transfer Jericoacoara' : 'Passeio Jericoacoara');

    // Montagem das notas (Origem: Site Institucional + observações relevantes)
    const notesParts = ['Origem: Site Institucional'];
    if (formData.pickup) {
      notesParts.push(`Ponto de Embarque: ${formData.pickup.trim()}`);
    }
    if (formData.flightDetails && formData.flightDetails.trim()) {
      notesParts.push(`Dados Voo: ${formData.flightDetails.trim()}`);
    }
    if (formData.tripType && isTransfer) {
      const tripLabels = { oneWay: 'Somente Ida', returnWay: 'Somente Volta', roundTrip: 'Ida e Volta' };
      notesParts.push(`Trajeto: ${tripLabels[formData.tripType] || formData.tripType}`);
    }
    if (formData.returnDate) {
      try {
        const retDateStr = typeof formData.returnDate === 'string' ? formData.returnDate.split('T')[0] : format(formData.returnDate, 'yyyy-MM-dd');
        notesParts.push(`Retorno: ${retDateStr} às ${formData.returnTime || '12:00'}h`);
      } catch (e) {
        // ignore
      }
    }
    if (paymentInfo.remainingBalance && paymentInfo.remainingBalance > 0) {
      notesParts.push(`Saldo Restante no Embarque: R$ ${paymentInfo.remainingBalance.toFixed(2)}`);
    }

    // Veículo normalizado
    const rawVehicle = paymentInfo.vehicle || formData.selectedVehicleType || itemData?.selectedVehicleType || '';
    const vehicle = normalizeVehicle(rawVehicle, serviceType, formData.optionType);

    // Preço unitário integral do item
    const unitPrice = Number((paymentInfo.fullTotal || itemData.unitPrice || 0).toFixed(2));

    const payload = {
      client_name: formData.name ? formData.name.trim() : 'Cliente Site',
      client_phone: formData.whatsapp ? formData.whatsapp.trim() : '',
      client_email: formData.email ? formData.email.trim() : '',
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      reservation_status: reservationStatus,
      amount_paid: Number(Number(amountPaid).toFixed(2)),
      discount: Number(Number(discount).toFixed(2)),
      notes: notesParts.join(' | '),
      items: [
        {
          service_type: serviceType,
          title: serviceTitle,
          vehicle,
          modality,
          date: formattedDate,
          time: formData.time || '12:00',
          pax: Number(formData.passengers || 1),
          unit_price: unitPrice,
        },
      ],
    };

    console.log('[HotelOps Integration] Disparando reserva para CRM HotelOps:', payload);

    const response = await fetch(HOTEL_OPS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('[HotelOps Integration] Resposta de erro do CRM:', response.status, data);
      return { success: false, error: data };
    }

    console.log('[HotelOps Integration] Reserva sincronizada com sucesso:', data);
    return { success: true, data };
  } catch (err) {
    // Tratamento de Erro Silencioso: NUNCA trava o fluxo do cliente
    console.error('[HotelOps Integration] Falha silenciosa no envio para o CRM HotelOps:', err);
    return { success: false, error: err?.message || err };
  }
}
