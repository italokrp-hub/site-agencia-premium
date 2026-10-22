import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Car,
  Compass,
  AlertCircle,
  Clock,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { openWhatsApp, WA_MESSAGES } from '@/utils/whatsapp';
import { CANCELLATION_POLICY } from '@/data/catalog';

// Estrutura rica e categorizada de Perguntas e Respostas
export const FAQ_CATEGORIES = [
  { id: 'todas', label: 'Todas as Dúvidas', icon: HelpCircle },
  { id: 'cancelamento', label: 'Política de Cancelamento', icon: CalendarCheck, badge: 'Regra de 7 Dias' },
  { id: 'reservas-pagamento', label: 'Reservas & Pagamento', icon: CreditCard },
  { id: 'veiculos-seguranca', label: 'Veículos & Segurança', icon: ShieldCheck },
  { id: 'logistica-transfer', label: 'Logística de Traslados', icon: Car },
  { id: 'passeios-roteiros', label: 'Passeios & Atrações', icon: Compass },
];

export const ALL_FAQ_DATA = [
  // 1. POLÍTICA DE CANCELAMENTO & REEMBOLSO
  {
    category: 'cancelamento',
    question: 'Qual é a política de cancelamento e reembolso da Jericoacoara Premium?',
    answer: 'Nossa política de cancelamento é estrita, transparente e prioriza o respeito mútuo. Você tem direito a 100% de reembolso integral caso a solicitação de cancelamento seja formalizada com no mínimo 7 dias corridos de antecedência em relação à data do embarque ou início do serviço.',
    highlight: true,
  },
  {
    category: 'cancelamento',
    question: 'O que acontece se eu cancelar entre 7 dias e 48 horas antes da viagem?',
    answer: 'Para cancelamentos solicitados entre 7 dias e 48 horas antes do horário agendado, oferecemos a opção de 100% do valor convertido em Voucher de Crédito (válido por 12 meses para reagendamento) ou o reembolso financeiro com retenção de 50% para cobrir custos operacionais e taxa de reserva de data.',
  },
  {
    category: 'cancelamento',
    question: 'Por que cancelamentos com menos de 48 horas ou no-show não são reembolsáveis?',
    answer: 'Jericoacoara é uma vila de acesso restrito pelo Parque Nacional e operamos com frota 4x4 selecionada e motoristas credenciados que reservam a data exclusivamente para o seu grupo. Com menos de 48 horas ou não comparecimento (no-show), o veículo e o motorista já foram escalados, impedindo a realocação para outros passageiros.',
  },
  {
    category: 'cancelamento',
    question: 'Posso alterar a data ou horário da minha reserva sem custo?',
    answer: 'Sim! Remarcações de data e horário solicitadas com mais de 7 dias de antecedência são 100% gratuitas, sujeitas apenas à disponibilidade de veículos na nova data solicitada. Caso a alteração ocorra dentro do período inferior a 7 dias, consulte nossa equipe de suporte pelo WhatsApp para avaliarmos a disponibilidade sem multas abusivas.',
  },

  // 2. RESERVAS & PAGAMENTOS
  {
    category: 'reservas-pagamento',
    question: 'Quais são as formas de pagamento aceitas?',
    answer: 'Aceitamos PIX Dinâmico com desconto imediato de 5% sobre o valor total, cartões de crédito em até 12x através do Mercado Pago e cartões internacionais via Stripe para passageiros estrangeiros. Você também pode optar por pagar apenas 50% de sinal online para garantir a reserva e quitar os 50% restantes no momento do embarque.',
  },
  {
    category: 'reservas-pagamento',
    question: 'Como funciona o desconto de 5% no PIX?',
    answer: 'Ao selecionar a opção PIX no checkout, o desconto de 5% é aplicado automaticamente sobre o valor total do serviço. Nosso sistema gera um QR Code dinâmico e o código "Copia e Cola" com confirmação instantânea de pagamento.',
  },
  {
    category: 'reservas-pagamento',
    question: 'Como funciona o pagamento do Sinal de 50%?',
    answer: 'Para sua comodidade, você pode pagar 50% do valor do transfer ou passeio antecipadamente pelo site (via PIX ou Cartão) para travar sua vaga no calendário, e pagar o saldo remanescente de 50% diretamente ao motorista ou guia no dia da viagem (em dinheiro ou cartão).',
  },
  {
    category: 'reservas-pagamento',
    question: 'Sou estrangeiro e não tenho CPF. Como posso reservar?',
    answer: 'Nosso sistema de checkout possui um alternador específico para clientes estrangeiros ("Sou Estrangeiro"). Você pode preencher seu Passaporte ou documento internacional de identificação, selecionar o DDI do seu país e realizar o pagamento com cartões do mundo inteiro de forma segura via Stripe.',
  },
  {
    category: 'reservas-pagamento',
    question: 'Como recebo o comprovante e voucher da minha reserva?',
    answer: 'Imediatamente após a aprovação do pagamento, você recebe seu Voucher Digital oficial contendo o código localizador único, detalhes do veículo, data, endereço de embarque e contato direto da nossa coordenação de logística.',
  },

  // 3. VEÍCULOS & SEGURANÇA
  {
    category: 'veiculos-seguranca',
    question: 'Quais veículos compõem a frota da Jericoacoara Premium?',
    answer: 'Nossa frota é composta por caminhonetes Toyota Hilux 4x4, SUVs Toyota SW4 de 6 lugares, Vans Executivas e Jardineiras 4x4 regulamentadas. Todos os veículos contam com ar-condicionado de alta eficiência, manutenção preventiva rigorosa e seguro contra sinistros.',
  },
  {
    category: 'veiculos-seguranca',
    question: 'A empresa é devidamente cadastrada nos órgãos de turismo?',
    answer: 'Sim, somos uma agência e operadora de turismo devidamente cadastrada no Cadastur (Ministério do Turismo) sob o CNPJ 51.790.615/0001-08. Nossos motoristas e guias são profissionais certificados com ampla experiência em condução off-road nas dunas móveis do Ceará.',
  },
  {
    category: 'veiculos-seguranca',
    question: 'Os passageiros contam com seguro durante os trajetos?',
    answer: 'Sim, todos os nossos transfers e passeios incluem seguro de Acidentes Pessoais a Passageiros (APP) com cobertura integral durante todo o percurso terrestre, garantindo tranquilidade absoluta para sua família.',
  },

  // 4. LOGÍSTICA DE TRASLADOS & AEROPORTOS
  {
    category: 'logistica-transfer',
    question: 'Qual é a franquia de bagagem permitida nos transfers?',
    answer: 'No Transfer Privativo (Hilux ou SW4), a franquia é ampla: até 2 malas despachadas (até 23kg cada) + 1 mala de mão por passageiro. No Transfer Compartilhado, para garantir o conforto de todos, é permitida 1 mala média despachada (até 23kg) + 1 mochila ou bolsa de mão por passageiro.',
  },
  {
    category: 'logistica-transfer',
    question: 'O que acontece se meu voo atrasar na chegada ao aeroporto?',
    answer: 'Monitoramos todos os voos dos nossos clientes em tempo real através dos números informados na reserva. Para transfers que partem de aeroportos (Fortaleza Pinto Martins - FOR ou Cruz/Jericoacoara - SBJE), oferecemos tolerância gratuita de até 1 hora de espera após o pouso sem qualquer taxa extra.',
  },
  {
    category: 'logistica-transfer',
    question: 'Onde o motorista me encontra no Aeroporto de Fortaleza ou Cruz?',
    answer: 'No Aeroporto de Fortaleza, nosso motorista aguarda no saguão de desembarque com uma placa identificadora contendo o seu nome e o logotipo da Jericoacoara Premium. No Aeroporto de Cruz (Jeri), o ponto de encontro fica logo na saída da esteira de bagagens.',
  },
  {
    category: 'logistica-transfer',
    question: 'Qual é o tempo de viagem entre Fortaleza e Jericoacoara?',
    answer: 'Em Transfer Privativo 4x4 direto, a viagem dura em média de 4 horas a 4h30min, incluindo uma parada conveniente para lanche e esticar as pernas. Em Transfer Compartilhado de Van/Ônibus, a duração varia entre 5h e 6h, dependendo do trânsito na saída da capital e do transbordo nas dunas.',
  },
  {
    category: 'logistica-transfer',
    question: 'Crianças pagam passagem de transfer?',
    answer: 'Bebês e crianças de colo até 2 anos completos viajam gratuitamente no colo de um adulto responsável. Crianças a partir de 2 anos completos ocupam assento individual por exigência da legislação rodoviária e pagam a tarifa padrão ou proporcional contratada.',
  },

  // 5. PASSEIOS & EXPERIÊNCIAS EM JERICOACOARA
  {
    category: 'passeios-roteiros',
    question: 'Qual a diferença entre o Passeio Lado Leste e o Lado Oeste?',
    answer: 'O Litoral Leste é voltado para relaxamento e fotos icônicas: visita a Árvore da Preguiça, Praia do Preá, o famoso Buraco Azul e a Lagoa do Paraíso com os famosos clubes de praia (como o Alchymist). O Litoral Oeste é mais focado em aventura off-road: inclui travessia de balsa tradicional em Guriú, mangue seco com cavalos-marinhos e as dunas radicais da Lagoa de Tatajuba (com tirolesa e toboágua).',
  },
  {
    category: 'passeios-roteiros',
    question: 'O que está incluso e o que NÃO está incluso nos passeios?',
    answer: 'INCLUSO (✔️): Veículo off-road selecionado (Buggy, Quadriciclo, SW4 ou Jardineira), guia/motorista credenciado, busca e retorno na sua pousada na Vila de Jericoacoara, travessia de balsa (quando aplicável ao privativo) e seguro passageiro. NÃO INCLUSO (✕): Entradas/day use de beach clubs (Alchymist, Lagun, Buraco Azul), refeições/bebidas, atrações opcionais (tirolesa, cavalos-marinhos) e a taxa de turismo sustentável da Vila.',
  },
  {
    category: 'passeios-roteiros',
    question: 'O que é a Taxa de Turismo Sustentável da Vila de Jericoacoara?',
    answer: 'É um tributo municipal instituído pela Prefeitura de Jijoca de Jericoacoara para a conservação e limpeza ambiental da vila. Ela deve ser paga individualmente por cada visitante (diretamente pelo site oficial da prefeitura ou no posto de controle na entrada da vila). O valor não faz parte do transporte nem das agências.',
  },
  {
    category: 'passeios-roteiros',
    question: 'Como funciona o Passeio de Helicóptero e o Passeio de UTV Can-Am?',
    answer: 'São experiências de luxo com vagas altamente limitadas. O sobrevoo de helicóptero proporciona vistas panorâmicas da Pedra Furada, dunas móveis e lagoas. O UTV Can-Am Maverick permite que você mesmo pilote uma máquina de alta performance acompanhado por um instrutor experiente. As reservas dessas duas atrações são personalizadas via WhatsApp.',
  },
];

