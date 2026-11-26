import { createClient } from '@supabase/supabase-js';
import {
  computeFinancialSummary,
  extractItemsFromBooking,
  normalizeReservationItems,
  formatModalityLabel,
  formatCleanServiceTitle,
  formatPaymentMethodLabel,
  isTransferService,
  extractCompanions,
} from '../src/utils/reservationUtils.js';

// Cache em memória para garantir idempotência em requisições automáticas concorrentes na mesma instância serverless
const sentEmailCodesCache = new Set();

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://lnowzrgmzdmbijckxvrw.supabase.co';

  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_t7F-VeX21DiacNiJqBppjA_X_bqsIvv';

  return createClient(supabaseUrl, supabaseKey);
}

const WHATSAPP_NUMBER = process.env.VITE_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '5588988463182';

/**
 * Formata mensagem dinâmica do concierge para o WhatsApp por serviço e idioma.
 */
function formatConciergeMessage({ serviceName, code, date, isEnglish }) {
  const cleanCode = code ? String(code).replace(/^#/, '').trim() : '';
  const cleanService = (serviceName || 'Transfer / Passeio em Jericoacoara').trim();
  const cleanDate = (date || 'A combinar').trim();

  if (isEnglish) {
    return `Hello, Jericoacoara Premium team! I just confirmed my booking for *${cleanService}* (Voucher *#${cleanCode}* — Date: *${cleanDate}*). I would like to align the details of my reservation and ask a few questions!`;
  }

  return `Olá, equipe Jericoacoara Premium! Acabei de confirmar minha reserva de *${cleanService}* (Voucher *#${cleanCode}* — Data: *${cleanDate}*). Gostaria de alinhar os detalhes da minha reserva e tirar algumas dúvidas!`;
}

function buildConciergeWhatsAppLink(params) {
  const message = formatConciergeMessage(params);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Formata valores monetários em Real brasileiro (pt-BR) com separador de milhar (ex.: R$ 2.070,00).
 */
export function formatBRL(val) {
  const num = Number(val || 0);
  const safeNum = Number.isFinite(num) ? num : 0;
  return `R$ ${safeNum.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calcula a quantidade real de passageiros da reserva sem somar entre itens do pacote.
 * Prioriza a reserva pai (pax_adults + pax_children); caso não preenchida, usa Math.max
 * entre os itens e (1 + companions.length).
 */
export function calculatePassengerSummary({
  booking = {},
  items = [],
  companions = [],
  isEnglish = false,
} = {}) {
  const parentAdults = Number(booking?.pax_adults ?? 0);
  const parentChildren = Number(booking?.pax_children ?? 0);
  const safeParentAdults = Number.isFinite(parentAdults) && parentAdults > 0 ? parentAdults : 0;
  const safeParentChildren = Number.isFinite(parentChildren) && parentChildren > 0 ? parentChildren : 0;
  const parentSum = safeParentAdults + safeParentChildren;

  const companionsCount = Array.isArray(companions) ? companions.length : 0;
  const companionsPax = companionsCount > 0 ? 1 + companionsCount : 0;

  let maxItemPax = 0;
  let bestItemAdults = 0;
  let bestItemChildren = 0;

  for (const it of Array.isArray(items) ? items : []) {
    const itAdults = Number(it?.pax_adults ?? 0);
    const itChildren = Number(it?.pax_children ?? 0);
    const safeItAdults = Number.isFinite(itAdults) && itAdults > 0 ? itAdults : 0;
    const safeItChildren = Number.isFinite(itChildren) && itChildren > 0 ? itChildren : 0;
    const itSplitSum = safeItAdults + safeItChildren;
    const rawItPax = Number(it?.pax ?? 0);
    const itPax = Math.max(Number.isFinite(rawItPax) ? rawItPax : 0, itSplitSum);

    if (itPax > maxItemPax) {
      maxItemPax = itPax;
      bestItemAdults = safeItAdults;
      bestItemChildren = safeItChildren;
    } else if (itPax === maxItemPax && bestItemAdults + bestItemChildren === 0 && itSplitSum > 0) {
      bestItemAdults = safeItAdults;
      bestItemChildren = safeItChildren;
    }
  }

  let totalPax;
  let adults = 0;
  let children = 0;

  if (parentSum > 0) {
    totalPax = parentSum;
    adults = safeParentAdults;
    children = safeParentChildren;
  } else {
    totalPax = Math.max(maxItemPax, companionsPax, 1);
    if (bestItemAdults + bestItemChildren === totalPax && (bestItemAdults > 0 || bestItemChildren > 0)) {
      adults = bestItemAdults;
      children = bestItemChildren;
    }
  }

  let label;
  if (isEnglish) {
    const paxWord = totalPax === 1 ? 'person' : 'people';
    if (adults > 0 && children > 0 && adults + children === totalPax) {
      const adultWord = adults === 1 ? 'adult' : 'adults';
      const childWord = children === 1 ? 'child' : 'children';
      label = `${totalPax} ${paxWord} (${adults} ${adultWord}, ${children} ${childWord})`;
    } else {
      label = `${totalPax} ${paxWord}`;
    }
  } else {
    const paxWord = totalPax === 1 ? 'pessoa' : 'pessoas';
    if (adults > 0 && children > 0 && adults + children === totalPax) {
      const adultWord = adults === 1 ? 'adulto' : 'adultos';
      const childWord = children === 1 ? 'criança' : 'crianças';
      label = `${totalPax} ${paxWord} (${adults} ${adultWord}, ${children} ${childWord})`;
    } else {
      label = `${totalPax} ${paxWord}`;
    }
  }

  return { totalPax, adults, children, label };
}

/**
 * Gera assunto, texto simples e HTML do e-mail de voucher a partir da reserva e itens.
 */
export function buildVoucherEmailContent({
  code,
  bookingWithRelations,
  rawItems = [],
  clientGreeting,
  isEnglish = false,
}) {
  const extracted = rawItems.length > 0 ? rawItems : extractItemsFromBooking(bookingWithRelations);
  const items = extracted.length > 0
    ? normalizeReservationItems(bookingWithRelations, extracted)
    : normalizeReservationItems(bookingWithRelations, [{
        service_name: bookingWithRelations.service_name || 'Transfer & Passeio Jericoacoara Premium',
        title: bookingWithRelations.service_name || 'Transfer & Passeio Jericoacoara Premium',
        date_start: bookingWithRelations.date || new Date().toISOString().split('T')[0],
        time_start: bookingWithRelations.time || null,
        pax_adults: bookingWithRelations.pax_adults || 1,
      }]);

  const companions = extractCompanions(bookingWithRelations, extracted);
  const companionsTextList = companions
    .map((c) => (c.type ? `${c.name} (${c.type})` : c.name))
    .join(', ');
  const companionsPillsHtml = companions
    .map(
      (c) =>
        `<span style="display: inline-block; background-color: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16); color: #e2e8f0; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 12px; margin: 2px 4px 2px 0;">${c.name}${c.type ? ` <span style="color: #D4AF37;">· ${c.type}</span>` : ''}</span>`
    )
    .join('');

  const firstItem = items[0] || {};
  const mainServiceName = firstItem.service_name || firstItem.title
    ? formatCleanServiceTitle(firstItem)
    : (isEnglish ? 'Jericoacoara Luxury Tour / Transfer' : 'Transfer & Passeio Jericoacoara Premium');

  const formatDateBr = (isoDate) => {
    if (!isoDate) return isEnglish ? 'To be confirmed' : 'A combinar';
    if (String(isoDate).includes('-')) {
      const [yyyy, mm, dd] = String(isoDate).split('T')[0].split('-');
      return `${dd}/${mm}/${yyyy}`;
    }
    return String(isoDate);
  };

  const formattedDate = formatDateBr(firstItem.date || bookingWithRelations.date);
  const departureTime = firstItem.time || bookingWithRelations.time || null;
  const passengerSummary = calculatePassengerSummary({
    booking: bookingWithRelations,
    items,
    companions,
    isEnglish,
  });

  // Cálculos financeiros dinâmicos baseados no banco (total, pago, saldo, status)
  const financial = computeFinancialSummary(bookingWithRelations, items);

  const amountTotalFormatted = financial.amountTotal > 0 ? formatBRL(financial.amountTotal) : (isEnglish ? 'Confirmed' : 'Confirmado');
  const amountPaidFormatted = formatBRL(financial.amountPaid);
  const remainingFormatted = formatBRL(financial.remainingBalance);

  const paymentMethodRaw = bookingWithRelations?.payment_method || financial.latestPaymentMethod || 'PIX';
  const paymentLabel = formatPaymentMethodLabel(paymentMethodRaw, isEnglish);

  let statusBadgeText;
  let statusBadgeColor = '#2C7A7B';
  let introCopyPlain;
  let introCopyHtml;

  if (financial.isCancelled) {
    statusBadgeText = isEnglish ? 'STATUS: CANCELLED' : 'STATUS: RESERVA CANCELADA';
    statusBadgeColor = '#991b1b';
    introCopyPlain = isEnglish
      ? 'This reservation is currently marked as cancelled in our system.'
      : 'Esta reserva encontra-se cancelada em nosso sistema.';
    introCopyHtml = introCopyPlain;
  } else if (financial.isPaidInFull) {
    statusBadgeText = isEnglish ? 'STATUS: CONFIRMED — PAID IN FULL (100%)' : 'STATUS: CONFIRMADA — PAGAMENTO QUITADO (100%)';
    introCopyPlain = isEnglish
      ? 'Your payment is paid in full (100%) and your reservation is confirmed and guaranteed with Jericoacoara Premium.'
      : 'Seu pagamento foi quitado integralmente (100%) e sua reserva está confirmada e garantida com a Jericoacoara Premium.';
    introCopyHtml = isEnglish
      ? 'Your payment is <strong>paid in full (100%)</strong> and your reservation is <strong>confirmed &amp; guaranteed</strong> with Jericoacoara Premium.'
      : 'Seu pagamento está <strong>100% quitado</strong> e sua reserva está <strong>confirmada e garantida</strong> com a Jericoacoara Premium.';
  } else if (financial.isPartialPaid) {
    statusBadgeText = isEnglish
      ? `STATUS: CONFIRMED — DEPOSIT PAID (${financial.paidPercentage}%)`
      : `STATUS: CONFIRMADA — SINAL PAGO (${financial.paidPercentage}%)`;
    introCopyPlain = isEnglish
      ? `Your ${financial.paidPercentage}% deposit (${amountPaidFormatted}) has been confirmed. The remaining balance of ${remainingFormatted} is due upon boarding.`
      : `Seu sinal de ${financial.paidPercentage}% (${amountPaidFormatted}) foi confirmado e sua reserva está garantida. O saldo restante de ${remainingFormatted} deverá ser quitado no momento do embarque.`;
    introCopyHtml = isEnglish
      ? `Your <strong>${financial.paidPercentage}% deposit (${amountPaidFormatted})</strong> is confirmed and your reservation is guaranteed. The remaining balance of <strong>${remainingFormatted}</strong> is due upon boarding.`
      : `Seu <strong>sinal de ${financial.paidPercentage}% (${amountPaidFormatted})</strong> foi confirmado e sua reserva está garantida. O saldo restante de <strong>${remainingFormatted}</strong> deve ser quitado no momento do embarque.`;
  } else if (financial.isConfirmed) {
    statusBadgeText = isEnglish ? 'STATUS: CONFIRMED' : 'STATUS: RESERVA CONFIRMADA';
    introCopyPlain = isEnglish
      ? 'Your reservation is confirmed with Jericoacoara Premium.'
      : 'Sua reserva está confirmada com a Jericoacoara Premium.';
    introCopyHtml = isEnglish
      ? 'Your reservation is <strong>confirmed</strong> with Jericoacoara Premium.'
      : 'Sua reserva está <strong>confirmada</strong> com a Jericoacoara Premium.';
  } else {
    statusBadgeText = isEnglish ? 'STATUS: AWAITING PAYMENT CONFIRMATION' : 'STATUS: PROVISÓRIO — AGUARDANDO PAGAMENTO';
    statusBadgeColor = '#b45309';
    introCopyPlain = isEnglish
      ? 'Your reservation has been registered and is awaiting payment confirmation to release boarding.'
      : 'Sua reserva foi registrada e está aguardando a confirmação do pagamento para liberação do embarque.';
    introCopyHtml = isEnglish
      ? 'Your reservation is registered and <strong>awaiting payment confirmation</strong> to release boarding.'
      : 'Sua reserva foi registrada e está <strong>aguardando confirmação do pagamento</strong> para liberação do embarque.';
  }

  const voucherUrl = `https://jericoacoarapremium.com/voucher/${code}`;
  const conciergeWhatsAppUrl = buildConciergeWhatsAppLink({
    serviceName: items.length > 1 ? `${mainServiceName} + ${items.length - 1} serviços` : mainServiceName,
    code,
    date: formattedDate,
    isEnglish,
  });

  // Renderização compacta e agrupada por categoria (Transfers vs. Passeios) para HTML e Plain-Text
  const transferItems = items.filter((it) => isTransferService(it));
  const tourItems = items.filter((it) => !isTransferService(it));

  const renderTransferHtml = (it, idx, total) => {
    const itName = formatCleanServiceTitle(it) || `Transfer ${idx + 1}`;
    const itDate = formatDateBr(it.date);
    const itTime = it.time ? ` ${isEnglish ? 'at' : 'às'} ${it.time}h` : '';
    const itVehicle = formatModalityLabel(it);
    const returnDate = formatDateBr(it.date_end);
    const returnTime = it.time_end ? ` ${isEnglish ? 'at' : 'às'} ${it.time_end}h` : '';

    const scheduleHtml = it.isRoundTrip
      ? `<span style="color: #34d399; font-weight: 700;">${isEnglish ? 'Outbound' : 'Ida'}:</span> ${itDate}${itTime} <span style="color: #64748b; margin: 0 4px;">·</span> <span style="color: #67e8f9; font-weight: 700;">${isEnglish ? 'Return' : 'Volta'}:</span> ${returnDate}${returnTime}`
      : `<span style="color: #34d399; font-weight: 700;">${isEnglish ? 'Outbound' : 'Ida'}:</span> ${itDate}${itTime} <span style="color: #94a3b8;">(${isEnglish ? 'One-way' : 'Somente Ida'})</span>`;

    return `
      <div style="padding: 8px 0; border-bottom: ${idx < total - 1 ? '1px dashed rgba(255,255,255,0.12)' : 'none'};">
        <div style="margin-bottom: 4px;">
          <strong style="color: #ffffff; font-size: 13px;">${itName}</strong>
          <span style="display: inline-block; background-color: rgba(44,122,123,0.35); color: #a7f3d0; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 6px; vertical-align: middle;">${itVehicle}</span>
        </div>
        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          ${scheduleHtml}
        </div>
      </div>
    `;
  };

  const renderTourHtml = (it, idx, total) => {
    const itName = formatCleanServiceTitle(it) || (isEnglish ? `Tour ${idx + 1}` : `Passeio ${idx + 1}`);
    const itDate = formatDateBr(it.date);
    const itTime = it.time ? ` ${isEnglish ? 'at' : 'às'} ${it.time}h` : ` · ${isEnglish ? 'Time to be confirmed' : 'Horário a combinar'}`;
    const itVehicle = formatModalityLabel(it);

    return `
      <div style="padding: 8px 0; border-bottom: ${idx < total - 1 ? '1px dashed rgba(255,255,255,0.12)' : 'none'};">
        <div style="margin-bottom: 4px;">
          <strong style="color: #ffffff; font-size: 13px;">${itName}</strong>
          <span style="display: inline-block; background-color: rgba(44,122,123,0.35); color: #a7f3d0; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 6px; vertical-align: middle;">${itVehicle}</span>
        </div>
        <div style="font-size: 12px; color: #a2c4c5; line-height: 1.5;">
          📅 ${itDate}${itTime}
        </div>
      </div>
    `;
  };

  const htmlSections = [];
  if (transferItems.length > 0) {
    htmlSections.push(`
      <div style="margin-bottom: ${tourItems.length > 0 ? '12px' : '0'};">
        <div style="font-size: 11px; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 4px; margin-bottom: 4px;">
          🚘 ${isEnglish ? 'Transfers' : 'Transfers &amp; Translados'}
        </div>
        ${transferItems.map((it, idx) => renderTransferHtml(it, idx, transferItems.length)).join('')}
      </div>
    `);
  }
  if (tourItems.length > 0) {
    htmlSections.push(`
      <div>
        <div style="font-size: 11px; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 4px; margin-bottom: 4px;">
          🧭 ${isEnglish ? 'Tours &amp; Experiences' : 'Passeios &amp; Experiências'}
        </div>
        ${tourItems.map((it, idx) => renderTourHtml(it, idx, tourItems.length)).join('')}
      </div>
    `);
  }
  const servicesListHtml = htmlSections.join('');

  const voucherDetailsNotePlain = isEnglish
    ? 'View full pickup locations and boarding instructions in your Digital Voucher below.'
    : 'Consulte locais de embarque e orientações completas no seu Voucher Digital abaixo.';

  const textSections = [];
  if (transferItems.length > 0) {
    textSections.push(
      `  [${isEnglish ? 'TRANSFERS' : 'TRANSFERS & TRANSLADOS'}]\n` +
        transferItems
          .map((it, idx) => {
            const itName = formatCleanServiceTitle(it);
            const itDate = formatDateBr(it.date);
            const itTime = it.time ? ` ${isEnglish ? 'at' : 'às'} ${it.time}h` : '';
            const itVehicle = formatModalityLabel(it);
            const returnDate = formatDateBr(it.date_end);
            const returnTime = it.time_end ? ` ${isEnglish ? 'at' : 'às'} ${it.time_end}h` : '';
            const scheduleLine = it.isRoundTrip
              ? `${isEnglish ? 'Outbound' : 'Ida'}: ${itDate}${itTime} | ${isEnglish ? 'Return' : 'Volta'}: ${returnDate}${returnTime}`
              : `${isEnglish ? 'Outbound' : 'Ida'}: ${itDate}${itTime} (${isEnglish ? 'One-way' : 'Somente Ida'})`;
            return `  ${idx + 1}. ${itName} [${itVehicle}]\n     ${scheduleLine}`;
          })
          .join('\n')
    );
  }
  if (tourItems.length > 0) {
    textSections.push(
      `  [${isEnglish ? 'TOURS & EXPERIENCES' : 'PASSEIOS & EXPERIÊNCIAS'}]\n` +
        tourItems
          .map((it, idx) => {
            const itName = formatCleanServiceTitle(it);
            const itDate = formatDateBr(it.date);
            const itTime = it.time ? ` ${isEnglish ? 'at' : 'às'} ${it.time}h` : ` (${isEnglish ? 'time TBD' : 'horário a combinar'})`;
            const itVehicle = formatModalityLabel(it);
            return `  ${idx + 1}. ${itName} [${itVehicle}] — ${itDate}${itTime}`;
          })
          .join('\n')
    );
  }
  const servicesListText = `${textSections.join('\n\n')}\n  ${voucherDetailsNotePlain}`;

  const serviceSubjectSnippet = items.length > 1
    ? (isEnglish ? `${mainServiceName} + ${items.length - 1} services` : `${mainServiceName} + ${items.length - 1} serviços`)
    : mainServiceName;

  const emailSubject = isEnglish
    ? `Booking Voucher #${code} — Jericoacoara Premium (${serviceSubjectSnippet})`
    : `Voucher de Reserva #${code} — Jericoacoara Premium (${serviceSubjectSnippet})`;

  const plainTextContent = isEnglish
    ? `JERICOACOARA PREMIUM — ${financial.isPending ? 'PROVISIONAL BOOKING VOUCHER' : 'OFFICIAL BOOKING VOUCHER & BOARDING PASS'}

Hello, ${clientGreeting}

${introCopyPlain}

--------------------------------------------------
BOOKING LOCATOR / VOUCHER CODE: ${code}
${statusBadgeText}
--------------------------------------------------

RESERVATION DETAILS:
${companions.length > 0 ? `- Booking Holder: ${clientGreeting}\n- Companions: ${companionsTextList}\n` : ''}${servicesListText}
- Date & Time: ${items.length > 1 ? `${formattedDate} (${items.length} scheduled services)` : `${formattedDate}${departureTime ? ` at ${departureTime}h` : ''}`}
- Passengers: ${passengerSummary.label}
- Total Amount: ${amountTotalFormatted}
- Amount Paid: ${financial.amountPaid > 0 ? `${amountPaidFormatted} (${paymentLabel})` : `${amountPaidFormatted} (Pending)`}${financial.remainingBalance > 0 ? `\n- Balance Due on Boarding: ${remainingFormatted}` : ''}

INCLUDED IN YOUR PREMIUM EXPERIENCE:
* Accredited professional driver and local guide
* Exclusive 4x4 / certified vehicle prepared for dunes and beaches
* Complete Cadastur license, passenger insurance & safety protocol
* 24/7 Digital Concierge assistance via WhatsApp

QUICK ACCESS LINKS:
- Access Your Digital Voucher:
  ${voucherUrl}

- Speak with Concierge on WhatsApp:
  ${conciergeWhatsAppUrl}

IMPORTANT BOARDING GUIDELINES:
1. Have your digital voucher ready on your phone upon boarding.
2. Be ready at your pickup point 15 minutes in advance.
3. Ensure you have the Sustainable Tourism Tax voucher if entering Jericoacoara.

--------------------------------------------------
Jericoacoara Premium | Certified Travel & Transportation Agency
CNPJ & CADASTUR Active · 24/7 VIP Concierge: +55 (88) 98846-3182
Vila de Jericoacoara, Jijoca de Jericoacoara - CE, Brazil
`
    : `JERICOACOARA PREMIUM — ${financial.isPending ? 'VOUCHER PROVISÓRIO DE RESERVA' : 'VOUCHER OFICIAL DE RESERVA E EMBARQUE'}

Olá, ${clientGreeting}

${introCopyPlain}

--------------------------------------------------
CÓDIGO LOCALIZADOR / VOUCHER: ${code}
${statusBadgeText}
--------------------------------------------------

DETALHES DA SUA RESERVA:
${companions.length > 0 ? `- Titular: ${clientGreeting}\n- Acompanhantes: ${companionsTextList}\n` : ''}${servicesListText}
- Data & Horário: ${items.length > 1 ? `${formattedDate} (${items.length} serviços agendados)` : `${formattedDate}${departureTime ? ` às ${departureTime}h` : ''}`}
- Passageiros: ${passengerSummary.label}
- Valor Total: ${amountTotalFormatted}
- Valor Pago: ${financial.amountPaid > 0 ? `${amountPaidFormatted} (${paymentLabel})` : `${amountPaidFormatted} (Pendente)`}${financial.remainingBalance > 0 ? `\n- Saldo no Embarque: ${remainingFormatted}` : ''}

O QUE ESTÁ INCLUSO NA SUA EXPERIÊNCIA:
* Motorista e guia credenciado local com ampla experiência
* Veículo 4x4 ou jardineira credenciada e revisada para trilhas e dunas
* Seguro de viagem, conformidade integral CADASTUR e segurança ativa
* Suporte operacional e Concierge VIP 24h via WhatsApp

LINKS DE ACESSO RÁPIDO:
- Acesse seu Voucher Digital:
  ${voucherUrl}

- Fale com o Concierge no WhatsApp (Alinhamento de embarque):
  ${conciergeWhatsAppUrl}

ORIENTAÇÕES IMPORTANTES DE EMBARQUE:
1. Apresente este voucher digital no celular ao motorista no momento do embarque.
2. Esteja pronto no ponto de embarque acordado com 15 minutos de antecedência.
3. Mantenha a Taxa de Turismo Sustentável de Jericoacoara paga em mãos.

--------------------------------------------------
Jericoacoara Premium | Agência Licenciada & Transportes Credenciados
CNPJ & CADASTUR Ativos · Atendimento e Concierge 24h: +55 (88) 98846-3182
Vila de Jericoacoara, Jijoca de Jericoacoara - CE, Brasil
`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="${isEnglish ? 'en' : 'pt-BR'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>
    .cta-btn, .cta-btn span { color: #ffffff !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1315; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1315; padding: 25px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #0f1e20; border-radius: 16px; border: 1px solid rgba(212, 175, 55, 0.4); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Luxury Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #091314 0%, #173235 100%); padding: 32px 28px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <div style="margin-bottom: 6px;">
                <span style="font-size: 26px; font-weight: 900; letter-spacing: 3px; color: #D4AF37;">JERICOACOARA</span>
                <span style="background-color: #D4AF37; color: #0b1315; font-size: 11px; font-weight: 900; padding: 2px 7px; border-radius: 4px; vertical-align: middle; letter-spacing: 1px; margin-left: 4px;">PREMIUM</span>
              </div>
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a2c4c5; letter-spacing: 2px; text-transform: uppercase;">
                ${financial.isPending
                  ? (isEnglish ? 'Provisional Booking Voucher' : 'Voucher Provisório de Reserva')
                  : (isEnglish ? 'Official Booking Voucher & VIP Boarding Pass' : 'Voucher Oficial de Reserva e Embarque')}
              </p>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="padding: 28px 28px 12px 28px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #ffffff;">
                ${isEnglish ? `Hello, ${clientGreeting}` : `Olá, ${clientGreeting}`}
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                ${introCopyHtml}
              </p>
            </td>
          </tr>

          <!-- Highlighted Voucher Box -->
          <tr>
            <td style="padding: 10px 24px 20px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #14272a; border: 1.5px solid #D4AF37; border-radius: 12px; padding: 18px 16px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 800; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase;">
                      ${isEnglish ? 'BOOKING LOCATOR / VOUCHER CODE' : 'CÓDIGO LOCALIZADOR / VOUCHER'}
                    </p>
                    <p style="margin: 0 0 10px 0; font-family: monospace, Courier, sans-serif; font-size: 21px; font-weight: 900; color: #D4AF37; letter-spacing: 1.5px; white-space: nowrap; word-break: keep-all;">
                      ${code}
                    </p>
                    <div style="display: inline-block; background-color: ${statusBadgeColor}; color: #ffffff; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; letter-spacing: 0.5px;">
                      ${financial.isPending ? '⏳' : '✓'} ${statusBadgeText}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reservation Details Grid -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #122123; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden;">
                ${companions.length > 0 ? `
                <tr>
                  <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <div style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                      ${isEnglish ? 'Holder &amp; Companions' : 'Titular &amp; Acompanhantes'}
                    </div>
                    <div style="color: #ffffff; font-size: 13px;">
                      <div style="font-weight: 700; margin-bottom: 6px;">${clientGreeting}</div>
                      <div>${companionsPillsHtml}</div>
                    </div>
                  </td>
                </tr>` : ''}
                <tr>
                  <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <div style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
                      ${isEnglish ? 'Service(s)' : 'Serviço(s)'}
                    </div>
                    <div style="color: #ffffff; font-size: 13px;">
                      ${servicesListHtml}
                      <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #94a3b8; line-height: 1.45;">
                        ${voucherDetailsNotePlain}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 40%; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${isEnglish ? 'Passengers' : 'Passageiros'}
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 13px; font-weight: 700; text-align: right;">
                    ${passengerSummary.label}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 40%; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${isEnglish ? 'Total Amount' : 'Valor Total'}
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 13px; font-weight: 700; text-align: right;">
                    ${amountTotalFormatted}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; ${financial.remainingBalance > 0 ? 'border-bottom: 1px solid rgba(255,255,255,0.06); ' : ''}width: 40%; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${financial.isPartialPaid ? (isEnglish ? 'Deposit Paid' : 'Valor Pago (Sinal)') : (isEnglish ? 'Amount Paid' : 'Valor Pago')}
                  </td>
                  <td style="padding: 12px 18px; ${financial.remainingBalance > 0 ? 'border-bottom: 1px solid rgba(255,255,255,0.06); ' : ''}color: ${financial.amountPaid > 0 ? '#34d399' : '#fbbf24'}; font-size: 14px; font-weight: 800; text-align: right;">
                    ${amountPaidFormatted} <span style="font-size: 11px; color: #94a3b8; font-weight: normal;">(${financial.amountPaid > 0 ? paymentLabel : (isEnglish ? 'Pending' : 'Pendente')})</span>
                  </td>
                </tr>
                ${financial.remainingBalance > 0 ? `
                <tr>
                  <td style="padding: 12px 18px; width: 40%; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${isEnglish ? 'Balance on Boarding' : 'Saldo no Embarque'}
                  </td>
                  <td style="padding: 12px 18px; color: #fbbf24; font-size: 14px; font-weight: 800; text-align: right;">
                    ${remainingFormatted}
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Summary: What is Included -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1719; border-radius: 12px; border: 1px solid rgba(44, 122, 123, 0.3); padding: 16px 18px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">
                      ✦ ${isEnglish ? 'Included in Your Premium Experience' : 'O Que Está Incluso na Sua Experiência'}
                    </p>
                    <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.8; color: #cbd5e1;">
                      <li>${isEnglish ? 'Accredited professional driver and local guide' : 'Motorista e guia credenciado local com ampla experiência'}</li>
                      <li>${isEnglish ? 'Exclusive 4x4 / certified vehicle prepared for dunes and beaches' : 'Veículo 4x4 ou jardineira credenciada e revisada para trilhas'}</li>
                      <li>${isEnglish ? 'Complete Cadastur license, passenger insurance & safety protocol' : 'Seguro de viagem, conformidade integral CADASTUR e segurança ativa'}</li>
                      <li>${isEnglish ? '24/7 Digital Concierge assistance via WhatsApp' : 'Suporte operacional e Concierge VIP 24h via WhatsApp'}</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTAs: 2 Prominent Action Buttons -->
          <tr>
            <td style="padding: 0 24px 28px 24px; text-align: center;">
              
              <!-- CTA 1: Access Digital Voucher -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="${voucherUrl}" target="_blank" class="cta-btn" style="display: block; width: 88%; max-width: 440px; background-color: #2C7A7B; color: #ffffff !important; -webkit-text-fill-color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 15px 20px; border-radius: 10px; text-align: center; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(44, 122, 123, 0.45);">
                      <span style="color: #ffffff !important; -webkit-text-fill-color: #ffffff;">📄 ${isEnglish ? 'Access Official Digital Voucher' : 'Acessar Meu Voucher Digital Oficial'}</span>
                    </a>
                  </td>
                </tr>
              </table>

              <!-- CTA 2: WhatsApp Concierge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%;">
                <tr>
                  <td align="center">
                    <a href="${conciergeWhatsAppUrl}" target="_blank" class="cta-btn" style="display: block; width: 88%; max-width: 440px; background-color: #25D366; color: #ffffff !important; -webkit-text-fill-color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 15px 20px; border-radius: 10px; text-align: center; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);">
                      <span style="color: #ffffff !important; -webkit-text-fill-color: #ffffff;">💬 ${isEnglish ? 'Speak with Concierge on WhatsApp' : 'Falar com o Concierge no WhatsApp'}</span>
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Quick Guidelines -->
          <tr>
            <td style="padding: 18px 28px; background-color: #0b1416; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; line-height: 1.6; color: #94a3b8;">
              <p style="margin: 0 0 6px 0; font-weight: bold; color: #cbd5e1;">
                ℹ ${isEnglish ? 'Important Boarding Guidelines:' : 'Orientações Importantes de Embarque:'}
              </p>
              <p style="margin: 0 0 4px 0;">• ${isEnglish ? 'Have your digital voucher ready on your phone upon boarding.' : 'Apresente este voucher digital no celular ao motorista no momento do embarque.'}</p>
              <p style="margin: 0 0 4px 0;">• ${isEnglish ? 'Be ready at your pickup point 15 minutes in advance.' : 'Esteja pronto no ponto de embarque acordado com 15 minutos de antecedência.'}</p>
              <p style="margin: 0;">• ${isEnglish ? 'Ensure you have the Sustainable Tourism Tax voucher if entering Jericoacoara.' : 'Mantenha a Taxa de Turismo Sustentável de Jericoacoara paga em mãos.'}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 28px; background-color: #070d0e; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 4px 0; color: #94a3b8; font-weight: bold;">
                Jericoacoara Premium | Agência Licenciada & Transportes Credenciados
              </p>
              <p style="margin: 0 0 4px 0;">
                CNPJ & CADASTUR Ativos · Atendimento e Concierge 24 horas: +55 (88) 98846-3182
              </p>
              <p style="margin: 0;">
                Vila de Jericoacoara, Jijoca de Jericoacoara - CE, Brasil
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return {
    emailSubject,
    plainTextContent,
    htmlContent,
    voucherUrl,
    passengerSummary,
    financial,
    items,
    companions,
  };
}

export default async function handler(req, res) {
  // 1. Suporte amplo a CORS (permite requisições do próprio site e do painel HotelOps)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = req.body || {};
    const code = (body.code || body.reservationCode || '').toString().trim().toUpperCase();
    const forceResend = Boolean(body.forceResend || body.force_resend);

    if (!code) {
      return res.status(400).json({ error: 'Código do voucher é obrigatório.' });
    }

    // 2. Verificação de Idempotência em memória rápida (ignorada em disparos manuais com forceResend)
    if (!forceResend && sentEmailCodesCache.has(code)) {
      console.log(`[Send Voucher Email] Idempotência (memória): Email para ${code} já enviado anteriormente.`);
      return res.status(200).json({ success: true, alreadySent: true, message: 'Email já enviado previamente.' });
    }

    const supabase = getSupabaseAdmin();

    // 3. Buscar os dados mais recentes da reserva diretamente no Supabase (sincronia com HotelOps e Webhooks)
    let resData = null;
    let dbCustomer = null;
    let dbItems = [];
    let dbPayments = [];

    try {
      const { data, error } = await supabase
        .from('agency_reservations')
        .select('*')
        .ilike('reservation_code', code)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('[Send Voucher Email] Aviso ao consultar reserva no Supabase:', error);
      } else if (data) {
        resData = data;

        if (data.customer_id) {
          const { data: custData, error: custErr } = await supabase
            .from('agency_customers')
            .select('id, name, whatsapp, email')
            .eq('id', data.customer_id)
            .maybeSingle();
          if (custErr) console.warn('[Send Voucher Email] Aviso ao consultar agency_customers:', custErr);
          if (custData) dbCustomer = custData;
        }

        if (data.id) {
          const [{ data: itemsData, error: itemsErr }, { data: payData, error: payErr }] = await Promise.all([
            supabase.from('agency_reservation_items').select('*').eq('reservation_id', data.id),
            supabase.from('agency_payments').select('*').eq('reservation_id', data.id),
          ]);
          if (itemsErr) console.warn('[Send Voucher Email] Aviso ao consultar agency_reservation_items:', itemsErr);
          if (payErr) console.warn('[Send Voucher Email] Aviso ao consultar agency_payments:', payErr);
          if (Array.isArray(itemsData)) dbItems = itemsData;
          if (Array.isArray(payData)) dbPayments = payData;
        }
      }
    } catch (dbErr) {
      console.warn('[Send Voucher Email] Erro ao consultar Supabase:', dbErr);
    }

    // 4. Verificação de Idempotência no banco de dados (ignorada em disparos manuais com forceResend)
    if (!forceResend && resData?.notes && resData.notes.includes('[EMAIL_VOUCHER_ENVIADO]')) {
      sentEmailCodesCache.add(code);
      console.log(`[Send Voucher Email] Idempotência (DB): Email para ${code} já constava como enviado.`);
      return res.status(200).json({ success: true, alreadySent: true, message: 'Email já enviado previamente.' });
    }

    // Identificar e-mail do destinatário
    const rawEmail = body.email || dbCustomer?.email || '';
    const cleanEmail = rawEmail && !rawEmail.toLowerCase().includes('example.com') ? rawEmail.trim() : '';

    if (!cleanEmail) {
      console.warn(`[Send Voucher Email] E-mail do cliente não informado para o voucher ${code}. Envio ignorado.`);
      return res.status(200).json({ success: false, reason: 'missing_email', message: 'E-mail do cliente não cadastrado.' });
    }

    // 5. Se o usuário passou email no body e a reserva ainda não tinha email salvo no Supabase, atualiza o banco
    if (cleanEmail && supabase) {
      try {
        if (resData?.customer_id) {
          const currentEmail = dbCustomer?.email || '';
          if (!currentEmail || currentEmail.trim() === '' || currentEmail.toLowerCase().includes('example.com')) {
            await supabase
              .from('agency_customers')
              .update({ email: cleanEmail })
              .eq('id', resData.customer_id);
            console.log(`[Send Voucher Email] agency_customers (${resData.customer_id}) atualizado com o e-mail: ${cleanEmail}`);
          }
        } else if (resData?.id) {
          const clientNameFallback = body.clientName || 'Cliente Jericoacoara Premium';
          const { data: newCust } = await supabase
            .from('agency_customers')
            .insert([{
              name: clientNameFallback,
              email: cleanEmail,
              whatsapp: body.phone || body.whatsapp || null,
            }])
            .select('id')
            .single();

          if (newCust?.id) {
            await supabase
              .from('agency_reservations')
              .update({ customer_id: newCust.id })
              .eq('id', resData.id);
            console.log(`[Send Voucher Email] Cliente criado (${newCust.id}) e vinculado à reserva ${code}: ${cleanEmail}`);
          }
        }
      } catch (updateCustErr) {
        console.warn('[Send Voucher Email] Erro ao sincronizar e-mail do cliente no Supabase:', updateCustErr);
      }
    }

    // 6. Extrair parâmetros com prioridade DB -> body -> defaults
    const isEnglish = Boolean(
      body.isEnglish !== undefined
        ? body.isEnglish
        : (resData?.payment_method === 'stripe' || (resData?.notes && resData.notes.includes('Stripe')))
    );

    const rawCustomerName = (
      body.clientName ||
      dbCustomer?.name ||
      ''
    ).trim();

    const isGenericOrEmptyName =
      !rawCustomerName ||
      rawCustomerName.toLowerCase().includes('cliente especial') ||
      rawCustomerName.toLowerCase().includes('valued customer') ||
      rawCustomerName.toLowerCase().includes('cliente site') ||
      rawCustomerName.toLowerCase().includes('cliente jericoacoara');

    const clientGreeting = isGenericOrEmptyName
      ? (isEnglish ? 'Traveler' : 'viajante')
      : rawCustomerName;

    // Itens contratados (suporte a pacotes múltiplos cadastrados no HotelOps)
    const bookingWithRelations = resData
      ? {
          ...resData,
          agency_customers: dbCustomer,
          agency_reservation_items: dbItems,
          agency_payments: dbPayments,
        }
      : {
          service_name: body.serviceName || null,
          date: body.date || new Date().toISOString().split('T')[0],
          time: body.time || null,
          pax_adults: body.pax_adults !== undefined && body.pax_adults !== null
            ? Number(body.pax_adults)
            : (body.passengers !== undefined && body.passengers !== null ? Number(body.passengers) : null),
          pax_children: body.pax_children !== undefined && body.pax_children !== null
            ? Number(body.pax_children)
            : null,
          price_final: Number(body.fullTotal || body.amountPaid || 0),
          amount_paid: Number(body.amountPaid || 0),
          payment_method: body.paymentMethod || 'PIX',
          payment_status: Number(body.amountPaid || 0) > 0 ? 'sinal_pago' : 'pendente',
          reservation_status: Number(body.amountPaid || 0) > 0 ? 'confirmada' : 'pendente',
          agency_reservation_items: [],
          agency_payments: [],
        };

    const {
      emailSubject,
      plainTextContent,
      htmlContent,
      voucherUrl,
    } = buildVoucherEmailContent({
      code,
      bookingWithRelations,
      clientGreeting,
      isEnglish,
    });

    // 11. Enviar via Resend API com Entregabilidade Anti-Spam (Plain-text, reply_to e headers transacionais)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Jericoacoara Premium <contato@jericoacoarapremium.com>';
    const replyToEmail = process.env.RESEND_REPLY_TO || 'contato@jericoacoarapremium.com';

    let emailSentSuccessfully = false;

    if (RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: cleanEmail,
            reply_to: replyToEmail,
            headers: {
              'X-Entity-Ref-ID': code,
            },
            subject: emailSubject,
            html: htmlContent,
            text: plainTextContent,
          }),
        });

        const resendResult = await resendResponse.json().catch(() => ({}));

        if (resendResponse.ok) {
          console.log(`[Send Voucher Email] E-mail enviado com sucesso via Resend para ${cleanEmail}. ID:`, resendResult.id);
          emailSentSuccessfully = true;
        } else {
          console.warn('[Send Voucher Email] Erro retornado pela API da Resend:', resendResult);
          // Fallback caso o domínio customizado de remetente ainda esteja pendente de verificação no Resend
          if (resendResult?.message && resendResult.message.includes('domain')) {
            console.log('[Send Voucher Email] Tentando envio com remetente de fallback da Resend (onboarding@resend.dev)...');
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: 'Jericoacoara Premium <onboarding@resend.dev>',
                to: cleanEmail,
                reply_to: replyToEmail,
                headers: {
                  'X-Entity-Ref-ID': code,
                },
                subject: emailSubject,
                html: htmlContent,
                text: plainTextContent,
              }),
            });
            if (fallbackRes.ok) {
              console.log('[Send Voucher Email] Fallback Resend bem sucedido!');
              emailSentSuccessfully = true;
            }
          }
        }
      } catch (sendErr) {
        console.error('[Send Voucher Email] Exceção na chamada Resend:', sendErr);
      }
    } else {
      console.log(`[Send Voucher Email - Modo Simulação] RESEND_API_KEY não configurada. E-mail simulado com sucesso para ${cleanEmail}. Voucher: ${voucherUrl}`);
      emailSentSuccessfully = true;
    }

    // 12. Atualizar idempotência em memória e no banco de dados
    sentEmailCodesCache.add(code);

    if (resData?.id) {
      try {
        const currentNotes = resData.notes || '';
        const tag = forceResend
          ? `[EMAIL_VOUCHER_REENVIADO_MANUAL:${new Date().toISOString()}]`
          : `[EMAIL_VOUCHER_ENVIADO:${new Date().toISOString()}]`;

        const updatedNotes = currentNotes ? `${currentNotes} | ${tag}` : tag;

        await supabase
          .from('agency_reservations')
          .update({
            notes: updatedNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', resData.id);
      } catch (updateErr) {
        console.warn('[Send Voucher Email] Não foi possível gravar flag no banco:', updateErr);
      }
    }

    return res.status(200).json({
      success: true,
      delivered: emailSentSuccessfully,
      code,
      recipient: cleanEmail,
      subject: emailSubject,
      message: forceResend
        ? 'Voucher reenviado com sucesso para o cliente.'
        : 'Voucher enviado com sucesso para o cliente.',
    });
  } catch (globalErr) {
    console.error('[Send Voucher Email] Erro global não tratado:', globalErr);
    return res.status(500).json({ error: 'Erro interno ao processar envio de voucher por e-mail.' });
  }
}
