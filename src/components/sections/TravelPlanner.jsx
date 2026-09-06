import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  Briefcase,
  Check,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData, transfersData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';
import { buildWhatsAppLink, WA_MESSAGES } from '@/utils/whatsapp';

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD STEPS DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

const TRAVELER_OPTIONS = [
  { id: 'Casal', label: 'Casal', icon: '👩‍❤️‍👨', desc: 'Viagem a dois, momentos inesquecíveis' },
  { id: 'Família', label: 'Família', icon: '👨‍👩‍👧‍👦', desc: 'Conforto e diversão para todas as idades' },
  { id: 'Amigos', label: 'Amigos', icon: '👯‍♂️', desc: 'Aventura, grupos e curtição' },
  { id: 'Sozinho', label: 'Sozinho', icon: '🎒', desc: 'Liberdade, paz e novas conexões' },
];

const DURATION_OPTIONS = [
  { id: '2 dias', label: '2 dias', badge: 'Express', desc: 'O essencial de Jeri em um final de semana' },
  { id: '3 dias', label: '3 dias', badge: 'Recomendado', desc: 'Leste, Oeste e tempo para relaxar' },
  { id: '4–5 dias', label: '4–5 dias', badge: 'Imersão', desc: 'Conheça cada canto do paraíso sem pressa' },
  { id: '6+ dias', label: '6+ dias', badge: 'Slow Travel', desc: 'Jeri completo + Rota das Emoções e arredores' },
];

const STYLE_OPTIONS = [
  { id: 'Relaxamento', label: 'Relaxamento', icon: '🧘‍♀️', desc: 'Beach clubs, redes na água e tranquilidade' },
  { id: 'Aventura', label: 'Aventura', icon: '🏜️', desc: 'Dunas, buggy, tirolesa e quadriciclo' },
  { id: 'Romance', label: 'Romance', icon: '🌅', desc: 'Jantares ao luar, pôr do sol e passeios privativos' },
  { id: 'Exclusividade', label: 'Exclusividade', icon: '🚁', desc: 'Helicóptero, transfer VIP e atrações reservadas' },
  { id: 'Misturado', label: 'Misturado', icon: '✨', desc: 'O melhor de todos os mundos' },
];

const INTEREST_OPTIONS = [
  { id: 'Transfer', label: 'Transfer', icon: '🚘', desc: 'Aeroporto x Jericoacoara com conforto' },
  { id: 'Passeios', label: 'Passeios', icon: '🏖️', desc: 'Roteiros Leste & Oeste com buggy ou quadriciclo' },
  { id: 'Hospedagem', label: 'Hospedagem', icon: '🏨', desc: 'Recomendações das melhores pousadas da vila' },
  { id: 'Pacote completo', label: 'Pacote completo', icon: '🌟', desc: 'Transfer + Passeios + Consultoria dedicada' },
];

