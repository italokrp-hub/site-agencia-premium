import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Plane, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Check, 
  Tag, 
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

const TransferAeroportoJeri = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  // Load actual data from catalog
  const cruzTransfer = transfersData.find(t => t.id === 'cruz');

  const handleWhatsApp = (assunto = "Transfer Aeroporto Jeri (JJD)") => {
    openWhatsApp(`Olá! Chego pelo Aeroporto de Cruz (JJD) e quero saber mais sobre o ${assunto}.`);
  };

  const handleBook = (item, modality) => {
    openWhatsApp({
      servico: item?.id || item?.title || 'cruz',
      modalidade: modality,
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Quanto tempo dura o transfer do Aeroporto Regional de Jericoacoara (JJD) até a Vila?",
      a: "O trajeto leva aproximadamente 40 a 50 minutos. São cerca de 33 km de percurso, que mescla trecho em rodovia pavimentada e trilha off-road pelas dunas do Parque Nacional até a porta da sua pousada."
    },
    {
      q: "Como o motorista me encontra no desembarque do aeroporto?",
      a: "Nosso motorista credenciado estará aguardando no saguão principal de desembarque de passageiros com uma placa personalizada com o seu nome. Você receberá o contato telefônico e os dados do motorista antes do pouso."
    },
    {
      q: "O que acontece se o meu voo da Azul ou da Gol atrasar?",
      a: "Monitoramos o status de todos os voos comerciais que aterrissam em Jericoacoara (JJD). Mesmo com atrasos da companhia aérea, nosso receptivo garante tolerância de espera sem cobrança de taxas adicionais."
    },
    {
      q: "Posso solicitar o transfer do aeroporto direto para a Praia do Preá?",
      a: "Sim! Realizamos o transfer tanto para a Vila de Jericoacoara quanto para hotéis e pousadas na Praia do Preá. Basta informar o destino da sua hospedagem ao reservar."
    },
    {
      q: "A Taxa de Turismo Sustentável (TTS) está inclusa no valor do transfer?",
      a: "Não. A Taxa de Turismo Sustentável é municipal e regulamentada pela Prefeitura de Jijoca de Jericoacoara (R$ 41,50 até 10 dias por visitante). A taxa deve ser gerada no site oficial da prefeitura pelo viajante antes do embarque ou quitada no posto físico."
    }
  ];

  const cruzSchema = [
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
          name: 'Transfer Aeroporto Jericoacoara (JJD)',
          item: 'https://www.jericoacoarapremium.com/transfer-aeroporto-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Transfer do Aeroporto de Jericoacoara (JJD) para a Vila',
      serviceType: 'Transfer Aeroportuário 4x4',
      description: 'Chegue com tranquilidade: transfer receptivo do Aeroporto Regional de Jericoacoara (Cruz/JJD) direto para sua pousada na Vila ou Preá com acompanhamento de voo.',
      provider: {
        '@type': 'TravelAgency',
        name: 'Jericoacoara Premium',
        url: 'https://www.jericoacoarapremium.com/',
        telephone: '+5588988463182',
        taxID: '51.790.615/0001-08',
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Aeroporto Regional de Jericoacoara (JJD - Cruz)' },
        { '@type': 'City', name: 'Jericoacoara' },
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '100.00',
        highPrice: '350.00',
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
      title="Transfer do Aeroporto de Jericoacoara (JJD) para a Vila | 4x4 Oficial"
      description="Chegue com tranquilidade: transfer receptivo do Aeroporto Regional de Jericoacoara (Cruz/JJD) direto para sua pousada na Vila ou Preá com acompanhamento de voo."
      canonical="https://www.jericoacoarapremium.com/transfer-aeroporto-jericoacoara"
      schema={cruzSchema}
    >
      {/* Hero */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-60"
            alt="Veículo 4x4 no Aeroporto Regional de Jericoacoara Cruz JJD"
            src="/images/transfer-hilux.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0F1A1C]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full mb-6 font-semibold uppercase tracking-widest text-xs backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aeroporto de Cruz (JJD) • Receptivo Oficial 4x4</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
          >
            Transfer do Aeroporto de Jericoacoara (JJD) para a Vila
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light"
          >
            {t('seoTransfers.cruzSubtitle', { defaultValue: 'O trajeto leva apenas ~45 minutos. Chegue no paraíso sem estresse com nossa frota 4x4 credenciada e monitoramento de voo.' })}
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
              onClick={() => handleWhatsApp('Transfer Aeroporto JJD')}
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
                <p className="text-lg font-bold text-white mt-1">40 a 50 min</p>
                <p className="text-xs text-gray-400 mt-0.5">Sem espera no privativo</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Compass className="w-8 h-8 text-[#2C7A7B] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Distância</p>
                <p className="text-lg font-bold text-white mt-1">~33 km</p>
                <p className="text-xs text-gray-400 mt-0.5">Asfalto + dunas e praia</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Plane className="w-8 h-8 text-[#D4AF37] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Embarque</p>
                <p className="text-lg font-bold text-white mt-1">Desembarque JJD</p>
                <p className="text-xs text-gray-400 mt-0.5">Recepção com placa</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle className="w-8 h-8 text-[#25D366] shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Desembarque</p>
                <p className="text-lg font-bold text-white mt-1">Vila ou Preá</p>
                <p className="text-xs text-gray-400 mt-0.5">Direto na sua pousada</p>
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
              Conforto absoluto do avião até sua pousada. Tudo combinado com antecedência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monitoramento de Voo */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Monitoramento Azul e Gol</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Acompanhamos horários de pouso de todos os voos no Aeroporto JJD.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tolerância de espera sem custo extra em caso de atraso confirmado da aeronave.</span>
                </li>
              </ul>
            </div>

            {/* Bagagem */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#2C7A7B] mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Limite de Bagagem</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Privativo:</strong> até 2 malas despachadas (até 23kg) + 1 de mão por passageiro.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Compartilhado:</strong> 1 mala despachada (até 23kg) + 1 mochila por assento.</span>
                </li>
              </ul>
            </div>

            {/* Crianças e Cadeirinha */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4AF37] mb-4">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Crianças & Bebês</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Crianças até 2 anos completos viajam gratuitamente no colo de um adulto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cadeirinha infantil ou assento elevatório gratuito no privativo sob aviso prévio.</span>
                </li>
              </ul>
            </div>

            {/* Capacidade dos Veículos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Veículos 4x4 Oficiais</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Toyota Hilux 4x4:</strong> até 4 passageiros confortavelmente com ar-condicionado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Toyota SW4 4x4:</strong> até 6 passageiros com espaço executivo.</span>
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
                  <span>Tributo municipal da Prefeitura de Jijoca (R$ 41,50 por visitante até 10 dias).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Não inclusa no valor do transfer; deve ser quitada no site oficial da prefeitura.</span>
                </li>
              </ul>
            </div>

            {/* Cancelamento sem Risco */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cancelamento Sem Risco</h3>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% de reembolso</strong> com até 7 dias de antecedência da viagem.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Flexibilidade para reagendamento em caso de alteração de malha aérea.</span>
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
            <h2 className="text-3xl font-bold mb-4">Escolha sua Categoria no Aeroporto JJD</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Valores transparentes por pessoa no compartilhado ou por veículo no privativo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Compartilhado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Transfer Compartilhado</h3>
                <p className="opacity-90 text-sm mt-1">Hilux ou SW4 Compartilhada</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(cruzTransfer?.options?.shared?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-80">por pessoa (somente ida)</span>
                </div>
                <p className="text-xs text-white/70 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-white">{formatPrice(cruzTransfer?.options?.shared?.roundTrip)}</span>
                  {' '}
                  por pessoa
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por pessoa (compartilhado):</strong> opção ideal e econômica para casais e solo.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Horários alinhados com o pouso dos voos regulares da Azul e Gol no JJD.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Veículo 4x4 credenciado cruzando o Parque Nacional direto para a vila.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Desembarque na porta da sua pousada em Jericoacoara.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(cruzTransfer, 'shared')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-base font-bold shadow-sm">
                  Reservar Compartilhado
                </Button>
              </div>
            </div>

            {/* Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#2C7A7B] flex flex-col h-full hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm">
                Exclusivo
              </div>
              <div className="bg-[#2C7A7B] text-white p-6 text-center pt-8">
                <h3 className="text-2xl font-bold">Privativo VIP</h3>
                <p className="opacity-90 text-sm mt-1">Hilux (até 4 pax) ou SW4 (até 6 pax)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(cruzTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  {' '}
                  <span className="text-sm opacity-90">por veículo (somente ida)</span>
                </div>
                <p className="text-xs text-white/80 mt-1.5">
                  Ida e Volta:
                  {' '}
                  <span className="font-semibold text-white">{formatPrice(cruzTransfer?.options?.private?.tiers?.[0]?.roundTrip)}</span>
                  {' '}
                  por veículo
                </p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3 mb-6 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span><strong>Por veículo privativo:</strong> exclusividade total para você e sua família.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Partida imediata assim que suas malas forem retiradas na esteira.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Recepção com placa de identificação com seu nome no desembarque.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-emerald-500 w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>Trajeto direto para a pousada em Jeri ou Preá sem tempo de espera.</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto flex flex-col items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Economize 5% pagando via PIX</span>
                </div>
                <Button onClick={() => handleBook(cruzTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-base font-bold text-white shadow-sm">
                  Reservar Privativo VIP
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={() => handleWhatsApp('Transfer Aeroporto JJD')} variant="ghost" className="text-gray-600 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Tem dúvidas sobre os horários do seu voo? Fale com a equipe
            </Button>
          </div>
        </div>
      </section>

      {/* Mini-FAQ Específico do Aeroporto JJD */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes sobre o Transfer no Aeroporto JJD</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 text-sm sm:text-base">
              Saiba tudo sobre o desembarque em Cruz e a chegada à Vila de Jericoacoara.
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
              <p className="font-bold text-lg text-[#D4AF37]">Já comprou sua passagem aérea para Jericoacoara?</p>
              <p className="text-sm text-gray-300 mt-1">Envie o código do seu voo no WhatsApp para garantir o melhor transfer.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Transfer Aeroporto JJD')}
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-6 py-3 rounded-full shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Agendar Receptivo JJD
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default TransferAeroportoJeri;
