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
  tripType: 'roundTrip', // 'oneWay' | 'returnWay' | 'roundTrip'
  optionType: 'private', // 'shared' | 'private'
  selectedTierIndex: undefined,
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

  // Identifica se o item possui a estrutura aninhada de transfer (transfersData)
  const transferItem = useMemo(() => {
    if (!item) return null;
    if (item.options) return item;
    if (item.raw?.options) return item.raw;
    return null;
  }, [item]);

  const isTransfer = Boolean(transferItem || item?.category === 'transfer');

  // Ao abrir o modal, define os valores iniciais adequados
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
    }
  }, [transferItem, item]);

  // Cálculo da precificação e veículo selecionado
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

  const isPrivate = transferPriceInfo ? transferPriceInfo.isPrivate : item?.selectedType === 'Privativo';
  const selectedTier = transferPriceInfo?.selectedTier;
  const nightFeeApplied = transferPriceInfo ? transferPriceInfo.nightFeeApplied : false;

  const total = useMemo(() => {
    if (transferPriceInfo) {
      return transferPriceInfo.total;
    }
    if (item?.priceType === 'per_person') return item.unitPrice * form.passengers;
    return item?.unitPrice || 0;
  }, [transferPriceInfo, item, form.passengers]);

  const totalPix = useMemo(() => {
    if (transferPriceInfo) {
      return transferPriceInfo.pixTotal;
    }
    return total * 0.95;
  }, [transferPriceInfo, total]);

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
    if (transferItem) {
      return transferItem.title;
    }
    if (isTransfer && item) {
      return `${item.title} (${item.selectedType})`;
    }
    return item?.title || 'Serviço';
  }, [transferItem, isTransfer, item]);

  // Checkout Pro Mercado Pago (Envio do total normal)
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
          category: item?.category || 'transfer',
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || undefined,
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
  }, [form, total, serviceTitle, item, selectedTier]);

  // Geração Direta de Pix (Envio do totalPix com 5% de desconto)
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
          category: item?.category || 'transfer',
          tripType: form.tripType,
          optionType: form.optionType,
          vehicle: selectedTier?.vehicle || undefined,
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
  }, [form, totalPix, serviceTitle, item, selectedTier]);

  // Envio Formatado para o WhatsApp
  const handleWhatsApp = useCallback(() => {
    const tripLabelMap = {
      oneWay: 'Somente Ida',
      returnWay: 'Somente Volta',
      roundTrip: 'Ida e Volta',
    };
    const tripText = tripLabelMap[form.tripType] || 'Ida e Volta';
    const modeText =
      form.optionType === 'shared'
        ? 'Compartilhado'
        : `Privativo (${selectedTier?.vehicle || 'Veículo Exclusivo'})`;

    const nightText = nightFeeApplied ? '\n+ R$ 20 (Tarifa Noturna após 18h)' : '';

    const msg = encodeURIComponent(
      `Olá! Gostaria de reservar:\n\n` +
        `*${serviceTitle}*\n` +
        `Trajeto: ${tripText}\n` +
        `Serviço: ${modeText}\n` +
        `Data: ${format(form.date, 'dd/MM/yyyy')} às ${form.time}h\n` +
        (form.pickup ? `Ponto de Partida: ${form.pickup}\n` : '') +
        `Passageiros: ${form.passengers}\n` +
        `Cartão: ${formatPrice(total)}${nightText}\n` +
        `PIX (5% OFF): *${formatPrice(totalPix)}*\n\n` +
        `Nome: ${form.name}\n` +
        `WhatsApp: ${form.whatsapp}` +
        (form.email ? `\nE-mail: ${form.email}` : '')
    );
    window.open(`https://wa.me/5592981038749?text=${msg}`, '_blank');
  }, [form, serviceTitle, total, totalPix, selectedTier, nightFeeApplied]);

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
            {step === 'pix' ? 'Pagamento via Pix' : 'Reservar Serviço'}
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
            {isTransfer && (
              <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Trajeto (Select) */}
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

                  {/* Tipo de Serviço (Select) */}
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

                {/* Horário de Chegada / Partida */}
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

            {/* Data, Ponto de Partida e Pessoas */}
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
                  {form.date ? format(form.date, "dd/MM/yy") : 'Data'}
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
                  Ponto de Partida
                </Label>
                <Input
                  id="booking-pickup"
                  placeholder="Ex: Hotel / Voo"
                  value={form.pickup}
                  onChange={handleChange('pickup')}
                  className="h-11 bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="booking-passengers" className="text-xs font-semibold">
                  Pessoas *
                </Label>
                <Input
                  id="booking-passengers"
                  type="number"
                  min="1"
                  max="50"
                  value={form.passengers}
                  onChange={handleChange('passengers')}
                  className="h-11 bg-white text-xs"
                />
              </div>
            </div>

            {/* Etapa 4: Exibição de Resumo e Desconto Pix */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100 space-y-1.5">
              {isPrivate && selectedTier && (
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#2C7A7B]" />
                  Veículo: <span className="font-semibold">{selectedTier.vehicle}</span>
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

            {/* Botões de Ação */}
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

            <p className="text-[11px] text-gray-400 text-center leading-relaxed pb-1">
              Pagamento seguro via Mercado Pago (Pix ou Cartão de Crédito).
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
