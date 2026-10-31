import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  CheckCircle, 
  ShieldCheck, 
  Map, 
  Check, 
  Tag, 
  Clock, 
  MapPin, 
  Briefcase, 
  Baby, 
  Plane, 
  FileText, 
  ChevronDown, 
  Sparkles,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import { transfersData, formatPrice } from '@/data/catalog';
import { useLanguage } from '@/i18n/LanguageContext';

const TransferFortalezaJeri = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  // Load actual data from catalog
  const busTransfer = transfersData.find(t => t.id === 'onibus-regular');
  const sharedTransfer = transfersData.find(t => t.id === 'fortaleza');
  
  const handleWhatsApp = (assunto = "Transfer Fortaleza -> Jericoacoara") => {
    openWhatsApp(`Olá! Vi a página de ${assunto} e gostaria de tirar uma dúvida.`);
  };

  const handleBook = (item, modality) => {
    openWhatsApp({
      servico: item?.id || item?.title || 'transfer-fortaleza',
      modalidade: modality,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Quanto tempo dura a viagem de Fortaleza para Jericoacoara?",
      a: "No transfer privativo em veículo 4x4 (Hilux ou SW4), o trajeto dura em média entre 4h e 4h30min, sem paradas desnecessárias e direto até a porta da sua pousada. No transfer compartilhado (ônibus/van até Jijoca com conexão em Jardineira 4x4), a viagem dura entre 5h e 6h, dependendo da rota dos hotéis e do tempo de transbordo nas dunas."
    },
    {
      q: "Como funciona o embarque no Aeroporto de Fortaleza (FOR) ou nos Hotéis?",
      a: "Se o seu embarque for no Aeroporto Pinto Martins (FOR), nosso motorista credenciado estará aguardando no saguão de desembarque no horário do seu voo com identificação clara. Se for em hotel ou pousada em Fortaleza (orla da Beira-Mar, Meireles, Iracema ou Praia do Futuro), a busca é realizada na recepção com confirmação antecipada via WhatsApp."
    },
    {
      q: "Qual a diferença entre o transfer privativo 4x4 e o compartilhado?",
      a: "O transfer privativo oferece um veículo 4x4 exclusivo para o seu grupo (Hilux para até 4 passageiros ou SW4 para até 6), horário 100% flexível de acordo com seu voo, paradas personalizadas e trajeto direto até Jeri sem troca de veículo. Já o compartilhado possui horários e pontos fixos, onde você divide o veículo com outros passageiros, tornando-se a alternativa mais econômica."
    },
    {
      q: "O que acontece se meu voo para o Aeroporto de Fortaleza atrasar?",
      a: "No serviço privativo, monitoramos seu voo em tempo real nos sistemas da Infraero/Fraport. Basta nos informar a companhia e o número do voo no momento da reserva: havendo atraso confirmado, garantimos a tolerância de espera sem custo adicional para que você viaje com tranquilidade."
    },
    {
      q: "A Taxa de Turismo Sustentável (TTS) de Jericoacoara está inclusa?",
      a: "Não. A Taxa de Turismo Sustentável é um tributo cobrado diretamente pela Prefeitura Municipal de Jijoca de Jericoacoara (R$ 41,50 para até 10 dias de estadia por visitante, com isenção para crianças menores de 12 anos e idosos acima de 60 anos). O pagamento deve ser realizado online com antecedência no site oficial da Prefeitura de Jijoca ou no posto de controle na entrada da Vila."
    }
  ];

  const fortalezaSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: 'https://www.jericoacoarapremium.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Transfer Fortaleza para Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/transfer-fortaleza-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Transfer Fortaleza para Jericoacoara: 4x4 Privativo e Compartilhado',
      serviceType: 'Transfer Turístico 4x4',
      description: 'Reserve seu transfer de Fortaleza (Aeroporto FOR ou hotéis) para Jericoacoara em veículo 4x4 credenciado, com seguro, conforto e suporte 24h via WhatsApp.',
      provider: {
        '@type': 'TravelAgency',
        name: 'Jericoacoara Premium',
        url: 'https://www.jericoacoarapremium.com/',
        telephone: '+5588988463182',
        taxID: '51.790.615/0001-08',
      },
      areaServed: [
        { '@type': 'City', name: 'Fortaleza' },
        { '@type': 'City', name: 'Jericoacoara' },
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '175.00',
        highPrice: '1100.00',
        offerCount: '3',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ];

  return (
    <SEOLayout 
      title="Transfer Fortaleza para Jericoacoara | 4x4 Privativo e Compartilhado"
      description="Reserve seu transfer de Fortaleza (Aeroporto FOR ou hotéis) para Jericoacoara em veículo 4x4 credenciado, com seguro, conforto e suporte 24h via WhatsApp."
      canonical="https://www.jericoacoarapremium.com/transfer-fortaleza-jericoacoara"
      schema={fortalezaSchema}
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 Toyota Hilux nas dunas de Jericoacoara"
            src="/images/transfer-4x4-dunas.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F1A1C]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full mb-6 font-semibold uppercase tracking-widest text-xs backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frota 4x4 Credenciada • CADASTUR 51.790.615/0001-08</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transfer Fortaleza para Jericoacoara
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 font-light mb-8 max-w-3xl mx-auto"
          >
            {t('seoTransfers.fortalezaSubtitle', { defaultValue: 'Opções econômicas, compartilhadas ou privativas saindo do Aeroporto Pinto Martins (FOR) ou da Orla de Fortaleza direto para sua pousada em Jeri.' })}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => {
                const element = document.querySelector('#opcoes');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              {t('seoTransfers.viewOptionsBtn', { defaultValue: 'Ver Opções e Preços' })}
            </Button>
            <Button
              onClick={() => handleWhatsApp('Transfer Fortaleza')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-md"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-[#25D366]" />
              Falar no WhatsApp
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Ficha Técnica da Rota */}
      <section className="py-12 bg-[#0F1A1C] text-white border-y border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Duração Média</p>
                <p className="text-lg font-bold text-white mt-1">4h a 4h30min</p>
                <p className="text-xs text-gray-400 mt-0.5">Privativo (~5h no compartilhado)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Map className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Distância Total</p>
                <p className="text-lg font-bold text-white mt-1">~300 km</p>
                <p className="text-xs text-gray-400 mt-0.5">280km asfalto + 20km dunas</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Embarque</p>
                <p className="text-lg font-bold text-white mt-1">Aeroporto FOR / Hotéis</p>
                <p className="text-xs text-gray-400 mt-0.5">Orla e área urbana de Fortaleza</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Desembarque</p>
                <p className="text-lg font-bold text-white mt-1">Porta da Pousada</p>
                <p className="text-xs text-gray-400 mt-0.5">Dentro da Vila de Jericoacoara</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regras Transparentes de Operação */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Regras Transparentes de Operação</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Viaje com total previsibilidade. Sem surpresas ou taxas ocultas no embarque.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bagagem */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#2C7A7B] mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Limite de Bagagem</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Privativo:</strong> até 2 malas despachadas (até 23kg cada) + 1 mala de mão por passageiro.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Compartilhado:</strong> 1 mala despachada (até 23kg) + 1 mochila de mão por assento.</span>
                </li>
              </ul>
            </div>

            {/* Crianças e Cadeirinha */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4AF37] mb-4">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Crianças & Cadeirinha</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Crianças de colo até 2 anos completos não pagam assento no compartilhado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cadeirinha infantil ou assento de elevação (booster) gratuito no privativo sob aviso prévio.</span>
                </li>
              </ul>
            </div>

            {/* Monitoramento de Voo */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Atrasos de Voo Monitorados</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Acompanhamos em tempo real o pouso do seu voo no Aeroporto FOR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tolerância de espera sem cobrança de taxa extra caso o voo atrase.</span>
                </li>
              </ul>
            </div>

            {/* Frota e Capacidade */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Frota e Capacidade</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Toyota Hilux 4x4:</strong> até 4 passageiros com ampla caçamba para bagagens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Toyota SW4 4x4:</strong> até 6 passageiros com acabamento premium em couro.</span>
                </li>
              </ul>
            </div>

            {/* Taxa de Turismo TTS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Taxa de Turismo (TTS)</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tributo municipal obrigatório cobrado pela Prefeitura de Jijoca (R$ 41,50 até 10 dias).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Não inclusa no transfer; orientamos a emissão prévia pelo site oficial da prefeitura.</span>
                </li>
              </ul>
            </div>

            {/* Cancelamento e Reembolso */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cancelamento Sem Risco</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% de reembolso integral</strong> com até 7 dias de antecedência.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Suporte humanizado 24h via WhatsApp para qualquer alteração de data.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Opções e Preços (Padronização Comercial) */}
      <section id="opcoes" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tarifas Transparentes Fortaleza ↔ Jericoacoara</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Valores claros por pessoa ou por veículo. Economize 5% pagando via PIX ou parcele em até 12x no cartão.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Econômico */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#D4AF37] flex flex-col h-full transform hover:-translate-y-2 transition-all relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-gray-900 font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                Mais Econômico
              </div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={busTransfer?.image || "/images/onibus-transfer-jericoacoara-premium.webp"}
                  alt="Transfer de Ônibus Jericoacoara Premium - Fortaleza para Jeri"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-2xl font-bold">Transfer Econômico</h3>
                  <p className="opacity-90 text-xs font-medium">Ônibus/Van Regular com transbordo 4x4 em Jijoca</p>
                </div>
              </div>
              <div className="bg-gray-900 text-white p-5 text-center">
                <div>
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(busTransfer?.options?.shared?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-80">por pessoa (somente ida)</span>
                </div>
                <p className="text-xs text-white/70 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-white">{formatPrice(busTransfer?.options?.shared?.roundTrip)}</span>
                  {' '}
                  por pessoa
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por pessoa (compartilhado):</strong> ideal para viajantes solo ou casais.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Horários fixos diários saindo do Aeroporto FOR e hotéis da Beira-Mar.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Ônibus executivo até Jijoca + Jardineira 4x4 oficial até sua pousada em Jeri.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>1 mala despachada (até 23kg) + 1 mochila de mão por pessoa.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(busTransfer, 'shared')} className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold h-12 text-base shadow-sm">
                  Reservar Econômico
                </Button>
              </div>
            </div>

            {/* Compartilhado 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 text-gray-800 p-6 text-center border-b border-gray-200">
                <h3 className="text-2xl font-bold">Compartilhado 4x4</h3>
                <p className="opacity-70 text-sm mt-1">Hilux / SW4 Direto sem transbordo</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(sharedTransfer?.options?.shared?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-80">por pessoa (somente ida)</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-gray-900">{formatPrice(sharedTransfer?.options?.shared?.roundTrip)}</span>
                  {' '}
                  por pessoa
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por pessoa (compartilhado):</strong> grupos reduzidos de até 4 a 6 pessoas.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Viagem direto no mesmo veículo 4x4 de Fortaleza até a pousada em Jeri.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Busca na orla ou Aeroporto FOR com ar-condicionado durante todo o trajeto.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Mais rápido que o ônibus: trajeto de aproximadamente 4h30min a 5h.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(sharedTransfer, 'shared')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-base font-bold shadow-sm">
                  Reservar Compartilhado
                </Button>
              </div>
            </div>

            {/* Privativo 4x4 VIP */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-[#2C7A7B] text-white p-6 text-center">
                <div className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase tracking-wider">
                  Exclusividade Total
                </div>
                <h3 className="text-2xl font-bold">Privativo VIP</h3>
                <p className="opacity-90 text-sm mt-1">Hilux (até 4 pax) ou SW4 (até 6 pax)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(sharedTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-90">por veículo (somente ida)</span>
                </div>
                <p className="text-xs text-white/80 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-white">{formatPrice(sharedTransfer?.options?.private?.tiers?.[0]?.roundTrip)}</span>
                  {' '}
                  por veículo
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por veículo privativo:</strong> você e seus acompanhantes com total privacidade.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Horário 100% flexível: saída na hora exata do seu voo ou no horário de sua preferência.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Paradas livres para alimentação, fotos e descanso na estrada.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Tolerância de atraso de voo e cadeirinha/booster inclusos sem custo extra.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(sharedTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-base font-bold text-white shadow-sm">
                  Reservar Privativo VIP
                </Button>
              </div>
            </div>

          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={() => handleWhatsApp('Dúvida sobre Transfer Fortaleza')} variant="ghost" className="text-gray-600 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Precisa de ajuda para escolher? Fale com um consultor especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona o Trajeto */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">O Trajeto: Fortaleza ↔ Jericoacoara Passo a Passo</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">1. Embarque em Fortaleza</h3>
                <p className="text-gray-600 text-sm">Recepção no Aeroporto Pinto Martins (FOR) com placa de identificação no desembarque ou diretamente no saguão do seu Hotel na orla. Acomodação das malas e início da viagem.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">2. Trecho em Asfalto (~3.5h)</h3>
                <p className="text-gray-600 text-sm">Viagem tranquila e segura pela rodovia CE-085 (Estruturante) em direção a Jijoca de Jericoacoara, com ar-condicionado e parada opcional para café/lanche.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">3. Trilha Off-Road Dunas e Praia (~40m)</h3>
                <p className="text-gray-600 text-sm">Entrada no Parque Nacional de Jericoacoara. O veículo 4x4 credenciado percorre o trecho final de dunas e areia fofa com total segurança e pilotos experientes.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[#2C7A7B] text-white rounded-2xl shadow-md border border-[#2C7A7B]">
                <h3 className="font-bold text-lg mb-2">4. Desembarque na Pousada em Jeri</h3>
                <p className="text-white/90 text-sm">Desembarque exatamente na porta da sua pousada ou hotel na Vila de Jeri, sem necessidade de carregar malas pelas ruas de areia.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mini-FAQ Específico da Rota */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre o Transfer Fortaleza ↔ Jeri</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 text-sm sm:text-base">
              Confira as respostas para as perguntas mais comuns de quem viaja de Fortaleza para Jericoacoara.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left font-bold text-gray-900 bg-gray-50/50 hover:bg-gray-100/80 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                  aria-expanded={openFaq === idx}
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-6 bg-white text-gray-700 text-sm sm:text-base leading-relaxed border-t border-gray-100">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#0F1A1C] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg text-[#D4AF37]">Ainda tem dúvidas sobre o seu transfer?</p>
              <p className="text-sm text-gray-300 mt-1">Nossa equipe atende 24 horas no WhatsApp para montar seu roteiro.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Dúvida sobre Transfer Fortaleza')}
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-6 py-3 rounded-full shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Falar com Atendente
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default TransferFortalezaJeri;
