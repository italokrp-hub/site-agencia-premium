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
  Camera,
  Sun,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import { toursData, formatPrice } from '@/data/catalog';

const PasseioLadoLesteJeri = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Load catalog data
  const tourLesteShared = toursData.find(t => t.id === 'tour-leste-shared');
  const tourLestePrivate = toursData.find(t => t.id === 'tour-leste-private');
  const buggyOpt = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Buggy');
  const quadriOpt = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Quadriciclo');
  const sw4Opt = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'SW4');

  const handleWhatsApp = (veiculo = "Lado Leste") => {
    openWhatsApp(`Olá! Gostaria de informações e reserva para o Passeio Lado Leste em Jericoacoara (${veiculo}).`);
  };

  const handleBook = (item, modality, vehicleType) => {
    openWhatsApp({
      servico: item?.id || 'tour-leste',
      modalidade: modality,
      veiculo: vehicleType,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Qual a duração média do Passeio Lado Leste e qual o horário de saída?",
      a: "O passeio dura entre 6h e 7h. O embarque na sua pousada em Jericoacoara ocorre por volta das 09:00 da manhã, com retorno previsto para a vila entre 15:30 e 16:00, aproveitando o dia todo com calma."
    },
    {
      q: "Os ingressos do Buraco Azul e dos Beach Clubs estão inclusos?",
      a: "Não. As taxas de entrada e Day-Use dos clubes privados (como Buraco Azul cerca de R$ 30,00 ou Alchymist Beach Club cerca de R$ 40,00) são pagas diretamente nas bilheterias de cada estabelecimento por quem desejar ingressar. O acesso à praia e áreas públicas da Lagoa do Paraíso é livre."
    },
    {
      q: "Qual a diferença entre fazer de Buggy, Quadriciclo ou Jardineira?",
      a: "No Buggy (privativo para até 4 pessoas), você tem um motorista-guia credenciado exclusivo com flexibilidade total de tempo. No Quadriciclo (para até 2 pessoas), você mesmo pilota o veículo acompanhando o guia à frente. Já a Jardineira (compartilhada) é a opção coletiva mais econômica, perfeita para quem busca ótimo custo-benefício."
    },
    {
      q: "Crianças podem fazer o Passeio Lado Leste?",
      a: "Sim! O Lado Leste é o passeio mais recomendado para famílias e crianças, pois as águas das lagoas são calmas, mornas, doces e sem ondas. Na Jardineira, crianças de colo até 2 anos completos não pagam. Em Buggys e SW4, crianças ocupam assento individual por normas de segurança."
    },
    {
      q: "O que devo levar no passeio?",
      a: "Recomendamos levar roupa de banho, toalha, protetor solar, óculos de sol, chapéu ou boné, chinelos ou calçado leve de praia, e dinheiro ou cartão para almoço e ingressos das atrações privadas."
    }
  ];

  const stops = [
    {
      num: '01',
      title: 'Árvore da Preguiça',
      tag: 'Cartão Postal',
      desc: 'Localizada na orla leste do Parque Nacional, essa árvore da espécie mangue-de-botão cresceu rasteira e deitada na areia, esculpida pelos fortes ventos alísios. Parada imperdível para fotos icônicas.'
    },
    {
      num: '02',
      title: 'Praia do Preá',
      tag: 'Vento & Natureza',
      desc: 'Vila costeira vizinha a Jeri com praias extensas, barcos de pesca artesanal e fama mundial como uma das melhores capitais do planeta para a prática de kitesurf e wingfoil.'
    },
    {
      num: '03',
      title: 'Buraco Azul ou Lagun Beach',
      tag: 'Águas Turquesa',
      desc: 'Parada nos famosos oásis artificiais de água doce com coloração azul-turquesa cristalina, dotados de trampolins, redes flutuantes, restaurante e estrutura de lazer para relaxamento total.'
    },
    {
      num: '04',
      title: 'Lagoa Azul / Lagoa do Amâncio',
      tag: 'Preservação Natural',
      desc: 'Banhos refrescantes em águas transparentes e calmas cercadas por dunas preservadas. Um recanto de tranquilidade no coração do Parque Nacional.'
    },
    {
      num: '05',
      title: 'Lagoa do Paraíso & Beach Clubs',
      tag: 'Redes na Água',
      desc: 'O ponto alto do roteiro: águas mornas em degradê de azul e verde com as clássicas redes dentro da água. Parada principal para almoço com frutos do mar frescos e relaxamento.'
    }
  ];

  const lesteSchema = [
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
          name: 'Passeio Lado Leste em Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/passeio-lado-leste-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Passeio Lado Leste em Jericoacoara: Lagoa do Paraíso e Buraco Azul',
      serviceType: 'Passeio Turístico Off-Road 4x4',
      description: 'Roteiro completo pelo Lado Leste de Jeri: Lagoa do Paraíso, Buraco Azul, Árvore da Preguiça e Praia do Preá. Opções em Buggy, Quadriciclo e Jardineira com guia credenciado.',
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
        lowPrice: '75.00',
        highPrice: '600.00',
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
      title="Passeio Lado Leste em Jericoacoara: Lagoa do Paraíso e Buraco Azul | Jericoacoara Premium"
      description="Roteiro completo pelo Lado Leste de Jeri: Lagoa do Paraíso, Buraco Azul, Árvore da Preguiça e Praia do Preá. Opções em Buggy, Quadriciclo e Jardineira com guia credenciado."
      canonical="https://www.jericoacoarapremium.com/passeio-lado-leste-jericoacoara"
      schema={lesteSchema}
    >
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Passeio Lado Leste Lagoa do Paraíso em Jericoacoara"
            src="/images/tours/passeio-leste.webp"
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
            <span>Roteiro Mais Famoso de Jeri • Lagoas Cristalinas</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Passeio Lado Leste em Jericoacoara: Lagoa do Paraíso e Buraco Azul
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 font-light mb-8 max-w-3xl mx-auto"
          >
            Relaxe nas redes dentro da água da Lagoa do Paraíso, surpreenda-se com o Buraco Azul e registre fotos inesquecíveis na Árvore da Preguiça com guias nativos credenciados.
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
              onClick={() => handleWhatsApp('Lado Leste')}
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
                <p className="text-lg font-bold text-white mt-1">6h a 7h</p>
                <p className="text-xs text-gray-400 mt-0.5">Saída ~09h | Volta ~15h30</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Embarque</p>
                <p className="text-lg font-bold text-white mt-1">Porta a Porta</p>
                <p className="text-xs text-gray-400 mt-0.5">Na sua pousada em Jeri</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Sun className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Indicação</p>
                <p className="text-lg font-bold text-white mt-1">Todas as Idades</p>
                <p className="text-xs text-gray-400 mt-0.5">Perfeito para famílias e casais</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Segurança</p>
                <p className="text-lg font-bold text-white mt-1">100% Credenciado</p>
                <p className="text-xs text-gray-400 mt-0.5">Guia nativo + seguro APP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roteiro Parada a Parada */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Roteiro Parada a Parada no Lado Leste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Conheça as atrações clássicas que tornam o Lado Leste o passeio mais procurado de Jericoacoara:
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
            <h2 className="text-3xl font-bold mb-4">Escolha o Seu Veículo para o Lado Leste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Preços padronizados com desconto de 5% no PIX e parcelamento no cartão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jardineira Compartilhada */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 text-gray-800 p-6 text-center border-b border-gray-200">
                <div className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase">
                  Melhor Custo-Benefício
                </div>
                <h3 className="text-xl font-bold">Jardineira 4x4</h3>
                <p className="text-xs text-gray-500 mt-1">Compartilhado Coletivo</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(tourLesteShared?.options?.shared?.price)}</span>
                  {' '}
                  <span className="text-sm opacity-80 text-gray-500">por pessoa</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por pessoa:</strong> ideal para quem viaja sozinho ou casais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Embarque e retorno na pousada em Jeri.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Veículo tradicional aberto com ventilação natural.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourLesteShared, 'shared', 'Jardineira')} variant="outline" className="w-full border-gray-800 font-bold h-11">
                  Reservar Jardineira
                </Button>
              </div>
            </div>

            {/* Buggy Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#D4AF37] flex flex-col h-full hover:shadow-xl transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-gray-900 font-bold px-3 py-1 rounded-bl-lg text-xs z-10">
                O Mais Vendido
              </div>
              <div className="bg-gray-900 text-white p-6 text-center">
                <h3 className="text-xl font-bold">Buggy Privativo</h3>
                <p className="text-xs text-white/70 mt-1">Até 4 passageiros</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(buggyOpt?.price || 450)}</span>
                  {' '}
                  <span className="text-sm opacity-80 text-white/80">por veículo</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por veículo privativo:</strong> exclusivo para o seu grupo (até 4 pax).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Tempo livre para fotos e paradas personalizadas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Piloto nativo credenciado experiente em dunas.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourLestePrivate, 'private', 'Buggy')} className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold h-11">
                  Reservar Buggy
                </Button>
              </div>
            </div>

            {/* Quadriciclo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white p-6 text-center">
                <div className="inline-block bg-teal-500/20 text-teal-300 text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase">
                  Você Pilota
                </div>
                <h3 className="text-xl font-bold">Quadriciclo 4x4</h3>
                <p className="text-xs text-white/70 mt-1">Até 2 pessoas (Piloto + Garupa)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(quadriOpt?.price || 450)}</span>
                  {' '}
                  <span className="text-sm opacity-80 text-white/80">por veículo</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por veículo privativo:</strong> pilote você mesmo seguindo o guia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Muita adrenalina e fotos fantásticas pelas trilhas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Exige CNH categoria B para o condutor.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourLestePrivate, 'private', 'Quadriciclo')} variant="outline" className="w-full border-gray-800 font-bold h-11">
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
                  <span className="text-3xl font-bold text-white">{formatPrice(sw4Opt?.price || 600)}</span>
                  {' '}
                  <span className="text-sm opacity-90">por veículo</span>
                </div>
              </div>
              <div className="p-6 flex-grow text-sm text-gray-600">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Por veículo privativo:</strong> ar-condicionado 100% do trajeto.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Sem poeira ou vento excessivo: perfeito para idosos e bebês.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Espaço para até 6 pessoas da mesma família.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />
                  <span>5% OFF no PIX</span>
                </div>
                <Button onClick={() => handleBook(tourLestePrivate, 'private', 'SW4')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 font-bold h-11 text-white">
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
            <h2 className="text-3xl font-bold mb-4">O Que Está Incluso no Passeio Lado Leste</h2>
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
                  <span>Veículo 4x4 selecionado credenciado pelo ICMBio e Prefeitura.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Guia e motorista nativo cadastrado no CADASTUR.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Embarque e retorno direto na sua pousada na Vila de Jeri.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Seguro de passageiros (APP) com cobertura durante todo o circuito.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Waves className="w-6 h-6 text-[#D4AF37]" /> Não Incluso (Opcionais)
              </h3>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Ingresso do Buraco Azul / Lagun Beach (em torno de R$ 30,00 por pessoa).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Day-Use do The Alchymist Beach Club (opcional para quem desejar entrar no clube).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 font-bold shrink-0">—</span>
                  <span>Almoço, petiscos e bebidas nos restaurantes locais.</span>
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

      {/* Mini-FAQ Lado Leste */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre o Passeio Lado Leste</h2>
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
              <p className="font-bold text-xl text-[#D4AF37]">Quer reservar seu Passeio Lado Leste?</p>
              <p className="text-sm text-gray-300 mt-1">Fale agora com nosso time no WhatsApp e garanta seu veículo preferido.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Lado Leste')}
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

export default PasseioLadoLesteJeri;
