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
  time: '12:00',
  pickup: '',
  passengers: 1,
  // Campos de Transfer
  tripType: 'roundTrip', // 'oneWay' | 'returnWay' | 'roundTrip'
  optionType: 'private', // 'shared' | 'private'
  selectedTierIndex: undefined,
  // Campos de Passeio (Tour)
  selectedVehicleType: 'Buggy',
};

export default function BookingModal({ item, open, onOpenChange }) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  // Cálculo dos totais (Cartão e Pix 5% OFF)
  const total = useMemo(() => {
    if (transferPriceInfo) return transferPriceInfo.total;
    if (tourPriceInfo) return tourPriceInfo.total;
    if (item?.priceType === 'per_person') return item.unitPrice * form.passengers;
    return item?.unitPrice || 0;
  }, [transferPriceInfo, tourPriceInfo, item, form.passengers]);

  const totalPix = useMemo(() => {
    if (transferPriceInfo) return transferPriceInfo.pixTotal;
    if (tourPriceInfo) return tourPriceInfo.pixTotal;
    return total * 0.95;
  }, [transferPriceInfo, tourPriceInfo, total]);

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

  const isFormValid = Boolean(
    form.name.trim() && form.whatsapp.replace(/\D/g, '').length >= 10 && form.date
  );

  const resetModal = useCallback(() => {
    setForm(initialForm);
    setStep('form');
    setPixData(null);
    setError(null);
    setCopied(false);
    setLoading(false);
    setLoadingPix(false);
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

  // Mercado Pago Checkout Pro (Envio do total normal)
  const handleMercadoPago = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckout({
        title: serviceTitle,
        unitPrice: total,
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
          time: form.time,
          pickup: form.pickup,
          passengers: form.passengers,
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
  }, [form, total, serviceTitle, item, selectedTier, tourPriceInfo, isTransfer]);

  // Geração Direta de Pix (Envio do totalPix com 5% OFF)
  const handlePixPayment = useCallback(async () => {
    setLoadingPix(true);
    setError(null);
    try {
      const result = await createPixPayment({
        title: `${serviceTitle} - PIX (5% OFF)`,
        unitPrice: totalPix,
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
          time: form.time,
          pickup: form.pickup,
          passengers: form.passengers,
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
  }, [form, totalPix, serviceTitle, item, selectedTier, tourPriceInfo, isTransfer]);

  // Envio Formatado para o WhatsApp
  const handleWhatsApp = useCallback(() => {
    let msgText = `Olá! Gostaria de ${isWhatsAppOnly ? 'consultar disponibilidade para' : 'reservar'}:\n\n*${serviceTitle}*\n`;

    if (isTransfer) {
      const tripLabelMap = {
        oneWay: 'Somente Ida',
        returnWay: 'Somente Volta',
        roundTrip: 'Ida e Volta',
      };
      msgText += `Trajeto: ${tripLabelMap[form.tripType] || 'Ida e Volta'}\n`;
      msgText += `Serviço: ${form.optionType === 'shared' ? 'Compartilhado' : `Privativo (${selectedTier?.vehicle || 'Exclusivo'})`}\n`;
    } else if (isTour) {
      msgText += `Modalidade: ${form.optionType === 'shared' ? 'Compartilhado' : `Privativo (${tourPriceInfo?.selectedVehicle?.type || form.selectedVehicleType})`}\n`;
      if (tourPriceInfo?.vehicleCount > 1) {
        msgText += `Veículos: ${tourPriceInfo.vehicleCount}x ${tourPriceInfo.selectedVehicle?.type}\n`;
      }
    }

    msgText += `Data: ${format(form.date, 'dd/MM/yyyy')}${isTransfer ? ` às ${form.time}h` : ''}\n`;
    if (form.pickup) msgText += `Ponto de Partida: ${form.pickup}\n`;
    msgText += `Passageiros: ${form.passengers}\n`;

    if (!isWhatsAppOnly) {
      const nightText = nightFeeApplied ? ' (+ R$ 20 Tarifa Noturna)' : '';
      msgText += `Cartão: ${formatPrice(total)}${nightText}\n`;
      msgText += `PIX (5% OFF): *${formatPrice(totalPix)}*\n`;
    } else {
      msgText += `Solicito informações de horários e reserva.\n`;
    }

    msgText += `\nNome: ${form.name}\nWhatsApp: ${form.whatsapp}`;
    if (form.email) msgText += `\nE-mail: ${form.email}`;

    window.open(`https://wa.me/5592981038749?text=${encodeURIComponent(msgText)}`, '_blank');
  }, [form, serviceTitle, isTransfer, isTour, isWhatsAppOnly, total, totalPix, selectedTier, tourPriceInfo, nightFeeApplied]);

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
                      <SelectTrigger className="h-10 bg-white text-xs font-medium">
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
                      <SelectTrigger className="h-10 bg-white text-xs font-medium">
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

                <div className="space-y-1.5">
                  <Label htmlFor="booking-time" className="text-xs font-semibold text-gray-700">
                    Horário de Chegada/Partida *
                  </Label>
                  <div className="relative">
                    <Input
                      id="booking-time"
                      type="time"
                      value={form.time}
                      onChange={handleChange('time')}
                      className="h-10 bg-white text-xs pl-9"
                    />
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
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
                className="h-11 bg-white"
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
                  className="h-11 bg-white"
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
                  className="h-11 bg-white"
                />
              </div>
            </div>

            {/* Data, Ponto de Partida / Local de Embarque e Pessoas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative space-y-1.5 sm:col-span-1">
                <Label className="text-xs font-semibold">Data *</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className={`w-full justify-start text-left font-normal h-11 bg-white border border-gray-200 text-xs ${
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

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-pickup" className="text-xs font-semibold">
                  {isTour ? 'Local de Embarque' : 'Ponto de Partida'}
                </Label>
                <Input
                  id="booking-pickup"
                  placeholder={isTour ? 'Ex: Nome da Pousada' : 'Ex: Hotel / Voo'}
                  value={form.pickup}
                  onChange={handleChange('pickup')}
                  className="h-11 bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-passengers" className="text-xs font-semibold">
                  Pessoas *
                </Label>
                <div className="flex items-center justify-between h-11 bg-white border border-gray-200 rounded-md px-2 shadow-2xs">
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
                {/* Resumo e Desconto Pix */}
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100 space-y-1.5">
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

                  <p className="text-gray-500 line-through text-xs font-medium">
                    Cartão: {formatPrice(total)}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    PIX (5% OFF): {formatPrice(totalPix)}
                  </p>
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
                    {loadingPix ? 'Gerando Pix...' : `Pagar com Pix (${formatPrice(totalPix)})`}
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
                    {loading ? 'Processando...' : `Pagar no Cartão (${formatPrice(total)})`}
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
