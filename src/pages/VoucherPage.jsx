import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Users,
  ShieldCheck,
  ArrowLeft,
  FileText,
  AlertCircle,
  CreditCard,
  Building,
  QrCode,
  Copy,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/catalog';
import { supabase } from '@/lib/supabase';
import { buildWhatsAppLink } from '@/utils/whatsapp';

// Mocks dedicados para os códigos demonstrativos e fallbacks
const DEMO_VOUCHERS = {
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
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for Pix Modal
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);

  const formattedCode = useMemo(() => (code || '').toUpperCase().trim(), [code]);

  useEffect(() => {
    let isMounted = true;

    async function loadVoucher() {
      setLoading(true);
      setError(null);

      // 1. Tentar ler do localStorage local (gerado no checkout recente)
      try {
        const localKey = `jeri_last_booking_${formattedCode}`;
        const localData = localStorage.getItem(localKey);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (isMounted) {
            setBooking(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar voucher do localStorage:', e);
      }

      // 2. Verificar se é um código demonstrativo pré-definido
      if (DEMO_VOUCHERS[formattedCode]) {
        if (isMounted) {
          setBooking(DEMO_VOUCHERS[formattedCode]);
          setLoading(false);
          return;
        }
      }

      // 3. Tentar buscar da API local (/api/booking-public) com cache-busting
      try {
        const res = await fetch(`/api/booking-public?code=${formattedCode}&t=${Date.now()}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.success && data.booking) {
            const b = data.booking;
            const cust = b.agency_customers || {};
            const items = Array.isArray(b.agency_reservation_items) ? b.agency_reservation_items : [];
            const priceFinal = Number(b.price_final || b.amount_total || 0);
            const isDeposit = b.payment_status === 'sinal_pago';
            const amountPaid = Number(b.amount_paid ?? (isDeposit ? priceFinal / 2 : (b.payment_status === 'pago_integral' ? priceFinal : 0)));

            if (isMounted) {
              setBooking({
                code: b.reservation_code || formattedCode,
                created_at: b.created_at,
                client_name: cust.name || b.client_name || 'Cliente',
                client_phone: cust.whatsapp || cust.phone || b.client_phone || '',
                client_email: cust.email || b.client_email || '',
                status: b.reservation_status || b.status || 'pendente',
                payment_status: b.payment_status || 'pendente',
                payment_method: b.payment_method || 'pix',
                amount_total: priceFinal,
                amount_paid: amountPaid,
                remaining_balance: Math.max(0, priceFinal - amountPaid),
                pickup_location: b.pickup_location || 'A combinar',
                notes: b.notes || '',
                items: items.length > 0 ? items.map((it) => ({
                  title: it.title || it.service_name || 'Serviço Jericoacoara',
                  service_type: it.category || 'passeio',
                  vehicle: it.vehicle_type || 'SW4 / Buggy',
                  modality: it.trecho || 'privativo',
                  date: it.date_start || b.date || new Date().toISOString().split('T')[0],
                  time: '11:30',
                  pax: Number(it.pax_adults || b.pax_adults || 1),
                  unit_price: Number(it.price_total || priceFinal),
                })) : [
                  {
                    title: 'Serviço Jericoacoara Premium',
                    service_type: 'passeio',
                    vehicle: 'SW4 / Buggy',
                    modality: 'privativo',
                    date: b.date || new Date().toISOString().split('T')[0],
                    time: '11:30',
                    pax: Number(b.pax_adults || 1),
                    unit_price: priceFinal,
                  }
                ],
              });
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // ignore
      }

      // 4. Consulta de Fallback ao Supabase
      try {
        const { data, error: dbErr } = await supabase
          .from('agency_reservations')
          .select(`
            id,
            reservation_code,
            created_at,
            date,
            pax_adults,
            pickup_location,
            price_gross,
            price_final,
            payment_method,
            payment_status,
            reservation_status,
            agency_customers (name, whatsapp, email),
            agency_reservation_items (title, service_name, vehicle_type, category, date_start, pax_adults, price_total)
          `)
          .or(`reservation_code.eq.${formattedCode},code.eq.${formattedCode}`)
          .maybeSingle();

        if (data && isMounted) {
          const cust = data.agency_customers || {};
          const items = data.agency_reservation_items || [];
          const priceFinal = Number(data.price_final || 0);
          const isDeposit = data.payment_status === 'sinal_pago';
          const amountPaid = isDeposit ? priceFinal / 2 : (data.payment_status === 'pago_integral' ? priceFinal : 0);

          setBooking({
            code: data.reservation_code || formattedCode,
            created_at: data.created_at,
            client_name: cust.name || 'Cliente',
            client_phone: cust.whatsapp || '',
            client_email: cust.email || '',
            status: data.reservation_status || 'pendente',
            payment_status: data.payment_status || 'pendente',
            payment_method: data.payment_method || 'pix',
            amount_total: priceFinal,
            amount_paid: amountPaid,
            remaining_balance: Math.max(0, priceFinal - amountPaid),
            pickup_location: data.pickup_location || 'A combinar',
            items: items.length > 0 ? items.map((it) => ({
              title: it.title || it.service_name || 'Serviço Jericoacoara',
              service_type: it.category || 'passeio',
              vehicle: it.vehicle_type || 'SW4 / Buggy',
              modality: 'privativo',
              date: it.date_start || data.date || new Date().toISOString().split('T')[0],
              time: '11:30',
              pax: Number(it.pax_adults || data.pax_adults || 1),
              unit_price: Number(it.price_total || priceFinal),
            })) : [
              {
                title: 'Serviço Jericoacoara Premium',
                service_type: 'passeio',
                vehicle: 'SW4 / Buggy',
                modality: 'privativo',
                date: data.date || new Date().toISOString().split('T')[0],
                time: '11:30',
                pax: Number(data.pax_adults || 1),
                unit_price: priceFinal,
              }
            ],
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        // ignore
      }

      // 5. Se o código não for localizado no banco nem no localStorage, definir erro explícito (SEM MOCKS)
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

  // Polling para pagamento pendente com cache-busting
  useEffect(() => {
    let interval;
    if (booking && (booking.payment_status === 'pendente' || booking.status === 'pendente') && !DEMO_VOUCHERS[formattedCode]) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/booking-public?code=${formattedCode}&t=${Date.now()}`);
          const data = await res.json();
          if (data && data.success && data.booking) {
            const status = data.booking.payment_status;
            const resStatus = data.booking.reservation_status || data.booking.status;
            
            if (status === 'pago_integral' || status === 'sinal_pago' || resStatus === 'confirmada' || resStatus === 'concluida') {
              // Pagamento confirmado!
              setBooking((prev) => ({
                ...prev,
                status: resStatus || 'confirmada',
                payment_status: status || 'sinal_pago',
                amount_paid: status === 'sinal_pago' ? prev.amount_total / 2 : prev.amount_total,
                remaining_balance: status === 'sinal_pago' ? prev.amount_total / 2 : 0,
              }));
              setIsPixModalOpen(false);
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error('[Polling Voucher] Erro:', e);
        }
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [booking?.payment_status, booking?.status, formattedCode]);

  const handlePrint = () => {
    window.print();
  };

  const mainItem = booking?.items?.[0] || {};
  const isDeposit = booking?.payment_status === 'sinal_pago' || (booking?.remaining_balance && booking.remaining_balance > 0);

  const statusBadge = useMemo(() => {
    if (!booking) return null;
    const pStatus = (booking.payment_status || '').toLowerCase();
    const rStatus = (booking.status || booking.reservation_status || '').toLowerCase();

    if (pStatus === 'pago_integral' || rStatus === 'concluida') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5" />
          CONFIRMADA · PAGO INTEGRAL (100%)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
        CONFIRMADA · SINAL PAGO (50%)
      </span>
    );
  }, [booking]);

  const whatsappProofUrl = useMemo(() => {
    const codeToUse = booking?.reservation_code || booking?.code || formattedCode;
    const text = `Olá! Acabei de realizar o pagamento do Pix da minha reserva no site. Localizador: ${codeToUse}. Segue o comprovante em anexo.`;
    return `https://wa.me/5588988463182?text=${encodeURIComponent(text)}`;
  }, [booking, formattedCode]);

  const whatsappSupportUrl = useMemo(() => {
    const text = `Olá! Gostaria de suporte sobre meu voucher de reserva: *${formattedCode}*`;
    return buildWhatsAppLink(text);
  }, [formattedCode]);

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
    <div className="min-h-screen bg-slate-100 text-gray-900 py-6 sm:py-10 px-3 sm:px-6 print:bg-white print:p-0">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border: 1px solid #ddd !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; }
        }
      `}</style>

      {/* Top Controls Bar (No Print) */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2C7A7B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Site
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Baixar / Imprimir Voucher (PDF)
          </button>

          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Suporte WhatsApp
          </a>
        </div>
      </div>

      {/* Main Voucher Printable Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print-card">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-[#1e4e4f] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#D4AF37] font-extrabold tracking-wider text-xl">JERICOACOARA</span>
              <span className="bg-[#D4AF37] text-gray-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">PREMIUM</span>
            </div>
            <p className="text-xs text-gray-300 font-medium tracking-wide">VOUCHER OFICIAL DE RESERVA E EMBARQUE</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 sm:text-right">
            <p className="text-[10px] uppercase text-gray-300 font-bold tracking-widest">CÓDIGO LOCALIZADOR</p>
            <p className="font-mono text-2xl font-black text-[#D4AF37] tracking-wider">{booking.code}</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {statusBadge}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Emissão: {new Date(booking.created_at || Date.now()).toLocaleDateString('pt-BR')} às {new Date(booking.created_at || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Caixa de Instrução Operacional: Validação e Ativação do Voucher */}
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50/70 to-emerald-50 border-b border-emerald-200/80 px-6 py-5 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                Validação e Ativação do Voucher
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed max-w-xl">
                Para validar o seu voucher e receber o contato do seu guia/motorista, envie o comprovante de pagamento no nosso WhatsApp oficial.
              </p>
            </div>
            <a
              href={whatsappProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar Comprovante no WhatsApp
            </a>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Section 1: Customer Details */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#2C7A7B]" />
              Dados do Titular da Reserva
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Nome Completo</span>
                <span className="font-bold text-gray-900">{booking.client_name}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Telefone / WhatsApp</span>
                <span className="font-semibold text-gray-800">{booking.client_phone || '(88) 98846-3182'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">E-mail</span>
                <span className="font-semibold text-gray-800">{booking.client_email || 'Não informado'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Service Details */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#2C7A7B]" />
              Resumo do Serviço Contratado
            </h3>

            <div className="bg-[#2C7A7B]/5 p-4 rounded-xl border border-[#2C7A7B]/20 mb-4">
              <h4 className="font-extrabold text-base sm:text-lg text-gray-900 mb-1">
                {mainItem.title || 'Transfer ou Passeio Jericoacoara Premium'}
              </h4>
              <p className="text-xs text-[#2C7A7B] font-bold">
                Modalidade: {mainItem.modality === 'shared' ? 'Compartilhado Econômico' : `Privativo Exclusivo (${mainItem.vehicle || 'SW4 4x4 / Buggy'})`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Calendar className="w-5 h-5 text-[#2C7A7B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Data & Horário de Saída</span>
                  <span className="font-bold text-gray-900">
                    {mainItem.date ? new Date(mainItem.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'A agendar'} às {mainItem.time || '11:30'}h
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <MapPin className="w-5 h-5 text-[#2C7A7B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Local de Embarque</span>
                  <span className="font-bold text-gray-900">{booking.pickup_location || 'A combinar com o motorista'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Users className="w-5 h-5 text-[#2C7A7B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Passageiros (PAX)</span>
                  <span className="font-bold text-gray-900">{mainItem.pax || 1} pessoa(s)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Car className="w-5 h-5 text-[#2C7A7B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Veículo / Tipo</span>
                  <span className="font-bold text-gray-900 capitalize">{mainItem.vehicle || 'SW4 4x4 Especial'}</span>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <strong className="text-gray-700">Observações adicionais:</strong> {booking.notes}
              </div>
            )}
          </div>

          {/* Section 3: Financial Summary */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-slate-50/70">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#2C7A7B]" />
              Resumo Financeiro da Reserva
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Valor Total do Serviço</span>
                <span className="text-lg font-black text-gray-900">{formatPrice(booking.amount_total)}</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                <span className="text-xs text-emerald-600 font-semibold uppercase block">Valor Pago (Garantia)</span>
                <span className="text-lg font-black text-emerald-600">{formatPrice(booking.amount_paid)}</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                <span className="text-xs text-amber-700 font-semibold uppercase block">Saldo a Pagar no Embarque</span>
                <span className="text-lg font-black text-amber-800">{formatPrice(booking.remaining_balance)}</span>
              </div>
            </div>

            {isDeposit && booking.remaining_balance > 0 && (
              <p className="mt-3 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                O saldo restante de <strong>{formatPrice(booking.remaining_balance)}</strong> deve ser quitado no momento do embarque diretamente com o motorista credenciado (PIX ou Dinheiro).
              </p>
            )}
          </div>

          {/* Section 4: Boarding Guidelines & Rules */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2C7A7B]" />
              Recomendações Importantes de Embarque
            </h3>

            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed list-disc pl-4">
              <li>
                <strong>Apresentação do Voucher:</strong> Apresente este voucher (digital na tela do celular ou impresso) ao motorista no início do atendimento.
              </li>
              <li>
                <strong>Pontualidade:</strong> Esteja pronto no ponto de embarque indicado com 10 a 15 minutos de antecedência em relação ao horário agendado.
              </li>
              <li>
                <strong>Taxa de Turismo (Jericoacoara):</strong> A Taxa de Turismo Sustentável de Jericoacoara é um tributo municipal do ecossistema local pago antecipadamente pelo visitante. Tenha a taxa gerada em mãos.
              </li>
              <li>
                <strong>Suporte 24h & Reagendamentos:</strong> Para alterações de horário, atraso de voos ou suporte emergencial, entre em contato imediatamente com nossa central oficial de atendimento via WhatsApp: <strong>(88) 98846-3182</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-900 text-gray-400 p-5 text-center text-xs space-y-1">
          <p className="font-bold text-white">Jericoacoara Premium | Agência Licenciada & Transportes Credenciados</p>
          <p>CNPJ & CADASTUR Ativos · Atendimento 24 horas: +55 (88) 98846-3182</p>
          <p className="text-[10px] text-gray-500 pt-1">https://jericoacoarapremium.com/voucher/{booking.code}</p>
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
    </div>
  );
}
