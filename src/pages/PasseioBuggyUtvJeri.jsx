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
  Zap,
  Gauge,
  Sliders,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import { toursData, formatPrice } from '@/data/catalog';

const PasseioBuggyUtvJeri = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Load catalog data
  const tourLestePrivate = toursData.find(t => t.id === 'tour-leste-private');
  const tourOestePrivate = toursData.find(t => t.id === 'tour-oeste-private');
  const tourUtv = toursData.find(t => t.id === 'tour-utv');
  const buggyLeste = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Buggy');
  const quadriLeste = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Quadriciclo');
  const sw4Leste = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'SW4');

  const handleWhatsApp = (veiculo = "Buggy e UTV") => {
    openWhatsApp(`Olá! Gostaria de informações sobre os passeios de ${veiculo} em Jericoacoara.`);
  };

  const handleBook = (servico, modalidade, veiculo) => {
    openWhatsApp({
      servico,
      modalidade,
      veiculo,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Qual a diferença entre alugar um Buggy, um UTV ou um Quadriciclo?",
      a: "No Buggy (até 4 passageiros), você é conduzido por um motorista-guia nativo credenciado, desfrutando da paisagem sem preocupações de pilotagem. No Quadriciclo (para até 2 pessoas), você mesmo pilota seguindo o guia à frente. Já o UTV Can-Am Maverick X3 é o ápice da performance off-road de alta potência, com suspensão esportiva de competição, gaiola tubular e tração 4x4 inteligente."
    },
    {
      q: "Preciso de habilitação (CNH) para pilotar Quadriciclo ou UTV?",
      a: "Sim. Para os veículos em que o cliente assume a condução (Quadriciclo ou UTV), é obrigatório apresentar Carteira Nacional de Habilitação (CNH categoria B) válida e ser maior de 18 anos. Antes do início da expedição, realizamos um briefing com instruções completas de segurança."
    },
    {
      q: "Posso escolher entre o Roteiro Leste e o Roteiro Oeste no Buggy ou Quadriciclo?",
      a: "Com certeza! Os passeios privativos de Buggy, Quadriciclo e SW4 podem ser realizados tanto no roteiro do Lado Leste (Lagoa do Paraíso e Buraco Azul) quanto no Lado Oeste (Dunas de Tatajuba e Mangue Seco), ou combinados em roteiros especiais personalizados."
    },
    {
      q: "Os passeios de Buggy são seguros para crianças e idosos?",
      a: "Sim. Todos os nossos bugueiros são credenciados pela Prefeitura e pelo Parque Nacional, treinados em direção preventiva nas dunas. Para famílias com bebês de colo ou idosos que preferem não pegar vento e poeira direta, recomendamos nossa Toyota SW4 4x4 climatizada."
    },
    {
      q: "Qual a antecedência recomendada para reservar?",
      a: "Devido ao número limitado de veículos credenciados para circulação no Parque Nacional e à alta procura por Buggys e UTVs, recomendamos reservar com pelo menos 3 a 7 dias de antecedência para garantir seu veículo no horário desejado."
    }
  ];

  const vehicles = [
    {
      title: 'Buggy Credenciado',
      badge: 'O Mais Tradicional',
      badgeColor: 'bg-[#D4AF37] text-gray-900',
      capacity: 'Até 4 Passageiros + Piloto Nativo',
      price: formatPrice(buggyLeste?.price || 450),
      priceUnit: 'por veículo (trecho Leste)',
      desc: 'O veículo mais clássico de Jeri. Permite total ventilação, contato íntimo com a brisa do mar e ângulos perfeitos para fotografias nas dunas.',
      features: [
        'Motorista nativo experiente e guia fotógrafo',
        'Flexibilidade total de tempo em cada atração',
        'Embarque direto na porta da pousada na Vila',
        'Acesso completo a todas as lagoas e dunas autorizadas'
      ],
      icon: Compass,
      bookVehicle: 'Buggy'
    },
    {
      title: 'UTV Can-Am Maverick X3',
      badge: 'Performance & Luxo',
      badgeColor: 'bg-rose-500 text-white',
      capacity: 'Até 2 Pessoas (Piloto + Passageiro)',
      price: 'Sob Consulta',
      priceUnit: 'experiência VIP off-road',
      desc: 'Máquina esportiva de alta tecnologia para quem busca adrenalina de ponta com segurança máxima. Gaiola tubular de corrida, suspensão Fox e tração 4x4 inteligente.',
      features: [
        'UTV Can-Am Maverick X3 de última geração',
        'Capacete esportivo e óculos de proteção inclusos',
        'Guia líder especialista abrindo a trilha off-road',
        'Sensação inigualável de velocidade controlada nas dunas'
      ],
      icon: Zap,
      bookVehicle: 'UTV'
    },
    {
      title: 'Quadriciclo 4x4 (ATV)',
      badge: 'Pilote Você Mesmo',
      badgeColor: 'bg-teal-600 text-white',
      capacity: 'Até 2 Pessoas (Piloto + Garupa)',
      price: formatPrice(quadriLeste?.price || 450),
      priceUnit: 'por veículo (trecho Leste)',
      desc: 'Sensação de liberdade e controle total. Você pilota nas trilhas ecológicas acompanhando o guia à sua frente, superando dunas e caminhos de areia.',
      features: [
        'Transmissão automática fácil de pilotar',
        'Instrução prática e teste inicial antes da saída',
        'Equipamento de segurança obrigatório incluso',
        'Exige CNH categoria B para o piloto condutor'
      ],
      icon: Gauge,
      bookVehicle: 'Quadriciclo'
    },
    {
      title: 'Toyota SW4 4x4 VIP',
      badge: 'Conforto Executivo',
      badgeColor: 'bg-[#2C7A7B] text-white',
      capacity: 'Até 6 Passageiros com Ar-Condicionado',
      price: formatPrice(sw4Leste?.price || 600),
      priceUnit: 'por veículo (trecho Leste)',
      desc: 'A alternativa de luxo com cabine fechada, ar-condicionado digital e bancos em couro. Zero poeira, zero cansaço térmico e silêncio absoluto para toda a família.',
      features: [
        'Ar-condicionado 100% do tempo em qualquer terreno',
        'Ideal para famílias com crianças pequenas e idosos',
        'Comporta até 6 pessoas confortavelmente',
        'Motorista executivo credenciado Cadastur'
      ],
      icon: Award,
      bookVehicle: 'SW4'
    }
  ];

  const buggySchema = [
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
          name: 'Passeio de Buggy, UTV e Quadriciclo em Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/passeio-buggy-utv-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Passeio de Buggy, UTV e Quadriciclo em Jericoacoara: Privativo e Credenciado',
      serviceType: 'Passeios Off-Road em Jericoacoara',
      description: 'Passeios privativos off-road em Jericoacoara: compare Buggy, UTV Can-Am Maverick e Quadriciclo 4x4. Roteiros Leste e Oeste com guias nativos credenciados.',
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
        lowPrice: '450.00',
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
      title="Passeio de Buggy, UTV e Quadriciclo em Jericoacoara | Privativo e Credenciado"
      description="Passeios privativos off-road em Jericoacoara: compare Buggy, UTV Can-Am Maverick e Quadriciclo 4x4. Roteiros Leste e Oeste com guias nativos credenciados."
      canonical="https://www.jericoacoarapremium.com/passeio-buggy-utv-jericoacoara"
      schema={buggySchema}
    >
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Passeio de Buggy e UTV nas dunas de Jericoacoara"
            src="/images/passeio-utv-maverick.webp"
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-[#0F1A1C]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full mb-6 font-semibold uppercase tracking-widest text-xs backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frota Privativa Off-Road • Roteiros Leste e Oeste</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Passeio de Buggy, UTV e Quadriciclo em Jericoacoara
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 font-light mb-8 max-w-3xl mx-auto"
          >
            A melhor experiência pelas dunas e praias de Jericoacoara. Compare os veículos off-road, escolha seu roteiro e viva a aventura com pilotos nativos credenciados.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => {
                const element = document.querySelector('#comparativo');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              Comparar Veículos e Preços
            </Button>
            <Button
              onClick={() => handleWhatsApp('Buggy, UTV e Quadriciclo')}
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

      {/* Destaques Técnicos */}
      <section className="py-12 bg-[#0F1A1C] text-white border-y border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Credenciamento</p>
                <p className="text-lg font-bold text-white mt-1">100% Oficial</p>
                <p className="text-xs text-gray-400 mt-0.5">Parque Nacional e ICMBio</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Sliders className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Roteiros</p>
                <p className="text-lg font-bold text-white mt-1">Leste ou Oeste</p>
                <p className="text-xs text-gray-400 mt-0.5">Você escolhe o destino</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Duração</p>
                <p className="text-lg font-bold text-white mt-1">5h a 6h</p>
                <p className="text-xs text-gray-400 mt-0.5">Tempo livre em cada parada</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Embarque</p>
                <p className="text-lg font-bold text-white mt-1">Porta a Porta</p>
                <p className="text-xs text-gray-400 mt-0.5">Na sua pousada em Jeri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo de Veículos */}
      <section id="comparativo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comparativo dos Veículos Off-Road de Jericoacoara</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Cada perfil de viajante tem seu veículo ideal. Confira os detalhes técnicos de cada opção:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-xl transition-all relative"
                >
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 text-[#D4AF37] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${v.badgeColor}`}>
                        {v.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{v.title}</h3>
                    <p className="text-xs text-gray-500 font-medium">{v.capacity}</p>
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-gray-900">{v.price}</span>
                      {' '}
                      <span className="text-xs text-gray-500">{v.priceUnit}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow text-sm text-gray-600">
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{v.desc}</p>
                    <ul className="space-y-2.5">
                      {v.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <Tag className="w-3 h-3" />
                      <span>5% OFF no PIX</span>
                    </div>
                    <Button 
                      onClick={() => handleWhatsApp(v.bookVehicle)}
                      className="w-full bg-[#0F1A1C] hover:bg-gray-800 text-white font-bold h-11 text-xs"
                    >
                      Reservar {v.bookVehicle}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roteiros Disponíveis */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Qual Roteiro Escolher? Leste ou Oeste?</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Você pode contratar seu veículo privativo para qualquer um dos dois principais roteiros:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Roteiro de Relaxamento
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Roteiro Lado Leste</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Ideal para quem busca curtir águas cristalinas e calmas, beach clubs com estrutura gastronômica completa e as clássicas redes dentro da água.
                </p>
                <div className="text-xs text-gray-500 font-semibold mb-6 space-y-1">
                  <p>• Árvore da Preguiça e Praia do Preá</p>
                  <p>• Buraco Azul de Caiçara ou Lagun Beach</p>
                  <p>• Lagoa do Paraíso e The Alchymist Beach Club</p>
                </div>
              </div>
              <Button 
                onClick={() => handleWhatsApp('Buggy Lado Leste')} 
                className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold h-12"
              >
                Reservar Leste Privativo
              </Button>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="inline-block bg-[#2C7A7B]/20 text-[#2C7A7B] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Roteiro de Aventura
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Roteiro Lado Oeste</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Perfeito para quem busca adrenalina off-road nas dunas móveis, descida de toboágua e tirolesa, balsa rústica no Rio Guriú e almoço à beira da lagoa.
                </p>
                <div className="text-xs text-gray-500 font-semibold mb-6 space-y-1">
                  <p>• Mangue Seco e Cavalos-Marinhos</p>
                  <p>• Travessia de balsa tradicional em Guriú</p>
                  <p>• Dunas de Tatajuba, Toboágua e Lagoa da Torta</p>
                </div>
              </div>
              <Button 
                onClick={() => handleWhatsApp('Buggy Lado Oeste')} 
                className="w-full bg-[#2C7A7B] hover:bg-teal-700 text-white font-bold h-12"
              >
                Reservar Oeste Privativo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Buggy & Off-road */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre Buggy e UTV</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
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

          <div className="mt-12 p-8 bg-[#0F1A1C] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <p className="font-bold text-xl text-[#D4AF37]">Quer montar um roteiro personalizado?</p>
              <p className="text-sm text-gray-300 mt-1">Converse com nossos especialistas e escolha o veículo ideal para sua viagem.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Roteiro Personalizado')}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-4 rounded-full shrink-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default PasseioBuggyUtvJeri;
