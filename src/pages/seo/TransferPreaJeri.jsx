import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  CheckCircle, 
  Map, 
  Check, 
  Shield, 
  Tag, 
  Clock, 
  MapPin, 
  Briefcase, 
  Baby, 
  FileText, 
  ChevronDown, 
  Sparkles,
  Wind,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import { transfersData, formatPrice } from '@/data/catalog';
import { useLanguage } from '@/i18n/LanguageContext';

const TransferPreaJeri = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  // Load actual data from catalog
  const preaTransfer = transfersData.find(t => t.id === 'prea');
  
  const handleWhatsApp = (assunto = "Transfer Preá -> Jericoacoara") => {
    openWhatsApp(`Olá! Vi a página de ${assunto} e gostaria de tirar uma dúvida.`);
  };

  const handleBook = (item, modality) => {
    openWhatsApp({
      servico: item?.id || item?.title || 'prea',
      modalidade: modality,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Quanto tempo dura o trajeto entre a Praia do Preá e Jericoacoara?",
      a: "O percurso leva em média de 30 a 40 minutos em veículo 4x4. A rota é percorrida à beira-mar e pelas dunas do Parque Nacional de Jericoacoara, variando de acordo com as condições da maré."
    },
    {
      q: "É possível transportar pranchas e equipamentos de kitesurf ou wingfoil?",
      a: "Sim, perfeitamente! Nossos veículos 4x4 (Hilux cabine dupla com caçamba protegida) são ideais para transportar pranchas, kites, trapézios e bolsas de equipamentos sem amassar. Solicitamos apenas avisar no momento da reserva para acomodação adequada."
    },
    {
      q: "Vocês buscam em qualquer hotel ou pousada do Preá?",
      a: "Sim, o serviço é 100% porta a porta. Buscamos você em qualquer pousada, hotel de charme ou kite camp na Praia do Preá e deixamos diretamente na porta da sua pousada na Vila de Jericoacoara (ou o trajeto inverso)."
    },
    {
      q: "O transfer Preá ↔ Jeri pode ser compartilhado?",
      a: "A rota Preá ↔ Jeri opera exclusivamente na modalidade privativa em veículo 4x4 ou Jardineira para garantir flexibilidade total de horários de vento e saídas para os velejadores e hóspedes."
    },
    {
      q: "A Taxa de Turismo Sustentável (TTS) é exigida no Preá?",
      a: "A Praia do Preá pertence ao município de Cruz (onde não há taxa de turismo para circular). Porém, ao entrar e se hospedar na Vila de Jericoacoara (município de Jijoca), a Taxa de Turismo Sustentável (R$ 41,50 até 10 dias) é obrigatória e cobrada pela Prefeitura de Jijoca."
    }
  ];

  const preaSchema = [
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
          name: 'Transfer Preá e Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/transfer-prea-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Transfer Preá e Jericoacoara: Transporte 4x4 Privativo e Seguro',
      serviceType: 'Transfer Turístico 4x4',
      description: 'Transporte rápido e seguro em 4x4 entre a Praia do Preá, Aeroporto JJD e a Vila de Jericoacoara para turistas e praticantes de kitesurf.',
      provider: {
        '@type': 'TravelAgency',
        name: 'Jericoacoara Premium',
        url: 'https://www.jericoacoarapremium.com/',
        telephone: '+5588988463182',
        taxID: '51.790.615/0001-08',
      },
      areaServed: [
        { '@type': 'City', name: 'Praia do Preá' },
        { '@type': 'City', name: 'Jericoacoara' },
      ],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '250.00',
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
      title="Transfer Preá e Jericoacoara | Transporte 4x4 Privativo e Seguro"
      description="Transporte rápido e seguro em 4x4 entre a Praia do Preá, Aeroporto JJD e a Vila de Jericoacoara para turistas e praticantes de kitesurf."
      canonical="https://www.jericoacoarapremium.com/transfer-prea-jericoacoara"
      schema={preaSchema}
    >
      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 nas dunas e orla da Praia do Preá"
            src="/images/transfer-4x4-dunas.webp"
            loading="eager"
            fetchPriority="high"
            decoding="async"
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
            <span>Kitesurf & Turismo • 4x4 Exclusivo Porta a Porta</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transfer Preá e Jericoacoara
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light"
          >
            {t('seoTransfers.preaSubtitle', { defaultValue: 'Conexão rápida e exclusiva entre a Praia do Preá e Jericoacoara via beira-mar e Parque Nacional. Transporte perfeito para velejadores e turistas.' })}
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
              {t('seoTransfers.viewOptionsBtn', { defaultValue: 'Ver Tarifas e Reservar' })}
            </Button>
            <Button
              onClick={() => handleWhatsApp('Transfer Preá')}
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
                <p className="text-lg font-bold text-white mt-1">30 a 40 min</p>
                <p className="text-xs text-gray-400 mt-0.5">Trajeto rápido à beira-mar</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Compass className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Distância</p>
                <p className="text-lg font-bold text-white mt-1">~12 km</p>
                <p className="text-xs text-gray-400 mt-0.5">Praia e Parque Nacional</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Embarque</p>
                <p className="text-lg font-bold text-white mt-1">Pousadas do Preá</p>
                <p className="text-xs text-gray-400 mt-0.5">Porta da sua hospedagem</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Desembarque</p>
                <p className="text-lg font-bold text-white mt-1">Vila de Jeri</p>
                <p className="text-xs text-gray-400 mt-0.5">Na porta da pousada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regras Transparentes de Operação */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Regras Transparentes da Rota Preá ↔ Jeri</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Especialmente preparado para velejadores e visitantes entre o polo do kite e Jericoacoara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pranchas de Kite e Wingfoil */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#2C7A7B] mb-4">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Pranchas e Kitesurf</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Acomodação segura de pranchas, trapézios, velas e bolsas de kite na caçamba da Hilux.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Basta nos avisar previamente a quantidade de equipamentos na reserva.</span>
                </li>
              </ul>
            </div>

            {/* Veículo Exclusivo */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4AF37] mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Veículo 4x4 Exclusivo</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Trajeto privativo em Toyota Hilux 4x4 climatizada ou Jardineira credenciada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Horário 100% livre: saia na hora em que o vento começar ou terminar.</span>
                </li>
              </ul>
            </div>

            {/* Bagagem e Passageiros */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Bagagens e Passageiros</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Até 4 passageiros com conforto e todas as malas na Hilux 4x4.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Opção para grupos de até 10 pessoas em Jardineira privativa sob consulta.</span>
                </li>
              </ul>
            </div>

            {/* Crianças e Famílias */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Crianças & Famílias</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Crianças de até 2 anos no colo gratuitas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cadeirinha infantil disponível no privativo sob solicitação prévia.</span>
                </li>
              </ul>
            </div>

            {/* Taxa TTS de Jeri */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Taxa de Turismo (TTS)</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Exigida pela Prefeitura de Jijoca para hóspedes que entram na Vila de Jericoacoara.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Não está inclusa no valor do transporte; gerada online pelo site oficial.</span>
                </li>
              </ul>
            </div>

            {/* Cancelamento sem Risco */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cancelamento Sem Risco</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% de reembolso</strong> com até 7 dias de antecedência do serviço.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Ajuste flexível de horários via WhatsApp direto com nossa central.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Opções e Preços */}
      <section id="opcoes" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Transfer Exclusivo Preá ↔ Jeri</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 text-sm sm:text-base">
              Tarifa fixa por veículo para até 4 passageiros em Toyota Hilux 4x4.
            </p>
          </div>
          
          <div className="flex justify-center">
            {/* Privativo 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37] flex flex-col w-full relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                VIP
              </div>
              <div className="bg-[#2C7A7B] text-white p-8 text-center pt-10">
                <h3 className="text-2xl font-bold">Privativo 4x4</h3>
                <p className="opacity-90 text-sm mt-1">Hilux ou SW4 (Até 4 passageiros)</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{formatPrice(preaTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-90">por veículo (somente ida)</span>
                </div>
                <p className="text-xs text-white/80 mt-2">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-white">{formatPrice(preaTransfer?.options?.private?.tiers?.[0]?.roundTrip)}</span>
                  {' '}
                  por veículo
                </p>
              </div>
              <div className="p-8 flex-grow bg-gray-50">
                <ul className="space-y-4 mb-8 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" />
                    <span><strong>Por veículo privativo:</strong> exclusividade total para você e seu grupo.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" />
                    <span>Viagem rápida de 30 a 40 minutos com vista privilegiada do litoral.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" />
                    <span>Horário 100% flexível de acordo com seu cronograma de kite ou pousada.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" />
                    <span>Espaço reservado para pranchas e equipamentos esportivos.</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto bg-gray-50 flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(preaTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-base font-bold text-white shadow-md hover:shadow-xl transition-all">
                  Reservar Transfer Privativo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={() => handleWhatsApp('Transfer Preá')} variant="ghost" className="text-gray-600 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Precisa de transporte para grupos maiores ou horários especiais? Fale conosco
            </Button>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Específico do Preá */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre o Transfer Preá ↔ Jeri</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 text-sm sm:text-base">
              Esclareça todas as dúvidas sobre o trajeto entre a Praia do Preá e a Vila de Jericoacoara.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all duration-200"
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
              <p className="font-bold text-lg text-[#D4AF37]">Hospedado no Preá e quer passar o dia em Jeri?</p>
              <p className="text-sm text-gray-300 mt-1">Organizamos seu transporte de ida e volta com motorista à sua espera.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Transfer Preá')}
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-6 py-3 rounded-full shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Solicitar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default TransferPreaJeri;
