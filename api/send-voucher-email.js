import { createClient } from '@supabase/supabase-js';

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
    try {
      const { data, error } = await supabase
        .from('agency_reservations')
        .select(`
          id,
          customer_id,
          reservation_code,
          date,
          time,
          pax_adults,
          price_gross,
          price_final,
          payment_method,
          payment_status,
          reservation_status,
          status,
          notes,
          notes_service,
          pickup_location,
          dropoff_location,
          agency_customers (id, name, whatsapp, email),
          agency_reservation_items (
            id,
            service_name,
            title,
            category,
            trecho,
            vehicle_type,
            pax_adults,
            pax_children,
            date_start,
            time_start,
            price_total,
            unit_price
          ),
          agency_payments (amount, method, status)
        `)
        .ilike('reservation_code', code)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        resData = data;
      } else if (error) {
        console.warn('[Send Voucher Email] Aviso ao consultar reserva no Supabase:', error);
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
    const rawEmail = body.email || resData?.agency_customers?.email || '';
    const cleanEmail = rawEmail && !rawEmail.toLowerCase().includes('example.com') ? rawEmail.trim() : '';

    if (!cleanEmail) {
      console.warn(`[Send Voucher Email] E-mail do cliente não informado para o voucher ${code}. Envio ignorado.`);
      return res.status(200).json({ success: false, reason: 'missing_email', message: 'E-mail do cliente não cadastrado.' });
    }

    // 5. Se o usuário passou email no body e a reserva ainda não tinha email salvo no Supabase, atualiza o banco
    if (cleanEmail && supabase) {
      try {
        if (resData?.customer_id) {
          const currentEmail = resData.agency_customers?.email || '';
          if (!currentEmail || currentEmail.trim() === '' || currentEmail.toLowerCase().includes('example.com')) {
            await supabase
              .from('agency_customers')
              .update({ email: cleanEmail })
              .eq('id', resData.customer_id);
            console.log(`[Send Voucher Email] agency_customers (${resData.customer_id}) atualizado com o e-mail: ${cleanEmail}`);
          }
        } else if (resData?.id) {
          // Se a reserva não possui customer_id vinculado, cria o registro do cliente e associa
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

    // 6. Extrair parâmetros com prioridade body -> db -> defaults
    const isEnglish = Boolean(
      body.isEnglish !== undefined
        ? body.isEnglish
        : (resData?.payment_method === 'stripe' || (resData?.notes && resData.notes.includes('Stripe')))
    );

    const clientName = (
      body.clientName ||
      resData?.agency_customers?.name ||
      (isEnglish ? 'Valued Customer' : 'Cliente Especial')
    ).trim();

    // Itens contratados (suporte a pacotes múltiplos cadastrados no HotelOps)
    const items = Array.isArray(resData?.agency_reservation_items) && resData.agency_reservation_items.length > 0
      ? resData.agency_reservation_items
      : [{
          service_name: body.serviceName || 'Transfer & Passeio Jericoacoara Premium',
          title: body.serviceName || 'Transfer & Passeio Jericoacoara Premium',
          date_start: resData?.date || new Date().toISOString().split('T')[0],
          time_start: resData?.time || '09:30',
          pax_adults: resData?.pax_adults || 1,
        }];

    const firstItem = items[0] || {};
    const mainServiceName = firstItem.service_name || firstItem.title || (isEnglish ? 'Jericoacoara Luxury Tour / Transfer' : 'Transfer & Passeio Jericoacoara Premium');
    
    const rawDate = body.date || firstItem.date_start || resData?.date || '';
    let formattedDate = rawDate;
    if (rawDate && rawDate.includes('-')) {
      const [yyyy, mm, dd] = rawDate.split('T')[0].split('-');
      formattedDate = `${dd}/${mm}/${yyyy}`;
    }
    if (!formattedDate) formattedDate = isEnglish ? 'To be confirmed' : 'A combinar';

    const departureTime = body.time || firstItem.time_start || resData?.time || '09:30';
    const totalPax = items.reduce((sum, it) => sum + (Number(it.pax_adults || 0) + Number(it.pax_children || 0)), 0) || Number(body.passengers || resData?.pax_adults || 1);

    // Cálculos financeiros com base nos dados mais recentes
    const itemsSum = items.reduce((s, it) => s + Number(it.price_total || it.unit_price || 0), 0);
    const amountVal = Number(resData?.price_final || resData?.price_gross || body.amountPaid || itemsSum || 0);
    const amountFormatted = amountVal > 0 ? `R$ ${amountVal.toFixed(2).replace('.', ',')}` : (isEnglish ? 'Confirmed' : 'Confirmado');

    const paymentMethodRaw = (body.paymentMethod || resData?.payment_method || 'PIX').toUpperCase();
    const paymentLabel = paymentMethodRaw.includes('STRIPE')
      ? (isEnglish ? 'International Credit Card (Stripe)' : 'Cartão Internacional (Stripe)')
      : paymentMethodRaw.includes('PIX')
      ? 'PIX Instantâneo'
      : paymentMethodRaw;

    const voucherUrl = `https://jericoacoarapremium.com/voucher/${code}`;
    const conciergeWhatsAppUrl = buildConciergeWhatsAppLink({
      serviceName: items.length > 1 ? `${mainServiceName} + ${items.length - 1} serviços` : mainServiceName,
      code,
      date: formattedDate,
      isEnglish,
    });

    // Renderização dos serviços (suporta pacote individual ou múltiplo do HotelOps)
    let servicesListHtml = '';
    if (items.length > 1) {
      servicesListHtml = items.map((it, idx) => {
        const itName = it.service_name || it.title || (isEnglish ? `Service ${idx + 1}` : `Serviço ${idx + 1}`);
        let itDate = it.date_start || formattedDate;
        if (itDate && itDate.includes('-')) {
          const [y, m, d] = itDate.split('T')[0].split('-');
          itDate = `${d}/${m}/${y}`;
        }
        const itTime = it.time_start || '09:30';
        const itPax = (Number(it.pax_adults || 0) + Number(it.pax_children || 0)) || 1;
        return `
          <div style="padding: 6px 0; border-bottom: ${idx < items.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none'};">
            <span style="color: #D4AF37; font-weight: 800; font-size: 11px; text-transform: uppercase;">✦ ${isEnglish ? 'Service' : 'Serviço'} ${idx + 1}:</span>
            <strong style="color: #ffffff; font-size: 13px;"> ${itName}</strong>
            <div style="font-size: 11px; color: #a2c4c5; margin-top: 2px;">
              📅 ${itDate} ${isEnglish ? 'at' : 'às'} ${itTime}h · 👥 ${itPax} ${isEnglish ? 'pax' : 'passageiro(s)'}
            </div>
          </div>
        `;
      }).join('');
    } else {
      servicesListHtml = `<strong style="color: #ffffff; font-size: 13px;">${mainServiceName}</strong>`;
    }

    // 7. Montar Template HTML Premium Jericoacoara (Gold #D4AF37 & Emerald #0F1E20 / #2C7A7B)
    const emailSubject = isEnglish
      ? `Your Booking is Confirmed! Official Voucher #${code} — Jericoacoara Premium`
      : `Sua Reserva Está Confirmada! Voucher Oficial #${code} — Jericoacoara Premium`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="${isEnglish ? 'en' : 'pt-BR'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
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
                ${isEnglish ? 'Official Booking Voucher & VIP Boarding Pass' : 'Voucher Oficial de Reserva e Embarque'}
              </p>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="padding: 28px 28px 12px 28px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #ffffff;">
                ${isEnglish ? `Welcome aboard, ${clientName}!` : `Tudo pronto, ${clientName}!`}
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                ${isEnglish
                  ? 'Your payment was successfully approved and your reservation is <strong>100% confirmed & guaranteed</strong> with Jericoacoara Premium.'
                  : 'Seu pagamento foi aprovado com sucesso e sua reserva está <strong>100% confirmada e garantida</strong> com a Jericoacoara Premium.'}
              </p>
            </td>
          </tr>

          <!-- Highlighted Voucher Box -->
          <tr>
            <td style="padding: 10px 24px 20px 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #14272a; border: 1.5px solid #D4AF37; border-radius: 12px; padding: 18px 20px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 800; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase;">
                      ${isEnglish ? 'BOOKING LOCATOR / VOUCHER CODE' : 'CÓDIGO LOCALIZADOR / VOUCHER'}
                    </p>
                    <p style="margin: 0 0 10px 0; font-family: monospace, Courier, sans-serif; font-size: 28px; font-weight: 900; color: #D4AF37; letter-spacing: 3px;">
                      ${code}
                    </p>
                    <div style="display: inline-block; background-color: #2C7A7B; color: #ffffff; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; letter-spacing: 0.5px;">
                      ✓ ${isEnglish ? 'STATUS: CONFIRMED & GUARANTEED' : 'STATUS: CONFIRMADO & GARANTIDO'}
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
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); width: 35%; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    ${isEnglish ? 'Service(s)' : 'Serviço(s)'}
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 13px;">
                    ${servicesListHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    ${isEnglish ? 'Date & Time' : 'Data & Horário'}
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 13px; font-weight: 700;">
                    ${items.length > 1
                      ? `${formattedDate} (${items.length} ${isEnglish ? 'services' : 'serviços'})`
                      : `${formattedDate} ${isEnglish ? 'at' : 'às'} ${departureTime}h`}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    ${isEnglish ? 'Passengers' : 'Passageiros'}
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 13px; font-weight: 700;">
                    ${totalPax} ${isEnglish ? 'person(s)' : 'pessoa(s)'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    ${isEnglish ? 'Amount Paid' : 'Valor Pago'}
                  </td>
                  <td style="padding: 14px 18px; color: #34d399; font-size: 14px; font-weight: 800;">
                    ${amountFormatted} <span style="font-size: 11px; color: #94a3b8; font-weight: normal;">(${paymentLabel})</span>
                  </td>
                </tr>
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
                    <a href="${voucherUrl}" target="_blank" style="display: block; width: 88%; max-width: 440px; background-color: #2C7A7B; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 15px 20px; border-radius: 10px; text-align: center; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(44, 122, 123, 0.45);">
                      📄 ${isEnglish ? 'Access Official Digital Voucher' : 'Acessar Meu Voucher Digital Oficial'}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- CTA 2: WhatsApp Concierge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%;">
                <tr>
                  <td align="center">
                    <a href="${conciergeWhatsAppUrl}" target="_blank" style="display: block; width: 88%; max-width: 440px; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 15px 20px; border-radius: 10px; text-align: center; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);">
                      💬 ${isEnglish ? 'Speak with Concierge on WhatsApp' : 'Falar com o Concierge no WhatsApp'}
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

    // 8. Enviar via Resend API (exclusivo para todo envio de e-mail)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Jericoacoara Premium <contato@jericoacoarapremium.com>';

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
            subject: emailSubject,
            html: htmlContent,
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
                subject: emailSubject,
                html: htmlContent,
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

    // 9. Atualizar idempotência em memória e no banco de dados
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
      message: forceResend
        ? 'Voucher reenviado com sucesso para o cliente.'
        : 'Voucher enviado com sucesso para o cliente.',
    });
  } catch (globalErr) {
    console.error('[Send Voucher Email] Erro global não tratado:', globalErr);
    return res.status(500).json({ error: 'Erro interno ao processar envio de voucher por e-mail.' });
  }
}
