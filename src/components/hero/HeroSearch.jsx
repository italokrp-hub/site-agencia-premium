import React, { useState, useMemo } from 'react';
import {
  Car,
  Compass,
  Plane,
  MapPin,
  ArrowLeftRight,
  Calendar as CalendarIcon,
  Users,
  Search,
  Minus,
  Plus,
  Check,
  Sparkles,
  Sun,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useLanguage } from '@/i18n/LanguageContext';

// Localidades padronizadas para Transfers
const TRANSFER_LOCATIONS = [
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    subtitle: 'Aeroporto Pinto Martins / Hotéis',
    icon: Plane,
    catalogMatchId: 'fortaleza',
  },
  {
    id: 'jeri',
    name: 'Jericoacoara',
    subtitle: 'Vila / Hotéis e Pousadas',
    icon: MapPin,
    catalogMatchId: 'fortaleza',
  },
  {
    id: 'cruz',
    name: 'Aeroporto Regional de Cruz (JJD)',
    subtitle: 'Aeroporto Regional de Jericoacoara',
    icon: Plane,
    catalogMatchId: 'cruz',
  },
  {
    id: 'prea',
    name: 'Preá',
    subtitle: 'Praia do Preá e Hotéis',
    icon: Compass,
    catalogMatchId: 'prea',
  },
  {
    id: 'jijoca',
    name: 'Jijoca de Jericoacoara',
    subtitle: 'Centro / Lagoas e Apoio',
    icon: MapPin,
    catalogMatchId: 'jijoca',
  },
];

// Roteiros padronizados para Passeios
const TOUR_ROUTES = [
  {
    id: 'tour-leste',
    title: 'Litoral Leste (Lagoa do Paraíso, Buraco Azul, Preá)',
    badge: 'Mais Procurado',
    description: 'Árvore da Preguiça, Praia do Preá, Buraco Azul e Lagoa do Paraíso',
    icon: Sun,
    catalogMatchId: 'tour-leste-private',
  },
  {
    id: 'tour-oeste',
    title: 'Litoral Oeste (Tatajuba, Mangue Seco, Dunas)',
    badge: 'Aventura & Dunas',
    description: 'Tirolesa, Toboágua, Mangue Seco e Dunas de Tatajuba',
    icon: Compass,
    catalogMatchId: 'tour-oeste-private',
  },
  {
    id: 'tour-barrinha',
    title: 'Praia da Barrinha & Pôr do Sol',
    badge: 'Exclusivo',
    description: 'Dunas douradas, parque e pôr do sol inesquecível',
    icon: Sparkles,
    catalogMatchId: 'tour-leste-private',
  },
  {
    id: 'tour-amancio',
    title: 'Lagoa do Amâncio (Pôr do Sol)',
    badge: 'Cenário Único',
    description: 'Oásis em meio às dunas preservadas no fim da tarde',
    icon: Sun,
    catalogMatchId: 'tour-oeste-private',
  },
];

