import React, { useState, useMemo, useCallback } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Loader2, MessageCircle, CreditCard, Copy, CheckCheck, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { calculateTotal, formatPrice } from '@/data/catalog';
import { createCheckout } from '@/services/payment';

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
  pickup: '',
  passengers: 1,
};

export default function BookingModal({ item, open, onOpenChange }) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isTransfer = item.category === 'transfer';

  const unitPrice = useMemo(() => {
    if (isTransfer) {
      return item.selectedType === 'Privativo' ? item.privatePrice : item.sharedPrice;
    }
    return item.unitPrice;
  }, [item, isTransfer]);

  const priceLabel = isTransfer
    ? item.selectedType === 'Privativo'
      ? item.privateNote
      : item.sharedNote
    : item.priceType === 'per_person'
      ? item.per
      : item.per;

  const isPerPerson = isTransfer
    ? item.selectedType === 'Compartilhado'
    : item.priceType === 'per_person';

  const total = useMemo(() => {
    if (isPerPerson) return unitPrice * form.passengers;
    return unitPrice;
  }, [unitPrice, form.passengers, isPerPerson]);

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

  const isFormValid = form.name.trim() && form.whatsapp.replace(/\D/g, '').length >= 10 && form.date;

  const resetModal = useCallback(() => {
    setForm(initialForm);
    setStep('form');
    setPixData(null);
    setError(null);
    setCopied(false);
    setLoading(false);
  }, []);

  const handleOpenChange = useCallback((isOpen) => {
    if (!isOpen) resetModal();
    onOpenChange(isOpen);
  }, [onOpenChange, resetModal]);

  const serviceTitle = isTransfer
    ? `${item.title} (${item.selectedType})`
    : item.title;

  const handleMercadoPago = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckout({
        title: serviceTitle,
        unitPrice: unitPrice,
        quantity: isPerPerson ? form.passengers : 1,
        payer: {
          name: form.name,
          email: form.email || undefined,
          phone: form.whatsapp,
        },
        metadata: {
          serviceId: item.id,
          category: item.category,
          type: item.selectedType || item.type,
          date: format(form.date, 'yyyy-MM-dd'),
          pickup: form.pickup,
          passengers: form.passengers,
        },
      });

      if (result.init_point) {
        window.open(result.init_point, '_blank');
        return;
      }

      if (result.point_of_interaction?.transaction_data?.qr_code_base64) {
        setPixData({
          qrCodeBase64: result.point_of_interaction.transaction_data.qr_code_base64,
          qrCode: result.point_of_interaction.transaction_data.qr_code,
          ticketUrl: result.point_of_interaction.transaction_data.ticket_url,
        });
        setStep('pix');
        return;
      }

      setError('Resposta inesperada do servidor de pagamento.');
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [form, unitPrice, isPerPerson, serviceTitle, item]);

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `Olá! Gostaria de reservar:\n\n` +
      `*${serviceTitle}*\n` +
      `Data: ${format(form.date, 'dd/MM/yyyy')}\n` +
      (form.pickup ? `Ponto de Partida: ${form.pickup}\n` : '') +
      `Pessoas: ${form.passengers}\n` +
      `Total: ${formatPrice(total)}\n\n` +
      `Nome: ${form.name}\n` +
      `WhatsApp: ${form.whatsapp}` +
      (form.email ? `\nE-mail: ${form.email}` : '')
    );
    window.open(`https://wa.me/5592981038749?text=${msg}`, '_blank');
  }, [form, serviceTitle, total]);

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
            <div className="space-y-1.5">
              <Label htmlFor="booking-name" className="text-xs font-semibold">Nome Completo *</Label>
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
                <Label htmlFor="booking-whatsapp" className="text-xs font-semibold">WhatsApp *</Label>
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
                <Label htmlFor="booking-email" className="text-xs font-semibold">E-mail</Label>
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

            <div className="relative space-y-1.5">
              <Label className="text-xs font-semibold">Data do Serviço *</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                className={`w-full justify-start text-left font-normal h-11 bg-white border border-gray-200 ${form.date ? 'text-gray-900' : 'text-muted-foreground'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.date ? format(form.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione uma data'}
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
              {form.date && !isCalendarOpen && (
                <p className="text-xs text-[#2C7A7B] font-medium">
                  <CalendarDays className="inline w-3 h-3 mr-1" />
                  {format(form.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="booking-pickup" className="text-xs font-semibold">Ponto de Partida / Hotel</Label>
                <Input
                  id="booking-pickup"
                  placeholder="Ex: Hotel Beach Club"
                  value={form.pickup}
                  onChange={handleChange('pickup')}
                  className="h-11 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-passengers" className="text-xs font-semibold">Pessoas *</Label>
                <Input
                  id="booking-passengers"
                  type="number"
                  min="1"
                  max="50"
                  value={form.passengers}
                  onChange={handleChange('passengers')}
                  className="h-11 bg-white"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-[#F7F3E9] to-white rounded-xl p-3.5 sm:p-4 border border-[#D4AF37]/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 truncate pr-2">{serviceTitle}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">{priceLabel}</span>
              </div>
              {isPerPerson && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {formatPrice(unitPrice)} x {form.passengers} {form.passengers === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                  <span className="text-sm text-gray-600">{formatPrice(unitPrice * form.passengers)}</span>
                </div>
              )}
              <div className="border-t border-[#D4AF37]/20 pt-2 mt-2 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#2C7A7B]">{formatPrice(total)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-200">
                {error}
              </div>
            )}

            <Button
              onClick={handleMercadoPago}
              disabled={!isFormValid || loading}
              className="w-full h-13 sm:h-12 bg-[#009ee3] hover:bg-[#007eb5] text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              {loading ? 'Processando...' : 'Pagar com Mercado Pago'}
            </Button>

            <Button
              onClick={handleWhatsApp}
              disabled={!isFormValid}
              variant="outline"
              className="w-full h-13 sm:h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Finalizar no WhatsApp
            </Button>

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
                  {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-[#2C7A7B]/5 rounded-xl p-4 text-center border border-[#2C7A7B]/10">
              <p className="text-sm text-gray-700 mb-1">
                <strong>Total: {formatPrice(total)}</strong>
              </p>
              <p className="text-xs text-gray-500">
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
              className="w-full h-13 sm:h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
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
