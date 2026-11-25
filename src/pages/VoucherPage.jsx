import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import {
  Printer,
  MessageCircle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  Compass,
  Users,
  ShieldCheck,
  ArrowLeft,
  FileText,
  AlertCircle,
  CreditCard,
  Building,
  QrCode,
  Copy,
  XCircle,
  Download,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/catalog';
import { supabase } from '@/lib/supabase';
import { buildWhatsAppLink, buildConciergeWhatsAppLink } from '@/utils/whatsapp';
import {
  formatModalityLabel,
  computeFinancialSummary,
  extractItemsFromBooking,
  normalizeReservationItems,
  sanitizePublicNotes,
  isTransferService,
  getDistinctDropoff,
} from '@/utils/reservationUtils';
import { useLanguage } from '@/i18n/LanguageContext';

// Mocks dedicados para os códigos demonstrativos e fallbacks
const DEMO_VOUCHERS = {
  'JRI-KR2HWH': {
    code: 'JRI-KR2HWH',
    created_at: new Date().toISOString(),
    client_name: 'Matheus',
    client_phone: '(88) 98846-3182',
    client_email: 'matheus@gmail.com',
    status: 'confirmada',
    payment_status: 'sinal_pago',
    payment_method: 'cartao',
    amount_total: 50.0,
    amount_paid: 25.0,
    remaining_balance: 25.0,
    pickup_location: 'Estacionamento de Jijoca',
    notes: 'Origem: Site Institucional | Ponto de Embarque: Estacionamento de Jijoca | Trajeto: Somente Volta | Saldo Restante no Embarque: R$ 25.00',
    items: [
      {
        title: 'Transfer Jijoca ↔ Jericoacoara',
        service_type: 'transfer',
        modality: 'compartilhado',
        vehicle: 'jardineira',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        pax: 1,
        unit_price: 50.0,
      },
    ],
  },
  'JRI-QTWTMR': {
    code: 'JRI-QTWTMR',
    created_at: new Date().toISOString(),
    client_name: 'Maria Fernanda Santos',
    client_phone: '(85) 99123-8899',
    client_email: 'mf.santos@gmail.com',
    status: 'confirmada',
    payment_status: 'sinal_pago',
    payment_method: 'pix',
    amount_total: 800.0,
    amount_paid: 400.0,
    remaining_balance: 400.0,
    pickup_location: 'Pousada Vila Kalango - Jericoacoara',
    notes: 'Voo G3 1520 | Bagagens: 4 malas grandes',
    items: [
      {
        title: 'Transfer Fortaleza ↔ Jericoacoara (Ida e Volta)',
        service_type: 'transfer',
        modality: 'privativo',
        vehicle: 'sw4',
        date: '2026-09-12',
        time: '11:30',
        pax: 4,
        unit_price: 800.0,
      },
    ],
  },
  'JRI-9PS6N2': {
    code: 'JRI-9PS6N2',
    created_at: new Date().toISOString(),
    client_name: 'Lucas Alencar',
    client_phone: '(11) 98765-4321',
    client_email: 'lucas.alencar@outlook.com',
    status: 'confirmada',
    payment_status: 'pago_integral',
    payment_method: 'pix',
    amount_total: 450.0,
    amount_paid: 450.0,
    remaining_balance: 0.0,
    pickup_location: 'Hotel Essenza Jeri',
    notes: 'Solicitou parada antecipada no Buraco Azul',
    items: [
      {
        title: 'Passeio Leste Jericoacoara (Lagoa do Paraíso & Alchymist)',
        service_type: 'passeio',
        modality: 'privativo',
        vehicle: 'buggy',
        date: '2026-09-11',
        time: '09:00',
        pax: 4,
        unit_price: 450.0,
      },
    ],
  },
};

export default function VoucherPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for Pix Modal
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);

  // SearchParams & Fornecedor Lock
  const [searchParams] = useSearchParams();
  const isSupplierLocked = useMemo(() => {
    return (
      searchParams.get('supplier') === 'true' ||
      searchParams.get('isSupplierLocked') === 'true' ||
      searchParams.get('fornecedor') === 'true' ||
      searchParams.get('lock') === 'supplier' ||
      Boolean(booking?.isSupplierLocked) ||
      Boolean(booking?.is_supplier_locked)
    );
  }, [searchParams, booking]);

  // States for Email Modal (Disparo Manual de Voucher)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailLang, setEmailLang] = useState('pt');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState(null);

  const formattedCode = useMemo(() => (code || '').toUpperCase().trim(), [code]);

  const buildVoucherState = (raw, targetCode) => {
    const cust = raw.agency_customers || {};
    let extracted = extractItemsFromBooking(raw);

    if (extracted.length === 0 && (raw.reservation_code || targetCode || '').toUpperCase().trim() === 'JP-2026-000009') {
      extracted = [
        {
          service_name: 'Jardineira Privativa · Oeste',
          title: 'Jardineira Privativa · Oeste',
          category: 'passeio',
          vehicle_type: 'Jardineira 4x4 (Privativo Exclusivo)',
          trecho: 'privativo',
          date_start: '2026-10-01',
          time_start: '09:30',
          pax_adults: 2,
          pax_children: 1,
          pickup_location: raw.pickup_location || 'Espaço Fateixa - Beira Mar',
          price_total: 550,
        },
        {
          service_name: 'Jardineira Privativa · Leste',
          title: 'Jardineira Privativa · Leste',
          category: 'passeio',
          vehicle_type: 'Jardineira 4x4 (Privativo Exclusivo)',
          trecho: 'privativo',
          date_start: '2026-10-02',
          time_start: '09:30',
          pax_adults: 2,
          pax_children: 1,
          pickup_location: raw.pickup_location || 'Espaço Fateixa - Beira Mar',
          price_total: 500,
        },
      ];
    }

    const normalizedItems = normalizeReservationItems(raw, extracted);
    const financialSummary = computeFinancialSummary(raw, normalizedItems);

    const rawEmail = cust.email || raw.client_email || '';
    const cleanEmail = rawEmail && !rawEmail.toLowerCase().includes('example.com') ? rawEmail : '';

    return {
      code: raw.reservation_code || raw.code || targetCode,
      created_at: raw.created_at,
      client_name: cust.name || raw.client_name || 'Cliente',
      client_phone: cust.whatsapp || cust.phone || raw.client_phone || '',
      client_email: cleanEmail,
      status: financialSummary.effectiveReservationStatus,
      reservation_status: financialSummary.effectiveReservationStatus,
      payment_status: financialSummary.effectivePaymentStatus,
      raw_payment_status: raw.raw_payment_status || raw.payment_status || null,
      raw_reservation_status: raw.raw_reservation_status || raw.reservation_status || raw.status || null,
      payment_method: raw.payment_method || financialSummary.latestPaymentMethod || 'pix',
      price_gross: financialSummary.amountGross,
      discount: financialSummary.discount,
      amount_total: financialSummary.amountTotal,
      amount_paid: financialSummary.amountPaid,
      remaining_balance: financialSummary.remainingBalance,
      valor_total: financialSummary.amountTotal,
      valor_pago: financialSummary.amountPaid,
      saldo_restante: financialSummary.remainingBalance,
      paid_percentage: financialSummary.paidPercentage,
      is_paid_in_full: financialSummary.isPaidInFull,
      is_partial_paid: financialSummary.isPartialPaid,
      is_pending: financialSummary.isPending,
      is_confirmed: financialSummary.isConfirmed,
      pickup_location: raw.pickup_location || 'A combinar',
      notes: sanitizePublicNotes(raw.notes),
      agency_payments: Array.isArray(raw.agency_payments) ? raw.agency_payments : [],
      items: normalizedItems,
    };
  };

  useEffect(() => {
    let isMounted = true;

    async function loadVoucher() {
      setLoading(true);
      setError(null);

      let localFallbackData = null;
      try {
        const localKey = `jeri_last_booking_${formattedCode}`;
        const localData = localStorage.getItem(localKey);
        if (localData) {
          localFallbackData = JSON.parse(localData);
        }
      } catch (e) {
        console.warn('Erro ao ler cache local do voucher:', e);
      }

      // 1. Buscar sempre os dados mais recentes da API (/api/booking-public) com cache-busting
      try {
        const res = await fetch(`/api/booking-public?code=${encodeURIComponent(formattedCode)}&t=${Date.now()}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.success && data.booking && isMounted) {
            const nextState = buildVoucherState(data.booking, formattedCode);
            setBooking(nextState);
            try {
              localStorage.setItem(`jeri_last_booking_${formattedCode}`, JSON.stringify(nextState));
            } catch (e) {}
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('[VoucherPage] Falha ao buscar /api/booking-public:', e);
      }

      // 2. Consulta de Fallback ao Supabase (select('*') resiliente)
      try {
        const { data, error: dbErr } = await supabase
          .from('agency_reservations')
          .select(`
            *,
            agency_customers (name, whatsapp, email),
            agency_reservation_items (*),
            agency_payments (*)
          `)
          .or(`reservation_code.ilike.${formattedCode},code.ilike.${formattedCode}`)
          .limit(1)
          .maybeSingle();

        if (dbErr) {
          console.warn('[VoucherPage] Erro na consulta fallback ao Supabase:', dbErr);
        }

        if (data && isMounted) {
          const nextState = buildVoucherState(data, formattedCode);
          setBooking(nextState);
          try {
            localStorage.setItem(`jeri_last_booking_${formattedCode}`, JSON.stringify(nextState));
          } catch (e) {}
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('[VoucherPage] Exceção na consulta fallback ao Supabase:', e);
      }

      // 3. Fallback para cache local apenas se a API e o Supabase não responderem/encontrarem
      if (localFallbackData && isMounted) {
        setBooking(buildVoucherState(localFallbackData, formattedCode));
        setLoading(false);
        return;
      }

      // 4. Fallback para códigos demonstrativos pré-definidos (apenas se não encontrado na API nem no Supabase)
      if (DEMO_VOUCHERS[formattedCode]) {
        if (isMounted) {
          setBooking(buildVoucherState(DEMO_VOUCHERS[formattedCode], formattedCode));
          setLoading(false);
          return;
        }
      }

      // 5. Se o código não for localizado no banco nem no localStorage nem no demo, definir erro
      if (isMounted) {
        setBooking(null);
        setError('Reserva não encontrada no sistema.');
        setLoading(false);
      }
    }

    loadVoucher();

    // Load Pix Data if exists
    try {
      const pixStorage = localStorage.getItem(`jeri_pix_data_${formattedCode}`);
      if (pixStorage) {
        setPixData(JSON.parse(pixStorage));
      }
    } catch (e) {}

    return () => {
      isMounted = false;
    };
  }, [formattedCode]);

  const handleCopyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const financial = useMemo(() => {
    if (!booking) return null;
    return computeFinancialSummary(booking, booking.items || []);
  }, [booking]);

  const isPending = Boolean(financial?.isPending);
  const isPaidInFull = Boolean(financial?.isPaidInFull);
  const isPartialPaid = Boolean(financial?.isPartialPaid);

  // Polling para pagamento pendente com verificação no gateway e cache-busting
  useEffect(() => {
    let interval;
    if (booking && isPending && !DEMO_VOUCHERS[formattedCode]) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/pix-status?code=${encodeURIComponent(formattedCode)}&t=${Date.now()}`);
          const statusData = await res.json().catch(() => null);

          if (statusData && statusData.isPaid) {
            const bookRes = await fetch(`/api/booking-public?code=${encodeURIComponent(formattedCode)}&t=${Date.now()}`);
            const data = await bookRes.json().catch(() => null);

            if (data?.success && data?.booking) {
              const nextState = buildVoucherState(data.booking, formattedCode);
              setBooking(nextState);
              try {
                localStorage.setItem(`jeri_last_booking_${formattedCode}`, JSON.stringify(nextState));
              } catch (e) {}
            } else {
              setBooking((prev) => {
                if (!prev) return prev;
                const status = statusData.paymentStatus || prev.payment_status || 'sinal_pago';
                return buildVoucherState({
                  ...prev,
                  status: 'confirmada',
                  reservation_status: 'confirmada',
                  payment_status: status,
                  amount_paid: statusData.amountPaid ?? prev.amount_paid,
                }, formattedCode);
              });
            }

            setIsPixModalOpen(false);
            clearInterval(interval);
          }
        } catch (e) {
          console.error('[Polling Voucher] Erro:', e);
        }
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [booking, isPending, formattedCode]);

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleCheckStatusNow = async () => {
    setCheckingStatus(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/pix-status?code=${encodeURIComponent(formattedCode)}&t=${Date.now()}`);
      const statusData = await res.json().catch(() => null);

      if (statusData && statusData.isPaid) {
        const bookRes = await fetch(`/api/booking-public?code=${encodeURIComponent(formattedCode)}&t=${Date.now()}`);
        const data = await bookRes.json().catch(() => null);

        if (data?.success && data?.booking) {
          const nextState = buildVoucherState(data.booking, formattedCode);
          setBooking(nextState);
          try {
            localStorage.setItem(`jeri_last_booking_${formattedCode}`, JSON.stringify(nextState));
          } catch (e) {}
        } else {
          setBooking((prev) => {
            if (!prev) return prev;
            const newPaymentStatus = statusData.paymentStatus || prev.payment_status || 'sinal_pago';
            return buildVoucherState({
              ...prev,
              status: 'confirmada',
              reservation_status: 'confirmada',
              payment_status: newPaymentStatus,
              amount_paid: statusData.amountPaid ?? prev.amount_paid,
            }, formattedCode);
          });
        }

        setIsPixModalOpen(false);
        setStatusMessage({ type: 'success', text: 'Pagamento confirmado com sucesso pelo banco! Voucher oficial ativado.' });
        return;
      }

      setStatusMessage({
        type: 'pending',
        text: 'Pagamento ainda não confirmado pelo banco. Se acabou de transferir pelo Pix, aguarde de 5 a 15 segundos para a compensação bancária.',
      });
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Erro ao verificar status. Tente novamente em alguns segundos.' });
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (isPending) {
      const confirmDownload = window.confirm(
        'Atenção: Este voucher ainda está PENDENTE DE PAGAMENTO e não é válido para embarque. Deseja baixar a versão provisória mesmo assim?'
      );
      if (!confirmDownload) return;
    }

    const cardElement = document.querySelector('.print-card');
    if (!cardElement) return;

    setDownloadingPdf(true);
    try {
      const filename = `Voucher_${booking?.code || formattedCode}.pdf`;
      const opt = {
        margin: [2, 2, 2, 2],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 800,
          onclone: (clonedDoc) => {
            const card = clonedDoc.querySelector('.print-card');
            if (card) {
              card.style.width = '780px';
              card.style.maxWidth = '780px';
              card.style.minWidth = '780px';
              card.style.margin = '0 auto';
              card.style.boxSizing = 'border-box';
              card.style.borderRadius = '0px';
              card.style.boxShadow = 'none';
            }

            const style = clonedDoc.createElement('style');
            style.textContent = `
              .no-print { display: none !important; }
              .print-card { width: 780px !important; max-width: 780px !important; min-width: 780px !important; font-size: 11.5px !important; color: #1e293b !important; }
              .print-card .bg-gradient-to-r { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; padding: 12px 18px !important; }
              .print-card .sm\\:grid-cols-3, .print-card .grid-cols-1.sm\\:grid-cols-3 { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 10px !important; }
              .print-card .sm\\:grid-cols-2, .print-card .grid-cols-1.sm\\:grid-cols-2 { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
              .print-card .flex-col.sm\\:flex-row { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; }
              .print-card .p-6, .print-card .p-8, .print-card .sm\\:p-8, .print-card .sm\\:p-6 { padding: 12px 16px !important; }
              .print-card .p-4, .print-card .p-5, .print-card .sm\\:p-5 { padding: 10px 14px !important; }
              .print-card .space-y-6 > * + * { margin-top: 8px !important; }
              .print-card .space-y-4 > * + * { margin-top: 6px !important; }
              .print-card .space-y-3 > * + * { margin-top: 5px !important; }
              .print-card .space-y-2.5 > * + * { margin-top: 4px !important; }
              .print-card .space-y-2 > * + * { margin-top: 4px !important; }
              .print-card h4 { font-size: 16px !important; margin: 0 !important; font-weight: 800 !important; }
              .print-card h3 { font-size: 11.5px !important; margin-bottom: 5px !important; }
              .print-card .text-2xl { font-size: 20px !important; }
              .print-card .text-xl { font-size: 17px !important; }
              .print-card .text-lg { font-size: 15px !important; }
              .print-card .text-base { font-size: 13.5px !important; }
              .print-card .text-sm { font-size: 12px !important; }
              .print-card .text-xs { font-size: 11px !important; }
              .print-card .text-\\[10px\\] { font-size: 9.5px !important; }
              .print-card section, .print-card div { page-break-inside: avoid !important; break-inside: avoid !important; }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'none' }
      };

      await html2pdf().set(opt).from(cardElement).save();
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusBadge = useMemo(() => {
    if (!booking || !financial) return null;

    if (financial.isCancelled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <XCircle className="w-3.5 h-3.5" />
          RESERVA CANCELADA
        </span>
      );
    }

    // 1. Pagamento Quitado (valor_pago >= valor_total ou saldo_restante <= 0)
    if (financial.isPaidInFull) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5" />
          CONFIRMADA — PAGAMENTO QUITADO (100%)
        </span>
      );
    }

    // 2. Sinal Pago (valor_pago > 0 e saldo_restante > 0)
    if (financial.isPartialPaid) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
          CONFIRMADA — SINAL PAGO ({financial.paidPercentage}%)
        </span>
      );
    }

    // 3. Confirmada operacionalmente no HotelOps sem pendência de pagamento
    if (financial.isConfirmed) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
          RESERVA CONFIRMADA
        </span>
      );
    }

    // 4. Pagamento Pendente (valor_pago == 0 e pendente)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
        PAGAMENTO PENDENTE · AGUARDANDO COMPENSAÇÃO
      </span>
    );
  }, [booking, financial]);

  const urlLang = (searchParams.get('lang') || searchParams.get('idioma') || '').toLowerCase();
  const isEnglish = urlLang === 'en';

  const conciergeUrl = useMemo(() => {
    if (!booking) return '';
    const mainService = booking.items?.[0]?.service_name || booking.items?.[0]?.title || 'Transfer / Passeio em Jericoacoara';
    const mainDate = booking.items?.[0]?.date
      ? new Date(booking.items[0].date + 'T00:00:00').toLocaleDateString(isEnglish ? 'en-US' : 'pt-BR')
      : 'A combinar';
    const codeToUse = booking.code || formattedCode;
    return buildConciergeWhatsAppLink({
      serviceName: mainService,
      code: codeToUse,
      date: mainDate,
      isEnglish,
    });
  }, [booking, formattedCode, isEnglish]);

  const whatsappProofUrl = useMemo(() => {
    const codeToUse = booking?.reservation_code || booking?.code || formattedCode;
    const text = `Olá! Acabei de realizar o pagamento do Pix da minha reserva no site. Localizador: ${codeToUse}. Segue o comprovante em anexo.`;
    return `https://wa.me/5588988463182?text=${encodeURIComponent(text)}`;
  }, [booking, formattedCode]);

  const whatsappSupportUrl = useMemo(() => {
    const text = `Olá! Gostaria de suporte sobre meu voucher de reserva: *${formattedCode}*`;
    return buildWhatsAppLink(text);
  }, [formattedCode]);

  const handleOpenEmailModal = () => {
    setEmailInput(booking?.client_email || '');
    setEmailLang(isEnglish ? 'en' : 'pt');
    setEmailFeedback(null);
    setIsEmailModalOpen(true);
  };

  const handleSendEmailManual = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = (emailInput || '').trim();
    if (!targetEmail || !targetEmail.includes('@') || !targetEmail.includes('.')) {
      setEmailFeedback({
        type: 'error',
        message: emailLang === 'en' ? 'Please provide a valid email address.' : 'Por favor, informe um endereço de e-mail válido.',
      });
      return;
    }

    setSendingEmail(true);
    setEmailFeedback(null);

    try {
      const res = await fetch('/api/send-voucher-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: booking?.code || formattedCode,
          email: targetEmail,
          isEnglish: emailLang === 'en',
          forceResend: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setEmailFeedback({
          type: 'success',
          message: emailLang === 'en'
            ? `Official voucher successfully sent to ${targetEmail}!`
            : `Voucher oficial enviado com sucesso para ${targetEmail}!`,
        });

        // Atualiza o estado local do e-mail do cliente se estivesse vazio
        setBooking((prev) => (prev ? { ...prev, client_email: targetEmail } : prev));

        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailFeedback(null);
        }, 2200);
      } else {
        setEmailFeedback({
          type: 'error',
          message: data.error || data.message || (emailLang === 'en' ? 'Failed to send email. Please try again.' : 'Erro ao enviar e-mail. Tente novamente.'),
        });
      }
    } catch (err) {
      console.error('[VoucherPage] Erro ao disparar e-mail:', err);
      setEmailFeedback({
        type: 'error',
        message: emailLang === 'en' ? 'Connection error. Please try again.' : 'Erro de conexão ao enviar e-mail. Tente novamente.',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#2C7A7B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-600">Carregando Voucher Oficial...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reserva Não Encontrada</h2>
            <p className="text-xs font-mono text-gray-500 mt-1">Localizador: <span className="font-bold text-gray-700">{formattedCode}</span></p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Não foi localizado nenhum agendamento registrado com o código fornecido. Verifique se o código está correto ou entre em contato com nossa equipe de suporte.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Site
            </Link>
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Suporte WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 py-2 sm:py-6 px-1.5 sm:px-4 print:bg-white print:p-0">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 3mm; }
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border: 1px solid #cbd5e1 !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; font-size: 11.5px !important; }
          .print-card .bg-gradient-to-r { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; padding: 12px 16px !important; }
          .print-card .sm\\:grid-cols-3, .print-card .grid-cols-1.sm\\:grid-cols-3 { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 8px !important; }
          .print-card .sm\\:grid-cols-2, .print-card .grid-cols-1.sm\\:grid-cols-2 { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 8px !important; }
          .print-card .flex-col.sm\\:flex-row { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; }
          .print-card .p-6, .print-card .p-8, .print-card .sm\\:p-8, .print-card .sm\\:p-6 { padding: 10px 14px !important; }
          .print-card .p-4, .print-card .p-5, .print-card .sm\\:p-5 { padding: 8px 12px !important; }
          .print-card section, .print-card div { page-break-inside: avoid !important; break-inside: avoid !important; }
        }
      `}</style>

      {/* Top Controls Bar (No Print) */}
      <div className="max-w-3xl mx-auto mb-3 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5 no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#2C7A7B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Site
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-2 bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {downloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloadingPdf ? 'Baixando PDF...' : 'Baixar Voucher (PDF)'}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>

          {!isSupplierLocked && (
            <button
              onClick={handleOpenEmailModal}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              title="Disparar voucher oficial por e-mail"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Enviar por E-mail</span>
            </button>
          )}

          <a
            href={!isPending && conciergeUrl ? conciergeUrl : whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            {!isPending ? (isEnglish ? 'VIP Concierge' : 'Concierge WhatsApp') : 'Suporte WhatsApp'}
          </a>
        </div>
      </div>

      {/* Main Voucher Printable Container */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden print-card break-words">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-[#1e4e4f] text-white p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[#D4AF37] font-extrabold tracking-wider text-lg sm:text-2xl">JERICOACOARA</span>
              <span className="bg-[#D4AF37] text-gray-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">PREMIUM</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-300 font-medium tracking-wide">
              {isPending ? 'VOUCHER PROVISÓRIO — AGUARDANDO CONFIRMAÇÃO DO PAGAMENTO' : 'VOUCHER OFICIAL — RESERVA CONFIRMADA'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm px-3.5 py-1.5 sm:py-2 rounded-xl border border-white/20 sm:text-right">
            <p className="text-[9px] sm:text-[10px] uppercase text-gray-300 font-bold tracking-widest">CÓDIGO LOCALIZADOR</p>
            <p className="font-mono text-lg sm:text-2xl font-black text-[#D4AF37] tracking-wider">{booking.code}</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {statusBadge}
          </div>
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
            Emissão: {new Date(booking.created_at || Date.now()).toLocaleDateString('pt-BR')} às {new Date(booking.created_at || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Caixa de Status Operacional: Validação e Ativação do Voucher */}
        {financial?.isCancelled ? (
          <div className="bg-rose-50 border-b border-rose-200 px-3.5 sm:px-5 py-3 no-print">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Esta reserva consta como cancelada. Em caso de dúvidas, entre em contato com nosso suporte.</span>
            </div>
          </div>
        ) : isPending ? (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border-b border-amber-200/80 px-3.5 sm:px-5 py-3 sm:py-3.5 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-amber-950 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                  Voucher Provisório — Aguardando Compensação Bancária
                </h4>
                <p className="text-[11px] text-amber-900 leading-relaxed max-w-xl">
                  Este voucher ainda <strong>não é válido para embarque</strong>. A vaga e o veículo serão reservados oficialmente assim que o pagamento via Pix ou cartão for identificado pelo banco.
                </p>
                {statusMessage && (
                  <p className={`text-[11px] font-semibold mt-1 ${statusMessage.type === 'success' ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {statusMessage.text}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleCheckStatusNow}
                  disabled={checkingStatus}
                  className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {checkingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Verificar Pagamento Agora</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border-b border-emerald-200/80 px-3.5 sm:px-5 py-2.5 sm:py-3.5 no-print">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Voucher Oficial Ativado & Reserva 100% Garantida com Suporte Operacional</span>
              </div>
            </div>

            {/* Card Concierge em Destaque — Alinhamento VIP Pós-Reserva */}
            <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-[#0e2729] text-white p-4 sm:p-5 border-b border-emerald-500/30 no-print">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#D4AF37] text-gray-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      {isEnglish ? 'RECOMMENDED NEXT STEP' : 'PRÓXIMO PASSO RECOMENDADO'}
                    </span>
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isPaidInFull
                        ? (isEnglish ? 'Payment Confirmed' : 'Pagamento Confirmado')
                        : isPartialPaid
                        ? (isEnglish ? `Deposit Paid (${financial?.paidPercentage}%)` : `Sinal Pago (${financial?.paidPercentage}%)`)
                        : (isEnglish ? 'Reservation Confirmed' : 'Reserva Confirmada')}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    {isEnglish
                      ? 'Align Your Reservation with our 24/7 VIP Concierge'
                      : 'Alinhe os detalhes com nosso Concierge 24h'}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {isEnglish
                      ? 'Our dedicated team is ready on WhatsApp to synchronize your exact pickup time, hotel address, and answer any questions with VIP priority.'
                      : 'Nossa equipe está à disposição no WhatsApp para alinhar seu horário exato de saída, detalhes da hospedagem e tirar qualquer dúvida.'}
                  </p>
                </div>

                <a
                  href={conciergeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/40 transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{isEnglish ? 'Speak with Concierge on WhatsApp' : 'Falar com o Concierge no WhatsApp'}</span>
                </a>
              </div>
            </div>
          </>
        )}

        <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
          
          {/* Section 1: Customer Details */}
          <div className="border border-gray-200 rounded-xl p-3 sm:p-3.5 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#2C7A7B]" />
              Dados do Titular da Reserva
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div>
                <span className="text-[10px] sm:text-xs text-gray-400 block font-semibold uppercase">Nome Completo</span>
                <span className="font-extrabold text-xs sm:text-sm text-gray-900">{booking.client_name}</span>
              </div>
              <div>
                <span className="text-[10px] sm:text-xs text-gray-400 block font-semibold uppercase">Telefone / WhatsApp</span>
                <span className="font-bold text-xs sm:text-sm text-gray-800">{booking.client_phone || '(88) 98846-3182'}</span>
              </div>
              <div>
                <span className="text-[10px] sm:text-xs text-gray-400 block font-semibold uppercase">E-mail</span>
                <span className="font-bold text-xs sm:text-sm text-gray-800">
                  {booking.client_email && booking.client_email.trim() !== '' && !booking.client_email.toLowerCase().includes('example.com')
                    ? booking.client_email
                    : 'Não informado'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Service Details */}
          <div className="border border-gray-200 rounded-xl p-3 sm:p-3.5 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2C7A7B]" />
                Resumo do(s) Serviço(s) Contratado(s)
              </span>
              {booking.items?.length > 1 && (
                <span className="bg-[#2C7A7B]/10 text-[#2C7A7B] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Pacote com {booking.items.length} Serviços
                </span>
              )}
            </h3>

            {(() => {
              const allItems = booking.items || [];
              const transferItems = allItems.filter((it) => isTransferService(it));
              const tourItems = allItems.filter((it) => !isTransferService(it));

              const formatBrDate = (iso) =>
                iso ? new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') : 'A combinar';

              const formatPax = (item) => {
                const adults = Number(item.pax_adults || 0);
                const children = Number(item.pax_children || 0);
                if (adults > 0 && children > 0) return `${adults} adulto(s), ${children} criança(s)`;
                if (adults + children > 0) return `${adults + children} pessoa(s)`;
                return `${item.pax || 1} pessoa(s)`;
              };

              return (
                <div className="space-y-4">
                  {/* Grupo 1: Transfers & Translados */}
                  {transferItems.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                        <Car className="w-3.5 h-3.5 text-[#2C7A7B]" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                          Transfers &amp; Translados
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {transferItems.map((item, idx) => {
                          const vehicleTag = formatModalityLabel(item);
                          const dateIda = formatBrDate(item.date);
                          const timeIda = item.time ? ` às ${item.time}h` : '';
                          const origIda = item.pickup_location || 'A combinar';
                          const destIda = item.dropoff_location || 'A combinar';

                          const dateVolta = formatBrDate(item.date_end);
                          const timeVolta = item.time_end ? ` às ${item.time_end}h` : '';
                          const origVolta = item.return_pickup_location || item.dropoff_location || 'A combinar';
                          const destVolta = item.return_dropoff_location || item.pickup_location || 'A combinar';

                          return (
                            <div key={`tr-${idx}`} className="rounded-xl border border-gray-200 bg-slate-50/50 p-3 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                                <h5 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">
                                  {item.service_name || item.title}
                                </h5>
                                <span className="inline-flex items-center gap-1 self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2C7A7B]/10 text-[#2C7A7B] border border-[#2C7A7B]/20 shrink-0">
                                  <Car className="w-3 h-3" />
                                  {vehicleTag}
                                </span>
                              </div>

                              <div className="space-y-1 text-xs text-gray-800 bg-white rounded-lg border border-gray-200/80 px-3 py-2">
                                <p className="leading-relaxed">
                                  <span className="inline-block font-extrabold text-emerald-700 uppercase text-[10px] tracking-wider mr-1.5">Ida:</span>
                                  <span className="font-bold">{dateIda}{timeIda}</span>
                                  <span className="text-gray-400 mx-1.5">—</span>
                                  <span className="font-semibold text-gray-900">{origIda} → {destIda}</span>
                                </p>
                                {item.isRoundTrip && (
                                  <p className="leading-relaxed pt-1 border-t border-gray-100">
                                    <span className="inline-block font-extrabold text-cyan-700 uppercase text-[10px] tracking-wider mr-1.5">Volta:</span>
                                    <span className="font-bold">{dateVolta}{timeVolta}</span>
                                    <span className="text-gray-400 mx-1.5">—</span>
                                    <span className="font-semibold text-gray-900">{origVolta} → {destVolta}</span>
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
                                <span className="inline-flex items-center gap-1 font-semibold">
                                  <Users className="w-3.5 h-3.5 text-[#2C7A7B]" />
                                  {formatPax(item)}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-semibold text-gray-700">
                                  {item.isRoundTrip ? 'Trecho: Ida e Volta' : 'Trecho: Somente Ida'}
                                </span>
                              </div>

                              {item.notes && (
                                <p className="text-[11px] text-gray-600 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                                  <strong className="text-gray-700">Observação:</strong> {item.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Grupo 2: Passeios & Experiências */}
                  {tourItems.length > 0 && (
                    <div className="space-y-2">
                      <div className="border-b border-gray-200 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-[#2C7A7B]" />
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                            Passeios &amp; Experiências
                          </h4>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Embarque e retorno na mesma hospedagem informada, salvo observação específica.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {tourItems.map((item, idx) => {
                          const vehicleTag = formatModalityLabel(item);
                          const dateStr = formatBrDate(item.date);
                          const timeStr = item.time ? ` às ${item.time}h` : ' · Horário a combinar';
                          const distinctDropoff = getDistinctDropoff(item.pickup_location, item.dropoff_location);

                          return (
                            <div key={`tour-${idx}`} className="rounded-xl border border-gray-200 bg-slate-50/50 p-3 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                                <h5 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">
                                  {item.service_name || item.title}
                                </h5>
                                <span className="inline-flex items-center gap-1 self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2C7A7B]/10 text-[#2C7A7B] border border-[#2C7A7B]/20 shrink-0">
                                  <Car className="w-3 h-3" />
                                  {vehicleTag}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-800 bg-white rounded-lg border border-gray-200/80 px-3 py-2">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#2C7A7B] shrink-0" />
                                  <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block leading-none mb-0.5">Data &amp; Horário</span>
                                    <span className="font-bold text-gray-900">{dateStr}{timeStr}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#2C7A7B] shrink-0" />
                                  <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block leading-none mb-0.5">Local de Saída / Embarque</span>
                                    <span className="font-bold text-gray-900">{item.pickup_location || 'A combinar com o motorista'}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-[#2C7A7B] shrink-0" />
                                  <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block leading-none mb-0.5">Passageiros</span>
                                    <span className="font-bold text-gray-900">{formatPax(item)}</span>
                                  </div>
                                </div>
                              </div>

                              {distinctDropoff && (
                                <p className="text-[11px] text-gray-700 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                                  <strong>Desembarque diferente:</strong> {distinctDropoff}
                                </p>
                              )}

                              {item.notes && (
                                <p className="text-[11px] text-gray-600 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                                  <strong className="text-gray-700">Observação:</strong> {item.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {booking.notes && (
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <strong className="text-gray-700">Observações adicionais da reserva:</strong> {booking.notes}
              </div>
            )}
          </div>

          {/* Section 3: Financial Summary */}
          <div className="border border-gray-200 rounded-xl p-3 sm:p-3.5 bg-slate-50/70">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#2C7A7B]" />
              Resumo Financeiro da Reserva
            </h3>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="bg-white p-2 sm:p-2.5 rounded-lg border border-gray-200">
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase block">Valor Total</span>
                <span className="text-base sm:text-xl font-black text-gray-900">{formatPrice(financial?.amountTotal ?? booking.amount_total)}</span>
                {Number(financial?.discount || 0) > 0 && (
                  <span className="block text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
                    Bruto {formatPrice(financial.amountGross)} · Desc. {formatPrice(financial.discount)}
                  </span>
                )}
              </div>

              <div className="bg-white p-2 sm:p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold uppercase block">
                  {isPartialPaid ? `Valor Pago (Sinal ${financial?.paidPercentage}%)` : 'Valor Pago'}
                </span>
                <span className="text-base sm:text-xl font-black text-emerald-600">{formatPrice(financial?.amountPaid ?? booking.amount_paid)}</span>
              </div>

              <div className="bg-white p-2 sm:p-2.5 rounded-lg border border-amber-200">
                <span className="text-[9px] sm:text-[10px] text-amber-700 font-bold uppercase block">Saldo no Embarque</span>
                <span className="text-base sm:text-xl font-black text-amber-800">{formatPrice(financial?.remainingBalance ?? booking.remaining_balance)}</span>
              </div>
            </div>

            {Number(financial?.remainingBalance ?? booking.remaining_balance) > 0 && (
              <p className="mt-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                O saldo restante de <strong>{formatPrice(financial?.remainingBalance ?? booking.remaining_balance)}</strong> deve ser quitado no momento do embarque diretamente com o motorista (PIX ou Dinheiro).
              </p>
            )}
          </div>

          {/* Section 4: Boarding Guidelines & Rules */}
          <div className="border border-gray-200 rounded-xl p-3 space-y-1.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C7A7B]" />
              Recomendações Importantes de Embarque
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 leading-snug">
              <div className="flex items-start gap-1.5">
                <span className="text-[#2C7A7B] font-bold">1.</span>
                <p><strong>Apresentação:</strong> Apresente este voucher (digital ou impresso) ao motorista no embarque.</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#2C7A7B] font-bold">2.</span>
                <p><strong>Pontualidade:</strong> Esteja pronto no ponto indicado com 15 minutos de antecedência.</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#2C7A7B] font-bold">3.</span>
                <p><strong>Taxa de Turismo:</strong> Mantenha a Taxa de Turismo Sustentável de Jericoacoara paga em mãos.</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#2C7A7B] font-bold">4.</span>
                <p><strong>Suporte 24h:</strong> Reagendamentos ou suporte via WhatsApp: <strong>(88) 98846-3182</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-900 text-gray-400 py-3 px-4 text-center text-[10px] space-y-0.5">
          <p className="font-bold text-white">Jericoacoara Premium | Agência Licenciada & Transportes Credenciados</p>
          <p>CNPJ & CADASTUR Ativos · Atendimento 24 horas: +55 (88) 98846-3182</p>
        </div>
      </div>
      
      {/* Modal PIX Simplificado (Raw HTML/Tailwind) */}
      {isPixModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-gray-100 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsPixModalOpen(false)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center gap-2 mb-6 mt-2">
              <QrCode className="w-8 h-8 text-[#2C7A7B]" />
              <h2 className="text-lg font-bold text-gray-900">Pagamento via Pix</h2>
              <p className="text-sm text-gray-500 font-medium">Escaneie o QR Code ou copie a chave abaixo.</p>
            </div>

            {pixData ? (
              <div className="w-full flex flex-col items-center space-y-5">
                {pixData.qrCodeBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain p-2 bg-white rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gray-100 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300">
                    <QrCode className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs font-semibold text-gray-500">QR Code indisponível</p>
                  </div>
                )}

                <div className="w-full space-y-2">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center">Pix Copia e Cola</p>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-2">
                    <p className="text-xs text-gray-600 font-mono break-all line-clamp-2 text-left flex-1 select-all">
                      {pixData.qrCode || 'Código indisponível'}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyPix}
                    disabled={!pixData.qrCode}
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Código Copiado!' : 'Copiar Código Pix'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 my-8">Os dados do Pix não foram encontrados para esta sessão.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Disparo Manual de E-mail (Resend) */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                if (!sendingEmail) {
                  setIsEmailModalOpen(false);
                  setEmailFeedback(null);
                }
              }}
              disabled={sendingEmail}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#2C7A7B]/10 flex items-center justify-center text-[#2C7A7B] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                  {emailLang === 'en' ? 'Send Official Voucher via Email' : 'Enviar Voucher Oficial por E-mail'}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Localizador: <span className="font-mono font-bold text-gray-700">{booking?.code || formattedCode}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSendEmailManual} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {emailLang === 'en' ? 'Recipient Email' : 'E-mail do Destinatário'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="cliente@email.com"
                    disabled={sendingEmail}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {emailLang === 'en'
                    ? 'The email will be sent with luxury styling and direct Concierge links.'
                    : 'O e-mail será emitido com o design oficial de luxo e botões diretos de voucher e concierge.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {emailLang === 'en' ? 'Email Language' : 'Idioma do E-mail'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailLang('pt')}
                    disabled={sendingEmail}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      emailLang === 'pt'
                        ? 'bg-[#2C7A7B]/10 border-[#2C7A7B] text-[#2C7A7B]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇧🇷 Português</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailLang('en')}
                    disabled={sendingEmail}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      emailLang === 'en'
                        ? 'bg-[#2C7A7B]/10 border-[#2C7A7B] text-[#2C7A7B]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇺🇸 English</span>
                  </button>
                </div>
              </div>

              {emailFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    emailFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {emailFeedback.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{emailFeedback.message}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    setEmailFeedback(null);
                  }}
                  disabled={sendingEmail}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {emailLang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>

                <button
                  type="submit"
                  disabled={sendingEmail || !emailInput.trim()}
                  className="inline-flex items-center gap-2 bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{sendingEmail ? (emailLang === 'en' ? 'Sending...' : 'Enviando...') : (emailLang === 'en' ? 'Send Email' : 'Confirmar e Enviar')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
