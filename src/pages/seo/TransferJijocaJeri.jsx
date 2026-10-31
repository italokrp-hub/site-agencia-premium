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
  Users,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import { transfersData, formatPrice } from '@/data/catalog';
import { useLanguage } from '@/i18n/LanguageContext';

const TransferJijocaJeri = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  // Load actual data from catalog
  const jijocaTransfer = transfersData.find(t => t.id === 'jijoca');
  
  const handleWhatsApp = (assunto = "Transfer Jijoca -> Jericoacoara") => {
    openWhatsApp(`Olá! Vi a página de ${assunto} e gostaria de tirar uma dúvida.`);
  };

  const handleBook = (item, modality) => {
    openWhatsApp({
      servico: item?.id || item?.title || 'jijoca',
      modalidade: modality,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Onde deixo meu carro próprio em Jijoca de Jericoacoara?",
      a: "Carros de passeio comuns (4x2) não conseguem transitar com segurança nas dunas e areia fofa de Jericoacoara. Por isso, orientamos que você deixe seu veículo em estacionamentos privados de apoio parceiros no centro de Jijoca (cobertos, murados e com vigilância 24h). Nosso veículo 4x4 busca você diretamente no estacionamento."
    },
    {
      q: "Quanto tempo dura a travessia de Jijoca até a Vila de Jeri?",
      a: "A travessia leva entre 35 e 45 minutos. O percurso tem cerca de 20 km e passa por dentro do Parque Nacional de Jericoacoara, superando dunas e trilhas de areia até a entrada da vila."
    },
    {
      q: "O transfer me deixa na pousada ou no ponto central?",
      a: "Tanto no transfer privativo quanto no compartilhado, nossos motoristas levam você e suas bagagens diretamente até a porta da sua pousada ou hotel dentro da Vila de Jericoacoara."
    },
    {
      q: "Existe taxa extra para transfers realizados à noite?",
      a: "Sim. Para saídas noturnas entre 18:00 e 06:00, há uma taxa operacional de R$ 20,00 por veículo devido às condições de visibilidade e suporte noturno nas dunas."
    },
    {
      q: "A Taxa de Turismo Sustentável (TTS) de Jijoca está inclusa?",
      a: "Não. A Taxa de Turismo Sustentável é municipal (R$ 41,50 até 10 dias por visitante) e deve ser paga pelo viajante via internet no portal da Prefeitura de Jijoca ou no posto de fiscalização na entrada da vila."
    }
  ];

  const jijocaSchema = [
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
          name: 'Transfer Jijoca para Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/transfer-jijoca-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Transfer Jijoca para Jericoacoara: Hilux e Jardineira 4x4 Credenciada',
      serviceType: 'Transfer Turístico 4x4 Off-Road',
      description: 'Travessia oficial pelas dunas de Jijoca até a sua pousada na Vila de Jericoacoara em veículos 4x4 autorizados, opções privativas ou compartilhadas.',
      provider: {
        '@type': 'TravelAgency',
        name: 'Jericoacoara Premium',
        url: 'https://www.jericoacoarapremium.com/',
        telephone: '+5588988463182',
        taxID: '51.790.615/0001-08',
      },
      areaServed: [
        { '@type': 'City', name: 'Jijoca de Jericoacoara' },
        { '@type': 'City', name: 'Jericoacoara' },
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '60.00',
        highPrice: '250.00',
        offerCount: '2',
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
      title="Transfer Jijoca para Jericoacoara | Hilux e Jardineira 4x4 Credenciada"
      description="Travessia oficial pelas dunas de Jijoca até a sua pousada na Vila de Jericoacoara em veículos 4x4 autorizados, opções privativas ou compartilhadas."
      canonical="https://www.jericoacoarapremium.com/transfer-jijoca-jericoacoara"
      schema={jijocaSchema}
    >
      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 em Jijoca de Jericoacoara nas dunas"
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
            <span>Travessia Oficial de Dunas • ICMBio e Prefeitura Credenciados</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transfer Jijoca para Jericoacoara
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light"
          >
            {t('seoTransfers.jijocaSubtitle', { defaultValue: 'Chegou em Jijoca de carro ou ônibus? Faça a travessia até a Vila em nossos veículos 4x4 credenciados com conforto, estacionamento seguro e agilidade.' })}
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
              onClick={() => handleWhatsApp('Transfer Jijoca')}
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
                <p className="text-lg font-bold text-white mt-1">35 a 45 min</p>
                <p className="text-xs text-gray-400 mt-0.5">Trilha off-road pelas dunas</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Compass className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Distância</p>
                <p className="text-lg font-bold text-white mt-1">~20 km</p>
                <p className="text-xs text-gray-400 mt-0.5">Areia fofa e trilhas do parque</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Embarque</p>
                <p className="text-lg font-bold text-white mt-1">Jijoca Centro</p>
                <p className="text-xs text-gray-400 mt-0.5">Estacionamento de apoio</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Desembarque</p>
                <p className="text-lg font-bold text-white mt-1">Porta da Pousada</p>
                <p className="text-xs text-gray-400 mt-0.5">Na Vila de Jericoacoara</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regras Transparentes de Operação */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Regras Transparentes da Travessia</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              A travessia de Jijoca até Jericoacoara exige 4x4 credenciado. Saiba todos os detalhes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estacionamento em Jijoca */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#2C7A7B] mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Estacionamento Seguro</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Indicamos estacionamentos cobertos, fechados e com segurança 24h em Jijoca.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>O motorista do transfer 4x4 busca você e suas malas diretamente no estacionamento.</span>
                </li>
              </ul>
            </div>

            {/* Veículos Credenciados */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4AF37] mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Jardineiras e Hilux 4x4</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Jardineiras 4x4 oficiais autorizadas pelo Parque Nacional (até 10 passageiros).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Opção privativa em Hilux fechada climatizada para até 4 passageiros.</span>
                </li>
              </ul>
            </div>

            {/* Bagagem e Crianças */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Bagagem e Crianças</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>1 mala média + 1 bolsa de mão por passageiro no compartilhado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Crianças até 2 anos no colo não pagam assento individual.</span>
                </li>
              </ul>
            </div>

            {/* Horário Noturno */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Saídas Noturnas</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Operação diurna normal das 06:00 às 18:00 com saídas regulares.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Saídas entre 18h e 06h têm adicional de R$ 20,00 de suporte noturno na duna.</span>
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
                  <Check className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Taxa cobrada pelo município de Jijoca (R$ 41,50 por até 10 dias de estadia).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Recomendamos efetuar o pagamento online antes de chegar em Jijoca.</span>
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
                  <span><strong>100% de reembolso</strong> com até 7 dias de antecedência.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Suporte via WhatsApp para alinhar o horário exato da sua chegada em Jijoca.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Opções e Preços */}
      <section id="opcoes" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha a Modalidade de Travessia</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Preços por pessoa no compartilhado ou por veículo no privativo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Compartilhado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 text-gray-800 p-6 text-center border-b border-gray-200">
                <h3 className="text-2xl font-bold">Transfer Compartilhado</h3>
                <p className="opacity-70 text-sm mt-1">Jardineira 4x4 (Jijoca ↔ Jeri)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(jijocaTransfer?.options?.shared?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-80">por pessoa (somente ida)</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-gray-900">{formatPrice(jijocaTransfer?.options?.shared?.roundTrip)}</span>
                  {' '}
                  por pessoa
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por pessoa (compartilhado):</strong> opção mais barata para quem chega de carro ou ônibus.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Saídas contínuas durante o dia após preenchimento do veículo.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Experiência tradicional em Jardineiras 4x4 abertas e ventiladas.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Desembarque direto na porta da sua acomodação em Jeri.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(jijocaTransfer, 'shared')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-base font-bold shadow-sm">
                  Reservar Compartilhado
                </Button>
              </div>
            </div>

            {/* Privativo 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                VIP
              </div>
              <div className="bg-[#2C7A7B] text-white p-6 text-center pt-8">
                <h3 className="text-2xl font-bold">Privativo 4x4</h3>
                <p className="opacity-90 text-sm mt-1">Veículo Exclusivo (Hilux ou Jardineira até 10 pax)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(jijocaTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-90">por veículo (somente ida)</span>
                </div>
                <p className="text-xs text-white/80 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-white">{formatPrice(jijocaTransfer?.options?.private?.tiers?.[0]?.roundTrip)}</span>
                  {' '}
                  por veículo
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por veículo privativo:</strong> exclusivo para sua família ou grupo de até 10 pessoas.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Saída imediata assim que você estacionar em Jijoca, sem esperar ninguém.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Acomoda todas as malas da família com máxima comodidade.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Acompanhamento VIP e flexibilidade de retorno da pousada para Jijoca.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(jijocaTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-base font-bold text-white shadow-sm">
                  Reservar Privativo VIP
                </Button>
              </div>
            </div>

          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={() => handleWhatsApp('Transfer Jijoca')} variant="ghost" className="text-gray-600 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Tem dúvidas sobre estacionamentos parceiros em Jijoca? Fale com a equipe
            </Button>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Específico de Jijoca */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre o Transfer Jijoca ↔ Jeri</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 text-sm sm:text-base">
              Informações indispensáveis para quem viaja de carro próprio ou ônibus até Jijoca.
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
              <p className="font-bold text-lg text-[#D4AF37]">Vai viajar de carro até Jijoca?</p>
              <p className="text-sm text-gray-300 mt-1">Reserve a travessia com antecedência e receba a localização do estacionamento seguro.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Transfer Jijoca')}
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-6 py-3 rounded-full shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Reservar Travessia
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default TransferJijocaJeri;
