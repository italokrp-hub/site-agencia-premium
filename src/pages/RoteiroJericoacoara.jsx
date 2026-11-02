import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  Sun, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  Car, 
  Plane, 
  Waves, 
  Users, 
  ChevronDown, 
  Baby, 
  Heart, 
  CheckCircle, 
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';

const RoteiroJericoacoara = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const handleWhatsApp = (assunto = "Roteiro Personalizado Jericoacoara") => {
    openWhatsApp(`Olá! Li o Guia de Roteiro de Jericoacoara e gostaria de ajuda para planejar minha viagem (${assunto}).`);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Quantos dias são necessários para conhecer Jericoacoara?",
      a: "O tempo mínimo recomendado é de 3 dias inteiros para conhecer os dois passeios principais (Lado Leste e Lado Oeste) e curtir a vila. No entanto, o roteiro ideal é de 4 a 5 dias: assim você explora tudo com calma, faz passeios privativos de Buggy ou UTV até o Preá e Barrinha, e aproveita a gastronomia e o pôr do sol sem pressa."
    },
    {
      q: "Qual a melhor época do ano para visitar Jericoacoara?",
      a: "Jericoacoara tem sol praticamente o ano todo. Para encontrar as lagoas no nível máximo e águas cristalinas, o melhor período vai de junho a novembro. Entre julho e dezembro ocorrem os ventos constantes alísios, época perfeita para os praticantes de kitesurf e wingfoil. A estação das chuvas ocorre entre fevereiro e maio, com pancadas rápidas que logo abrem espaço para o sol."
    },
    {
      q: "Como funciona o pagamento da Taxa de Turismo Sustentável (TTS) e quem é isento?",
      a: "A taxa é um tributo municipal instituído pela Prefeitura de Jijoca de Jericoacoara no valor de R$ 41,50 para até 10 dias de estadia por pessoa (com acréscimo diário para períodos maiores). Têm direito à isenção por lei municipal: crianças até 12 anos, idosos com mais de 60 anos, Pessoas com Deficiência (PCD mediante laudo), moradores residentes e familiares diretos, trabalhadores com vínculo comprovado e proprietários de imóveis na vila. A comprovação com documento oficial ou laudo é obrigatória e a emissão deve ser feita previamente no portal da Prefeitura de Jijoca ou nos postos de controle."
    },
    {
      q: "É melhor fazer o Lado Leste ou o Lado Oeste primeiro?",
      a: "Se você busca relaxamento imediato e fotos clássicas nas redes dentro d'água, comece pelo Lado Leste (Lagoa do Paraíso e Buraco Azul). Se você prefere começar com adrenalina nas dunas e toboágua, opte pelo Lado Oeste. Em viagens de 3 ou mais dias, o recomendado é fazer ambos, pois os cenários são completamente diferentes e complementares."
    },
    {
      q: "Precisa alugar carro comum para ir a Jericoacoara?",
      a: "Não é recomendado de forma alguma. Carros comuns de passeio (tração 4x2) atolam na areia fofa das dunas e não têm autorização para circular no Parque Nacional. A maneira mais segura, econômica e confortável é contratar um transfer 4x4 credenciado de Fortaleza ou do Aeroporto de Cruz (JJD) que deixa você na porta da pousada."
    }
  ];

  const roteiroSchema = [
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
          name: 'Guia de Roteiro em Jericoacoara',
          item: 'https://www.jericoacoarapremium.com/roteiro-jericoacoara',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Roteiro Jericoacoara 3, 5 e 7 Dias: O Que Fazer e Como Chegar',
      description: 'Planeje sua viagem para Jericoacoara: roteiro completo de 3 e 5 dias, comparativo Lado Leste vs Lado Oeste, como chegar saindo de Fortaleza ou Aeroporto JJD e Taxa de Turismo.',
      author: {
        '@type': 'Organization',
        name: 'Jericoacoara Premium',
        url: 'https://www.jericoacoarapremium.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Jericoacoara Premium',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.jericoacoarapremium.com/images/logo.webp',
        },
      },
      datePublished: '2026-10-31',
      dateModified: '2026-10-31',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.jericoacoarapremium.com/roteiro-jericoacoara',
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
      title="Roteiro Jericoacoara 3, 5 e 7 Dias: O Que Fazer e Como Chegar | Guia Oficial"
      description="Planeje sua viagem para Jericoacoara: roteiro completo de 3 e 5 dias, comparativo Lado Leste vs Lado Oeste, como chegar saindo de Fortaleza ou Aeroporto JJD e Taxa de Turismo."
      canonical="https://www.jericoacoarapremium.com/roteiro-jericoacoara"
      schema={roteiroSchema}
    >
      {/* Hero do Guia */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-dunas.webp"
            alt="Pôr do Sol nas Dunas de Jericoacoara — Guia Oficial de Viagem"
            width="1920"
            height="1080"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
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
            <span>Guia Oficial de Planejamento • Atualizado 2026</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Roteiro Jericoacoara: Guia Oficial de 3, 5 e 7 Dias
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl text-white/90 font-light mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Tudo o que você precisa saber para planejar sua viagem: como chegar com segurança, roteiro dia a dia passo a passo, comparativo dos passeios e dicas locais essenciais.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => {
                const element = document.querySelector('#roteiro-3dias');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              Ver Roteiros Dia a Dia
            </Button>
            <Button
              onClick={() => handleWhatsApp('Planejar Viagem')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-md"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-[#25D366]" />
              Falar com Concierge VIP
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Índice Rápido do Artigo */}
      <section className="py-8 bg-[#0F1A1C] text-white border-y border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold text-center md:text-left mb-3">
            Navegue pelos Tópicos do Guia
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-semibold">
            <a href="#como-chegar" className="bg-white/10 hover:bg-[#D4AF37] hover:text-gray-900 px-3.5 py-2 rounded-full transition-colors border border-white/10">
              1. Como Chegar
            </a>
            <a href="#roteiro-3dias" className="bg-white/10 hover:bg-[#D4AF37] hover:text-gray-900 px-3.5 py-2 rounded-full transition-colors border border-white/10">
              2. Roteiro 3 Dias
            </a>
            <a href="#roteiro-5dias" className="bg-white/10 hover:bg-[#D4AF37] hover:text-gray-900 px-3.5 py-2 rounded-full transition-colors border border-white/10">
              3. Roteiro 5 Dias
            </a>
            <a href="#comparativo-leste-oeste" className="bg-white/10 hover:bg-[#D4AF37] hover:text-gray-900 px-3.5 py-2 rounded-full transition-colors border border-white/10">
              4. Leste vs. Oeste
            </a>
            <a href="#guia-pratico" className="bg-white/10 hover:bg-[#D4AF37] hover:text-gray-900 px-3.5 py-2 rounded-full transition-colors border border-white/10">
              5. Guia Prático & TTS
            </a>
            <a href="#duvidas" className="bg-white/10 hover:bg-[#D4AF37] hover:text-gray-900 px-3.5 py-2 rounded-full transition-colors border border-white/10">
              6. Perguntas Frequentes
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: Como Chegar a Jericoacoara */}
      <section id="como-chegar" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2C7A7B] font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Etapa 1: Logística de Transporte
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Como Chegar a Jericoacoara: Qual a Melhor Rota?
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              A Vila de Jericoacoara fica dentro de um Parque Nacional cercado por dunas. Não há estradas asfaltadas dentro da vila: você precisará de um veículo 4x4 credenciado para a travessia final.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Opção 1: Fortaleza */}
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#2C7A7B] flex items-center justify-center mb-4">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Via Fortaleza (FOR)</h3>
                <p className="text-xs text-gray-500 font-semibold mb-4">Maior oferta de voos nacionais</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Você pousa no Aeroporto Pinto Martins em Fortaleza e segue de transfer até Jeri (~300 km).
                </p>
                <ul className="text-xs text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span><strong>4h a 4h30</strong> (4x4 privativo) / ~5h (ônibus)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Busca no aeroporto ou hotel na orla</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Desembarque na porta da pousada em Jeri</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/transfer-fortaleza-jericoacoara"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#2C7A7B] hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                <span>Ver Transfers de Fortaleza</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Opção 2: Aeroporto JJD Cruz */}
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-gray-900 font-bold px-3 py-1 rounded-bl-lg text-[10px] uppercase tracking-wider">
                Mais Rápido
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D4AF37] flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Aeroporto Regional (JJD)</h3>
                <p className="text-xs text-gray-500 font-semibold mb-4">Voos diretos Azul e Gol (Cruz)</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Pouse a apenas 33 km de Jericoacoara e chegue à praia no mesmo dia sem cansaço de estrada.
                </p>
                <ul className="text-xs text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span><strong>40 a 50 minutos</strong> de trajeto 4x4</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Recepção com placa com seu nome</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Monitoramento de atrasos de voo incluso</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/transfer-aeroporto-jericoacoara"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold py-3 rounded-xl text-xs transition-colors"
              >
                <span>Ver Transfers do Aeroporto JJD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Opção 3: Jijoca */}
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Via Jijoca de Carro</h3>
                <p className="text-xs text-gray-500 font-semibold mb-4">Para quem viaja em carro próprio</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Estacione seu veículo em estacionamentos seguros em Jijoca e faça a travessia das dunas em 4x4.
                </p>
                <ul className="text-xs text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span><strong>35 a 45 minutos</strong> de dunas e areia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Jardineiras e Hilux 4x4 credenciadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Indicação de estacionamentos 24h</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/transfer-jijoca-jericoacoara"
                className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                <span>Ver Travessia de Jijoca</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: Roteiro de 3 Dias (Essencial) */}
      <section id="roteiro-3dias" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Roteiro Essencial
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Roteiro de 3 Dias em Jericoacoara (O Clássico Imperdível)
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Ideal para feriados prolongados ou escapadas de fim de semana. Conheça as atrações mais famosas de Jeri sem perder tempo.
            </p>
          </div>

          <div className="space-y-8">
            {/* Dia 1 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1A1C] text-[#D4AF37] font-bold text-2xl flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                01
              </div>
              <div className="flex-1">
                <div className="inline-block bg-teal-50 text-[#2C7A7B] text-xs font-bold px-3 py-0.5 rounded-full mb-2">
                  Primeiro Dia: Boas-Vindas ao Paraíso
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Chegada na Pousada + Pôr do Sol na Duna + Vida Noturna da Vila
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Após desembarcar na porta da sua pousada com o transfer credenciado, tire os sapatos e sinta a energia das ruas de areia. Almoce em um dos bistrôs da Rua Principal e, por volta das 17h, suba a clássica <strong>Duna do Pôr do Sol</strong> para contemplar o sol mergulhando no mar — um dos poucos pontos do Brasil onde o sol se põe diretamente no oceano.
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-1">
                  <p>• <strong>Dica da noite:</strong> Visite o Beco do Forró e o Beco do Doce, prove caipirinhas de frutas tropicais nas barraquinhas da praia e jante peixe fresco grelhado.</p>
                </div>
              </div>
            </div>

            {/* Dia 2 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1A1C] text-[#D4AF37] font-bold text-2xl flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                02
              </div>
              <div className="flex-1">
                <div className="inline-block bg-teal-50 text-[#2C7A7B] text-xs font-bold px-3 py-0.5 rounded-full mb-2">
                  Segundo Dia: Lagoas Cristalinas
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Passeio Lado Leste (Lagoa do Paraíso, Buraco Azul & Árvore da Preguiça)
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Saída por volta das 09h da pousada em Buggy privativo ou Jardineira. O circuito visita a <strong>Árvore da Preguiça</strong> (mangue esculpido pelos ventos), passa pela Praia do Preá e segue para as águas azul-turquesa do <strong>Buraco Azul</strong>. O ápice do dia é a tarde na <strong>Lagoa do Paraíso</strong>, deitando nas famosas redes armadas dentro da água com apoio dos beach clubs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                  <span className="text-xs text-teal-900 font-semibold">
                    Quer ver todas as paradas e opções de veículos do Lado Leste?
                  </span>
                  <Link
                    to="/passeio-lado-leste-jericoacoara"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C7A7B] hover:text-teal-900 bg-white px-4 py-2 rounded-full border border-teal-200 shrink-0 transition-colors"
                  >
                    <span>Ver Passeio Lado Leste</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Dia 3 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1A1C] text-[#D4AF37] font-bold text-2xl flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                03
              </div>
              <div className="flex-1">
                <div className="inline-block bg-teal-50 text-[#2C7A7B] text-xs font-bold px-3 py-0.5 rounded-full mb-2">
                  Terceiro Dia: Aventura & Dunas
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Passeio Lado Oeste (Tatajuba, Toboágua, Mangue Seco & Balsa)
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Dia de adrenalina off-road pelas dunas móveis. O trajeto percorre o visual de raízes do <strong>Mangue Seco</strong>, travessia de balsa tradicional no Rio Guriú, observação ecológica de cavalos-marinhos e muita diversão no <strong>toboágua e tirolesa da Duna do Funil</strong>. O almoço ocorre na Lagoa da Torta, escolhendo seu peixe ou lagosta direto na bandeja.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                  <span className="text-xs text-teal-900 font-semibold">
                    Conheça a rota completa com travessia de balsa inclusa:
                  </span>
                  <Link
                    to="/passeio-lado-oeste-jericoacoara"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2C7A7B] hover:text-teal-900 bg-white px-4 py-2 rounded-full border border-teal-200 shrink-0 transition-colors"
                  >
                    <span>Ver Passeio Lado Oeste</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: Roteiro de 5 Dias (Experiência Completa VIP) */}
      <section id="roteiro-5dias" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2C7A7B] font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Experiência Completa
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Roteiro de 5 Dias em Jericoacoara (A Viagem Perfeita)
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Além do essencial dos 3 primeiros dias, reserve os Dias 4 e 5 para pilotar nas dunas, visitar praias vizinhas e caminhar pelos monumentos naturais do Parque Nacional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dia 4 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-gray-900 text-[#D4AF37] font-bold text-xl flex items-center justify-center border border-[#D4AF37]/30">
                    04
                  </span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase">
                    Off-Road Exclusivo
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Dia 4: Expedição de UTV ou Buggy até o Preá e Barrinha
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Alugue um potente <strong>UTV Can-Am Maverick</strong> ou um Buggy privativo com guia dedicado. Percorra as dunas selvagens da Barrinha (onde as dunas encontram o mar e formam lagoas cristalinas na maré cheia) e encerre o dia no polo gastronômico de frutos do mar da Praia do Preá.
                </p>
              </div>
              <Link
                to="/passeio-buggy-utv-jericoacoara"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#0F1A1C] hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                <span>Comparar Buggy, UTV e Quadriciclo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Dia 5 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-gray-900 text-[#D4AF37] font-bold text-xl flex items-center justify-center border border-[#D4AF37]/30">
                    05
                  </span>
                  <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full uppercase">
                    Ecoturismo & Despedida
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Dia 5: Trilha da Pedra Furada + Praia Malhada + Retorno
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Acorde cedo na maré baixa para fazer a caminhada pelo Caminho do Serrote ou beira-mar até a icônica <strong>Pedra Furada</strong>. Na volta, tome um banho nas piscinas naturais da Praia Malhada, faça as últimas compras de artesanato e embarque no transfer privativo no horário alinhado com o seu voo.
                </p>
              </div>
              <Button
                onClick={() => handleWhatsApp('Roteiro 5 Dias')}
                className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold py-3 rounded-xl text-xs"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Montar Pacote de 5 Dias
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: Comparativo Leste vs. Oeste */}
      <section id="comparativo-leste-oeste" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2C7A7B] font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Decisão Inteligente
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Lado Leste ou Lado Oeste: Qual Passeio Escolher?
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Se você tem pouco tempo e precisa priorizar um dos lados, confira o comparativo objetivo:
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <th className="p-5">Critério</th>
                  <th className="p-5 text-[#2C7A7B]">Passeio Lado Leste</th>
                  <th className="p-5 text-[#D4AF37]">Passeio Lado Oeste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="p-5 font-bold text-gray-900">Perfil Principal</td>
                  <td className="p-5">Relaxamento, águas calmas e fotos icônicas</td>
                  <td className="p-5">Aventura, dunas radicais e ecoturismo</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-gray-900">Principais Atrações</td>
                  <td className="p-5">Lagoa do Paraíso, Buraco Azul, Praia do Preá e Árvore da Preguiça</td>
                  <td className="p-5">Dunas de Tatajuba, Toboágua, Tirolesa, Mangue Seco e Balsa de Guriú</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-gray-900">Estilo das Águas</td>
                  <td className="p-5">Lagoas cristalinas mornas com redes deitadas na água</td>
                  <td className="p-5">Lagoa de água doce cercada de dunas gigantes</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-gray-900">Almoço</td>
                  <td className="p-5">Beach clubs sofisticados (The Alchymist)</td>
                  <td className="p-5">Barracas rústicas com o "cardápio ao vivo" na bandeja</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-gray-900">Indicação Ideal</td>
                  <td className="p-5">Famílias com crianças, casais e amantes de fotos</td>
                  <td className="p-5">Grupos de amigos, jovens e fãs de adrenalina</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-gray-900">Duração Média</td>
                  <td className="p-5">6h a 7h (saída às 09h)</td>
                  <td className="p-5">~6h (saída às 09h)</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-gray-900">Veículos Disponíveis</td>
                  <td className="p-5">Buggy, Quadriciclo, Jardineira e SW4 VIP</td>
                  <td className="p-5">Buggy, Quadriciclo, Jardineira e SW4 VIP</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Ainda em dúvida? Nossa recomendação é fazer <strong>ambos os passeios</strong> para ter a experiência completa de Jericoacoara.
            </p>
            <Button
              onClick={() => handleWhatsApp('Dúvida Leste vs Oeste')}
              variant="outline"
              className="border-gray-800 text-gray-800 font-bold px-6 py-3 rounded-full"
            >
              Falar com um Consultor Local no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: Guia Prático do Turista */}
      <section id="guia-pratico" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Dicas de Quem Vive em Jeri
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
              Guia Prático do Turista: Taxa TTS, Bagagem e Clima
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Informações indispensáveis para você não passar perrengue e curtir o paraíso com tranquilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* TTS */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Taxa de Turismo (TTS)</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Tributo de <strong>R$ 41,50</strong> cobrado pela Prefeitura de Jijoca por até 10 dias por visitante.
              </p>
              <ul className="text-xs text-gray-600 space-y-2 mt-auto">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Isenção: até 12 anos, 60+ anos, PCD (com laudo), moradores e trabalhadores locais.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Emissão online no portal oficial da Prefeitura de Jijoca com documento com foto.</span>
                </li>
              </ul>
            </div>

            {/* O que levar */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#2C7A7B] flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">O Que Levar na Mala</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Em Jeri não há asfalto: esqueça sapatos de salto e calçados duros.
              </p>
              <ul className="text-xs text-gray-600 space-y-2 mt-auto">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Chinelos, sandálias rasteiras e roupas leves.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Protetor solar, óculos escuros e chapéu.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dinheiro em espécie (sinal de maquininha oscila).</span>
                </li>
              </ul>
            </div>

            {/* Crianças e Casais */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Famílias & Lua de Mel</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Como curtir com máximo conforto e exclusividade:
              </p>
              <ul className="text-xs text-gray-600 space-y-2 mt-auto">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Com bebês: prefira a Toyota SW4 4x4 climatizada.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Lua de mel: reserve Buggy privativo com guia fotógrafo.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Cadeirinha infantil gratuita no privativo sob aviso.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: Perguntas Frequentes */}
      <section id="duvidas" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes sobre o Roteiro em Jeri</h2>
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

          {/* Card Final de Conversão */}
          <div className="mt-12 p-8 bg-[#0F1A1C] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <p className="font-bold text-xl text-[#D4AF37]">Pronto para viver Jericoacoara sem estresse?</p>
              <p className="text-sm text-gray-300 mt-1">Converse com nossos consultores nativos e monte seu pacote completo com transfer e passeios.</p>
            </div>
            <Button
              onClick={() => handleWhatsApp('Pacote Completo')}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-4 rounded-full shrink-0"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com Concierge VIP
            </Button>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default RoteiroJericoacoara;