// ─────────────────────────────────────────────────────────────────────────────
// DETERMINISTIC RECOMMENDATION ENGINE
// Resolves actual items from catalog.js (no fake prices or fake products)
// ─────────────────────────────────────────────────────────────────────────────
function generateRecommendation(answers) {
  const { style, interests, days } = answers;
  const selectedTours = [];
  const selectedTransfers = [];

  // Always include Leste Tour (core experience)
  if (style === 'Exclusividade' || style === 'Romance' || style === 'Relaxamento') {
    const lestePriv = toursData.find((t) => t.id === 'tour-leste-private');
    if (lestePriv) selectedTours.push(lestePriv);
  } else {
    const lestePriv = toursData.find((t) => t.id === 'tour-leste-private');
    if (lestePriv) selectedTours.push(lestePriv);
  }

  // Include Oeste Tour for 3+ days or Aventura
  if (days !== '2 dias' || style === 'Aventura' || style === 'Misturado') {
    const oestePriv = toursData.find((t) => t.id === 'tour-oeste-private');
    if (oestePriv) selectedTours.push(oestePriv);
  }

  // Include Helicopter for Exclusividade
  if (style === 'Exclusividade') {
    const heli = toursData.find((t) => t.id === 'tour-helicoptero');
    if (heli) selectedTours.push(heli);
  }

  // Include UTV for Aventura
  if (style === 'Aventura') {
    const utv = toursData.find((t) => t.id === 'tour-utv');
    if (utv && !selectedTours.some((t) => t.id === 'tour-utv')) {
      selectedTours.push(utv);
    }
  }

  // Transfers if requested
  if (interests.includes('Transfer') || interests.includes('Pacote completo')) {
    const fort = transfersData.find((t) => t.id === 'fortaleza');
    if (fort) selectedTransfers.push(fort);
  }

  // Build suggested daily itinerary
  const itinerary = [];
  if (days === '2 dias') {
    itinerary.push(
      { day: 'Dia 1', title: 'Chegada + Lagoa do Paraíso & Pedra Furada', desc: 'Transfer até a vila, passeio Litoral Leste e Pôr do Sol na Duna.' },
      { day: 'Dia 2', title: 'Litoral Oeste & Aventura em Tatajuba', desc: 'Dunas de Tatajuba, tirolesa e retorno com transfer confortável.' }
    );
  } else if (days === '3 dias') {
    itinerary.push(
      { day: 'Dia 1', title: 'Chegada VIP & Pôr do Sol', desc: 'Check-in na pousada e fim de tarde encantador na Duna do Pôr do Sol.' },
      { day: 'Dia 2', title: 'Circuito Leste — Lagoas & Buraco Azul', desc: 'Árvore da Preguiça, Lagoa do Paraíso e Buraco Azul em veículo privativo.' },
      { day: 'Dia 3', title: 'Circuito Oeste & Despedida', desc: 'Mangue Seco, balsa, tirolesa em Tatajuba e transfer de retorno.' }
    );
  } else {
    itinerary.push(
      { day: 'Dia 1', title: 'Recepção & Boas-vindas em Jeri', desc: 'Transfer executivo e primeiro jantar nos restaurantes charmosa da vila.' },
      { day: 'Dia 2', title: 'Roteiro Leste — Lagoas & Beach Clubs', desc: 'Dia inteiro em Lagoa do Paraíso e Buraco Azul com almoço no Alchymist.' },
      { day: 'Dia 3', title: 'Roteiro Oeste — Mangue Seco & Dunas', desc: 'Passeio de balsa, santuário dos cavalos-marinhos e dunas de Tatajuba.' },
      { day: 'Dia 4+', title: 'Experiências Exclusivas & Relax', desc: 'Dia livre para kitesurf, voo panorâmico ou descanso nas praias secretas.' }
    );
  }

  return {
    tours: selectedTours,
    transfers: selectedTransfers,
    itinerary,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TravelPlanner = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    travelers: '',
    days: '',
    style: '',
    interests: [],
  });
  const [bookingItem, setBookingItem] = useState(null);

  const totalSteps = 4;

  const handleSelectSingle = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleInterest = (value) => {
    setAnswers((prev) => {
      const current = prev.interests;
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, interests: updated };
    });
  };

  const isCurrentStepValid = () => {
    if (step === 1) return !!answers.travelers;
    if (step === 2) return !!answers.days;
    if (step === 3) return !!answers.style;
    if (step === 4) return answers.interests.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps && isCurrentStepValid()) {
      setStep((prev) => prev + 1);
    } else if (step === totalSteps && isCurrentStepValid()) {
      setStep(5); // Result step
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({
      travelers: '',
      days: '',
      style: '',
      interests: [],
    });
  };

  const handleSendWhatsApp = () => {
    const message = WA_MESSAGES.planner({
      travelers: answers.travelers,
      days: answers.days,
      style: answers.style,
      interests: answers.interests,
    });
    window.open(buildWhatsAppLink(message), '_blank');
  };

  const recommendation = step === 5 ? generateRecommendation(answers) : null;

  return (
    <section id="planner" className="py-20 md:py-28 bg-[#F7F3E9] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C7A7B]/10 text-[#2C7A7B] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Jeri Travel Planner
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Monte sua experiência em <span className="text-[#2C7A7B]">Jericoacoara</span>
          </h2>
          <p className="mt-3 text-gray-600 text-base max-w-lg mx-auto">
            Responda 4 perguntas rápidas e receba uma sugestão de roteiro sob medida para sua viagem.
          </p>
        </motion.div>

        {/* Wizard Card Container */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden p-6 sm:p-10">

          {/* Progress Bar (Visible in steps 1..4) */}
          {step <= totalSteps && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
                <span>Etapa {step} de {totalSteps}</span>
                <span className="text-[#2C7A7B]">
                  {Math.round((step / totalSteps) * 100)}% concluído
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#2C7A7B] to-[#D4AF37]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          {/* Wizard Content Steps */}
          <AnimatePresence mode="wait">
            
            {/* ETAPA 1: Quem vai viajar? */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-[#2C7A7B]" />
                  <h3 className="text-xl font-bold text-gray-900">Quem vai viajar?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {TRAVELER_OPTIONS.map((opt) => {
                    const isSelected = answers.travelers === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectSingle('travelers', opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-[#2C7A7B] bg-[#2C7A7B]/5 ring-2 ring-[#2C7A7B]/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ETAPA 2: Quantos dias? */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-[#2C7A7B]" />
                  <h3 className="text-xl font-bold text-gray-900">Quantos dias pretender ficar?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = answers.days === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectSingle('days', opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-[#2C7A7B] bg-[#2C7A7B]/5 ring-2 ring-[#2C7A7B]/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900 text-lg">{opt.label}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-gray-900">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ETAPA 3: Qual estilo de viagem? */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Compass className="w-5 h-5 text-[#2C7A7B]" />
                  <h3 className="text-xl font-bold text-gray-900">Qual estilo de viagem você busca?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {STYLE_OPTIONS.map((opt) => {
                    const isSelected = answers.style === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectSingle('style', opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-[#2C7A7B] bg-[#2C7A7B]/5 ring-2 ring-[#2C7A7B]/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ETAPA 4: O que você precisa? */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-[#2C7A7B]" />
                  <h3 className="text-xl font-bold text-gray-900">O que você precisa para sua viagem?</h3>
                </div>
                <p className="text-xs text-gray-400 mb-6">Você pode selecionar mais de uma opção.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {INTEREST_OPTIONS.map((opt) => {
                    const isSelected = answers.interests.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleToggleInterest(opt.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 relative ${
                          isSelected
                            ? 'border-[#2C7A7B] bg-[#2C7A7B]/5 ring-2 ring-[#2C7A7B]/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="flex-1 pr-6">
                          <p className="font-bold text-gray-900 text-base">{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#2C7A7B] border-[#2C7A7B] text-white' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* RESULTADO (Etapa 5): Recomendação de Roteiro */}
            {step === 5 && recommendation && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Summary Pill Badge */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-6 border-b border-gray-100 mb-6">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Seu Perfil Selecionado</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2.5 py-1 bg-[#2C7A7B]/10 text-[#2C7A7B] text-xs font-bold rounded-lg">
                        {answers.travelers}
                      </span>
                      <span className="px-2.5 py-1 bg-[#2C7A7B]/10 text-[#2C7A7B] text-xs font-bold rounded-lg">
                        {answers.days}
                      </span>
                      <span className="px-2.5 py-1 bg-[#D4AF37]/20 text-gray-900 text-xs font-bold rounded-lg">
                        {answers.style}
                      </span>
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">
                        {answers.interests.join(' + ')}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Refazer teste
                  </Button>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Seu Roteiro Sugerido em Jericoacoara ✨
                  </h3>
                  <p className="text-sm text-gray-600">
                    Com base nas suas preferências, selecionamos os melhores passeios e serviços do nosso catálogo:
                  </p>
                </div>

                {/* Suggested Catalog Products */}
                <div className="space-y-3 mb-8">
                  {recommendation.tours.map((tour) => {
                    const startPrice =
                      tour.options?.private?.vehicles?.[0]?.price ||
                      tour.options?.shared?.price;
                    return (
                      <div
                        key={tour.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-200 bg-[#FAF8F5] gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C7A7B] bg-[#2C7A7B]/10 px-2 py-0.5 rounded-md">
                              Passeio Recomendado
                            </span>
                            <h4 className="font-bold text-gray-900 text-base leading-snug mt-0.5">
                              {tour.title}
                            </h4>
                            {startPrice && (
                              <p className="text-xs font-bold text-gray-500">
                                A partir de <span className="text-[#2C7A7B] font-extrabold">{formatPrice(startPrice)}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={() => setBookingItem(tour)}
                          variant="outline"
                          size="sm"
                          className="border-[#2C7A7B] text-[#2C7A7B] hover:bg-[#2C7A7B] hover:text-white font-bold rounded-xl text-xs shrink-0"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    );
                  })}

                  {recommendation.transfers.map((tr) => (
                    <div
                      key={tr.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-200 bg-[#FAF8F5] gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={tr.image}
                          alt={tr.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            Transfer Recomendado
                          </span>
                          <h4 className="font-bold text-gray-900 text-base leading-snug mt-0.5">
                            {tr.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Preço garantido no checkout oficial
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => setBookingItem(tr)}
                        variant="outline"
                        size="sm"
                        className="border-[#2C7A7B] text-[#2C7A7B] hover:bg-[#2C7A7B] hover:text-white font-bold rounded-xl text-xs shrink-0"
                      >
                        Ver opções
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Itinerary Preview Breakdown */}
                <div className="mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3 text-center sm:text-left">
                    Sugestão Dia a Dia:
                  </h4>
                  <div className="space-y-3">
                    {recommendation.itinerary.map((item) => (
                      <div key={item.day} className="flex items-start gap-3 text-xs">
                        <span className="px-2.5 py-1 bg-[#2C7A7B] text-white font-bold rounded-lg shrink-0">
                          {item.day}
                        </span>
                        <div>
                          <p className="font-bold text-gray-900">{item.title}</p>
                          <p className="text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Final WhatsApp Button */}
                <div className="pt-4 border-t border-gray-100 flex flex-col items-center">
                  <Button
                    onClick={handleSendWhatsApp}
                    className="w-full sm:w-auto px-8 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    Receber meu roteiro personalizado no WhatsApp
                  </Button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Atendimento rápido e exclusivo com nossos especialistas locais
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls (Visible during steps 1..4) */}
          {step <= totalSteps && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <Button
                onClick={handleBack}
                disabled={step === 1}
                variant="ghost"
                className="text-gray-500 font-bold text-xs disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-xs px-6 h-11 rounded-xl shadow-md transition-all disabled:opacity-40"
              >
                {step === totalSteps ? 'Ver Meu Roteiro' : 'Próxima Etapa'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}

        </div>
      </div>

      {bookingItem && (
        <BookingModal
          item={bookingItem}
          open={!!bookingItem}
          onOpenChange={(open) => !open && setBookingItem(null)}
        />
      )}
    </section>
  );
};

export default TravelPlanner;