const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndices, setExpandedIndices] = useState({ 0: true }); // Primeiro aberto por padrão

  const toggleAccordion = (index) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Filtragem combinada por busca e categoria
  const filteredFaqs = useMemo(() => {
    return ALL_FAQ_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === 'todas' || faq.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Schema.org FAQPage JSON-LD para SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ALL_FAQ_DATA.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Perguntas Frequentes (FAQ) & Cancelamento | Jericoacoara Premium</title>
        <meta
          name="description"
          content="Tire todas as suas dúvidas sobre transfer para Jericoacoara, passeios de buggy, formas de pagamento, bagagens, atrasos de voo e nossa política de cancelamento com 100% de reembolso com até 7 dias."
        />
        <meta name="keywords" content="faq jericoacoara, politica de cancelamento transfer jeri, duvidas transfer jericoacoara, reembolso transfer jeri, pagamento jeri premium, franquia de bagagem jeri" />
        <link rel="canonical" href="https://jericoacoarapremium.com/faq" />
        <meta property="og:title" content="Perguntas Frequentes (FAQ) | Jericoacoara Premium" />
        <meta property="og:description" content="Central de Ajuda e Dúvidas Frequentes da Jericoacoara Premium. Política de Cancelamento transparente com 100% de reembolso em 7 dias." />
        <meta property="og:url" content="https://jericoacoarapremium.com/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-gray-900 selection:bg-[#D4AF37]/30 selection:text-gray-950">
        <Header />

        <main className="flex-1 pt-24 pb-20">
          
          {/* HERO HEADER DA PÁGINA */}
          <section className="relative bg-gradient-to-b from-[#0B1517] via-[#0F1E20] to-[#142629] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Elementos visuais de fundo */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Central de Ajuda & Transparência
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Perguntas Frequentes <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">
                  (FAQ) & Políticas
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
                Tudo o que você precisa saber sobre nossos traslados, passeios exclusivos,
                formas de pagamento seguras e nossa política transparente de cancelamento.
              </p>

              {/* BARRA DE PESQUISA INTELIGENTE */}
              <div className="max-w-xl mx-auto relative">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite sua dúvida (ex: cancelamento, bagagem, PIX, atraso)..."
                    className="w-full pl-12 pr-10 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white/15 transition-all shadow-xl"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* DESTAQUE ESPECIAL: POLÍTICA DE CANCELAMENTO TRANSPARENTE (7 DIAS) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xl p-6 sm:p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-6 h-6 text-[#B48F1E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B48F1E]">Garantia Oficial</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">100% de Reembolso</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                      {CANCELLATION_POLICY.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory('cancelamento');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#B48F1E] hover:text-[#8C6D0F] bg-amber-50 hover:bg-amber-100/80 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Ver todas as regras de cancelamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* GRID DAS 3 REGRAS DE CANCELAMENTO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                
                {/* 1. Até 7 dias: 100% */}
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 mb-2 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Até 7 Dias Antes</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-700 tracking-tight mb-1">
                      100% Reembolso
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Cancelamento solicitado com no mínimo 7 dias corridos de antecedência do embarque. Reembolso integral sem taxas ocultas.
                    </p>
                  </div>
                </div>

                {/* 2. De 7 dias a 48h: 50% ou Voucher */}
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-900 mb-2 font-bold text-xs">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>De 7 Dias a 48h Antes</span>
                    </div>
                    <p className="text-2xl font-black text-amber-700 tracking-tight mb-1">
                      Voucher ou 50%
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Reagendamento gratuito com crédito em voucher válido por 12 meses ou reembolso com 50% de retenção de custos de reserva.
                    </p>
                  </div>
                </div>

                {/* 3. Menos de 48h ou no-show: Sem reembolso */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-2 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                      <span>Menos de 48h / No-Show</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                      Não Reembolsável
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Veículo 4x4 e motorista credenciado já estão bloqueados exclusivamente para a sua rota no Parque Nacional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NAVEGAÇÃO POR CATEGORIAS (TABS / PILLS) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
              {FAQ_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#142629] text-white shadow-md ring-2 ring-[#D4AF37]/50'
                        : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black">
                        {cat.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* LISTA DE PERGUNTAS E RESPOSTAS (ACCORDION MODERNO) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900 mb-1">Nenhuma pergunta encontrada</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Não encontramos dúvidas para o termo "{searchQuery}". Nossa equipe 24h está à disposição no WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('todas');
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Limpar filtros de busca
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = Boolean(expandedIndices[index]);
                return (
                  <div
                    key={faq.question}
                    className={`rounded-2xl transition-all duration-200 border ${
                      faq.highlight
                        ? 'bg-amber-50/40 border-amber-300/80 shadow-xs'
                        : isOpen
                        ? 'bg-white border-[#D4AF37]/60 shadow-md ring-1 ring-[#D4AF37]/30'
                        : 'bg-white border-gray-200/90 hover:border-gray-300 shadow-2xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-4 sm:py-5 text-left cursor-pointer group focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3">
                        {faq.highlight && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#D4AF37] text-gray-950 text-[10px] font-black uppercase tracking-wider">
                            Destaque
                          </span>
                        )}
                        <span className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {faq.question}
                        </span>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-[#142629] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-1 text-gray-600 text-sm sm:text-[15px] leading-relaxed border-t border-gray-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </section>

          {/* BANNER CTA DE ATENDIMENTO CONCIERGE NO WHATSAPP */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="bg-gradient-to-br from-[#0F1E20] to-[#172D30] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D4AF37]/20 to-transparent pointer-events-none" />

              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  Atendimento 24 Horas
                </div>

                <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white">
                  Ainda possui dúvidas ou deseja um roteiro personalizado?
                </h3>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Nossos consultores especialistas em Jericoacoara estão disponíveis no WhatsApp
                  para montar pacotes combinados, verificar horários de voos e garantir as melhores tarifas.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => openWhatsApp(WA_MESSAGES.generic)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A028] text-gray-950 font-black text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Falar com Concierge no WhatsApp</span>
                  </button>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-colors"
                  >
                    <span>Voltar para a Página Inicial</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default FaqPage;
