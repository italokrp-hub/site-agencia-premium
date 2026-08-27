import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
} from '@/data/catalog';
import { createCheckout, createPixPayment } from '@/services/payment';
import { registerBookingToERP } from '@/services/bookingIntegration';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const initialForm = {
  name: '',
  whatsapp: '',
  email: '',
  date: undefined,
  returnDate: undefined,
  time: '12:00',
  returnTime: '12:00',
  pickup: '',
  passengers: 1,
  flightDetails: '',
  // Campos de Transfer
  tripType: 'roundTrip', // 'oneWay' | 'returnWay' | 'roundTrip'
  optionType: 'private', // 'shared' | 'private'
  selectedTierIndex: undefined,
  // Campos de Passeio (Tour)
  selectedVehicleType: 'Buggy',
};

export default function BookingModal({ item, open, onOpenChange }) {
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

  // Identifica se o item é um Transfer (estrutura aninhada)
  const transferItem = useMemo(() => {
    if (!item) return null;
    if (item.category === 'transfer' && item.options) return item;
    if (item.raw?.category === 'transfer' && item.raw?.options) return item.raw;
    if (item.options?.private?.tiers) return item;
    if (item.raw?.options?.private?.tiers) return item.raw;
    return null;
  }, [item]);

  // Identifica se o item é um Passeio (Tour)
  const tourItem = useMemo(() => {
    if (!item) return null;
    if (item.category === 'tour' && item.options) return item;
    if (item.raw?.category === 'tour' && item.raw?.options) return item.raw;
    if (item.category === 'tour' && item.requireWhatsApp) return item;
    if (item.raw?.category === 'tour') return item.raw;
    return null;
  }, [item]);

  const isTransfer = Boolean(transferItem || item?.category === 'transfer');
  const isTour = Boolean(tourItem || item?.category === 'tour');
  const isRoundTrip = isTransfer && form.tripType === 'roundTrip';

  // Define os valores iniciais adequados quando o modal é aberto
  useEffect(() => {
    if (transferItem) {
      const sharedAvailable = transferItem.options?.shared?.available;
      const initialType = item?.selectedType === 'Compartilhado' && sharedAvailable ? 'shared' : 'private';
      const initialTrip = item?.selectedTripType || 'roundTrip';
      setForm((prev) => ({
        ...prev,
        optionType: initialType,
        tripType: initialTrip,
      }));
    } else if (tourItem) {
      const sharedAvailable = tourItem.options?.shared?.available;
      const initialType = item?.selectedType === 'Compartilhado' && sharedAvailable ? 'shared' : 'private';
      const defaultVehicle = tourItem.options?.private?.vehicles?.[0]?.type || 'Buggy';
      setForm((prev) => ({
        ...prev,
        optionType: initialType,
        selectedVehicleType: item?.selectedVehicleType || defaultVehicle,
      }));
    }
  }, [transferItem, tourItem, item]);

  // Cálculo de preço de Transfer
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

  // Cálculo de preço de Passeio (Tour)
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

  // Verifica se o item/veículo exige atendimento via WhatsApp
  const isWhatsAppOnly = useMemo(() => {
    if (tourPriceInfo) return tourPriceInfo.isWhatsAppOnly;
    if (item?.requireWhatsApp) return true;
    return false;
  }, [tourPriceInfo, item]);

  const isPrivate = useMemo(() => {
    if (transferPriceInfo) return transferPriceInfo.isPrivate;
    if (tourPriceInfo) return tourPriceInfo.optionType === 'private';
    return item?.selectedType === 'Privativo';
  }, [transferPriceInfo, tourPriceInfo, item]);

  const selectedTier = transferPriceInfo?.selectedTier;
  const nightFeeApplied = transferPriceInfo ? transferPriceInfo.nightFeeApplied : false;

  // Cálculo dos totais integrais (Cartão e Pix 5% OFF)
  const fullTotal = useMemo(() => {
    if (transferPriceInfo) return transferPriceInfo.total;
    if (tourPriceInfo) return tourPriceInfo.total;
    if (item?.priceType === 'per_person') return item.unitPrice * form.passengers;
    return item?.unitPrice || 0;
  }, [transferPriceInfo, tourPriceInfo, item, form.passengers]);

  const fullPixTotal = useMemo(() => {
    if (transferPriceInfo) return transferPriceInfo.pixTotal;
    if (tourPriceInfo) return tourPriceInfo.pixTotal;
    return fullTotal * 0.95;
  }, [transferPriceInfo, tourPriceInfo, fullTotal]);

  // Cálculos considerando o pagamento de sinal de 50% vs 100% integral
  const isDeposit = paymentMode === '50';
  const chargeTotal = useMemo(() => (isDeposit ? fullTotal / 2 : fullTotal), [fullTotal, isDeposit]);
  const chargePixTotal = useMemo(() => (isDeposit ? fullPixTotal / 2 : fullPixTotal), [fullPixTotal, isDeposit]);
  const remainingBalance = useMemo(() => (isDeposit ? fullTotal / 2 : 0), [fullTotal, isDeposit]);

  const handleChange = useCallback((field) => (e) => {
    if (field === 'whatsapp') {
      setForm((prev) => ({ ...prev, whatsapp: formatPhone(e.target.value) }));
      return;
    }
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
    form.whatsapp.replace(/\D/g, '').length >= 10 &&
    form.date &&
    form.pickup.trim() !== '' &&
    (!isRoundTrip || form.returnDate)
  );

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
  }, []);

  const handleOpenChange = useCallback(
    (isOpen) => {
      if (!isOpen) resetModal();
      onOpenChange(isOpen);
    },
    [onOpenChange, resetModal]
  );

  const serviceTitle = useMemo(() => {
    if (transferItem) return transferItem.title;
    if (tourItem) return tourItem.title;
    if (item?.title) return item.title;
    return 'Serviço';
  }, [transferItem, tourItem, item]);

  // Mercado Pago Checkout Pro (Envio do valor fracionado chargeTotal)
  const handleMercadoPago = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Sincronização não-bloqueante com o ERP Supabase
      registerBookingToERP(form, item || { title: serviceTitle, category: isTransfer ? 'transfer' : 'tour' }, {
        fullTotal,
        chargeTotal,
        paymentMode,
        paymentMethod: 'Cartão de Crédito',
        vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType,
      }).catch((e) => console.error('Erro na sincronização ERP Supabase:', e));

      const titleSuffix = isDeposit ? ' - Sinal de 50%' : ' - Pagamento Integral';
      const result = await createCheckout({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: chargeTotal,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: form.whatsapp,
        },
        metadata: {
          serviceId: item?.id || 'service',
          category: item?.category || (isTransfer ? 'transfer' : 'tour'),
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
          chargeTotal,
          remainingBalance,
        },
      });

      if (result.init_point) {
        window.open(result.init_point, '_blank');
        return;
      }

      setError('Resposta inesperada do servidor de pagamento.');
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [form, chargeTotal, fullTotal, remainingBalance, paymentMode, isDeposit, serviceTitle, item, selectedTier, tourPriceInfo, isTransfer, isRoundTrip]);

  // Geração Direta de Pix (Envio do valor fracionado chargePixTotal)
  const handlePixPayment = useCallback(async () => {
    setLoadingPix(true);
    setError(null);
    try {
      // Sincronização não-bloqueante com o ERP Supabase
      registerBookingToERP(form, item || { title: serviceTitle, category: isTransfer ? 'transfer' : 'tour' }, {
        fullTotal,
        chargeTotal: chargePixTotal,
        paymentMode,
        paymentMethod: 'Pix',
        vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType,
      }).catch((e) => console.error('Erro na sincronização ERP Supabase:', e));

      const titleSuffix = isDeposit ? ' - Sinal 50% PIX' : ' - PIX (5% OFF)';
      const result = await createPixPayment({
        title: `${serviceTitle}${titleSuffix}`,
        unitPrice: chargePixTotal,
        quantity: 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: form.whatsapp,
        },
        metadata: {
          serviceId: item?.id || 'service',
          category: item?.category || (isTransfer ? 'transfer' : 'tour'),
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
          chargePixTotal,
          remainingBalance,
          isPixDiscount: true,
        },
      });

      if (result.qr_code_base64) {
        setPixData({
          qrCodeBase64: result.qr_code_base64,
          qrCode: result.qr_code,
          ticketUrl: result.ticket_url,
        });
        setStep('pix');
        return;
      }

      setError('Erro ao gerar código Pix.');
    } catch (err) {
      setError(err.message || 'Erro ao gerar pagamento Pix. Tente novamente.');
    } finally {
      setLoadingPix(false);
    }
  }, [form, chargePixTotal, fullTotal, remainingBalance, paymentMode, isDeposit, serviceTitle, item, selectedTier, tourPriceInfo, isTransfer, isRoundTrip]);

  // Envio Formatado para o WhatsApp
  const handleWhatsApp = useCallback(() => {
    // Sincronização não-bloqueante com o ERP Supabase
    registerBookingToERP(form, item || { title: serviceTitle, category: isTransfer ? 'transfer' : 'tour' }, {
      fullTotal,
      chargeTotal,
      paymentMode,
      paymentMethod: 'WhatsApp',
      vehicle: selectedTier?.vehicle || tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType,
    }).catch((e) => console.error('Erro na sincronização ERP Supabase:', e));

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
    if (form.pickup) msgText += `Ponto de Partida: ${form.pickup}\n`;
    msgText += `Passageiros: ${form.passengers}\n`;

    if (!isWhatsAppOnly) {
      msgText += `Modalidade de Pagamento: *${isDeposit ? 'Sinal de 50%' : 'Pagamento Integral (100%)'}*\n`;
      const nightText = nightFeeApplied ? ' (+ R$ 20 Tarifa Noturna)' : '';
      if (isDeposit) {
        msgText += `Valor Total do Serviço: ${formatPrice(fullTotal)}${nightText}\n`;
        msgText += `Sinal no Cartão (50%): ${formatPrice(chargeTotal)}\n`;
        msgText += `Sinal no PIX (5% OFF): *${formatPrice(chargePixTotal)}*\n`;
        msgText += `Saldo Restante (no embarque): *${formatPrice(remainingBalance)}*\n`;
      } else {
        msgText += `Cartão (100%): ${formatPrice(chargeTotal)}${nightText}\n`;
        msgText += `PIX (5% OFF): *${formatPrice(chargePixTotal)}*\n`;
      }
    } else {
      msgText += `Solicito informações de horários e reserva.\n`;
    }

    msgText += `\nNome: ${form.name}\nWhatsApp: ${form.whatsapp}`;
    if (form.email) msgText += `\nE-mail: ${form.email}`;

    window.open(`https://wa.me/5592981038749?text=${encodeURIComponent(msgText)}`, '_blank');
  }, [form, serviceTitle, isTransfer, isTour, isRoundTrip, isWhatsAppOnly, isDeposit, fullTotal, chargeTotal, chargePixTotal, remainingBalance, selectedTier, tourPriceInfo, nightFeeApplied]);

  const handleCopyPix = useCallback(() => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [pixData]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[60] w-[95vw] max-w-lg mx-auto max-h-[90dvh] overflow-hidden rounded-xl bg-white p-0 shadow-xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <DialogHeader className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900 pr-8">
            {step === 'pix' ? 'Pagamento via Pix' : isWhatsAppOnly ? 'Consultar Atendimento Premium' : 'Reservar Serviço'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {step === 'pix'
              ? 'Escaneie o QR Code ou copie o código abaixo para pagar.'
              : serviceTitle}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
            {/* Campos adicionais para Transfer */}
            {isTransfer && transferItem && (
              <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">Trajeto *</Label>
                    <Select
                      value={form.tripType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, tripType: val }))}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium border-gray-200">
                        <SelectValue placeholder="Selecione o trajeto" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="oneWay">Somente Ida</SelectItem>
                        <SelectItem value="returnWay">Somente Volta</SelectItem>
                        <SelectItem value="roundTrip">Ida e Volta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">Tipo de Serviço *</Label>
                    <Select
                      value={form.optionType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, optionType: val }))}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium border-gray-200">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="private">Privativo</SelectItem>
                        {transferItem?.options?.shared?.available !== false && (
                          <SelectItem value="shared">Compartilhado</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Horários e Dados do Voo (Ida e Volta vs Trajeto Simples) */}
                {isRoundTrip ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="booking-time" className="text-xs font-semibold text-gray-700">
                          Horário de Chegada (Ida) *
                        </Label>
                        <div className="relative flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none z-10 shrink-0" />
                          <Input
                            id="booking-time"
                            type="time"
                            value={form.time}
                            onChange={handleChange('time')}
                            className="h-10 bg-white text-xs pl-9 pr-3 w-full rounded-md border border-gray-200 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="booking-return-time" className="text-xs font-semibold text-gray-700">
                          Horário de Partida (Volta) *
                        </Label>
                        <div className="relative flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none z-10 shrink-0" />
                          <Input
                            id="booking-return-time"
                            type="time"
                            value={form.returnTime}
                            onChange={handleChange('returnTime')}
                            className="h-10 bg-white text-xs pl-9 pr-3 w-full rounded-md border border-gray-200 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="booking-flight" className="text-xs font-semibold text-gray-700">
                        Dados do Voo (Opcional)
                      </Label>
                      <Input
                        id="booking-flight"
                        placeholder="Ex: LA3330 ou G3 1520"
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
                        Horário de Chegada/Partida *
                      </Label>
                      <div className="relative flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none z-10 shrink-0" />
                        <Input
                          id="booking-time"
                          type="time"
                          value={form.time}
                          onChange={handleChange('time')}
                          className="h-10 bg-white text-xs pl-9 pr-3 w-full rounded-md border border-gray-200 font-medium [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="booking-flight" className="text-xs font-semibold text-gray-700">
                        Dados do Voo (Opcional)
                      </Label>
                      <Input
                        id="booking-flight"
                        placeholder="Ex: LA3330 ou G3 1520"
                        value={form.flightDetails}
                        onChange={handleChange('flightDetails')}
                        className="h-10 bg-white text-xs px-3 w-full rounded-md border border-gray-200"
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  * Caso não saiba agora, você pode nos informar posteriormente pelo WhatsApp.
                </p>
              </div>
            )}

            {/* Campos adicionais para Passeio (Tour) */}
            {isTour && tourItem && (
              <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className={`grid grid-cols-1 ${form.optionType === 'private' ? 'sm:grid-cols-2' : ''} gap-3`}>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">Modalidade *</Label>
                    <Select
                      value={form.optionType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, optionType: val }))}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium">
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent className="z-[110] bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="private">Privativo</SelectItem>
                        {tourItem.options?.shared?.available && (
                          <SelectItem value="shared">Compartilhado</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {form.optionType === 'private' && tourItem.options?.private?.vehicles && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">Veículo *</Label>
                      <Select
                        value={form.selectedVehicleType}
                        onValueChange={(val) => setForm((prev) => ({ ...prev, selectedVehicleType: val }))}
                      >
                        <SelectTrigger className="h-10 bg-white text-xs font-medium">
                          <SelectValue placeholder="Selecione o veículo" />
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

                {/* Aviso visual de múltiplos veículos se multiplier > 1 (Apenas em Privativo) */}
                {!isWhatsAppOnly && form.optionType === 'private' && tourPriceInfo?.vehicleCount > 1 && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-2.5 flex items-center gap-2 text-xs font-medium">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Serão necessários <strong>{tourPriceInfo.vehicleCount} {tourPriceInfo.selectedVehicle?.type}s</strong> para acomodar {form.passengers} pessoas (capacidade máxima de {tourPriceInfo.maxCapacity} pessoas por veículo).
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Dados do Passageiro */}
            <div className="space-y-1.5">
              <Label htmlFor="booking-name" className="text-xs font-semibold">
                Nome Completo *
              </Label>
              <Input
                id="booking-name"
                placeholder="Seu nome completo"
                value={form.name}
                onChange={handleChange('name')}
                className="h-10 bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="booking-whatsapp" className="text-xs font-semibold">
                  WhatsApp *
                </Label>
                <Input
                  id="booking-whatsapp"
                  placeholder="(00) 00000-0000"
                  value={form.whatsapp}
                  onChange={handleChange('whatsapp')}
                  maxLength={16}
                  className="h-10 bg-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-email" className="text-xs font-semibold">
                  E-mail
                </Label>
                <Input
                  id="booking-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  className="h-10 bg-white text-xs"
                />
              </div>
            </div>

            {/* Data(s), Ponto de Partida / Local de Embarque e Pessoas */}
            <div className={`grid grid-cols-1 ${isRoundTrip ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
              <div className="relative space-y-1.5 sm:col-span-1">
                <Label className="text-xs font-semibold">
                  {isRoundTrip ? 'Data da Ida *' : 'Data *'}
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
                  {form.date ? format(form.date, 'dd/MM/yy') : 'Data'}
                </Button>
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-1 z-[100] bg-white border border-gray-200 rounded-lg shadow-2xl p-2">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={handleDateSelect}
                      disabled={(date) => isBefore(date, startOfDay(addDays(new Date(), 1)))}
                      locale={ptBR}
                    />
                  </div>
                )}
              </div>

              {/* Data da Volta (Apenas para Transfer Ida e Volta) */}
              {isRoundTrip && (
                <div className="relative space-y-1.5 sm:col-span-1">
                  <Label className="text-xs font-semibold">Data da Volta *</Label>
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
                    {form.returnDate ? format(form.returnDate, 'dd/MM/yy') : 'Retorno'}
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
                        locale={ptBR}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-pickup" className="text-xs font-semibold">
                  {isTour ? 'Local de Embarque *' : 'Ponto de Partida *'}
                </Label>
                <Input
                  id="booking-pickup"
                  placeholder={isTour ? 'Ex: Nome da Pousada' : 'Ex: Hotel / Voo'}
                  value={form.pickup}
                  onChange={handleChange('pickup')}
                  className="h-10 bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-passengers" className="text-xs font-semibold">
                  Pessoas *
                </Label>
                <div className="flex items-center justify-between h-10 bg-white border border-gray-200 rounded-md px-2 shadow-2xs">
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

            {/* Renderização Condicional: Se isWhatsAppOnly for true, esconde os botões e resumo de checkout */}
            {!isWhatsAppOnly ? (
              <>
                {/* Seleção de Fração de Pagamento (Sinal 50% vs Integral 100%) */}
                <div className="space-y-2 mt-4">
                  <Label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Como deseja pagar? *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Opção 1: Sinal de 50% */}
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
                          Sinal de 50%
                          {paymentMode === '50' && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        Garante a reserva agora. O resto no embarque.
                      </p>
                    </button>

                    {/* Opção 2: Integral 100% */}
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
                          Integral (100%)
                          {paymentMode === '100' && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">
                        Deixe tudo pago e viaje sem preocupações.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Resumo e Desconto Pix */}
                <div className="bg-gray-50 p-4 rounded-lg mt-3 border border-gray-200 space-y-1.5">
                  {isPrivate && selectedTier && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#2C7A7B]" />
                      Veículo: <span className="font-semibold">{selectedTier.vehicle}</span>
                    </p>
                  )}
                  {isPrivate && isTour && tourPriceInfo?.selectedVehicle && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#2C7A7B]" />
                      Veículo: <span className="font-semibold">{tourPriceInfo.vehicleCount > 1 ? `${tourPriceInfo.vehicleCount}x ` : ''}{tourPriceInfo.selectedVehicle.type}</span>
                    </p>
                  )}
                  {nightFeeApplied && (
                    <p className="text-sm text-amber-600 mb-2 font-medium flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-amber-600 shrink-0" />
                      + R$ 20 (Tarifa Noturna após 18h)
                    </p>
                  )}

                  <div className="flex justify-between items-baseline text-xs text-gray-500 pb-1">
                    <span>Valor Total do Serviço:</span>
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
                        PIX (5% OFF no pagamento):
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

                {/* Botões Padrão de Pagamento */}
                <div className="space-y-2">
                  <Button
                    onClick={handlePixPayment}
                    disabled={!isFormValid || loadingPix || loading}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loadingPix ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <QrCode className="w-5 h-5" />
                    )}
                    {loadingPix ? 'Gerando Pix...' : `Pagar com Pix (${formatPrice(chargePixTotal)})`}
                  </Button>

                  <Button
                    onClick={handleMercadoPago}
                    disabled={!isFormValid || loading || loadingPix}
                    className="w-full h-11 bg-[#009ee3] hover:bg-[#007eb5] text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {loading ? 'Processando...' : `Pagar no Cartão (${formatPrice(chargeTotal)})`}
                  </Button>

                  <Button
                    onClick={handleWhatsApp}
                    disabled={!isFormValid}
                    variant="outline"
                    className="w-full h-11 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Finalizar no WhatsApp
                  </Button>
                </div>
              </>
            ) : (
              /* Modo WhatsApp Only (Helicóptero / UTV / Serviços Premium) */
              <div className="pt-2 space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-emerald-900 mb-1">
                    Atendimento Premium Exclusivo
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Devido à altíssima procura e requisitos personalizados deste passeio, o agendamento é feito diretamente com a nossa equipe no WhatsApp.
                  </p>
                </div>

                <Button
                  onClick={handleWhatsApp}
                  disabled={!isFormValid}
                  className="w-full h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Consultar Disponibilidade no WhatsApp
                </Button>
              </div>
            )}

            <p className="text-[11px] text-gray-400 text-center leading-relaxed pb-1">
              Atendimento garantido Jericoacoara Premium.
              <br />
              Ao continuar, você concorda com nossos Termos de Uso.
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
              <Label className="text-xs font-semibold">Pix Copia e Cola</Label>
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
                <strong>Total no PIX: {formatPrice(totalPix)}</strong>
              </p>
              <p className="text-xs text-gray-600">
                Após o pagamento, confirmaremos sua reserva pelo WhatsApp em até 5 minutos.
              </p>
            </div>

            <div className="text-center">
              <a
                href={pixData.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#009ee3] hover:underline"
              >
                Abrir tela de pagamento do Mercado Pago
              </a>
            </div>

            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Confirmar Dados no WhatsApp
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
