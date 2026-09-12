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
  CalendarIcon,
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
} from '@/data/catalog';
import { createCheckout, createPixPayment } from '@/services/payment';
import { createStripeCheckout } from '@/services/stripePayment';
import { sendBookingToHotelOps } from '@/services/hotelopsIntegration';
import { useLanguage } from '@/i18n/LanguageContext';
import { buildWhatsAppLink } from '@/utils/whatsapp';

function formatPhone(value) {
  return value;
}

const initialForm = {
  name: '',
  whatsapp: '',
  email: '',
  cpf: '',
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

  const [form, setForm] = useState(initialForm);
  const [paymentMode, setPaymentMode] = useState('50'); // '50' | '100'
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
  const [createdReservationCode, setCreatedReservationCode] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState(''); // 'idle', 'sending', 'sent', 'error'

  // Polling para pagamento aprovado
  useEffect(() => {
    let interval;
    if (step === 'pix' && createdReservationCode) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://hotelops-rh.vercel.app/api/booking-public?code=${createdReservationCode}`);
          const data = await res.json();
          if (data && data.success && data.booking) {
            const status = data.booking.payment_status;
            if (status === 'pago_integral' || status === 'sinal_pago') {
              setStep('success');
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
  }, [step, createdReservationCode]);

  // Seleção de Locale para date-fns conforme idioma
  const dateFnsLocale = useMemo(() => {
    if (language === 'en') return enUS;
    if (language === 'es') return es;
    return ptBR;
  }, [language]);

  // Identifica se o item é um Transfer
  const transferItem = useMemo(() => {
    if (!internalItem) return null;
    if (internalItem.category === 'transfer' && internalItem.options) return internalItem;
    if (internalItem.raw?.category === 'transfer' && internalItem.raw?.options) return internalItem.raw;
    if (internalItem.options?.private?.tiers) return internalItem;
    if (internalItem.raw?.options?.private?.tiers) return internalItem.raw;
    return null;
  }, [internalItem]);

  // Identifica se o item é um Passeio (Tour)
  const tourItem = useMemo(() => {
    if (!internalItem) return null;
    if (internalItem.category === 'tour' && internalItem.options) return internalItem;
    if (internalItem.raw?.category === 'tour' && internalItem.raw?.options) return internalItem.raw;
    if (internalItem.category === 'tour' && internalItem.requireWhatsApp) return internalItem;
    if (internalItem.raw?.category === 'tour') return internalItem.raw;
    return null;
  }, [internalItem]);

  const serviceTitle = useMemo(() => {
    const itemObj = transferItem || tourItem || internalItem;
    const rawTitle = itemObj?.title || 'Serviço';
    if (!itemObj?.id) return rawTitle;
    const res = t(`catalog.${itemObj.id}`, { defaultValue: rawTitle });
    return (res && typeof res === 'string' && !res.startsWith('catalog.')) ? res : rawTitle;
  }, [transferItem, tourItem, internalItem, t]);

  const isTransfer = Boolean(transferItem || internalItem?.category === 'transfer');
  const isTour = Boolean(tourItem || internalItem?.category === 'tour');
  const isRoundTrip = isTransfer && form.tripType === 'roundTrip';

  useEffect(() => {
    if (transferItem) {
      const sharedAvailable = transferItem.options?.shared?.available;
      const privateAvailable = transferItem.options?.private?.available !== false;
      const initialType = (internalItem?.selectedType === 'Compartilhado' || !privateAvailable) && sharedAvailable ? 'shared' : 'private';
      const initialTrip = internalItem?.selectedTripType || 'roundTrip';
      setForm((prev) => ({
        ...prev,
        optionType: initialType,
        tripType: initialTrip,
      }));
    } else if (tourItem) {
      const sharedAvailable = tourItem.options?.shared?.available;
      const initialType = internalItem?.selectedType === 'Compartilhado' && sharedAvailable ? 'shared' : 'private';
      const defaultVehicle = internalItem?.selectedVehicleType || tourItem.options?.private?.vehicles?.[0]?.type || 'Buggy';
      setForm((prev) => ({
        ...prev,
        optionType: initialType,
        selectedVehicleType: defaultVehicle,
      }));
    }
  }, [transferItem, tourItem, internalItem]);

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

  const isDeposit = isPortuguese && paymentMode === '50';
  const chargeTotal = useMemo(() => (isDeposit ? fullTotal / 2 : fullTotal), [fullTotal, isDeposit]);
  const chargePixTotal = useMemo(() => (isDeposit ? fullPixTotal / 2 : fullPixTotal), [fullPixTotal, isDeposit]);
  const remainingBalance = useMemo(() => (isDeposit ? fullTotal / 2 : 0), [fullTotal, isDeposit]);

  const handleChange = useCallback((field) => (e) => {
    if (field === 'passengers') {
      const val = parseInt(e.target.value, 10);
      setForm((prev) => ({ ...prev, passengers: isNaN(val) || val < 1 ? 1 : val }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleDateSelect = useCallback((date) => {
    setForm((prev) => ({ ...prev, date }));
    setIsCalendarOpen(false);
  }, []);

  const handleReturnDateSelect = useCallback((date) => {
    setForm((prev) => ({ ...prev, returnDate: date }));
    setIsReturnCalendarOpen(false);
  }, []);

  const isFormValid = Boolean(
    form.name.trim() &&
    form.whatsapp.trim().length >= 7 &&
    form.date &&
    form.pickup.trim() !== '' &&
    (!isRoundTrip || form.returnDate)
  );

  const hasSentToHotelOpsRef = useRef(false);

  const resetModal = useCallback(() => {
    setForm(initialForm);
    setStep('form');
    setPixData(null);
    setError(null);
    setCopied(false);
    setLoading(false);
    setLoadingPix(false);
    setIsCalendarOpen(false);
    setIsReturnCalendarOpen(false);
    setPaymentMode('50');
    setCreatedReservationCode(null);
    hasSentToHotelOpsRef.current = false;
  }, []);

  const saveBookingToStorage = useCallback((paymentMethodName = 'Pix', existingCode = null) => {
    const code = existingCode || `JRI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const isDeposit = isPortuguese && paymentMode === '50';
    const isPix = (paymentMethodName || '').toLowerCase().includes('pix');
    const amountPaid = isDeposit ? (isPix ? chargePixTotal : chargeTotal) : (isPix ? fullPixTotal : fullTotal);
    const remaining = isDeposit ? remainingBalance : 0;

    const bookingObj = {
      code,
      created_at: new Date().toISOString(),
      client_name: form.name || 'Cliente Jericoacoara Premium',
      client_phone: form.whatsapp || '',
      client_email: form.email || '',
      status: isPix ? 'pendente' : 'confirmada',
      payment_status: isPix ? 'pendente' : (isDeposit ? 'sinal_pago' : 'pago_integral'),
      payment_method: isPix ? 'pix' : 'cartao',
      amount_total: fullTotal,
      amount_paid: amountPaid,
      remaining_balance: remaining,
      pickup_location: form.pickup || 'Ponto informado no formulário',
      notes: form.flightDetails ? `Voo: ${form.flightDetails}` : '',
      items: [
        {
          title: serviceTitle,
          service_type: isTransfer ? 'transfer' : 'passeio',
          modality: form.optionType,
          vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType || 'SW4 4x4 / Buggy',
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
  }, [form, fullTotal, fullPixTotal, chargeTotal, chargePixTotal, remainingBalance, isDeposit, isPortuguese, paymentMode, serviceTitle, isTransfer, selectedTier, tourPriceInfo]);

  const handleOpenChange = useCallback(
    (isOpen) => {
      if (!isOpen) resetModal();
      onOpenChange(isOpen);
    },
    [onOpenChange, resetModal]
  );



  const triggerHotelOpsSync = useCallback(
    (paymentMethodName) => {
      if (hasSentToHotelOpsRef.current) {
        console.log('[HotelOps Sync] Disparo já realizado para este checkout. Ignorando duplicata.');
        return;
      }
      hasSentToHotelOpsRef.current = true;

      const itemInfo = internalItem || { title: serviceTitle, category: isTransfer ? 'transfer' : 'tour' };
      const paymentInfo = {
        fullTotal,
        fullPixTotal,
        chargeTotal: paymentMethodName === 'Pix' ? chargePixTotal : chargeTotal,
        chargePixTotal,
        remainingBalance: isPortuguese ? remainingBalance : 0,
        paymentMode: isPortuguese ? paymentMode : '100',
        paymentMethod: paymentMethodName,
        vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType,
        isWhatsAppOnly: !isPortuguese || isWhatsAppOnly,
        paymentStatus: 'pendente',
        reservationStatus: 'pendente',
      };

      sendBookingToHotelOps(form, itemInfo, paymentInfo).catch((e) =>
        console.error('Erro na sincronização HotelOps CRM:', e)
      );
    },
    [
      form,
      internalItem,
      serviceTitle,
      isTransfer,
      fullTotal,
      fullPixTotal,
      chargeTotal,
      chargePixTotal,
      remainingBalance,
      paymentMode,
      isPortuguese,
      selectedTier,
      tourPriceInfo,
      isWhatsAppOnly,
    ]
  );

  // Mercado Pago Checkout Handler (para PT)
  const handleMercadoPago = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const finalUnitPrice = Math.round(chargeTotal * 100) / 100;
      if (!finalUnitPrice || finalUnitPrice <= 0) {
        throw new Error('Valor inválido para o checkout. Verifique a opção e o veículo selecionados.');
      }

      const resCode = saveBookingToStorage('Cartão de Crédito');
      triggerHotelOpsSync('Cartão de Crédito (Mercado Pago)');

      const titleSuffix = isDeposit ? ' - Sinal de 50%' : ' - Pagamento Integral';
      const result = await createCheckout({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: finalUnitPrice,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: form.whatsapp,
        },
        metadata: {
          serviceId: internalItem?.id || 'service',
          category: internalItem?.category || (isTransfer ? 'transfer' : 'tour'),
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || undefined,
          date: format(form.date, 'yyyy-MM-dd'),
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
          cpf: form.cpf || undefined,
          code: resCode,
        },
      });

      if (result.init_point) {
        window.open(result.init_point, '_blank');
        setStep('success');
        return;
      }

      setError('Resposta inesperada do servidor de pagamento.');
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [form, chargeTotal, fullTotal, remainingBalance, paymentMode, isDeposit, serviceTitle, internalItem, selectedTier, tourPriceInfo, isTransfer, isRoundTrip, triggerHotelOpsSync, saveBookingToStorage]);

  // Pix Handler (para PT)
  const handlePixPayment = useCallback(async () => {
    setLoadingPix(true);
    setError(null);
    try {
      const finalPixUnitPrice = Math.round(chargePixTotal * 100) / 100;
      if (!finalPixUnitPrice || finalPixUnitPrice <= 0) {
        throw new Error('Valor inválido para a chave Pix. Verifique a opção e o veículo selecionados.');
      }

      // Verifica se já existe um active_booking_code nesta sessão para reaproveitar
      let resCode = sessionStorage.getItem('active_booking_code');
      if (!resCode) {
        resCode = saveBookingToStorage('Pix');
        sessionStorage.setItem('active_booking_code', resCode);
        triggerHotelOpsSync('Pix');
      } else {
        // Apenas atualiza o storage local se já existe
        saveBookingToStorage('Pix', resCode);
      }

      const titleSuffix = isDeposit ? ' - Sinal 50% PIX' : ' - PIX (5% OFF)';
      const result = await createPixPayment({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: finalPixUnitPrice,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: form.whatsapp,
        },
        metadata: {
          serviceId: internalItem?.id || 'service',
          category: internalItem?.category || (isTransfer ? 'transfer' : 'tour'),
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || undefined,
          date: format(form.date, 'yyyy-MM-dd'),
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
          cpf: form.cpf || undefined,
          code: resCode,
        },
      });

      if (result.qr_code_base64) {
        const pixInfo = {
          qrCodeBase64: result.qr_code_base64,
          qrCode: result.qr_code,
          ticketUrl: result.ticket_url,
        };
        setPixData(pixInfo);
        
        try {
          localStorage.setItem(`jeri_pix_data_${resCode}`, JSON.stringify(pixInfo));
        } catch(e) {}
        
        setStep('pix');
        return;
      }

      setError('Erro ao gerar código Pix.');
    } catch (err) {
      setError(err.message || 'Erro ao gerar pagamento Pix. Tente novamente.');
    } finally {
      setLoadingPix(false);
    }
  }, [form, chargePixTotal, fullTotal, remainingBalance, paymentMode, isDeposit, serviceTitle, internalItem, selectedTier, tourPriceInfo, isTransfer, isRoundTrip, triggerHotelOpsSync, saveBookingToStorage]);

  // Handler do WhatsApp em PT, EN ou ES
  const handleWhatsApp = useCallback(() => {
    triggerHotelOpsSync(isPortuguese ? 'WhatsApp' : 'WhatsApp (International)');
    const resCode = createdReservationCode || saveBookingToStorage(isPortuguese ? 'WhatsApp' : 'WhatsApp (International)');

    let msgText = '';

    if (language === 'en') {
      msgText = `Hello! I would like to book:\n\n*${serviceTitle}*\n`;
      if (isTransfer) {
        const tripLabelMap = {
          oneWay: 'One Way',
          returnWay: 'Return Only',
          roundTrip: 'Round Trip',
        };
        msgText += `Route: ${tripLabelMap[form.tripType] || 'Round Trip'}\n`;
        msgText += `Service: ${form.optionType === 'shared' ? 'Shared' : `Private (${selectedTier?.vehicle || 'Exclusive'})`}\n`;
        if (form.flightDetails.trim()) {
          msgText += `Flight Details: ${form.flightDetails.trim()}\n`;
        }
      } else if (isTour) {
        msgText += `Modality: ${form.optionType === 'shared' ? 'Shared' : `Private (${tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType})`}\n`;
      }
      if (isRoundTrip && form.returnDate) {
        msgText += `Departure Date: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` at ${form.time}` : ''}\n`;
        msgText += `Return Date: ${format(form.returnDate, 'dd/MM/yyyy')}${isTransfer ? ` at ${form.returnTime}` : ''}\n`;
      } else {
        msgText += `Date: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` at ${form.time}` : ''}\n`;
      }
      if (form.pickup) msgText += `Pickup Location: ${form.pickup}\n`;
      msgText += `Travelers: ${form.passengers}\n`;
      msgText += `Total Price: *${formatPrice(fullTotal)}*\n`;
      msgText += `\nName: ${form.name}\nContact Phone: ${form.whatsapp}`;
      if (form.email) msgText += `\nEmail: ${form.email}`;
    } else if (language === 'es') {
      msgText = `¡Hola! Me gustaría reservar:\n\n*${serviceTitle}*\n`;
      if (isTransfer) {
        const tripLabelMap = {
          oneWay: 'Solo Ida',
          returnWay: 'Solo Vuelta',
          roundTrip: 'Ida y Vuelta',
        };
        msgText += `Trayecto: ${tripLabelMap[form.tripType] || 'Ida y Vuelta'}\n`;
        msgText += `Servicio: ${form.optionType === 'shared' ? 'Compartido' : `Privado (${selectedTier?.vehicle || 'Exclusivo'})`}\n`;
        if (form.flightDetails.trim()) {
          msgText += `Datos del Vuelo: ${form.flightDetails.trim()}\n`;
        }
      } else if (isTour) {
        msgText += `Modalidad: ${form.optionType === 'shared' ? 'Compartido' : `Privado (${tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType})`}\n`;
      }
      if (isRoundTrip && form.returnDate) {
        msgText += `Fecha de Ida: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` a las ${form.time}hs` : ''}\n`;
        msgText += `Fecha de Vuelta: ${format(form.returnDate, 'dd/MM/yyyy')}${isTransfer ? ` a las ${form.returnTime}hs` : ''}\n`;
      } else {
        msgText += `Fecha: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` a las ${form.time}hs` : ''}\n`;
      }
      if (form.pickup) msgText += `Lugar de Recogida: ${form.pickup}\n`;
      msgText += `Pasajeros: ${form.passengers}\n`;
      msgText += `Precio Total: *${formatPrice(fullTotal)}*\n`;
      msgText += `\nNombre: ${form.name}\nTeléfono: ${form.whatsapp}`;
      if (form.email) msgText += `\nCorreo: ${form.email}`;
    } else {
      // Português
      msgText = `Olá! Gostaria de ${isWhatsAppOnly ? 'consultar disponibilidade para' : 'reservar'}:\n\n*${serviceTitle}*\n`;
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
        if (tourPriceInfo?.vehicleCount > 1) {
          msgText += `Veículos: ${tourPriceInfo.vehicleCount}x ${tourPriceInfo.selectedVehicle?.type}\n`;
        }
      }

      if (isRoundTrip && form.returnDate) {
        msgText += `Data da Ida: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` às ${form.time}h` : ''}\n`;
        msgText += `Data da Volta: ${format(form.returnDate, 'dd/MM/yyyy')}${isTransfer ? ` às ${form.returnTime}h` : ''}\n`;
      } else {
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

      msgText += `\nNome: ${form.name}\nContato: ${form.whatsapp}`;
      if (form.email) msgText += `\nE-mail: ${form.email}`;
    }

    window.open(buildWhatsAppLink(msgText), '_blank');
    setStep('success');
  }, [form, serviceTitle, isTransfer, isTour, isRoundTrip, isWhatsAppOnly, isPortuguese, language, isDeposit, fullTotal, chargeTotal, chargePixTotal, remainingBalance, selectedTier, tourPriceInfo, nightFeeApplied, triggerHotelOpsSync, createdReservationCode, saveBookingToStorage]);

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
        body: JSON.stringify({ code: createdReservationCode, email: emailInput })
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
      <DialogContent className="z-[60] w-[95vw] max-w-lg mx-auto max-h-[90dvh] overflow-hidden rounded-xl bg-white p-0 shadow-xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <DialogHeader className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900 pr-8">
            {step === 'success'
              ? 'Reserva Solicitada!'
              : step === 'pix'
              ? t('bookingModal.pixTitle')
              : (isWhatsAppOnly || !isPortuguese)
              ? t('bookingModal.whatsappTitle')
              : t('bookingModal.modalTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {step === 'success'
              ? 'Sua solicitação foi registrada no sistema com sucesso.'
              : step === 'pix'
              ? t('bookingModal.pixInstructions')
              : serviceTitle}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
            
            {/* Seletor do Serviço */}
            <div className="space-y-1.5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <Label className="text-xs font-semibold text-gray-700">{t('bookingModal.serviceSelected')} *</Label>
              <Select
                value={internalItem?.id || ''}
                onValueChange={(val) => {
                  const newTransfer = transfersData.find((t) => t.id === val);
                  if (newTransfer) setInternalItem(newTransfer);
                  const newTour = toursData.find((t) => t.id === val);
                  if (newTour) setInternalItem(newTour);
                }}
              >
                <SelectTrigger className="h-10 bg-white text-xs font-medium border-gray-200">
                  <SelectValue placeholder="Escolha o serviço..." />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg max-h-60">
                  <div className="px-2 py-1.5 text-xs font-bold text-gray-500 bg-gray-50">Transfers</div>
                  {transfersData.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 mt-2">Passeios e Roteiros</div>
                  {toursData.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transfer Fields */}
            {isTransfer && transferItem && (
              <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">{t('bookingModal.tripType')} *</Label>
                    <Select
                      value={form.tripType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, tripType: val }))}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium border-gray-200">
                        <SelectValue placeholder="Trajeto" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="oneWay">{t('transfers.oneWay')}</SelectItem>
                        <SelectItem value="returnWay">Somente Volta</SelectItem>
                        <SelectItem value="roundTrip">{t('transfers.roundTrip')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">{t('bookingModal.serviceType')} *</Label>
                    <Select
                      value={form.optionType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, optionType: val }))}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium border-gray-200">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                        {transferItem?.options?.private?.available !== false && (
                          <SelectItem value="private">{t('tours.private')}</SelectItem>
                        )}
                        {transferItem?.options?.shared?.available !== false && (
                          <SelectItem value="shared">{t('tours.shared')}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isRoundTrip ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="booking-time" className="text-xs font-semibold text-gray-700">
                          {t('bookingModal.departureTime')} *
                        </Label>
                        <div className="relative flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none z-10 shrink-0" />
                          <Input
                            id="booking-time"
                            type="time"
                            value={form.time}
                            onChange={handleChange('time')}
                            className="h-10 bg-white text-xs pl-9 pr-3 w-full rounded-md border border-gray-200 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="booking-return-time" className="text-xs font-semibold text-gray-700">
                          {t('bookingModal.returnTime')} *
                        </Label>
                        <div className="relative flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none z-10 shrink-0" />
                          <Input
                            id="booking-return-time"
                            type="time"
                            value={form.returnTime}
                            onChange={handleChange('returnTime')}
                            className="h-10 bg-white text-xs pl-9 pr-3 w-full rounded-md border border-gray-200 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="booking-flight" className="text-xs font-semibold text-gray-700">
                        {t('bookingModal.flightData')}
                      </Label>
                      <Input
                        id="booking-flight"
                        placeholder={t('bookingModal.flightPlaceholder')}
                        value={form.flightDetails}
                        onChange={handleChange('flightDetails')}
                        className="h-10 bg-white text-xs px-3 w-full rounded-md border border-gray-200"
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="booking-time" className="text-xs font-semibold text-gray-700">
                        {t('bookingModal.departureTime')} *
                      </Label>
                      <div className="relative flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none z-10 shrink-0" />
                        <Input
                          id="booking-time"
                          type="time"
                          value={form.time}
                          onChange={handleChange('time')}
                          className="h-10 bg-white text-xs pl-9 pr-3 w-full rounded-md border border-gray-200 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="booking-flight" className="text-xs font-semibold text-gray-700">
                        {t('bookingModal.flightData')}
                      </Label>
                      <Input
                        id="booking-flight"
                        placeholder={t('bookingModal.flightPlaceholder')}
                        value={form.flightDetails}
                        onChange={handleChange('flightDetails')}
                        className="h-10 bg-white text-xs px-3 w-full rounded-md border border-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tour Fields */}
            {isTour && tourItem && (
              <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className={`grid grid-cols-1 ${form.optionType === 'private' ? 'sm:grid-cols-2' : ''} gap-3`}>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">{t('bookingModal.modality')} *</Label>
                    <Select
                      value={form.optionType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, optionType: val }))}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium">
                        <SelectValue placeholder="Modalidade" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="private">{t('tours.private')}</SelectItem>
                        {tourItem.options?.shared?.available && (
                          <SelectItem value="shared">{t('tours.shared')}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {form.optionType === 'private' && tourItem.options?.private?.vehicles && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">{t('bookingModal.vehicle')} *</Label>
                      <Select
                        value={form.selectedVehicleType}
                        onValueChange={(val) => setForm((prev) => ({ ...prev, selectedVehicleType: val }))}
                      >
                        <SelectTrigger className="h-10 bg-white text-xs font-medium">
                          <SelectValue placeholder="Veículo" />
                        </SelectTrigger>
                        <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                          {tourItem.options.private.vehicles.map((v) => (
                            <SelectItem key={v.type} value={v.type}>
                              {v.type} {v.requireWhatsApp ? '(WhatsApp)' : `- ${formatPrice(v.price)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dados do Cliente */}
            <div className="space-y-1.5">
              <Label htmlFor="booking-name" className="text-xs font-semibold">
                {t('bookingModal.fullName')} *
              </Label>
              <Input
                id="booking-name"
                placeholder={t('bookingModal.fullNamePlaceholder')}
                value={form.name}
                onChange={handleChange('name')}
                className="h-10 bg-white text-xs"
              />
            </div>

            <div className={`grid grid-cols-1 ${isPortuguese ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
              <div className="space-y-1.5">
                <Label htmlFor="booking-whatsapp" className="text-xs font-semibold">
                  {t('bookingModal.whatsapp')} *
                </Label>
                <Input
                  id="booking-whatsapp"
                  placeholder={t('bookingModal.whatsappPlaceholder')}
                  value={form.whatsapp}
                  onChange={handleChange('whatsapp')}
                  className="h-10 bg-white text-xs"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="booking-email" className="text-xs font-semibold">
                  {t('bookingModal.email')}
                </Label>
                <Input
                  id="booking-email"
                  type="email"
                  placeholder={t('bookingModal.emailPlaceholder')}
                  value={form.email}
                  onChange={handleChange('email')}
                  className="h-10 bg-white text-xs"
                />
              </div>

              {/* Campo CPF exibido APENAS para Português */}
              {isPortuguese && (
                <div className="space-y-1.5">
                  <Label htmlFor="booking-cpf" className="text-xs font-semibold">
                    CPF
                  </Label>
                  <Input
                    id="booking-cpf"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={handleChange('cpf')}
                    className="h-10 bg-white text-xs"
                  />
                </div>
              )}
            </div>

            {/* Datas, Local e Pessoas */}
            <div className={`grid grid-cols-1 ${isRoundTrip ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
              <div className="relative space-y-1.5 sm:col-span-1">
                <Label className="text-xs font-semibold">
                  {isRoundTrip ? t('bookingModal.departureDate') : `${t('bookingModal.departureDate')} *`}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCalendarOpen((prev) => !prev);
                    setIsReturnCalendarOpen(false);
                  }}
                  className={`w-full justify-start text-left font-normal h-10 bg-white border border-gray-200 text-xs ${
                    form.date ? 'text-gray-900' : 'text-muted-foreground'
                  }`}
                >
                  <CalendarIcon className="mr-1.5 h-4 w-4" />
                  {form.date ? format(form.date, 'dd/MM/yy') : t('bookingModal.departureDate')}
                </Button>
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-1 z-[100] bg-white border border-gray-200 rounded-lg shadow-2xl p-2">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={handleDateSelect}
                      disabled={(date) => isBefore(date, startOfDay(addDays(new Date(), 1)))}
                      locale={dateFnsLocale}
                    />
                  </div>
                )}
              </div>

              {isRoundTrip && (
                <div className="relative space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-semibold">{t('bookingModal.returnDate')} *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsReturnCalendarOpen((prev) => !prev);
                      setIsCalendarOpen(false);
                    }}
                    className={`w-full justify-start text-left font-normal h-10 bg-white border border-gray-200 text-xs ${
                      form.returnDate ? 'text-gray-900' : 'text-muted-foreground'
                    }`}
                  >
                    <CalendarIcon className="mr-1.5 h-4 w-4" />
                    {form.returnDate ? format(form.returnDate, 'dd/MM/yy') : t('bookingModal.returnDate')}
                  </Button>
                  {isReturnCalendarOpen && (
                    <div className="absolute top-full left-0 mt-1 z-[100] bg-white border border-gray-200 rounded-lg shadow-2xl p-2">
                      <Calendar
                        mode="single"
                        selected={form.returnDate}
                        onSelect={handleReturnDateSelect}
                        disabled={(date) =>
                          isBefore(date, startOfDay(form.date ? form.date : addDays(new Date(), 1)))
                        }
                        locale={dateFnsLocale}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-pickup" className="text-xs font-semibold">
                  {t('bookingModal.pickupLocation')} *
                </Label>
                <Input
                  id="booking-pickup"
                  placeholder={t('bookingModal.pickupPlaceholder')}
                  value={form.pickup}
                  onChange={handleChange('pickup')}
                  className="h-10 bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-passengers" className="text-xs font-semibold">
                  {t('bookingModal.passengers')} *
                </Label>
                <div className="flex items-center justify-between h-10 bg-white border border-gray-200 rounded-md px-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={form.passengers <= 1}
                    onClick={() => setForm((prev) => ({ ...prev, passengers: Math.max(1, prev.passengers - 1) }))}
                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <span className="text-sm font-bold text-gray-900 min-w-[2rem] text-center select-none">
                    {form.passengers}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setForm((prev) => ({ ...prev, passengers: prev.passengers + 1 }))}
                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Seções de Pagamento Condicionais */}
            {isPortuguese && !isWhatsAppOnly ? (
              <>
                {/* Seleção de Fração de Pagamento (Apenas para Português PT) */}
                <div className="space-y-2 mt-4">
                  <Label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    {t('bookingModal.paymentMethodLabel')} *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('50')}
                      className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        paymentMode === '50'
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          {t('bookingModal.deposit50')}
                          {paymentMode === '50' && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {t('bookingModal.recommended')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        {t('bookingModal.deposit50Desc')}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('100')}
                      className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                        paymentMode === '100'
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          {t('bookingModal.full100')}
                          {paymentMode === '100' && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        {t('bookingModal.full100Desc')}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Resumo do Valor */}
                <div className="bg-gray-50 p-4 rounded-lg mt-3 border border-gray-200 space-y-1.5">
                  {isPrivate && selectedTier && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#2C7A7B]" />
                      Veículo: <span className="font-semibold">{selectedTier.vehicle}</span>
                    </p>
                  )}
                  {nightFeeApplied && (
                    <p className="text-sm text-amber-600 mb-2 font-medium flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-amber-600 shrink-0" />
                      + R$ 20 (Tarifa Noturna)
                    </p>
                  )}

                  <div className="flex justify-between items-baseline text-xs text-gray-500 pb-1">
                    <span>{t('bookingModal.totalValue')}</span>
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
                      <span className="text-xs font-bold text-emerald-800">
                        {t('bookingModal.pixDiscountLabel')}
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatPrice(chargePixTotal)}
                      </span>
                    </div>
                  </div>

                  {isDeposit && (
                    <p className="text-xs text-amber-800 font-medium bg-amber-50/90 p-2 rounded border border-amber-200 mt-2">
                      * O saldo restante de <strong>{formatPrice(remainingBalance)}</strong> deverá ser pago no dia do serviço.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-200">
                    {error}
                  </div>
                )}

                {/* Botões de Ação de Pagamento PT */}
                <div className="space-y-2 mt-3">
                  <Button
                    onClick={handlePixPayment}
                    disabled={!isFormValid || loadingPix || loading}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {loadingPix ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <QrCode className="w-5 h-5" />
                    )}
                    {loadingPix ? t('bookingModal.generatingPix') : t('bookingModal.payWithPix', { price: formatPrice(chargePixTotal) })}
                  </Button>

                  <Button
                    onClick={handleMercadoPago}
                    disabled={!isFormValid || loading || loadingPix}
                    className="w-full h-11 bg-[#009ee3] hover:bg-[#007eb5] text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {loading ? t('bookingModal.processing') : t('bookingModal.payWithCardMP', { price: formatPrice(chargeTotal) })}
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    disabled={!isFormValid}
                    variant="outline"
                    className="w-full h-11 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('bookingModal.finishWhatsApp')}
                  </Button>
                </div>
              </>
            ) : (
              /* Modo Direcionado ao WhatsApp (Para EN/ES e serviços WhatsApp Only) */
              <div className="pt-2 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs text-gray-500 pb-1">
                    <span>{t('bookingModal.totalValue')}</span>
                    <span className="font-bold text-gray-900 text-lg">{formatPrice(fullTotal)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleWhatsApp}
                  disabled={!isFormValid}
                  className="w-full h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6" />
                  {t('bookingModal.finishWhatsApp')}
                </Button>
              </div>
            )}

            <p className="text-[11px] text-gray-400 text-center leading-relaxed pb-1">
              {t('bookingModal.guaranteeFooter')}
            </p>
          </div>
        )}

        {step === 'pix' && pixData && (
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
            <div className="flex justify-center bg-white p-4 rounded-xl border border-gray-200">
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code Pix"
                className="w-48 h-48 sm:w-56 sm:h-56"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('bookingModal.copyPix')}</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={pixData.qrCode}
                  className="h-11 text-xs font-mono bg-white truncate"
                />
                <Button
                  onClick={handleCopyPix}
                  variant="outline"
                  className="h-11 px-4 flex-shrink-0"
                >
                  {copied ? (
                    <CheckCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-base text-gray-900 mb-1">
                <strong>Total no PIX: {formatPrice(chargePixTotal)}</strong>
              </p>
              <p className="text-xs text-gray-600">
                {t('bookingModal.pixPaidConfirm')}
              </p>
            </div>

            <div className="text-center">
              <a
                href={pixData.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#009ee3] hover:underline"
              >
                {t('bookingModal.openMP')}
              </a>
            </div>

            {createdReservationCode && (
              <Button
                onClick={() => {
                  handleOpenChange(false);
                  window.open(`/voucher/${createdReservationCode}`, '_blank');
                }}
                className="w-full h-12 bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FileText className="w-5 h-5" />
                Visualizar Meu Voucher ({createdReservationCode})
              </Button>
            )}

            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Já realizei o pagamento no banco
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-gray-900">
                Reserva Confirmada com Sucesso!
              </h3>
              <p className="text-xs text-gray-500">
                Sua reserva para <strong className="text-gray-800">{serviceTitle}</strong> foi registrada no sistema.
              </p>
            </div>

            {createdReservationCode && (
              <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Código Localizador</span>
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
                    {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
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
                  className="w-full h-13 bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <FileText className="w-5 h-5" />
                  Visualizar Meu Voucher
                </Button>
              )}

              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full h-11 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Falar com Suporte no WhatsApp
              </Button>
            </div>

            {/* Opcional: Enviar voucher por e-mail */}
            {createdReservationCode && (
              <div className="mt-6 pt-5 border-t border-gray-100 text-left">
                <p className="text-xs font-semibold text-gray-700 mb-2">Deseja receber o voucher no seu e-mail?</p>
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
                    {emailStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Voucher'}
                  </Button>
                </div>
                {emailStatus === 'sent' && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2">Voucher enviado com sucesso!</p>
                )}
                {emailStatus === 'error' && (
                  <p className="text-xs font-semibold text-red-500 mt-2">Falha ao enviar e-mail. Verifique o endereço.</p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
