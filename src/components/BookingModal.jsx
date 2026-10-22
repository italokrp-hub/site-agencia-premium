import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import {
  CalendarDays,
  Loader2,
  MessageCircle,
  CreditCard,
  Copy,
  CheckCheck,
  Calendar as CalendarIcon,
  Clock,
  Moon,
  Tag,
  Car,
  QrCode,
  Info,
  Compass,
  Minus,
  Plus,
  Globe,
  Lock,
  FileText,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  Plane,
  MapPin,
  Users,
  XCircle,
  Luggage,
  Baby,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  calculateTotal,
  formatPrice,
  calculateTransferPrice,
  calculateTourPrice,
  transfersData,
  toursData,
  getServiceDetails,
  CANCELLATION_POLICY,
} from '@/data/catalog';
import { createCheckout, createPixPayment, checkPixPaymentStatus } from '@/services/payment';
import { createStripeCheckout } from '@/services/stripePayment';
import { sendBookingToHotelOps } from '@/services/hotelopsIntegration';
import { useLanguage } from '@/i18n/LanguageContext';
import { openWhatsApp } from '@/utils/whatsapp';

// Validação real de dígitos verificadores do CPF brasileiro (Algoritmo Mod 11)
export function isValidCPF(cpf) {
  if (!cpf) return false;
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false; // Elimina sequências repetidas como 111.111.111-11

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

// Máscara de CPF brasileiro 000.000.000-00
export function maskCPF(value) {
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
}

// Formatação inteligente de telefone conforme DDI
export function maskPhone(value, ddi = '+55') {
  if (ddi === '+55') {
    const clean = value.replace(/\D/g, '').slice(0, 11);
    if (clean.length <= 2) return clean ? `(${clean}` : '';
    if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  return value.replace(/[^\d\s\-\(\)]/g, '').slice(0, 20);
}

// Lista de DDIs mais frequentes
export const DDI_OPTIONS = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'Estados Unidos / Canadá', flag: '🇺🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
  { code: '+49', country: 'Alemanha', flag: '🇩🇪' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+598', country: 'Uruguai', flag: '🇺🇾' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+39', country: 'Itália', flag: '🇮🇹' },
  { code: '+57', country: 'Colômbia', flag: '🇨🇴' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
];

const initialForm = {
  name: '',
  ddi: '+55',
  whatsapp: '',
  email: '',
  isForeigner: false,
  cpf: '',
  passport: '',
  date: undefined,
  returnDate: undefined,
  time: '12:00',
  returnTime: '12:00',
  pickup: '',
  passengers: 1,
  flightDetails: '',
  tripType: 'roundTrip', // 'oneWay' | 'returnWay' | 'roundTrip'
  optionType: 'private', // 'shared' | 'private'
  selectedTierIndex: undefined,
  selectedVehicleType: 'Buggy',
};

export default function BookingModal({ item, open, onOpenChange }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isPortuguese = language === 'pt';

  const [internalItem, setInternalItem] = useState(null);

  useEffect(() => {
    if (item && (!internalItem || internalItem.id !== item.id)) {
      setInternalItem(item);
    }
  }, [item]);

  // Stepper principal: 1: Serviço & Veículo, 2: Identificação & Embarque, 3: Pagamento Seguro
  const [wizardStep, setWizardStep] = useState(1);
  // Status modal pós-wizard: 'wizard' | 'pix' | 'success'
  const [stepStatus, setStepStatus] = useState('wizard');

  const [form, setForm] = useState(initialForm);
  const [paymentMode, setPaymentMode] = useState('50'); // '50' | '100'
  const [loading, setLoading] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [isPixConfirmed, setIsPixConfirmed] = useState(false);
  const [pixVerificationMessage, setPixVerificationMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
  const [createdReservationCode, setCreatedReservationCode] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState(''); // 'idle', 'sending', 'sent', 'error'
  const [showDetailsSection, setShowDetailsSection] = useState(false);

  // Detalhes ricos do serviço (o que inclui, não inclui, bagagem, cancelamento)
  const serviceDetails = useMemo(() => getServiceDetails(internalItem), [internalItem]);

  // Locale de datas
  const dateFnsLocale = useMemo(() => {
    if (language === 'en') return enUS;
    if (language === 'es') return es;
    return ptBR;
  }, [language]);

  // Identificação do item Transfer vs Passeio
  const transferItem = useMemo(() => {
    if (!internalItem) return null;
    if (internalItem.category === 'transfer' && internalItem.options) return internalItem;
    if (internalItem.raw?.category === 'transfer' && internalItem.raw?.options) return internalItem.raw;
    if (internalItem.options?.private?.tiers) return internalItem;
    if (internalItem.raw?.options?.private?.tiers) return internalItem.raw;
    return null;
  }, [internalItem]);

  const tourItem = useMemo(() => {
    if (!internalItem) return null;
    if (internalItem.category === 'tour' && internalItem.options) return internalItem;
    if (internalItem.raw?.category === 'tour' && internalItem.raw?.options) return internalItem.raw;
    if (internalItem.category === 'tour' && internalItem.requireWhatsApp) return internalItem;
    if (internalItem.raw?.category === 'tour') return internalItem.raw;
    return null;
  }, [internalItem]);

  const isTransfer = Boolean(transferItem || internalItem?.category === 'transfer');
  const isTour = Boolean(tourItem || internalItem?.category === 'tour');
  const isRoundTrip = isTransfer && form.tripType === 'roundTrip';

  const serviceTitle = useMemo(() => {
    const itemObj = transferItem || tourItem || internalItem;
    const rawTitle = itemObj?.title || 'Serviço Jericoacoara';
    if (!itemObj?.id) return rawTitle;
    const res = t(`catalog.${itemObj.id}`, { defaultValue: rawTitle });
    return res && typeof res === 'string' && !res.startsWith('catalog.') ? res : rawTitle;
  }, [transferItem, tourItem, internalItem, t]);

  // Pré-preenchimento ao alterar o item recebido
  useEffect(() => {
    if (transferItem) {
      const sharedAvailable = transferItem.options?.shared?.available;
      const privateAvailable = transferItem.options?.private?.available !== false;
      const initialType =
        (internalItem?.selectedType === 'Compartilhado' || !privateAvailable) && sharedAvailable
          ? 'shared'
          : 'private';
      const initialTrip = internalItem?.selectedTripType || 'roundTrip';

      setForm((prev) => ({
        ...prev,
        optionType: initialType,
        tripType: initialTrip,
        date: internalItem?.initialDate || prev.date || addDays(new Date(), 1),
        returnDate: internalItem?.initialReturnDate || prev.returnDate || addDays(new Date(), 4),
        passengers: internalItem?.initialPassengers || prev.passengers || 2,
        pickup: internalItem?.initialPickup || prev.pickup,
      }));
    } else if (tourItem) {
      const sharedAvailable = tourItem.options?.shared?.available;
      const initialType =
        internalItem?.selectedType === 'Compartilhado' && sharedAvailable ? 'shared' : 'private';
      const defaultVehicle =
        internalItem?.selectedVehicleType ||
        tourItem.options?.private?.vehicles?.[0]?.type ||
        'Buggy';

      setForm((prev) => ({
        ...prev,
        optionType: initialType,
        selectedVehicleType: defaultVehicle,
        date: internalItem?.initialDate || prev.date || addDays(new Date(), 1),
        passengers: internalItem?.initialPassengers || prev.passengers || 2,
        pickup: internalItem?.initialPickup || prev.pickup,
      }));
    }
  }, [transferItem, tourItem, internalItem]);

  // Se o idioma for internacional, pré-ativa turista estrangeiro
  useEffect(() => {
    if (language === 'en' || language === 'es') {
      setForm((prev) => ({
        ...prev,
        isForeigner: true,
        ddi: language === 'en' ? '+1' : '+34',
      }));
    }
  }, [language]);

  // Cálculos financeiros
  const transferPriceInfo = useMemo(() => {
    if (transferItem) {
      return calculateTransferPrice({
        transfer: transferItem,
        optionType: form.optionType,
        tripType: form.tripType,
        passengers: form.passengers,
        selectedTierIndex: form.selectedTierIndex,
        time: form.time,
      });
    }
    return null;
  }, [transferItem, form.optionType, form.tripType, form.passengers, form.selectedTierIndex, form.time]);

  const tourPriceInfo = useMemo(() => {
    if (tourItem) {
      return calculateTourPrice({
        tour: tourItem,
        optionType: form.optionType,
        selectedVehicleType: form.selectedVehicleType,
        passengers: form.passengers,
      });
    }
    return null;
  }, [tourItem, form.optionType, form.selectedVehicleType, form.passengers]);

  const isWhatsAppOnly = useMemo(() => {
    if (tourPriceInfo) return tourPriceInfo.isWhatsAppOnly;
    if (internalItem?.requireWhatsApp) return true;
    return false;
  }, [tourPriceInfo, internalItem]);

  const isPrivate = useMemo(() => {
    if (transferPriceInfo) return transferPriceInfo.isPrivate;
    if (tourPriceInfo) return tourPriceInfo.optionType === 'private';
    return internalItem?.selectedType === 'Privativo';
  }, [transferPriceInfo, tourPriceInfo, internalItem]);

  const selectedTier = transferPriceInfo?.selectedTier;
  const nightFeeApplied = transferPriceInfo ? transferPriceInfo.nightFeeApplied : false;

  const fullTotal = useMemo(() => {
    if (transferPriceInfo && typeof transferPriceInfo.total === 'number' && transferPriceInfo.total > 0) {
      return transferPriceInfo.total;
    }
    if (tourPriceInfo && typeof tourPriceInfo.total === 'number' && tourPriceInfo.total > 0) {
      return tourPriceInfo.total;
    }
    if (internalItem?.priceType === 'per_person') return (internalItem.unitPrice || 0) * form.passengers;
    return internalItem?.unitPrice || 0;
  }, [transferPriceInfo, tourPriceInfo, internalItem, form.passengers]);

  const fullPixTotal = useMemo(() => {
    if (transferPriceInfo && typeof transferPriceInfo.pixTotal === 'number' && transferPriceInfo.pixTotal > 0) {
      return transferPriceInfo.pixTotal;
    }
    if (tourPriceInfo && typeof tourPriceInfo.pixTotal === 'number' && tourPriceInfo.pixTotal > 0) {
      return tourPriceInfo.pixTotal;
    }
    return Math.round(fullTotal * 0.95 * 100) / 100;
  }, [transferPriceInfo, tourPriceInfo, fullTotal]);

  const isDeposit = paymentMode === '50';
  const chargeTotal = useMemo(() => (isDeposit ? fullTotal / 2 : fullTotal), [fullTotal, isDeposit]);
  const chargePixTotal = useMemo(() => (isDeposit ? fullPixTotal / 2 : fullPixTotal), [fullPixTotal, isDeposit]);
  const remainingBalance = useMemo(() => (isDeposit ? fullTotal / 2 : 0), [fullTotal, isDeposit]);

  // Polling para pagamento Pix aprovado
  useEffect(() => {
    let interval;
    if (stepStatus === 'pix' && createdReservationCode) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/booking-public?code=${createdReservationCode}`);
          const data = await res.json();
          if (data && data.success && data.booking) {
            const status = data.booking.payment_status;
            if (status === 'pago_integral' || status === 'sinal_pago') {
              setStepStatus('success');
            }
          }
        } catch (e) {
          console.error('[Polling] Erro na consulta de status:', e);
        }
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stepStatus, createdReservationCode]);

  // Validações do Stepper
  const isStep1Valid = useMemo(() => {
    if (!form.date) return false;
    if (isRoundTrip && !form.returnDate) return false;
    if (form.passengers < 1) return false;
    return true;
  }, [form.date, isRoundTrip, form.returnDate, form.passengers]);

  const isCpfValid = useMemo(() => {
    if (form.isForeigner) return true;
    return isValidCPF(form.cpf);
  }, [form.isForeigner, form.cpf]);

  const isStep2Valid = useMemo(() => {
    if (!form.name.trim() || form.name.trim().length < 3) return false;
    const cleanPhone = form.whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 8) return false;
    if (form.email && (!form.email.includes('@') || !form.email.includes('.'))) return false;
    if (form.isForeigner) {
      if (!form.passport.trim() || form.passport.trim().length < 4) return false;
    } else {
      if (!isCpfValid) return false;
    }
    if (!form.pickup.trim() || form.pickup.trim().length < 2) return false;
    return true;
  }, [form.name, form.whatsapp, form.email, form.isForeigner, form.passport, isCpfValid, form.pickup]);

  // Handlers de Formulário
  const handleChange = useCallback((field) => (e) => {
    let val = e.target.value;
    if (field === 'passengers') {
      const parsed = parseInt(val, 10);
      setForm((prev) => ({ ...prev, passengers: isNaN(parsed) || parsed < 1 ? 1 : parsed }));
      return;
    }
    if (field === 'cpf') {
      val = maskCPF(val);
    } else if (field === 'whatsapp') {
      val = maskPhone(val, form.ddi);
    }
    setForm((prev) => ({ ...prev, [field]: val }));
  }, [form.ddi]);

  const handleDdiChange = useCallback((newDdi) => {
    setForm((prev) => ({
      ...prev,
      ddi: newDdi,
      whatsapp: maskPhone(prev.whatsapp, newDdi),
    }));
  }, []);

  const resetModal = useCallback(() => {
    setForm(initialForm);
    setWizardStep(1);
    setStepStatus('wizard');
    setPixData(null);
    setError(null);
    setCopied(false);
    setLoading(false);
    setLoadingPix(false);
    setIsCalendarOpen(false);
    setIsReturnCalendarOpen(false);
    setPaymentMode('50');
    setCreatedReservationCode(null);
  }, []);

  const handleOpenChange = useCallback(
    (isOpen) => {
      if (!isOpen) resetModal();
      onOpenChange(isOpen);
    },
    [onOpenChange, resetModal]
  );

  // Armazenamento local e código da reserva
  const saveBookingToStorage = useCallback(
    (paymentMethodName = 'Pix', existingCode = null) => {
      const code = existingCode || `JRI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const isPix = (paymentMethodName || '').toLowerCase().includes('pix');
      const amountPaid = isDeposit ? (isPix ? chargePixTotal : chargeTotal) : (isPix ? fullPixTotal : fullTotal);
      const remaining = isDeposit ? remainingBalance : 0;
      const fullPhone = `${form.ddi} ${form.whatsapp}`.trim();

      const bookingObj = {
        code,
        created_at: new Date().toISOString(),
        client_name: form.name || 'Cliente Jericoacoara Premium',
        client_phone: fullPhone,
        client_email: form.email || '',
        document: form.isForeigner ? form.passport : form.cpf,
        is_foreigner: form.isForeigner,
        status: 'pendente',
        reservation_status: 'pendente',
        payment_status: 'pendente',
        payment_method: isPix ? 'pix' : 'cartao',
        amount_total: fullTotal,
        amount_paid: 0,
        remaining_balance: fullTotal,
        pickup_location: form.pickup || 'Ponto informado no formulário',
        notes: form.flightDetails ? `Voo: ${form.flightDetails}` : '',
        items: [
          {
            title: serviceTitle,
            service_type: isTransfer ? 'transfer' : 'passeio',
            modality: form.optionType,
            vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType || 'SW4 / Buggy',
            date: form.date ? format(form.date, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
            time: form.time || '11:30',
            pax: form.passengers || 1,
            unit_price: fullTotal,
          },
        ],
      };

      try {
        localStorage.setItem(`jeri_last_booking_${code}`, JSON.stringify(bookingObj));
      } catch (e) {
        console.warn('[BookingModal] Erro ao salvar voucher em localStorage:', e);
      }
      setCreatedReservationCode(code);
      return code;
    },
    [form, isDeposit, chargePixTotal, chargeTotal, fullPixTotal, fullTotal, remainingBalance, serviceTitle, isTransfer, selectedTier, tourPriceInfo]
  );

  const triggerHotelOpsSync = useCallback(
    async (paymentMethodName, codeOverride = null) => {
      const codeToUse = codeOverride || createdReservationCode;
      const itemInfo = internalItem || { title: serviceTitle, category: isTransfer ? 'transfer' : 'tour' };
      const paymentInfo = {
        code: codeToUse,
        fullTotal,
        fullPixTotal,
        chargeTotal: paymentMethodName === 'Pix' ? chargePixTotal : chargeTotal,
        chargePixTotal,
        remainingBalance: isDeposit ? remainingBalance : 0,
        paymentMode,
        paymentMethod: paymentMethodName,
        vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType,
        isWhatsAppOnly: isWhatsAppOnly,
        paymentStatus: 'pendente',
        reservationStatus: 'pendente',
      };

      try {
        await sendBookingToHotelOps(form, itemInfo, paymentInfo);
      } catch (err) {
        console.error('[BookingModal] Erro na sincronização:', err);
      }
    },
    [createdReservationCode, internalItem, serviceTitle, isTransfer, fullTotal, fullPixTotal, chargePixTotal, chargeTotal, isDeposit, remainingBalance, paymentMode, selectedTier, tourPriceInfo, form, isWhatsAppOnly]
  );

  // Pagamento Cartão Mercado Pago
  const handleMercadoPago = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const finalUnitPrice = Math.round(chargeTotal * 100) / 100;
      if (!finalUnitPrice || finalUnitPrice <= 0) {
        throw new Error('Valor inválido para o checkout.');
      }

      let resCode = sessionStorage.getItem('active_booking_code');
      if (!resCode) {
        resCode = saveBookingToStorage('Cartão de Crédito');
        sessionStorage.setItem('active_booking_code', resCode);
      } else {
        saveBookingToStorage('Cartão de Crédito', resCode);
      }

      await triggerHotelOpsSync('Cartão de Crédito', resCode);

      const titleSuffix = isDeposit ? ' - Sinal 50%' : ' - Pagamento Integral';
      const fullPhone = `${form.ddi} ${form.whatsapp}`.trim();

      const result = await createCheckout({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: finalUnitPrice,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: fullPhone,
        },
        metadata: {
          serviceId: internalItem?.id || 'service',
          category: internalItem?.category || (isTransfer ? 'transfer' : 'tour'),
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || undefined,
          date: form.date ? format(form.date, 'yyyy-MM-dd') : undefined,
          returnDate: form.returnDate ? format(form.returnDate, 'yyyy-MM-dd') : undefined,
          time: form.time,
          returnTime: isRoundTrip ? form.returnTime : undefined,
          pickup: form.pickup,
          passengers: form.passengers,
          flightDetails: form.flightDetails.trim() || undefined,
          paymentMode,
          fullTotal,
          chargeTotal: finalUnitPrice,
          remainingBalance,
          cpf: form.isForeigner ? undefined : form.cpf,
          passport: form.isForeigner ? form.passport : undefined,
          code: resCode,
        },
      });

      if (result && (result.init_point || result.sandbox_init_point)) {
        window.location.href = result.init_point || result.sandbox_init_point;
        return;
      }

      setError('Resposta inesperada do servidor de pagamento.');
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [chargeTotal, saveBookingToStorage, triggerHotelOpsSync, isDeposit, form, serviceTitle, internalItem, isTransfer, selectedTier, tourPriceInfo, isRoundTrip, paymentMode, fullTotal, remainingBalance]);

  // Pagamento Cartão Internacional Stripe
  const handleStripePayment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const finalUnitPrice = Math.round(chargeTotal * 100) / 100;
      if (!finalUnitPrice || finalUnitPrice <= 0) {
        throw new Error('Valor inválido para o checkout Stripe.');
      }

      let resCode = sessionStorage.getItem('active_booking_code');
      if (!resCode) {
        resCode = saveBookingToStorage('Cartão Internacional (Stripe)');
        sessionStorage.setItem('active_booking_code', resCode);
      } else {
        saveBookingToStorage('Cartão Internacional (Stripe)', resCode);
      }

      await triggerHotelOpsSync('Cartão Internacional (Stripe)', resCode);

      const titleSuffix = isDeposit ? ' - 50% Deposit' : '';
      const fullPhone = `${form.ddi} ${form.whatsapp}`.trim();

      const result = await createStripeCheckout({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: finalUnitPrice,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: fullPhone,
        },
        metadata: {
          serviceId: internalItem?.id || 'service',
          category: internalItem?.category || (isTransfer ? 'transfer' : 'tour'),
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || undefined,
          date: form.date ? format(form.date, 'yyyy-MM-dd') : undefined,
          returnDate: form.returnDate ? format(form.returnDate, 'yyyy-MM-dd') : undefined,
          time: form.time,
          pickup: form.pickup,
          passengers: form.passengers,
          flightDetails: form.flightDetails.trim() || undefined,
          document: form.isForeigner ? form.passport : form.cpf,
          isForeigner: form.isForeigner ? 'true' : 'false',
          paymentMode,
          fullTotal,
          chargeTotal: finalUnitPrice,
          remainingBalance,
          code: resCode,
        },
      });

      if (result && result.url) {
        window.location.href = result.url;
        return;
      }

      setError('Resposta inesperada do servidor Stripe.');
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento com cartão internacional. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [chargeTotal, saveBookingToStorage, triggerHotelOpsSync, isDeposit, form, serviceTitle, internalItem, isTransfer, selectedTier, tourPriceInfo, paymentMode, fullTotal, remainingBalance]);

  // Pagamento via PIX Dinâmico
  const handlePixPayment = useCallback(async () => {
    setLoadingPix(true);
    setError(null);
    try {
      const finalPixUnitPrice = Math.round(chargePixTotal * 100) / 100;
      if (!finalPixUnitPrice || finalPixUnitPrice <= 0) {
        throw new Error('Valor inválido para a chave Pix.');
      }

      let resCode = sessionStorage.getItem('active_booking_code');
      if (!resCode) {
        resCode = saveBookingToStorage('Pix');
        sessionStorage.setItem('active_booking_code', resCode);
      } else {
        saveBookingToStorage('Pix', resCode);
      }

      await triggerHotelOpsSync('Pix', resCode);

      const titleSuffix = isDeposit ? ' - Sinal 50% PIX' : ' - PIX (5% OFF)';
      const fullPhone = `${form.ddi} ${form.whatsapp}`.trim();

      const result = await createPixPayment({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: finalPixUnitPrice,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: fullPhone,
        },
        metadata: {
          serviceId: internalItem?.id || 'service',
          category: internalItem?.category || (isTransfer ? 'transfer' : 'tour'),
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || undefined,
          date: form.date ? format(form.date, 'yyyy-MM-dd') : undefined,
          returnDate: form.returnDate ? format(form.returnDate, 'yyyy-MM-dd') : undefined,
          time: form.time,
          returnTime: isRoundTrip ? form.returnTime : undefined,
          pickup: form.pickup,
          passengers: form.passengers,
          flightDetails: form.flightDetails.trim() || undefined,
          paymentMode,
          fullTotal,
          chargePixTotal: finalPixUnitPrice,
          remainingBalance,
          isPixDiscount: true,
          cpf: form.isForeigner ? undefined : form.cpf,
          code: resCode,
        },
      });

      if (result.qr_code_base64) {
        const pixInfo = {
          paymentId: result.id,
          qrCodeBase64: result.qr_code_base64,
          qrCode: result.qr_code,
          ticketUrl: result.ticket_url,
        };
        setPixData(pixInfo);
        setIsPixConfirmed(false);
        setPixVerificationMessage(null);

        try {
          localStorage.setItem(`jeri_pix_data_${resCode}`, JSON.stringify(pixInfo));
        } catch (e) {}

        setStepStatus('pix');
        return;
      }

      setError('Erro ao gerar código Pix.');
    } catch (err) {
      setError(err.message || 'Erro ao gerar pagamento Pix. Tente novamente.');
    } finally {
      setLoadingPix(false);
    }
  }, [chargePixTotal, saveBookingToStorage, triggerHotelOpsSync, isDeposit, form, serviceTitle, internalItem, isTransfer, selectedTier, tourPriceInfo, isRoundTrip, paymentMode, fullTotal, remainingBalance]);

  // Polling automático no modal de PIX aguardando confirmação real do Mercado Pago
  useEffect(() => {
    let interval = null;
    if (stepStatus === 'pix' && pixData && !isPixConfirmed) {
      const resCode = createdReservationCode || sessionStorage.getItem('active_booking_code');
      interval = setInterval(async () => {
        try {
          const statusRes = await checkPixPaymentStatus({
            paymentId: pixData.paymentId,
            code: resCode,
          });

          if (statusRes && statusRes.isPaid) {
            setIsPixConfirmed(true);
            const paidAmount = isDeposit ? chargePixTotal : fullPixTotal;
            const remaining = isDeposit ? remainingBalance : 0;
            const fullPhone = `${form.ddi} ${form.whatsapp}`.trim();

            const confirmedObj = {
              code: resCode,
              created_at: new Date().toISOString(),
              client_name: form.name || 'Cliente Jericoacoara Premium',
              client_phone: fullPhone,
              client_email: form.email || '',
              document: form.isForeigner ? form.passport : form.cpf,
              is_foreigner: form.isForeigner,
              status: 'confirmada',
              reservation_status: 'confirmada',
              payment_status: paymentMode === '50' ? 'sinal_pago' : 'pago_integral',
              payment_method: 'pix',
              amount_total: fullTotal,
              amount_paid: paidAmount,
              remaining_balance: remaining,
              pickup_location: form.pickup || 'Ponto informado no formulário',
              notes: form.flightDetails ? `Voo: ${form.flightDetails}` : '',
              items: [
                {
                  title: serviceTitle,
                  service_type: isTransfer ? 'transfer' : 'passeio',
                  modality: form.optionType,
                  vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType || 'SW4 / Buggy',
                  date: form.date ? format(form.date, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
                  time: form.time || '11:30',
                  pax: form.passengers || 1,
                  unit_price: fullTotal,
                },
              ],
            };
            try {
              localStorage.setItem(`jeri_last_booking_${resCode}`, JSON.stringify(confirmedObj));
            } catch (e) {}

            clearInterval(interval);
          }
        } catch (e) {
          // ignore polling error
        }
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stepStatus, pixData, isPixConfirmed, createdReservationCode, isDeposit, chargePixTotal, fullPixTotal, remainingBalance, form, paymentMode, fullTotal, serviceTitle, isTransfer, selectedTier, tourPriceInfo]);

  // Verificação de Pix disparada por clique (com consulta real, sem bypass)
  const handleVerifyPixPayment = useCallback(async () => {
    setLoadingPix(true);
    setPixVerificationMessage(null);
    const resCode = createdReservationCode || sessionStorage.getItem('active_booking_code');
    if (!resCode) {
      setLoadingPix(false);
      return;
    }

    try {
      const paymentId = pixData?.paymentId;
      const statusRes = await checkPixPaymentStatus({ paymentId, code: resCode });

      if (statusRes && statusRes.isPaid) {
        setIsPixConfirmed(true);
        const paidAmount = isDeposit ? chargePixTotal : fullPixTotal;
        const remaining = isDeposit ? remainingBalance : 0;
        const fullPhone = `${form.ddi} ${form.whatsapp}`.trim();

        const confirmedObj = {
          code: resCode,
          created_at: new Date().toISOString(),
          client_name: form.name || 'Cliente Jericoacoara Premium',
          client_phone: fullPhone,
          client_email: form.email || '',
          document: form.isForeigner ? form.passport : form.cpf,
          is_foreigner: form.isForeigner,
          status: 'confirmada',
          reservation_status: 'confirmada',
          payment_status: paymentMode === '50' ? 'sinal_pago' : 'pago_integral',
          payment_method: 'pix',
          amount_total: fullTotal,
          amount_paid: paidAmount,
          remaining_balance: remaining,
          pickup_location: form.pickup || 'Ponto informado no formulário',
          notes: form.flightDetails ? `Voo: ${form.flightDetails}` : '',
          items: [
            {
              title: serviceTitle,
              service_type: isTransfer ? 'transfer' : 'passeio',
              modality: form.optionType,
              vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType || 'SW4 / Buggy',
              date: form.date ? format(form.date, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0],
              time: form.time || '11:30',
              pax: form.passengers || 1,
              unit_price: fullTotal,
            },
          ],
        };
        try {
          localStorage.setItem(`jeri_last_booking_${resCode}`, JSON.stringify(confirmedObj));
        } catch (e) {}

        handleOpenChange(false);
        window.location.href = `/voucher/${resCode}`;
        return;
      }

      setPixVerificationMessage({
        type: 'pending',
        text: 'Pagamento Pix ainda não identificado pelo banco. Se você acabou de efetuar o Pix no app do seu banco, aguarde alguns instantes (a compensação pelo Banco Central leva geralmente de 5 a 15 segundos). O sistema atualiza automaticamente assim que o pagamento for registrado.',
      });
    } catch (err) {
      console.error('[BookingModal] Erro ao verificar status Pix:', err);
      setPixVerificationMessage({
        type: 'error',
        text: 'Não foi possível verificar o pagamento no momento. Tente novamente em alguns segundos.',
      });
    } finally {
      setLoadingPix(false);
    }
  }, [createdReservationCode, pixData, isDeposit, chargePixTotal, fullPixTotal, remainingBalance, form, paymentMode, fullTotal, serviceTitle, isTransfer, selectedTier, tourPriceInfo, handleOpenChange]);

  // Handler WhatsApp
  const handleWhatsApp = useCallback(async () => {
    const resCode =
      createdReservationCode || saveBookingToStorage(isPortuguese ? 'WhatsApp' : 'WhatsApp (International)');
    await triggerHotelOpsSync(isPortuguese ? 'WhatsApp' : 'WhatsApp (International)', resCode);

    let msgText = `Olá! Gostaria de ${isWhatsAppOnly ? 'consultar disponibilidade para' : 'reservar'}:\n\n*${serviceTitle}*\n`;
    if (isTransfer) {
      const tripLabelMap = {
        oneWay: 'Somente Ida',
        returnWay: 'Somente Volta',
        roundTrip: 'Ida e Volta',
      };
      msgText += `Trajeto: ${tripLabelMap[form.tripType] || 'Ida e Volta'}\n`;
      msgText += `Serviço: ${form.optionType === 'shared' ? 'Compartilhado' : `Privativo (${selectedTier?.vehicle || 'Exclusivo'})`}\n`;
      if (form.flightDetails.trim()) {
        msgText += `Dados do Voo: ${form.flightDetails.trim()}\n`;
      }
    } else if (isTour) {
      msgText += `Modalidade: ${form.optionType === 'shared' ? 'Compartilhado' : `Privativo (${tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType})`}\n`;
    }

    if (isRoundTrip && form.returnDate) {
      msgText += `Data da Ida: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` às ${form.time}h` : ''}\n`;
      msgText += `Data da Volta: ${format(form.returnDate, 'dd/MM/yyyy')}${isTransfer ? ` às ${form.returnTime}h` : ''}\n`;
    } else if (form.date) {
      msgText += `Data: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` às ${form.time}h` : ''}\n`;
    }
    if (form.pickup) msgText += `Local de Embarque: ${form.pickup}\n`;
    msgText += `Passageiros: ${form.passengers}\n`;

    if (!isWhatsAppOnly) {
      msgText += `Modalidade de Pagamento: *${isDeposit ? 'Sinal de 50%' : 'Pagamento Integral (100%)'}*\n`;
      const nightText = nightFeeApplied ? ' (+ R$ 20 Tarifa Noturna)' : '';
      if (isDeposit) {
        msgText += `Valor Total do Serviço: ${formatPrice(fullTotal)}${nightText}\n`;
        msgText += `Sinal no Cartão (50%): ${formatPrice(chargeTotal)}\n`;
        msgText += `Sinal no PIX (5% OFF): *${formatPrice(chargePixTotal)}*\n`;
        msgText += `Saldo Restante: *${formatPrice(remainingBalance)}*\n`;
      } else {
        msgText += `Cartão (100%): ${formatPrice(chargeTotal)}${nightText}\n`;
        msgText += `PIX (5% OFF): *${formatPrice(chargePixTotal)}*\n`;
      }
    }

    msgText += `\nNome: ${form.name}\nContato: ${form.ddi} ${form.whatsapp}`;
    if (form.isForeigner && form.passport) {
      msgText += `\nDocumento: Passaporte ${form.passport}`;
    } else if (form.cpf) {
      msgText += `\nCPF: ${form.cpf}`;
    }
    if (form.email) msgText += `\nE-mail: ${form.email}`;

    openWhatsApp(msgText);
    setStepStatus('success');
  }, [createdReservationCode, saveBookingToStorage, isPortuguese, triggerHotelOpsSync, isWhatsAppOnly, serviceTitle, isTransfer, form, isTour, tourPriceInfo, isRoundTrip, isDeposit, nightFeeApplied, fullTotal, chargeTotal, chargePixTotal, remainingBalance, selectedTier]);

  const handleCopyPix = useCallback(() => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [pixData]);

  const handleSendVoucherEmail = useCallback(async () => {
    if (!emailInput || !emailInput.includes('@')) {
      setEmailStatus('error');
      return;
    }
    setEmailStatus('sending');
    try {
      const res = await fetch('/api/send-voucher-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: createdReservationCode, email: emailInput }),
      });
      if (res.ok) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('error');
      }
    } catch (e) {
      setEmailStatus('error');
    }
  }, [emailInput, createdReservationCode]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[70] w-[95vw] max-w-2xl mx-auto max-h-[92dvh] overflow-hidden rounded-2xl bg-white p-0 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        
        {/* Header com Título do Modal */}
        <DialogHeader className="px-5 pt-4 pb-3 sm:px-6 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 pr-6">
                {stepStatus === 'success'
                  ? 'Reserva Confirmada!'
                  : stepStatus === 'pix'
                  ? 'Pagamento via PIX Dinâmico'
                  : serviceTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                {stepStatus === 'success'
                  ? 'Sua solicitação foi registrada com sucesso.'
                  : stepStatus === 'pix'
                  ? 'Escaneie o QR Code ou copie o código Pix abaixo.'
                  : isTransfer
                  ? 'Configure sua viagem, identifique os passageiros e garanta sua reserva.'
                  : 'Escolha seu veículo, informe seus dados e parcele sua aventura.'}
              </DialogDescription>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reserva Garantida</span>
            </div>
          </div>
        </DialogHeader>

        {/* Barra de Progresso Visual (Stepper 1-2-3) */}
        {stepStatus === 'wizard' && (
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/80 shrink-0">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              {/* Linha conectora de fundo */}
              <div className="absolute left-6 right-6 top-3.5 -translate-y-1/2 h-0.5 bg-gray-200 z-0">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{
                    width: wizardStep === 1 ? '0%' : wizardStep === 2 ? '50%' : '100%',
                  }}
                />
              </div>

              {/* Etapa 1 */}
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="flex flex-col items-center relative z-10 cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    wizardStep > 1
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : wizardStep === 1
                      ? 'bg-[#D4AF37] text-gray-950 ring-4 ring-[#D4AF37]/25 shadow-md'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {wizardStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-wide ${
                    wizardStep === 1 ? 'text-[#B48F1E]' : 'text-gray-500'
                  }`}
                >
                  Serviço & Veículo
                </span>
              </button>

              {/* Etapa 2 */}
              <button
                type="button"
                onClick={() => {
                  if (isStep1Valid) setWizardStep(2);
                }}
                className={`flex flex-col items-center relative z-10 focus:outline-none ${
                  isStep1Valid ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    wizardStep > 2
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : wizardStep === 2
                      ? 'bg-[#D4AF37] text-gray-950 ring-4 ring-[#D4AF37]/25 shadow-md'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {wizardStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-wide ${
                    wizardStep === 2 ? 'text-[#B48F1E]' : 'text-gray-500'
                  }`}
                >
                  Identificação
                </span>
              </button>

              {/* Etapa 3 */}
              <button
                type="button"
                onClick={() => {
                  if (isStep1Valid && isStep2Valid) setWizardStep(3);
                }}
                className={`flex flex-col items-center relative z-10 focus:outline-none ${
                  isStep1Valid && isStep2Valid ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    wizardStep === 3
                      ? 'bg-[#D4AF37] text-gray-950 ring-4 ring-[#D4AF37]/25 shadow-md'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-wide ${
                    wizardStep === 3 ? 'text-[#B48F1E]' : 'text-gray-500'
                  }`}
                >
                  Pagamento Seguro
                </span>
              </button>
            </div>
          </div>
        )}

        {/* CORPO DO WIZARD */}
        {stepStatus === 'wizard' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
            
            {/* ETAPA 1: SERVIÇO & VEÍCULO */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                
                {/* Seletor rápido de rota / item */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isTransfer ? (
                      <Car className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <Compass className="w-4 h-4 text-emerald-600" />
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">
                        Rota Selecionada
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">{serviceTitle}</p>
                    </div>
                  </div>

                  <Select
                    value={internalItem?.id || ''}
                    onValueChange={(val) => {
                      const newTransfer = transfersData.find((t) => t.id === val);
                      if (newTransfer) setInternalItem(newTransfer);
                      const newTour = toursData.find((t) => t.id === val);
                      if (newTour) setInternalItem(newTour);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white border-gray-200 w-auto px-3">
                      <SelectValue placeholder="Trocar" />
                    </SelectTrigger>
                    <SelectContent className="z-[150] bg-white border border-gray-200 max-h-60">
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase">Transfers</div>
                      {transfersData.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs">
                          {t.title}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase mt-1">Passeios</div>
                      {toursData.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs">
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trajeto (Para Transfers) */}
                {isTransfer && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Modalidade do Trajeto
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'roundTrip', label: 'Ida e Volta', badge: 'Mais Recomendado' },
                        { id: 'oneWay', label: 'Somente Ida', badge: null },
                        { id: 'returnWay', label: 'Somente Volta', badge: null },
                      ].map((trip) => (
                        <button
                          key={trip.id}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, tripType: trip.id }))}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            form.tripType === trip.id
                              ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{trip.label}</span>
                            {form.tripType === trip.id && (
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            )}
                          </div>
                          {trip.badge && (
                            <span className="text-[9px] text-emerald-700 font-semibold block mt-0.5">
                              {trip.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CARDS COMPARATIVOS: COMPARTILHADO VS PRIVATIVO */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Escolha a Categoria do Veículo
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Opção Compartilhada (se disponível) */}
                    {isTransfer && transferItem?.options?.shared?.available && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, optionType: 'shared' }))}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          form.optionType === 'shared'
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-emerald-600" /> Compartilhado
                            </span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Econômico
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-snug">
                            Van, Ônibus ou Jardineira climatizada com outros viajantes.
                          </p>
                          <ul className="mt-2 space-y-1 text-[10px] text-gray-600">
                            <li className="flex items-center gap-1">✓ Preço por passageiro</li>
                            <li className="flex items-center gap-1">✓ Horários regulares definidos</li>
                            <li className="flex items-center gap-1">✓ Motorista credenciado</li>
                          </ul>
                        </div>
                        <div className="pt-3 mt-2 border-t border-gray-100 flex items-baseline justify-between">
                          <span className="text-[10px] text-gray-400">Tarifa por pessoa:</span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {formatPrice(
                              form.tripType === 'roundTrip'
                                ? transferItem.options.shared.roundTrip
                                : transferItem.options.shared.oneWay
                            )}
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Opção Compartilhada para Passeios */}
                    {isTour && tourItem?.options?.shared?.available && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, optionType: 'shared' }))}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          form.optionType === 'shared'
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-emerald-600" /> Jardineira Compartilhada
                            </span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Melhor Custo
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-snug">
                            Passeio em grupo na clássica Jardineira 4x4 de Jeri.
                          </p>
                          <ul className="mt-2 space-y-1 text-[10px] text-gray-600">
                            <li className="flex items-center gap-1">✓ Preço por pessoa</li>
                            <li className="flex items-center gap-1">✓ Roteiro completo com paradas</li>
                          </ul>
                        </div>
                        <div className="pt-3 mt-2 border-t border-gray-100 flex items-baseline justify-between">
                          <span className="text-[10px] text-gray-400">Por pessoa:</span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {formatPrice(tourItem.options.shared.price)}
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Opção Privativa (Transfers ou Passeios) */}
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, optionType: 'private' }))}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        form.optionType === 'private'
                          ? 'bg-amber-50/70 border-[#D4AF37] ring-2 ring-[#D4AF37]/25 shadow-md'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> Privativo VIP 4x4
                          </span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-gray-900 font-extrabold">
                            Exclusivo
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug">
                          Veículo e motorista particular dedicados com total flexibilidade.
                        </p>
                        <ul className="mt-2 space-y-1 text-[10px] text-gray-600">
                          <li className="flex items-center gap-1">✓ Embarque porta a porta no hotel/aeroporto</li>
                          <li className="flex items-center gap-1">✓ Você escolhe o melhor horário de partida</li>
                          <li className="flex items-center gap-1">✓ Hilux, SW4, Buggy ou Quadriciclo</li>
                        </ul>
                      </div>
                      <div className="pt-3 mt-2 border-t border-gray-100 flex items-baseline justify-between">
                        <span className="text-[10px] text-gray-400">Preço fechado para o grupo</span>
                        <span className="text-base font-extrabold text-gray-900">
                          {isTransfer && transferItem?.options?.private?.tiers?.[0]
                            ? formatPrice(
                                form.tripType === 'roundTrip'
                                  ? transferItem.options.private.tiers[0].roundTrip
                                  : transferItem.options.private.tiers[0].oneWay
                              )
                            : isTour && tourItem?.options?.private?.vehicles?.[0]
                            ? formatPrice(tourItem.options.private.vehicles[0].price)
                            : 'Sob consulta'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Seletor de Veículo Privativo Específico */}
                {form.optionType === 'private' && (
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <Label className="text-xs font-semibold text-gray-700">
                      Escolha o Modelo do Veículo Privativo
                    </Label>
                    
                    {/* Tiers de Transfers */}
                    {isTransfer && transferItem?.options?.private?.tiers && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {transferItem.options.private.tiers.map((tier, idx) => {
                          const isTierSelected =
                            form.selectedTierIndex === idx ||
                            (form.selectedTierIndex === undefined && idx === 0);
                          const tierPrice =
                            form.tripType === 'roundTrip' ? tier.roundTrip : tier.oneWay;
                          return (
                            <button
                              key={tier.vehicle}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  selectedTierIndex: idx,
                                  selectedVehicleType: tier.vehicle,
                                }))
                              }
                              className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                isTierSelected
                                  ? 'bg-white border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-xs'
                                  : 'bg-white/60 border-gray-200 hover:bg-white'
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">{tier.vehicle}</p>
                                <p className="text-[10px] text-gray-500">Até {tier.maxCapacity} passageiros</p>
                              </div>
                              <span className="text-xs font-extrabold text-[#B48F1E]">
                                {formatPrice(tierPrice)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Veículos de Tours */}
                    {isTour && tourItem?.options?.private?.vehicles && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {tourItem.options.private.vehicles.map((v) => {
                          const isSelected = form.selectedVehicleType === v.type;
                          return (
                            <button
                              key={v.type}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({ ...prev, selectedVehicleType: v.type }))
                              }
                              className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-white border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-xs'
                                  : 'bg-white/60 border-gray-200 hover:bg-white'
                              }`}
                            >
                              <p className="text-xs font-bold text-gray-900">{v.type}</p>
                              <p className="text-[10px] text-gray-500 mb-1">Até {v.maxCapacity} pax</p>
                              <span className="text-[11px] font-extrabold text-emerald-700">
                                {formatPrice(v.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Datas, Horários e Passageiros */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  
                  {/* Data Ida */}
                  <div className={`space-y-1 ${isRoundTrip ? 'sm:col-span-4' : 'sm:col-span-5'}`}>
                    <Label className="text-xs font-semibold text-gray-700">
                      {isRoundTrip ? 'Data da Ida' : 'Data do Serviço'} *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCalendarOpen((prev) => !prev);
                        setIsReturnCalendarOpen(false);
                      }}
                      className="w-full justify-start text-left font-normal h-10 bg-white border-gray-200 text-xs"
                    >
                      <CalendarIcon className="mr-1.5 h-4 w-4 text-[#D4AF37]" />
                      {form.date ? format(form.date, 'dd/MM/yyyy') : 'Selecione a data'}
                    </Button>
                    {isCalendarOpen && (
                      <div className="absolute z-[120] mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-2">
                        <Calendar
                          mode="single"
                          selected={form.date}
                          onSelect={(d) => {
                            if (d) {
                              setForm((prev) => ({ ...prev, date: d }));
                              if (form.returnDate && isBefore(form.returnDate, d)) {
                                setForm((prev) => ({ ...prev, returnDate: addDays(d, 3) }));
                              }
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabled={(d) => isBefore(d, startOfDay(new Date()))}
                          locale={dateFnsLocale}
                        />
                      </div>
                    )}
                  </div>

                  {/* Data Volta (se roundTrip) */}
                  {isRoundTrip && (
                    <div className="space-y-1 sm:col-span-4">
                      <Label className="text-xs font-semibold text-gray-700">Data da Volta *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsReturnCalendarOpen((prev) => !prev);
                          setIsCalendarOpen(false);
                        }}
                        className="w-full justify-start text-left font-normal h-10 bg-white border-gray-200 text-xs"
                      >
                        <CalendarIcon className="mr-1.5 h-4 w-4 text-emerald-600" />
                        {form.returnDate ? format(form.returnDate, 'dd/MM/yyyy') : 'Data de retorno'}
                      </Button>
                      {isReturnCalendarOpen && (
                        <div className="absolute z-[120] mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-2">
                          <Calendar
                            mode="single"
                            selected={form.returnDate}
                            onSelect={(d) => {
                              if (d) {
                                setForm((prev) => ({ ...prev, returnDate: d }));
                                setIsReturnCalendarOpen(false);
                              }
                            }}
                            disabled={(d) => isBefore(d, startOfDay(form.date || new Date()))}
                            locale={dateFnsLocale}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Horário */}
                  <div className={`space-y-1 ${isRoundTrip ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
                    <Label className="text-xs font-semibold text-gray-700">Horário</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={handleChange('time')}
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  {/* Passageiros */}
                  <div className={`space-y-1 ${isRoundTrip ? 'sm:col-span-2' : 'sm:col-span-4'}`}>
                    <Label className="text-xs font-semibold text-gray-700">Passageiros</Label>
                    <div className="flex items-center justify-between h-10 bg-white border border-gray-200 rounded-md px-2">
                      <button
                        type="button"
                        disabled={form.passengers <= 1}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, passengers: Math.max(1, prev.passengers - 1) }))
                        }
                        className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-900">{form.passengers}</span>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, passengers: prev.passengers + 1 }))}
                        className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* PAINEL DE DETALHES DO SERVIÇO (O QUE INCLUI / NÃO INCLUI + INFO PRÁTICA) */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs transition-all">
                  <button
                    type="button"
                    onClick={() => setShowDetailsSection((prev) => !prev)}
                    className="w-full flex items-center justify-between p-3.5 bg-gray-50/80 hover:bg-gray-100/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            Detalhes do Serviço: O que Inclui & Condições
                          </span>
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase">
                            Garantia 7 Dias
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Veja a franquia de bagagem, política de crianças e cancelamento 100% garantido.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <span className="hidden sm:inline">{showDetailsSection ? 'Recolher' : 'Ver detalhes'}</span>
                      {showDetailsSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {showDetailsSection && (
                    <div className="p-4 space-y-4 border-t border-gray-100 bg-white text-xs animate-in fade-in duration-200">
                      {/* Descrição Completa */}
                      {serviceDetails.description && (
                        <div className="text-gray-600 text-xs leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50">
                          <strong className="text-gray-900 block mb-0.5">Sobre esta rota:</strong>
                          <span>{serviceDetails.description}</span>
                        </div>
                      )}

                      {/* Grid: O que Inclui vs O que Não Inclui */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* O que Inclui */}
                        <div className="bg-emerald-50/40 rounded-xl p-3 border border-emerald-200/60 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>O Que Está Incluso (✔️)</span>
                          </div>
                          <ul className="space-y-1.5 text-[11px] text-gray-700">
                            {serviceDetails.includes.map((inc, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0 stroke-[3]" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* O que Não Inclui */}
                        <div className="bg-red-50/30 rounded-xl p-3 border border-red-200/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-red-800 font-bold text-xs uppercase tracking-wide">
                            <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>O Que NÃO Está Incluso (✕)</span>
                          </div>
                          <ul className="space-y-1.5 text-[11px] text-gray-700">
                            {serviceDetails.excludes.map((exc, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-red-500 font-bold text-xs mt-0.2 shrink-0">✕</span>
                                <span>{exc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Informações Práticas e Condições */}
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                          Informações Práticas & Condições
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-700">
                          {/* Franquia de Bagagem */}
                          {serviceDetails.practicalInfo?.baggage && (
                            <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-100">
                              <Luggage className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-gray-900 block">Franquia de Bagagem</span>
                                <span className="text-gray-600 leading-tight block">{serviceDetails.practicalInfo.baggage}</span>
                              </div>
                            </div>
                          )}

                          {/* Crianças e Bebês */}
                          {serviceDetails.practicalInfo?.children && (
                            <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-100">
                              <Baby className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-gray-900 block">Política de Crianças</span>
                                <span className="text-gray-600 leading-tight block">{serviceDetails.practicalInfo.children}</span>
                              </div>
                            </div>
                          )}

                          {/* Tolerância de Atraso */}
                          {serviceDetails.practicalInfo?.flightDelay && (
                            <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-100">
                              <Plane className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-gray-900 block">Atraso de Voo</span>
                                <span className="text-gray-600 leading-tight block">{serviceDetails.practicalInfo.flightDelay}</span>
                              </div>
                            </div>
                          )}

                          {/* Cancelamento 7 Dias */}
                          <div className="flex items-start gap-2 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/80">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-emerald-900">Cancelamento Estrito</span>
                                <a
                                  href="/faq"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-800 underline hover:text-emerald-950 font-bold"
                                >
                                  (Ver FAQ)
                                </a>
                              </div>
                              <span className="text-emerald-800 text-[10.5px] leading-tight block">
                                {CANCELLATION_POLICY.fullRefundText} Entre 7 dias e 48h voucher ou 50%.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumo Financeiro da Etapa 1 */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">
                      Subtotal Estimado
                    </span>
                    <span className="text-xl font-extrabold text-gray-900">
                      {formatPrice(fullTotal)}
                    </span>
                    {nightFeeApplied && (
                      <span className="text-[10px] text-amber-700 block font-medium">
                        + R$ 20 (Tarifa Noturna após 18h)
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => setWizardStep(2)}
                    disabled={!isStep1Valid}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Continuar para Identificação</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ETAPA 2: IDENTIFICAÇÃO & EMBARQUE */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                
                {/* Alternador de Documento: Brasileiro vs Estrangeiro */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Nacionalidade do Titular</span>
                    <span className="text-[11px] text-gray-500">
                      {form.isForeigner
                        ? 'Identificação via Passaporte ou ID Internacional'
                        : 'Identificação padrão via CPF brasileiro'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-lg shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, isForeigner: false, ddi: '+55' }))}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        !form.isForeigner
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🇧🇷 Brasileiro
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, isForeigner: true, ddi: '+1' }))}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        form.isForeigner
                          ? 'bg-[#D4AF37] text-gray-950 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🌍 Estrangeiro
                    </button>
                  </div>
                </div>

                {/* Campos do Titular */}
                <div className="space-y-3">
                  {/* Nome Completo */}
                  <div className="space-y-1">
                    <Label htmlFor="step2-name" className="text-xs font-semibold text-gray-700">
                      Nome Completo do Titular *
                    </Label>
                    <Input
                      id="step2-name"
                      placeholder="Ex: Maria Silva Santos"
                      value={form.name}
                      onChange={handleChange('name')}
                      className="h-10 text-xs bg-white"
                    />
                  </div>

                  {/* WhatsApp com Seletor de DDI & E-mail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="step2-whatsapp" className="text-xs font-semibold text-gray-700">
                        WhatsApp para Envio do Voucher *
                      </Label>
                      <div className="flex gap-2">
                        {/* Seletor DDI */}
                        <Select value={form.ddi} onValueChange={handleDdiChange}>
                          <SelectTrigger className="w-28 h-10 text-xs bg-white border-gray-200 shrink-0">
                            <SelectValue placeholder="+55" />
                          </SelectTrigger>
                          <SelectContent className="z-[150] bg-white border border-gray-200 max-h-56">
                            {DDI_OPTIONS.map((item) => (
                              <SelectItem key={item.code} value={item.code} className="text-xs">
                                <span>{item.flag}</span> <span className="font-bold">{item.code}</span> ({item.country})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Input do Telefone */}
                        <Input
                          id="step2-whatsapp"
                          placeholder={form.ddi === '+55' ? '(85) 99999-9999' : 'Número com código de área'}
                          value={form.whatsapp}
                          onChange={handleChange('whatsapp')}
                          className="h-10 text-xs bg-white flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="step2-email" className="text-xs font-semibold text-gray-700">
                        E-mail de Confirmação
                      </Label>
                      <Input
                        id="step2-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={handleChange('email')}
                        className="h-10 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Campo de Documento (CPF vs Passaporte) */}
                  <div className="space-y-1">
                    <Label htmlFor="step2-doc" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                      <span>{form.isForeigner ? 'Passaporte / ID Internacional *' : 'CPF do Titular *'}</span>
                      {!form.isForeigner && form.cpf && (
                        <span className={`text-[10px] font-bold ${isCpfValid ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isCpfValid ? '✓ CPF Válido' : '✕ CPF Inválido'}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="step2-doc"
                      placeholder={form.isForeigner ? 'Ex: AA1234567 ou Documento de Identidade' : '000.000.000-00'}
                      value={form.isForeigner ? form.passport : form.cpf}
                      onChange={handleChange(form.isForeigner ? 'passport' : 'cpf')}
                      className={`h-10 text-xs bg-white ${
                        !form.isForeigner && form.cpf && !isCpfValid ? 'border-red-400 focus:ring-red-400' : ''
                      }`}
                    />
                  </div>

                  {/* Local de Embarque Inteligente */}
                  <div className="space-y-1">
                    <Label htmlFor="step2-pickup" className="text-xs font-semibold text-gray-700">
                      Local de Embarque / Hotel / Pousada *
                    </Label>
                    <Input
                      id="step2-pickup"
                      placeholder="Ex: Hotel Vila Kalango, Aeroporto de Fortaleza, ou Pousada em Jeri"
                      value={form.pickup}
                      onChange={handleChange('pickup')}
                      className="h-10 text-xs bg-white"
                    />
                    
                    {/* Banner de Ajuda Sutil */}
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-blue-900 text-[11px] mt-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Ainda não escolheu seu hotel? Digite <strong>"A definir"</strong> e nos informe até 24h antes do embarque via WhatsApp.
                      </span>
                    </div>
                  </div>

                  {/* Dados do Voo (se aplicável) */}
                  {isTransfer && (
                    <div className="space-y-1 pt-1">
                      <Label htmlFor="step2-flight" className="text-xs font-semibold text-gray-700">
                        Número do Voo & Horário de Pouso (Opcional)
                      </Label>
                      <Input
                        id="step2-flight"
                        placeholder="Ex: G3 1540 pousando às 14:20"
                        value={form.flightDetails}
                        onChange={handleChange('flightDetails')}
                        className="h-10 text-xs bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Botões de Navegação Etapa 2 */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWizardStep(1)}
                    className="h-10 text-xs px-4 border-gray-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    disabled={!isStep2Valid}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
                  >
                    <span>Avançar para Pagamento</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ETAPA 3: PAGAMENTO SEGURO MULTI-GATEWAY */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                
                {/* Modalidade de Quitação (Sinal 50% vs 100%) */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Escolha a Condição de Pagamento
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('50')}
                      className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMode === '50'
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-gray-900">Sinal de 50%</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        Garanta sua vaga pagando 50% agora e o restante de {formatPrice(remainingBalance)} no embarque.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('100')}
                      className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMode === '100'
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold text-gray-900">Pagamento Integral (100%)</span>
                        {paymentMode === '100' && (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        Pague o valor total do serviço e embarque sem nenhuma pendência financeira.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Resumo Financeiro Transparente */}
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 border-b border-gray-200/80 pb-2">
                    <span className="font-medium">Serviço:</span>
                    <span className="font-bold text-gray-900">{serviceTitle}</span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-gray-500">
                    <span>Valor Total do Serviço</span>
                    <span className="font-semibold text-gray-700">{formatPrice(fullTotal)}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-700">
                        {isDeposit ? 'Valor a pagar agora (Sinal 50%):' : 'Valor a pagar agora (100%):'}
                      </span>
                      <span className="text-gray-400 line-through">
                        Cartão: {formatPrice(chargeTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> PIX Dinâmico (5% OFF)
                      </span>
                      <span className="text-2xl font-black text-emerald-600">
                        {formatPrice(chargePixTotal)}
                      </span>
                    </div>
                  </div>

                  {isDeposit && (
                    <p className="text-xs text-amber-800 font-medium bg-amber-50/90 p-2 rounded-lg border border-amber-200 mt-2">
                      * O saldo de <strong>{formatPrice(remainingBalance)}</strong> deverá ser pago no dia do serviço diretamente ao motorista credenciado.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 text-xs rounded-lg p-3 border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* GATEWAYS CONTEXTUAIS (BRASILEIRO VS INTERNACIONAL) */}
                <div className="space-y-2.5 pt-1">
                  
                  {/* Se for Cliente Internacional: Prioridade Stripe Checkout */}
                  {form.isForeigner ? (
                    <>
                      {/* Botão Stripe Internacional */}
                      <Button
                        onClick={handleStripePayment}
                        disabled={loading || loadingPix}
                        className="w-full h-13 bg-slate-900 hover:bg-black text-white font-bold text-sm sm:text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#D4AF37]" />
                        )}
                        <span>
                          {loading
                            ? 'Abrindo Stripe Checkout...'
                            : `Pagar com Cartão Internacional (${formatPrice(chargeTotal)})`}
                        </span>
                      </Button>

                      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 py-0.5">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Stripe Verified
                        </span>
                        <span>•</span>
                        <span>Visa / MasterCard / Amex</span>
                        <span>•</span>
                        <span>Criptografia 256-bit</span>
                      </div>

                      {/* PIX como opção secundária */}
                      <Button
                        onClick={handlePixPayment}
                        disabled={loadingPix || loading}
                        variant="outline"
                        className="w-full h-11 border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loadingPix ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                        Pagar via PIX com 5% OFF ({formatPrice(chargePixTotal)})
                      </Button>
                    </>
                  ) : (
                    /* Se for Cliente Brasileiro: PIX em Destaque + Mercado Pago */
                    <>
                      {/* Botão 1: PIX Dinâmico com 5% OFF */}
                      <Button
                        onClick={handlePixPayment}
                        disabled={loadingPix || loading}
                        className="w-full h-13 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                      >
                        {loadingPix ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <QrCode className="w-5 h-5" />
                        )}
                        <span>
                          {loadingPix
                            ? 'Gerando QR Code Pix...'
                            : `Pagar com PIX Dinâmico • ${formatPrice(chargePixTotal)}`}
                        </span>
                      </Button>

                      {/* Botão 2: Cartão de Crédito Mercado Pago */}
                      <Button
                        onClick={handleMercadoPago}
                        disabled={loading || loadingPix}
                        className="w-full h-11 bg-[#009ee3] hover:bg-[#007eb5] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        <span>Pagar com Cartão até 12x • {formatPrice(chargeTotal)}</span>
                      </Button>

                      {/* Botão 3: Stripe Internacional (opcional para cartões internacionais) */}
                      <Button
                        onClick={handleStripePayment}
                        disabled={loading || loadingPix}
                        variant="outline"
                        className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-gray-500" />
                        <span>Cartão Internacional (Stripe)</span>
                      </Button>
                    </>
                  )}

                  {/* Botão de Escape / WhatsApp */}
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="w-full h-10 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar com Consultor via WhatsApp</span>
                  </Button>
                </div>

                {/* Botão Voltar Etapa 2 */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Voltar para dados de identificação
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP STATUS: PIX QR CODE & INSTRUÇÕES */}
        {stepStatus === 'pix' && pixData && (
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-4 animate-in fade-in">
            <div className="flex justify-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs max-w-xs mx-auto">
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code Pix"
                className="w-48 h-48 sm:w-52 sm:h-52"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Código Pix Copia e Cola:</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={pixData.qrCode}
                  className="h-10 text-xs font-mono bg-white truncate"
                />
                <Button
                  onClick={handleCopyPix}
                  variant="outline"
                  className="h-10 px-4 shrink-0 text-xs font-bold"
                >
                  {copied ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCheck className="w-4 h-4" /> Copiado!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-4 h-4" /> Copiar
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Estado de Pagamento Pix Confirmado vs Aguardando */}
            {isPixConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-2.5 animate-in zoom-in-95">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Pagamento Pix Confirmado pelo Banco!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Sua reserva foi ativada com sucesso e seu voucher oficial de embarque já está disponível.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const resCode = createdReservationCode || sessionStorage.getItem('active_booking_code');
                    handleOpenChange(false);
                    window.location.href = `/voucher/${resCode}`;
                  }}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer mt-1"
                >
                  <span>Acessar Voucher Oficial Confirmado</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            ) : (
              <>
                {/* Aviso de Polling em tempo real */}
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Aguardando identificação bancária... Atualização em tempo real.</span>
                </div>

                {pixVerificationMessage && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    pixVerificationMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{pixVerificationMessage.text}</span>
                  </div>
                )}

                {/* Botão de Verificação Real */}
                <Button
                  onClick={handleVerifyPixPayment}
                  disabled={loadingPix}
                  className="w-full h-13 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
                >
                  {loadingPix ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Já realizei o pagamento (Verificar Agora)
                </Button>
              </>
            )}
          </div>
        )}

        {/* STEP STATUS: SUCESSO / VOUCHER */}
        {stepStatus === 'success' && (
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-5 text-center animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-gray-900">
                Reserva Registrada com Sucesso!
              </h3>
              <p className="text-xs text-gray-500">
                Sua solicitação para <strong className="text-gray-800">{serviceTitle}</strong> foi registrada no sistema.
              </p>
            </div>

            {createdReservationCode && (
              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Código Localizador
                </span>
                <div className="flex items-center justify-center gap-2 font-mono text-2xl font-black text-[#2C7A7B]">
                  <span>{createdReservationCode}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(createdReservationCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              {createdReservationCode && (
                <Button
                  onClick={() => {
                    handleOpenChange(false);
                    window.open(`/voucher/${createdReservationCode}`, '_blank');
                  }}
                  className="w-full h-12 bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-sm sm:text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Visualizar Meu Voucher
                </Button>
              )}

              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full h-11 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Falar com Suporte no WhatsApp
              </Button>
            </div>

            {/* Enviar voucher por e-mail */}
            {createdReservationCode && (
              <div className="mt-6 pt-5 border-t border-gray-100 text-left">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Deseja receber o voucher no seu e-mail?
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (emailStatus === 'error') setEmailStatus('');
                    }}
                    disabled={emailStatus === 'sending' || emailStatus === 'sent'}
                    className="h-10 text-xs flex-1"
                  />
                  <Button
                    onClick={handleSendVoucherEmail}
                    disabled={!emailInput || emailStatus === 'sending' || emailStatus === 'sent'}
                    className="h-10 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold"
                  >
                    {emailStatus === 'sending' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Enviar Voucher'
                    )}
                  </Button>
                </div>
                {emailStatus === 'sent' && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2">
                    Voucher enviado com sucesso!
                  </p>
                )}
                {emailStatus === 'error' && (
                  <p className="text-xs font-semibold text-red-500 mt-2">
                    Falha ao enviar e-mail. Verifique o endereço.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