export default function HeroSearch({ onSearch }) {
  const { t } = useLanguage();

  // Estados principais
  const [activeTab, setActiveTab] = useState('transfers'); // 'transfers' | 'tours'

  // Estados da Aba Transfers
  const [origin, setOrigin] = useState('fortaleza');
  const [destination, setDestination] = useState('jeri');
  const [isRotating, setIsRotating] = useState(false);
  const [hasReturn, setHasReturn] = useState(false);

  // Datas
  const [departureDate, setDepartureDate] = useState(() => addDays(new Date(), 1));
  const [returnDate, setReturnDate] = useState(() => addDays(new Date(), 4));
  const [isDepOpen, setIsDepOpen] = useState(false);
  const [isRetOpen, setIsRetOpen] = useState(false);

  // Passageiros (Adultos + Crianças)
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isPaxOpen, setIsPaxOpen] = useState(false);

  // Estados da Aba Passeios
  const [selectedTourId, setSelectedTourId] = useState('tour-leste');
  const [tourDate, setTourDate] = useState(() => addDays(new Date(), 1));
  const [isTourDateOpen, setIsTourDateOpen] = useState(false);

  // Inverter Origem e Destino
  const handleSwap = () => {
    setIsRotating((prev) => !prev);
    setOrigin(destination);
    setDestination(origin);
  };

  // Objetos selecionados
  const originObj = useMemo(
    () => TRANSFER_LOCATIONS.find((loc) => loc.id === origin) || TRANSFER_LOCATIONS[0],
    [origin]
  );
  const destinationObj = useMemo(
    () => TRANSFER_LOCATIONS.find((loc) => loc.id === destination) || TRANSFER_LOCATIONS[1],
    [destination]
  );
  const selectedTourObj = useMemo(
    () => TOUR_ROUTES.find((tour) => tour.id === selectedTourId) || TOUR_ROUTES[0],
    [selectedTourId]
  );

  const totalPassengers = adults + children;

  const passengersSummary = useMemo(() => {
    const parts = [];
    if (adults > 0) parts.push(`${adults} ${adults === 1 ? 'Adulto' : 'Adultos'}`);
    if (children > 0) parts.push(`${children} ${children === 1 ? 'Criança' : 'Crianças'}`);
    return parts.length > 0 ? parts.join(', ') : '1 Adulto';
  }, [adults, children]);

  // Submissão da Busca
  const handleSubmit = () => {
    if (activeTab === 'transfers') {
      const payload = {
        tab: 'transfers',
        origin,
        destination,
        originLabel: `${originObj.name} (${originObj.subtitle})`,
        destinationLabel: `${destinationObj.name} (${destinationObj.subtitle})`,
        departureDate,
        returnDate: hasReturn ? returnDate : null,
        hasReturn,
        passengers: {
          adults,
          children,
          total: totalPassengers,
        },
        catalogMatchId:
          origin === 'cruz' || destination === 'cruz'
            ? 'cruz'
            : origin === 'jijoca' || destination === 'jijoca'
            ? 'jijoca'
            : origin === 'prea' || destination === 'prea'
            ? 'prea'
            : 'fortaleza',
      };
      if (onSearch) onSearch(payload);
    } else {
      const payload = {
        tab: 'tours',
        origin: 'jeri',
        originLabel: 'Jericoacoara (Vila / Hotéis)',
        tourId: selectedTourId,
        tourLabel: selectedTourObj.title,
        departureDate: tourDate,
        returnDate: null,
        hasReturn: false,
        passengers: {
          adults,
          children,
          total: totalPassengers,
        },
        catalogMatchId: selectedTourObj.catalogMatchId,
      };
      if (onSearch) onSearch(payload);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* Container Principal com Dark Glassmorphism de Luxo */}
      <div className="backdrop-blur-2xl bg-black/75 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl p-3 sm:p-5 text-left transition-all duration-300">
        
        {/* A. Abas Superiores Integradas (Tabs) */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('transfers')}
            className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === 'transfers'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-950 shadow-lg shadow-[#D4AF37]/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Car className="w-4 h-4 shrink-0" />
            <span>Traslados & Transfers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tours')}
            className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === 'tours'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-950 shadow-lg shadow-[#D4AF37]/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Passeios & Experiências</span>
          </button>
        </div>

        {/* B. Conteúdo da Aba: Traslados & Transfers */}
        {activeTab === 'transfers' && (
          <div className="space-y-3">
            {/* Linha de Busca Principal (Desktop: Faixa contínua | Mobile: Grid em blocos) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 sm:p-2.5 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-0 items-center">
              
              {/* 1. Origem ("Saindo de") */}
              <div className="lg:col-span-3 px-3 py-2 lg:border-r border-white/10 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Saindo de
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <originObj.icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {originObj.name}
                          </p>
                          <p className="text-[10px] text-white/50 truncate">
                            {originObj.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="z-[200] w-80 p-2 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/10">
                      Escolha o local de partida
                    </div>
                    <div className="py-1 space-y-1">
                      {TRANSFER_LOCATIONS.map((loc) => {
                        const Icon = loc.icon;
                        const isSelected = loc.id === origin;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setOrigin(loc.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                                : 'hover:bg-white/10 text-white/90'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">{loc.name}</p>
                              <p className="text-[10px] text-white/50 truncate">{loc.subtitle}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* 2. Botão Inversor Central (⇄) */}
              <div className="lg:col-span-1 flex items-center justify-center -my-2 lg:my-0 z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Inverter Origem e Destino"
                  aria-label="Inverter Origem e Destino"
                  className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white hover:text-gray-950 border border-white/20 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ArrowLeftRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isRotating ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Destino ("Indo para") */}
              <div className="lg:col-span-3 px-3 py-2 lg:border-r border-white/10 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Indo para
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <destinationObj.icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {destinationObj.name}
                          </p>
                          <p className="text-[10px] text-white/50 truncate">
                            {destinationObj.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="z-[200] w-80 p-2 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/10">
                      Escolha o destino
                    </div>
                    <div className="py-1 space-y-1">
                      {TRANSFER_LOCATIONS.map((loc) => {
                        const Icon = loc.icon;
                        const isSelected = loc.id === destination;
                        const isDisabled = loc.id === origin;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setDestination(loc.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                              isDisabled
                                ? 'opacity-30 cursor-not-allowed text-white/40'
                                : isSelected
                                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                                : 'hover:bg-white/10 text-white/90'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">{loc.name}</p>
                              <p className="text-[10px] text-white/50 truncate">{loc.subtitle}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* 4. Datas (Ida e Volta Opcional) */}
              <div className="lg:col-span-3 px-3 py-2 lg:border-r border-white/10 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37]">
                    {hasReturn ? 'Ida & Volta' : 'Data de Ida'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHasReturn((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-3 h-3 rounded-xs border flex items-center justify-center transition-colors ${
                        hasReturn
                          ? 'bg-emerald-500 border-emerald-400 text-gray-950'
                          : 'border-white/30 bg-white/10'
                      }`}
                    >
                      {hasReturn && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{hasReturn ? 'Com volta' : '+ Volta'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Seletor Data Ida */}
                  <Popover open={isDepOpen} onOpenChange={setIsDepOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex-1 flex items-center gap-2 text-left cursor-pointer focus:outline-none"
                      >
                        <CalendarIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {format(departureDate, "dd 'de' MMM", { locale: ptBR })}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="z-[200] p-3 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                    >
                      <div className="px-2 py-1 text-xs font-bold text-[#D4AF37] mb-2">
                        Selecione a data de embarque
                      </div>
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={(date) => {
                          if (date) {
                            setDepartureDate(date);
                            if (isBefore(returnDate, date)) {
                              setReturnDate(addDays(date, 3));
                            }
                            setIsDepOpen(false);
                          }
                        }}
                        disabled={(date) => isBefore(date, startOfDay(new Date()))}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Seletor Data Volta (se habilitado) */}
                  {hasReturn && (
                    <>
                      <span className="text-white/30 text-xs">→</span>
                      <Popover open={isRetOpen} onOpenChange={setIsRetOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex-1 flex items-center gap-2 text-left cursor-pointer focus:outline-none animate-in fade-in"
                          >
                            <CalendarIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {format(returnDate, "dd 'de' MMM", { locale: ptBR })}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="z-[200] p-3 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                        >
                          <div className="px-2 py-1 text-xs font-bold text-emerald-400 mb-2">
                            Selecione a data de retorno
                          </div>
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={(date) => {
                              if (date) {
                                setReturnDate(date);
                                setIsRetOpen(false);
                              }
                            }}
                            disabled={(date) => isBefore(date, startOfDay(departureDate))}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </>
                  )}
                </div>
              </div>

              {/* 5. Passageiros (Popover com Stepper) */}
              <div className="lg:col-span-2 px-3 py-2 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Passageiros
                </span>
                <Popover open={isPaxOpen} onOpenChange={setIsPaxOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {passengersSummary}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="z-[200] w-72 p-4 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl space-y-4"
                  >
                    <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/10 pb-2">
                      Quantidade de Passageiros
                    </div>

                    {/* Stepper Adultos */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">Adultos</p>
                        <p className="text-[10px] text-white/50">A partir de 12 anos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                          disabled={adults <= 1}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-white min-w-[1.2rem] text-center">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                          disabled={adults >= 10}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Stepper Crianças */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <p className="text-xs font-bold text-white">Crianças</p>
                        <p className="text-[10px] text-white/50">2 a 11 anos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                          disabled={children <= 0}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-white min-w-[1.2rem] text-center">
                          {children}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                          disabled={children >= 6}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-white/40 pt-1 leading-tight">
                      * Bebês de até 2 anos viajam gratuitamente no colo de um adulto responsável.
                    </p>

                    <Button
                      onClick={() => setIsPaxOpen(false)}
                      size="sm"
                      className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-950 font-bold text-xs rounded-xl h-8"
                    >
                      Confirmar
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>

            </div>

            {/* 6. Botão de Busca CTA (Linha de Ação) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-4 text-[11px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Frota 100% Climatizada & Vistoriada
                </span>
                <span className="hidden sm:inline text-white/20">•</span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-emerald-400" /> Embarque no Aeroporto ou Hotel
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                id="btn-hero-search-submit"
                data-tracking="hero-search-transfers-cta"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B48F1E] text-gray-950 font-black px-8 py-6 text-sm sm:text-base rounded-full shadow-xl shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[3]" />
                <span>Ver Opções & Preços</span>
              </Button>
            </div>
          </div>
        )}

        {/* C. Conteúdo da Aba: Passeios & Experiências */}
        {activeTab === 'tours' && (
          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 sm:p-2.5 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-0 items-center">
              
              {/* 1. Origem Fixa */}
              <div className="lg:col-span-3 px-3 py-2 lg:border-r border-white/10 flex flex-col justify-center min-h-[56px] rounded-xl bg-white/[0.02]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Ponto de Partida
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                      Jericoacoara (Vila)
                    </p>
                    <p className="text-[10px] text-white/50 truncate">
                      Buscamos no seu hotel / pousada
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Seletor de Roteiro */}
              <div className="lg:col-span-4 px-3 py-2 lg:border-r border-white/10 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Escolha o Roteiro
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <selectedTourObj.icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {selectedTourObj.title}
                          </p>
                          <p className="text-[10px] text-emerald-400 truncate">
                            {selectedTourObj.badge}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="z-[200] w-96 p-2 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/10">
                      Roteiros Exclusivos Jericoacoara
                    </div>
                    <div className="py-1 space-y-1">
                      {TOUR_ROUTES.map((tour) => {
                        const Icon = tour.icon;
                        const isSelected = tour.id === selectedTourId;
                        return (
                          <button
                            key={tour.id}
                            type="button"
                            onClick={() => setSelectedTourId(tour.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                                : 'hover:bg-white/10 text-white/90'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold truncate">{tour.title}</p>
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold shrink-0">
                                  {tour.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/50 truncate">{tour.description}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* 3. Data do Passeio */}
              <div className="lg:col-span-3 px-3 py-2 lg:border-r border-white/10 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Data do Passeio
                </span>
                <Popover open={isTourDateOpen} onOpenChange={setIsTourDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 text-left cursor-pointer focus:outline-none"
                    >
                      <CalendarIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {format(tourDate, "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="z-[200] p-3 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-2 py-1 text-xs font-bold text-[#D4AF37] mb-2">
                      Selecione a data do passeio
                    </div>
                    <Calendar
                      mode="single"
                      selected={tourDate}
                      onSelect={(date) => {
                        if (date) {
                          setTourDate(date);
                          setIsTourDateOpen(false);
                        }
                      }}
                      disabled={(date) => isBefore(date, startOfDay(new Date()))}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 4. Passageiros (Tour) */}
              <div className="lg:col-span-2 px-3 py-2 flex flex-col justify-center min-h-[56px] hover:bg-white/5 rounded-xl transition-colors">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] mb-0.5">
                  Passageiros
                </span>
                <Popover open={isPaxOpen} onOpenChange={setIsPaxOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {passengersSummary}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0 ml-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="z-[200] w-72 p-4 bg-[#0d1618] border border-white/15 text-white rounded-2xl shadow-2xl backdrop-blur-xl space-y-4"
                  >
                    <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/10 pb-2">
                      Quantidade de Passageiros
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">Adultos</p>
                        <p className="text-[10px] text-white/50">A partir de 12 anos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                          disabled={adults <= 1}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-white min-w-[1.2rem] text-center">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                          disabled={adults >= 10}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <p className="text-xs font-bold text-white">Crianças</p>
                        <p className="text-[10px] text-white/50">2 a 11 anos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                          disabled={children <= 0}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-white min-w-[1.2rem] text-center">
                          {children}
                        </span>
                        <button
                          type="button"
                          onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                          disabled={children >= 6}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsPaxOpen(false)}
                      size="sm"
                      className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-950 font-bold text-xs rounded-xl h-8"
                    >
                      Confirmar
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>

            </div>

            {/* 5. Botão de Busca CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-4 text-[11px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Buggy, Quadriciclo ou 4x4 Exclusivo
                </span>
                <span className="hidden sm:inline text-white/20">•</span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Guias & Pilotos Credenciados
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                id="btn-hero-search-tours-submit"
                data-tracking="hero-search-tours-cta"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B48F1E] text-gray-950 font-black px-8 py-6 text-sm sm:text-base rounded-full shadow-xl shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[3]" />
                <span>Buscar Passeios</span>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
