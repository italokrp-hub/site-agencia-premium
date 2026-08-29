import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Compass,
  CreditCard,
  QrCode,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  LayoutList,
  CalendarDays,
  ChevronRight,
  RefreshCw,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  Plane,
  Sparkles,
  Users,
  Check,
} from 'lucide-react';
import { useAgency } from '@/hooks/useAgency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

export default function Reservas() {
  const {
    reservations,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    counts,
    departureCalendar,
    fetchReservations,
    updateReservationStatus,
    updatePaymentStatus,
    getWhatsAppRecoveryUrl,
  } = useAgency();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetail = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailOpen(true);
  };

  // Helper para formatar moeda em BRL
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  // Helper de ícone de veículo
  const getVehicleLabel = (vehicle) => {
    const v = (vehicle || '').toLowerCase();
    if (v.includes('buggy')) return 'Buggy (4x4 Exclusivo)';
    if (v.includes('quadri')) return 'Quadriciclo';
    if (v.includes('sw4') || v.includes('hilux')) return 'SW4 / Hilux 4x4';
    if (v.includes('jardineira')) return 'Jardineira (Pau de Arara)';
    if (v.includes('onibus') || v.includes('van')) return 'Ônibus / Van Executiva';
    return vehicle || 'Veículo';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header / Navbar do Painel PMS */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-900 shadow-sm">
              JRI
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight flex items-center gap-2">
                Jericoacoara Premium{' '}
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  PMS & CRM
                </span>
              </h1>
              <p className="text-xs text-slate-400">Gestão de Reservas, Saídas e Funil de Vendas</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Comutador de Visualização: Lista vs Calendário */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex space-x-1">
              <button
                onClick={() => setViewMode('lista')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'lista'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>📋 Lista</span>
              </button>
              <button
                onClick={() => setViewMode('calendario')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'calendario'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>📅 Calendário de Saídas</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchReservations}
              disabled={loading}
              className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs hidden sm:flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Abas de Filtro Rápido (Funil de Status) */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('todas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'todas'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Todas</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-200">
              {counts.todas}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('confirmadas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'confirmadas'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Confirmadas (Operação Ativa)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-800 text-emerald-100">
              {counts.confirmadas}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pendentes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pendentes'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pendentes / Checkout Aberto (Recuperação)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-800 text-amber-100">
              {counts.pendentes}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('a_receber')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'a_receber'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>A Receber (Saldo no Embarque)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-800 text-blue-100">
              {counts.a_receber}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quitadas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quitadas'
                ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-500'
                : 'text-teal-700 hover:bg-teal-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Quitadas (100%)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-800 text-teal-100">
              {counts.quitadas}
            </span>
          </button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <Input
              placeholder="Buscar por cliente, WhatsApp, código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {selectedDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(null)}
                className="text-xs text-rose-600 hover:bg-rose-50"
              >
                Limpar Data
              </Button>
            )}
            <p className="text-xs text-slate-500 font-medium">
              Exibindo <strong>{reservations.length}</strong> reserva(s)
            </p>
          </div>
        </div>

        {/* MODO 1: VISÃO DE LISTA DE RESERVAS */}
        {viewMode === 'lista' && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Nenhuma reserva encontrada</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Não há registros para os filtros selecionados. Tente alterar a aba do funil ou limpar a busca.
                </p>
              </div>
            ) : (
              reservations.map((r) => {
                const firstItem = r.items?.[0] || {};
                const isPendente = r.status === 'pendente';
                const isConfirmada = r.status === 'confirmada';
                const isConcluida = r.status === 'concluida';
                const isCancelada = r.status === 'cancelada';
                const isQuitado = r.remaining_balance === 0;

                return (
                  <div
                    key={r.id}
                    className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md p-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between ${
                      isPendente
                        ? 'border-amber-300 bg-gradient-to-r from-amber-50/30 to-white'
                        : isConfirmada
                        ? 'border-emerald-200'
                        : isCancelada
                        ? 'border-rose-200 opacity-70'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Coluna 1: Dados do Cliente & Código */}
                    <div className="space-y-2 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {r.code}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-bold px-2.5 py-0.5 capitalize ${
                            isConfirmada
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isPendente
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : isConcluida
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {isPendente ? 'Pendente / Checkout Aberto' : r.status}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          {r.client_name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {r.client_phone}
                        </p>
                      </div>

                      {/* Badge de Origem */}
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          🌐 {r.origin || 'Site Institucional'}
                        </span>
                      </div>
                    </div>

                    {/* Coluna 2: Detalhes do Serviço & Logística */}
                    <div className="space-y-2 flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5">
                      {r.items.map((it, idx) => (
                        <div key={it.id || idx} className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                            {it.service_type === 'transfer' ? (
                              <Car className="w-4 h-4 text-teal-600 shrink-0" />
                            ) : (
                              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                            <span>{it.title}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              🚘 {getVehicleLabel(it.vehicle)}
                            </span>
                            <span className="inline-flex items-center gap-1 capitalize bg-slate-100 px-2 py-0.5 rounded">
                              🏷️ {it.modality}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              <CalendarIcon className="w-3 h-3 text-slate-500" />
                              {it.date} {it.time ? `às ${it.time}h` : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              <Users className="w-3 h-3 text-slate-500" />
                              {it.pax} PAX
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Logística / Pickup */}
                      {r.notes && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate max-w-md">{r.notes}</span>
                        </p>
                      )}
                    </div>

                    {/* Coluna 3: Valores Financeiros */}
                    <div className="space-y-1 min-w-[200px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5">
                      <div className="text-xs text-slate-500">Valor Total:</div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatMoney(r.amount_total)}
                      </div>

                      {/* Financial Status Badge */}
                      <div className="pt-1">
                        {isQuitado ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Quitado (100%)
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                              <DollarSign className="w-3.5 h-3.5" /> Saldo Embarque:{' '}
                              {formatMoney(r.remaining_balance)}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              Pago agora: {formatMoney(r.amount_paid)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coluna 4: Botões de Ação Rápida & WhatsApp Recovery */}
                    <div className="flex lg:flex-col gap-2 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 justify-end">
                      {/* BOTÃO ESPECIAL DE RECUPERAÇÃO DE CHECKOUT ABANDONADO */}
                      {isPendente && (
                        <a
                          href={getWhatsAppRecoveryUrl(r)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-md transition-all animate-pulse"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>📲 Recuperar no WhatsApp</span>
                        </a>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(r)}
                        className="flex-1 lg:flex-none h-10 px-3.5 text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <span>👁️ Detalhes / Status</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MODO 2: VISÃO DE CALENDÁRIO / MAPA DE SAÍDAS (ESTILO PMS / FAREHARBOR) */}
        {viewMode === 'calendario' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                Mapa de Saídas por Data (Governança e Escala)
              </h2>
              <p className="text-xs text-slate-500">
                Agrupamento automático por dia para logística de veículos, motoristas e distribuição de passageiros (PAX).
              </p>
            </div>

            {departureCalendar.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
                Nenhuma saída agendada para exibição no mapa.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {departureCalendar.map((dayGroup) => {
                  let formattedDayHeader = dayGroup.date;
                  try {
                    const parsed = parseISO(dayGroup.date);
                    formattedDayHeader = format(parsed, "EEEE, dd 'de' MMMM", { locale: ptBR });
                  } catch (e) {
                    // ignore
                  }

                  return (
                    <div
                      key={dayGroup.date}
                      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
                    >
                      {/* Header do Dia */}
                      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold capitalize text-emerald-400">
                            {formattedDayHeader}
                          </p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {dayGroup.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-white">{dayGroup.totalPax}</span>
                          <span className="text-xs text-slate-400 block font-medium">PAX Total</span>
                        </div>
                      </div>

                      {/* Resumo Logístico dos Veículos */}
                      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
                        {Object.entries(dayGroup.vehicles).map(([veh, qty]) => (
                          <Badge
                            key={veh}
                            variant="outline"
                            className="bg-white text-slate-800 border-slate-300 text-[11px] font-bold"
                          >
                            🚘 {qty}x {getVehicleLabel(veh)}
                          </Badge>
                        ))}
                      </div>

                      {/* Lista de Saídas daquela Data */}
                      <div className="p-4 space-y-3 flex-1 divide-y divide-slate-100">
                        {dayGroup.reservations.map((res) => (
                          <div key={res.id} className="pt-2 first:pt-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {res.client_name}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 font-mono">
                                {res.code}
                              </span>
                            </div>

                            {res.items.map((it) => (
                              <p key={it.id} className="text-xs text-slate-600 flex items-center justify-between">
                                <span className="truncate max-w-[200px]">{it.title}</span>
                                <span className="font-bold text-slate-800">{it.pax} PAX</span>
                              </p>
                            ))}

                            {res.notes && (
                              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 pt-0.5">
                                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                <span>{res.notes}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Footer do Card de Dia */}
                      <div className="p-3 bg-slate-100 border-t border-slate-200 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDate(parseISO(dayGroup.date));
                            setViewMode('lista');
                          }}
                          className="w-full text-xs text-slate-700 hover:bg-white font-semibold"
                        >
                          Ver {dayGroup.totalReservations} reserva(s) na lista →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL DE DETALHES E ALTERAÇÃO DE STATUS DE RESERVA */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="z-[100] max-w-xl max-h-[90dvh] overflow-y-auto bg-white rounded-2xl p-6 shadow-2xl space-y-5">
          {selectedReservation && (
            <>
              <DialogHeader className="border-b pb-3">
                <div className="flex items-center justify-between pr-6">
                  <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Reserva #{selectedReservation.code}
                  </DialogTitle>
                  <Badge className="capitalize text-xs font-bold px-2.5 py-1">
                    {selectedReservation.status}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Criada em: {format(parseISO(selectedReservation.created_at), 'dd/MM/yyyy HH:mm')}
                </DialogDescription>
              </DialogHeader>

              {/* Dados do Cliente */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cliente & Contato
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Nome:</span>
                    <strong className="text-slate-900">{selectedReservation.client_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">WhatsApp:</span>
                    <a
                      href={`https://wa.me/55${selectedReservation.client_phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {selectedReservation.client_phone}
                    </a>
                  </div>
                  {selectedReservation.client_email && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block">E-mail:</span>
                      <span className="text-slate-800 font-medium">{selectedReservation.client_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Controles de Status da Reserva e Pagamento */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Atualização de Status (Operacional & Financeiro)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Status Operacional</label>
                    <Select
                      value={selectedReservation.status}
                      onValueChange={(val) => {
                        updateReservationStatus(selectedReservation.id, val);
                        setSelectedReservation((prev) => ({ ...prev, status: val }));
                      }}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium border-slate-300">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="z-[120] bg-white border border-slate-200">
                        <SelectItem value="pendente">Pendente / Checkout Aberto</SelectItem>
                        <SelectItem value="confirmada">Confirmada (Operação Ativa)</SelectItem>
                        <SelectItem value="concluida">Concluída (Realizado)</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Status do Pagamento</label>
                    <Select
                      value={selectedReservation.payment_status}
                      onValueChange={(val) => {
                        updatePaymentStatus(selectedReservation.id, val);
                        setSelectedReservation((prev) => {
                          const isQuit = val === 'pago_integral';
                          const paid = isQuit ? prev.amount_total : prev.amount_paid;
                          return {
                            ...prev,
                            payment_status: val,
                            amount_paid: paid,
                            remaining_balance: Math.max(0, prev.amount_total - paid),
                          };
                        });
                      }}
                    >
                      <SelectTrigger className="h-10 bg-white text-xs font-medium border-slate-300">
                        <SelectValue placeholder="Status financeiro" />
                      </SelectTrigger>
                      <SelectContent className="z-[120] bg-white border border-slate-200">
                        <SelectItem value="pendente">Pendente (Não Pago)</SelectItem>
                        <SelectItem value="sinal_pago">Sinal de 50% Pago</SelectItem>
                        <SelectItem value="pago_integral">Pago Integral (100%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Itens do Pacote */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Itens do Pacote / Serviços
                </h4>
                <div className="space-y-2">
                  {selectedReservation.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{it.title}</p>
                        <p className="text-slate-500 mt-0.5">
                          {getVehicleLabel(it.vehicle)} • {it.modality} • {it.pax} PAX
                        </p>
                        <p className="text-slate-500">
                          Data: {it.date} {it.time ? `às ${it.time}h` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {formatMoney(it.unit_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financeiro Completo */}
              <div className="bg-slate-100 p-4 rounded-xl space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Valor Integral do Pacote:</span>
                  <span className="font-bold text-slate-900">
                    {formatMoney(selectedReservation.amount_total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Pago (Sinal / Pix / Cartão):</span>
                  <span className="font-bold text-emerald-700">
                    {formatMoney(selectedReservation.amount_paid)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-black">
                  <span>Saldo a Pagar no Embarque:</span>
                  <span className="text-blue-700">
                    {formatMoney(selectedReservation.remaining_balance)}
                  </span>
                </div>
              </div>

              {/* Botão de Fechamento */}
              <div className="pt-2">
                <Button
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Concluir Visualização
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
