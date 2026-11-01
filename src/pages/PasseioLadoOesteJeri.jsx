import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  CheckCircle, 
  MapPin, 
  Check, 
  Tag, 
  Clock, 
  Users, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  Compass,
  Ship,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import { toursData, formatPrice } from '@/data/catalog';

const PasseioLadoOesteJeri = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Load catalog data
  const tourOesteShared = toursData.find(t => t.id === 'tour-oeste-shared');
  const tourOestePrivate = toursData.find(t => t.id === 'tour-oeste-private');
  const buggyOpt = tourOestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Buggy');
  const quadriOpt = tourOestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Quadriciclo');
  const sw4Opt = tourOestePrivate?.options?.private?.vehicles?.find(v => v.type === 'SW4');

  const handleWhatsApp = (veiculo = "Lado Oeste") => {
    openWhatsApp(`Olá! Gostaria de informações e reserva para o Passeio Lado Oeste em Jericoacoara (${veiculo}).`);
  };

  const handleBook = (item, modality, vehicleType) => {
    openWhatsApp({
      servico: item?.id || 'tour-oeste',
      modalidade: modality,
      veiculo: vehicleType,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Qual a duração média do Passeio Lado Oeste e os horários?",
      a: "O passeio dura cerca de 6 horas. A saída da sua pousada em Jericoacoara ocorre por volta das 09:00 da manhã e o retorno acontece entre 15:00 e 15:30, após o almoço e banho na Lagoa da Torta."
    },
    {
      q: "A travessia de balsa em Guriú está inclusa no valor?",
      a: "Sim! A travessia de balsa tradicional do veículo pelo Rio Guriú já está inclusa tanto na Jardineira compartilhada quanto nos veículos privativos contratados com a Jericoacoara Premium."
    },
    {
      q: "Como funciona a tirolesa e o toboágua nas dunas da Tatajuba?",
      a: "São atrações opcionais montadas pelos moradores locais nas encostas da Duna do Funil. Você pode descer de tirolesa ou escorregar no toboágua caindo diretamente na água da lagoa. O custo é pago no local por descida (geralmente entre R$ 20,00 e R$ 25,00)."
    },
    {
      q: "O passeio aos cavalos-marinhos é obrigatório?",
      a: "Não, é uma atração ecológica opcional. Durante a parada no manguezal do Rio Guriú, quem desejar pode embarcar em uma canoa artesanal de nativos para observar cavalos-marinhos em seu habitat natural (ingresso de cerca de R$ 25 a R$ 30 por pessoa pago diretamente ao barqueiro)."
    },
    {
      q: "Como é o almoço na Lagoa da Torta (Tatajuba)?",
      a: "O almoço é uma das experiências mais marcantes de Jeri: as barracas apresentam uma bandeja com peixes nobres (como Robalo e Pargo) e lagostas frescas pescadas no dia para você escolher na hora o seu prato grelhado, acompanhado de arroz, pirão e macaxeira, saboreando com os pés na água."
    }
  ];

  const stops = [
    {
      num: '01',
      title: 'Praia e Trilha do Mangue Seco',
      tag: 'Cenário Cinematográfico',
      desc: 'Visual impressionante de raízes aéreas entrelaçadas esculpidas pelo avanço das marés e das areias. Um ponto de parada clássico para fotos criativas e contemplação ecológica.'
    },
    {
      num: '02',
      title: 'Passeio Ecológico dos Cavalos-Marinhos',
      tag: 'Ecoturismo Opcional',
      desc: 'Parada na foz do Rio Guriú onde barqueiros nativos conduzem canoas de madeira silenciosas pelos canais do manguezal para observação responsável de cavalos-marinhos.'
    },
    {
      num: '03',
      title: 'Travessia de Balsa Rústica em Guriú',
      tag: 'Tradição Cearense',
      desc: 'Experiência única onde os veículos 4x4 e buggys atravessam o rio sobre balsas de madeira impulsionadas manualmente pelos balseiros com varas de apoio.'
    },
    {
      num: '04',
      title: 'Dunas de Tatajuba & Duna do Funil',
      tag: 'Aventura Radical',
      desc: 'Trecho emocionante pelas dunas móveis da Velha Tatajuba (vila soterrada pela areia). Na Duna do Funil, divirta-se na tirolesa gigante e no toboágua com mergulho refrescante.'
    },
    {
      num: '05',
      title: 'Lagoa da Torta (Tatajuba) & Almoço',
      tag: 'Cardápio ao Vivo',
      desc: 'Lagoa de águas tranquilas e mornas com mesinhas e redes dentro d’água. Parada para relaxar, tomar banho e saborear o tradicional peixe frito ou grelhado com escolha direta na bandeja.'
    }
  ];

  const oesteSchema = [
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
          name: 'Passeios em Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/passeios-jericoacoara',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Passeio Lado Oeste em Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/passeio-lado-oeste-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Passeio Lado Oeste em Jericoacoara: Tatajuba e Mangue Seco',
      serviceType: 'Passeio Turístico Off-Road 4x4',
      description: 'Aventura e emoção nas Dunas de Tatajuba, Mangue Seco, balsa no Rio Guriú e toboágua. Passeio privativo e compartilhado em Jericoacoara com guias credenciados.',
      provider: {
        '@type': 'TravelAgency',
        name: 'Jericoacoara Premium',
        url: 'https://www.jericoacoarapremium.com/',
        telephone: '+5588988463182',
        taxID: '51.790.615/0001-08',
      },
      areaServed: {
        '@type': 'City',
        name: 'Jericoacoara',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '80.00',
        highPrice: '700.00',
        offerCount: '4',
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
      title="Passeio Lado Oeste em Jericoacoara: Tatajuba e Mangue Seco | Jericoacoara Premium"
      description="Aventura e emoção nas Dunas de Tatajuba, Mangue Seco, balsa no Rio Guriú e toboágua. Passeio privativo e compartilhado em Jericoacoara com guias credenciados."
      canonical="https://www.jericoacoarapremium.com/passeio-lado-oeste-jericoacoara"
      schema={oesteSchema}
    >
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Passeio Lado Oeste Dunas de Tatajuba em Jericoacoara"
            src="/images/tours/passeio-oeste.webp"
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0F1A1C]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full mb-6 font-semibold uppercase tracking-widest text-xs backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aventura & Ecoturismo • Dunas Móveis de Tatajuba</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Passeio Lado Oeste em Jericoacoara: Tatajuba e Mangue Seco
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 font-light mb-8 max-w-3xl mx-auto"
          >
            Viva a adrenalina das dunas de Tatajuba, a travessia tradicional de balsa em Guriú, o famoso toboágua e o almoço com peixe fresco na Lagoa da Torta.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => {
                const element = document.querySelector('#veiculos');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              Ver Valores e Opções
            </Button>
            <Button
              onClick={() => handleWhatsApp('Lado Oeste')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-md"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-[#25D366]" />
              Reservar no WhatsApp
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Ficha Rápida do Passeio */}
      <section className="py-12 bg-[#0F1A1C] text-white border-y border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Duração</p>
                <p className="text-lg font-bold text-white mt-1">~6 Horas</p>
                <p className="text-xs text-gray-400 mt-0.5">Saída ~09h | Volta ~15h30</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Ship className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Balsa Inclusa</p>
                <p className="text-lg font-bold text-white mt-1">Rio Guriú</p>
                <p className="text-xs text-gray-400 mt-0.5">Travessia sobre balsa de madeira</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Compass className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Estilo</p>
                <p className="text-lg font-bold text-white mt-1">Aventura Off-Road</p>
                <p className="text-xs text-gray-400 mt-0.5">Dunas, toboágua e tirolesa</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Credenciamento</p>
                <p className="text-lg font-bold text-white mt-1">CADASTUR</p>
                <p className="text-xs text-gray-400 mt-0.5">Piloto experiente em dunas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roteiro Parada a Parada */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Roteiro Parada a Parada no Lado Oeste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Conheça as 5 principais etapas de um dos roteiros mais emocionantes do Ceará:
            </p>
          </div>

          <div className="space-y-6">
            {stops.map((stop, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F1A1C] text-[#D4AF37] font-bold text-xl flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                    {stop.num}
                  </div>
                  <div>
                    <div className="inline-block bg-teal-50 text-[#2C7A7B] text-xs font-bold px-3 py-0.5 rounded-full mb-2">
                      {stop.tag}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stop.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{stop.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opções de Veículos e Preços */}
      <section id="veiculos" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha o Seu Veículo para o Lado Oeste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Valores com balsa inclusa, 5% de desconto no PIX e parcelamento no cartão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jardineira Compartilhada */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 text-gray-800 p-6 text-center border-b border-gray-200">
                <div className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase">
                  Opção Econômica
                </div>
                <h3 className="text-xl font-bold">Jardineira 4x4</h3>
                <p className="text-xs text-gray-500 mt-1">Compartilhado Coletivo</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(tourOesteShared?.options?.shared?.price)}</span>
                  {' '}
                  <span className="text-sm opacity-80 text-gray-500">por pessoa</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por pessoa:</strong> ótimo para viajantes solo ou casais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Balsa tradicional inclusa no percurso.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Embarque e retorno na pousada em Jeri.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourOesteShared, 'shared', 'Jardineira')} variant="outline" className="w-full border-gray-800 font-bold h-11">
                  Reservar Jardineira
                </Button>
              </div>
            </div>

            {/* Buggy Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#D4AF37] flex flex-col h-full hover:shadow-xl transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-gray-900 font-bold px-3 py-1 rounded-bl-lg text-xs z-10">
                Mais Desejado
              </div>
              <div className="bg-gray-900 text-white p-6 text-center">
                <h3 className="text-xl font-bold">Buggy Privativo</h3>
                <p className="text-xs text-white/70 mt-1">Até 4 passageiros</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(buggyOpt?.price || 500)}</span>
                  {' '}
                  <span className="text-sm opacity-80 text-white/80">por veículo</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por veículo privativo:</strong> até 4 pessoas com exclusividade total.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Escolha seu ritmo: "com ou sem emoção" nas dunas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Motorista nativo credenciado e balsa inclusa.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourOestePrivate, 'private', 'Buggy')} className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold h-11">
                  Reservar Buggy
                </Button>
              </div>
            </div>

            {/* Quadriciclo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white p-6 text-center">
                <div className="inline-block bg-teal-500/20 text-teal-300 text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase">
                  Pilotagem Real
                </div>
                <h3 className="text-xl font-bold">Quadriciclo 4x4</h3>
                <p className="text-xs text-white/70 mt-1">Até 2 pessoas (Piloto + Garupa)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(quadriOpt?.price || 500)}</span>
                  {' '}
                  <span className="text-sm opacity-80 text-white/80">por veículo</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por veículo privativo:</strong> você pilota o quadriciclo seguindo o guia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Adrenalina pura nas subidas e descidas de dunas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Balsa do quadriciclo inclusa no valor.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourOestePrivate, 'private', 'Quadriciclo')} variant="outline" className="w-full border-gray-800 font-bold h-11">
                  Reservar Quadri
                </Button>
              </div>
            </div>

            {/* SW4 4x4 VIP */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-[#2C7A7B] text-white p-6 text-center">
                <div className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase">
                  Conforto VIP Climatizado
                </div>
                <h3 className="text-xl font-bold">Toyota SW4 4x4</h3>
                <p className="text-xs text-white/80 mt-1">Até 6 passageiros</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(sw4Opt?.price || 700)}</span>
                  {' '}
                  <span className="text-sm opacity-90">por veículo</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por veículo privativo:</strong> ar-condicionado e silêncio absoluto a bordo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Máxima proteção contra sol forte e areia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Comporta até 6 pessoas confortavelmente.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourOestePrivate, 'private', 'SW4')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 font-bold h-11 text-white">
                  Reservar SW4 VIP
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* O Que Inclui e Não Inclui */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O Que Está Incluso no Passeio Lado Oeste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" /> Incluso no Pacote
              </h3>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Veículo 4x4 selecionado credenciado pelo Parque Nacional.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Travessia de balsa tradicional do Rio Guriú (ida e volta do veículo).</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Guia e motorista nativo credenciado no CADASTUR.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Embarque e retorno direto na sua pousada na Vila de Jeri.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Waves className="w-6 h-6 text-[#D4AF37]" /> Não Incluso (Opcionais Locais)
              </h3>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Passeio ecológico em canoa para ver cavalos-marinhos (~R$ 25 a R$ 30 por pessoa).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Descidas de tirolesa e toboágua na Duna do Funil (~R$ 20 por descida).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Almoço, petiscos e bebidas nos restaurantes da Lagoa da Torta.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Taxa de Turismo Sustentável (TTS) da Vila de Jericoacoara.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Lado Oeste */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre o Passeio Lado Oeste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
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

          <div className="mt-12 p-8 bg-[#0F1A1C] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <p className="font-bold text-xl text-[#D4AF37]">Quer viver a aventura do Lado Oeste?</p>
              <p className="text-sm text-gray-300 mt-1">Converse com nossos consultores nativos e garanta sua vaga.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Lado Oeste')}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-4 rounded-full shrink-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Reservar pelo WhatsApp
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default PasseioLadoOesteJeri;
