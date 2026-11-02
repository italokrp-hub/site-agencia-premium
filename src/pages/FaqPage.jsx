import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Car,
  Compass,
  ChevronDown,
  Search,
  MessageCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Users,
  Shield,
  FileText,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEOHead';
import { openWhatsApp, WA_MESSAGES } from '@/utils/whatsapp';
import { CANCELLATION_POLICY } from '@/data/catalog';

// As 4 Categorias Oficiais solicitadas na Auditoria SEO
export const FAQ_CATEGORIES = [
  { id: 'todas', label: 'Todas as Dúvidas', icon: HelpCircle },
  { id: 'transfers-voos', label: 'Transfers e Atrasos de Voo', icon: Car },
  { id: 'bagagem-criancas', label: 'Bagagem e Crianças', icon: Users },
  { id: 'passeios-roteiros', label: 'Passeios e Roteiros', icon: Compass },
  { id: 'pagamentos-cancelamento', label: 'Pagamentos e Cancelamento', icon: CalendarCheck, badge: 'Regra de 7 Dias' },
];

export const ALL_FAQ_DATA = [
  // 1. TRANSFERS E ATRASOS DE VOO
  {
    id: 'atraso-voo',
    category: 'transfers-voos',
    question: 'O que acontece se meu voo atrasar na chegada ao aeroporto (FOR ou JJD)?',
    answerText: 'Monitoramos todos os voos em tempo real com base no número informado na sua reserva. Tanto no Aeroporto Internacional de Fortaleza (FOR) quanto no Aeroporto Regional de Jericoacoara (JJD - Cruz), oferecemos tolerância gratuita de espera após o pouso sem qualquer taxa extra. Seu motorista credenciado estará aguardando no desembarque com placa de identificação.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          Monitoramos todos os voos em tempo real com base no número informado na sua reserva. Tanto no Aeroporto Internacional de Fortaleza (FOR) quanto no Aeroporto Regional de Jericoacoara (JJD - Cruz), oferecemos <strong>tolerância gratuita de espera após o pouso</strong> sem qualquer cobrança de taxa extra.
        </p>
        <p>
          Seu motorista credenciado aguarda com placa nominal no desembarque. Conheça nossos serviços de{' '}
          <Link to="/transfer-aeroporto-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Transfer do Aeroporto de Jericoacoara (JJD)
          </Link>{' '}
          e{' '}
          <Link to="/transfer-fortaleza-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Transfer Fortaleza para Jericoacoara
          </Link>.
        </p>
      </div>
    ),
    highlight: true,
  },
  {
    id: 'diferenca-privativo-compartilhado',
    category: 'transfers-voos',
    question: 'Qual a diferença entre Transfer Privativo 4x4 e Compartilhado para Jericoacoara?',
    answerText: 'No Transfer Privativo (Toyota Hilux ou SW4 4x4), o veículo é 100% exclusivo para o seu grupo, sem paradas desnecessárias e com horário livre de saída diretamente para sua pousada. Já o Transfer Compartilhado oferece o melhor custo-benefício, com partidas regulares e veículos confortáveis compartilhados com outros passageiros.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          No <strong>Transfer Privativo (Toyota Hilux ou SW4 4x4)</strong>, o veículo é 100% exclusivo para o seu grupo, sem espera por outros passageiros e com horário livre de saída, levando você direto à porta da sua pousada na Vila de Jericoacoara.
        </p>
        <p>
          Já o <strong>Transfer Compartilhado</strong> oferece o melhor custo-benefício da rota, com veículos executivos e confortáveis compartilhados com outros passageiros. Veja mais detalhes em{' '}
          <Link to="/transfer-fortaleza-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Transfer Fortaleza Jeri
          </Link>{' '}
          e{' '}
          <Link to="/transfer-jijoca-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Transfer Jijoca Jericoacoara
          </Link>.
        </p>
      </div>
    ),
  },
  {
    id: 'tempo-viagem',
    category: 'transfers-voos',
    question: 'Qual é o tempo médio de viagem até Jericoacoara saindo de cada ponto?',
    answerText: 'Saindo do Aeroporto Regional de Jericoacoara (JJD em Cruz), o percurso leva cerca de 40 a 50 minutos em veículo 4x4. A partir de Jijoca de Jericoacoara, a travessia das dunas dura aproximadamente 35 a 45 minutos. Já de Fortaleza até Jericoacoara, a viagem dura em média de 4h a 4h30min em 4x4 privativo ou de 5h a 6h no transfer compartilhado/ônibus.',
    renderAnswer: () => (
      <div>
        <ul className="list-disc pl-5 space-y-1 mb-2">
          <li>
            <strong>Aeroporto de Jericoacoara (Cruz / JJD):</strong> cerca de 40 a 50 minutos direto pela praia/dunas.{' '}
            <Link to="/transfer-aeroporto-jericoacoara" className="text-[#2C7A7B] font-semibold hover:underline">Ver detalhes</Link>.
          </li>
          <li>
            <strong>Jijoca de Jericoacoara:</strong> cerca de 35 a 45 minutos em jardineira 4x4 ou Hilux.{' '}
            <Link to="/transfer-jijoca-jericoacoara" className="text-[#2C7A7B] font-semibold hover:underline">Ver detalhes</Link>.
          </li>
          <li>
            <strong>Fortaleza (Aeroporto FOR ou Hotéis):</strong> 4h a 4h30min em 4x4 privativo (ou 5h a 6h no transfer compartilhado).{' '}
            <Link to="/transfer-fortaleza-jericoacoara" className="text-[#2C7A7B] font-semibold hover:underline">Ver detalhes</Link>.
          </li>
          <li>
            <strong>Praia do Preá:</strong> cerca de 30 a 40 minutos pela beira-mar.{' '}
            <Link to="/transfer-prea-jericoacoara" className="text-[#2C7A7B] font-semibold hover:underline">Ver detalhes</Link>.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'onde-encontrar-motorista',
    category: 'transfers-voos',
    question: 'Onde o motorista me encontra no Aeroporto de Fortaleza ou de Jericoacoara?',
    answerText: 'No Aeroporto de Fortaleza (FOR), nosso motorista aguarda no saguão de desembarque com uma placa identificadora personalizada com seu nome e a marca Jericoacoara Premium. No Aeroporto de Jericoacoara (JJD em Cruz), o ponto de encontro fica logo na saída da esteira de restituição de bagagens.',
    renderAnswer: () => (
      <div>
        <p>
          No <strong>Aeroporto de Fortaleza (FOR)</strong>, nossa equipe aguarda no saguão de desembarque com uma placa identificadora contendo seu nome. No <strong>Aeroporto Regional de Jericoacoara (Cruz / JJD)</strong>, a recepção é logo na saída da esteira de bagagens. Nosso suporte 24h via WhatsApp (+55 88 98846-3182) acompanha toda a sua chegada.
        </p>
      </div>
    ),
  },

  // 2. BAGAGEM E CRIANÇAS
  {
    id: 'franquia-bagagem',
    category: 'bagagem-criancas',
    question: 'Qual é a franquia de bagagem permitida nos transfers e passeios?',
    answerText: 'No Transfer Privativo 4x4 (Hilux ou SW4), a franquia é ampla: até 2 malas despachadas grandes (até 23kg cada) mais bagagem de mão por passageiro. Equipamentos como pranchas de kitesurf e wingfoil são transportados com segurança (avise previamente). No Transfer Compartilhado, é permitida 1 mala média despachada (até 23kg) + 1 mochila ou bolsa de mão por passageiro.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          No <strong>Transfer Privativo 4x4 (Hilux ou SW4)</strong>, você tem total liberdade: até 2 malas despachadas (até 23kg cada) + bagagem de mão por passageiro. Pranchas de kitesurf e equipamentos esportivos são acomodados com segurança (basta nos avisar com antecedência).
        </p>
        <p>
          No <strong>Transfer Compartilhado</strong>, para garantir o conforto de todos os viajantes, o limite é de 1 mala média despachada (até 23kg) + 1 bolsa ou mochila de mão por passageiro. Se você vai praticar kite no Preá, confira nosso{' '}
          <Link to="/transfer-prea-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Transfer Preá Jericoacoara
          </Link>.
        </p>
      </div>
    ),
  },
  {
    id: 'criancas-cadeirinha',
    category: 'bagagem-criancas',
    question: 'Como funciona o transporte de crianças e a exigência de cadeirinha nos transfers e passeios?',
    answerText: 'Em cumprimento estrito às normas do CONTRAN/CTB e órgãos fiscalizadores, é terminantemente proibido o transporte de crianças ou bebês no colo em qualquer veículo. Toda criança, independentemente da idade, ocupa um assento individual e deve utilizar o dispositivo de retenção regulamentado adequado (bebê conforto, cadeirinha ou assento de elevação), disponibilizado gratuitamente mediante solicitação prévia no momento da reserva.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          <strong>Transporte Seguro e Obrigatório por Lei:</strong> Em cumprimento rigoroso às resoluções do CONTRAN e Código de Trânsito Brasileiro (CTB), <strong>é expressamente proibido transportar crianças ou bebês no colo</strong> em transfers (privativos ou compartilhados) e passeios off-road.
        </p>
        <p className="mb-2">
          Toda criança, desde recém-nascida, ocupa um <strong>assento individual obrigatório</strong> devidamente equipado com cinto de segurança e o dispositivo de retenção adequado à sua idade e peso:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-2 text-xs">
          <li><strong>Bebê Conforto:</strong> para bebês de até 1 ano (ou até 13 kg);</li>
          <li><strong>Cadeirinha:</strong> para crianças de 1 a 4 anos (ou de 9 a 18 kg);</li>
          <li><strong>Assento de Elevação (Booster):</strong> para crianças de 4 a 10 anos (ou até 1,45m de altura).</li>
        </ul>
        <p>
          Para transfers privativos, disponibilizamos <strong>cadeirinha infantil, assento de elevação ou bebê conforto gratuitamente</strong> mediante solicitação prévia no ato da reserva.
        </p>
      </div>
    ),
  },

  // 3. PASSEIOS E ROTEIROS
  {
    id: 'diferenca-leste-oeste',
    category: 'passeios-roteiros',
    question: 'Qual a diferença entre o Passeio Lado Leste e o Passeio Lado Oeste de Jericoacoara?',
    answerText: 'O Passeio Lado Leste é voltado para relaxamento e fotos clássicas: visita a Árvore da Preguiça, Praia do Preá, o famoso Buraco Azul e a Lagoa do Paraíso (com paradas nos melhores beach clubs, como o The Alchymist). O Passeio Lado Oeste é focado em aventura off-road: inclui travessia de balsa em Guriú, mangue seco com cavalos-marinhos e as dunas radicais da Lagoa de Tatajuba (com tirolesa e toboágua).',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          O <strong>Litoral Leste</strong> é focado em relaxamento, águas calmas e pontos fotográficos emblemáticos: Árvore da Preguiça, Praia do Preá, Buraco Azul e a famosa Lagoa do Paraíso (com tempo livre nos beach clubs como o The Alchymist).
        </p>
        <p>
          O <strong>Litoral Oeste</strong> é o roteiro da adrenalina e natureza selvagem: travessia de balsa em Guriú, mangue seco com berçário de cavalos-marinhos e descidas emocionantes nas dunas móveis da Tatajuba (com tirolesa e toboágua). Conheça todas as opções em{' '}
          <Link to="/passeios-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Passeios em Jericoacoara (Buggy, Quadriciclo e Jardineira)
          </Link>.
        </p>
      </div>
    ),
  },
  {
    id: 'o-que-inclui-passeio',
    category: 'passeios-roteiros',
    question: 'O que está incluso e o que NÃO está incluso nos passeios de Buggy e Jardineira?',
    answerText: 'INCLUSO: Veículo off-road regularizado (Buggy, Quadriciclo, Jardineira ou UTV), motorista/guia credenciado CADASTUR com vasta experiência nas dunas, embarque e desembarque na porta da sua pousada em Jericoacoara, seguro passageiro e paradas fotográficas. NÃO INCLUSO: Taxas de entrada de beach clubs privados (Alchymist, Lagun, Buraco Azul), atrações ecológicas opcionais (barco do cavalo-marinho no Guriú, tirolesa, toboágua), refeições e a Taxa de Turismo Sustentável da Vila.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          <strong>O que está Incluso (✔️):</strong> Veículo 4x4 revisado (Buggy, Jardineira, Quadriciclo ou UTV), motorista/guia nativo credenciado CADASTUR, busca e retorno na porta da sua pousada em Jeri e seguro passageiro APP integral.
        </p>
        <p>
          <strong>O que NÃO está Incluso (✕):</strong> Day use ou ingressos em clubes particulares (Alchymist Club, Lagun Beach, Buraco Azul), barco do cavalo-marinho no Guriú, tirolesa/toboágua na Tatajuba, refeições e bebidas, além da Taxa de Turismo Sustentável da Vila. Veja os valores em{' '}
          <Link to="/passeios-jericoacoara" className="text-[#2C7A7B] font-bold hover:underline">
            Passeios em Jericoacoara
          </Link>.
        </p>
      </div>
    ),
  },
  {
    id: 'taxa-turismo-sustentavel',
    category: 'passeios-roteiros',
    question: 'O que é a Taxa de Turismo Sustentável (TTS) de Jericoacoara, quanto custa e quem tem direito à isenção?',
    answerText: 'A Taxa de Turismo Sustentável (TTS) é um tributo municipal instituído pela Prefeitura de Jijoca de Jericoacoara no valor de R$ 41,50 por pessoa (válido por até 10 dias de estadia). Têm direito à isenção por lei municipal: crianças com até 12 anos, idosos com mais de 60 anos, Pessoas com Deficiência (PCD mediante laudo médico), moradores de Jijoca de Jericoacoara e seus familiares diretos, trabalhadores/prestadores de serviço com vínculo comprovado e proprietários de imóveis na vila. A emissão ou pedido de isenção deve ser feito previamente no site oficial da Prefeitura de Jijoca de Jericoacoara ou nos postos fiscais de atendimento.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          A <strong>Taxa de Turismo Sustentável (TTS)</strong> é um tributo municipal instituído pela Prefeitura de Jijoca de Jericoacoara (Lei Municipal nº 440/2015) para preservação do Parque Nacional e manutenção da vila:
        </p>
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 mb-3 text-xs">
          <p className="font-bold text-amber-900 mb-1">Valor Oficial para Pagantes: R$ 41,50 por pessoa</p>
          <p className="text-gray-700">Válido para estadias de até 10 dias corridos por visitante. Dias adicionais possuem acréscimo diário tabelado pela prefeitura.</p>
        </div>
        <p className="font-bold text-gray-900 mb-1.5 text-xs uppercase tracking-wider">Quem tem direito à isenção por lei municipal:</p>
        <ul className="list-disc pl-5 space-y-1 mb-3 text-xs text-gray-700">
          <li><strong>Crianças com até 12 anos de idade</strong>;</li>
          <li><strong>Idosos com mais de 60 anos de idade</strong>;</li>
          <li><strong>Pessoas com Deficiência (PCD)</strong>, mediante apresentação de laudo médico;</li>
          <li><strong>Moradores residentes</strong> no município de Jijoca de Jericoacoara e seus familiares diretos;</li>
          <li><strong>Trabalhadores e prestadores de serviço</strong> com vínculo empregatício ou atuação profissional comprovada no local;</li>
          <li><strong>Proprietários de imóveis ou estabelecimentos</strong> na vila.</li>
        </ul>
        <p className="text-xs text-gray-600">
          <strong>Comprovação e Emissão:</strong> É obrigatória a apresentação de documento oficial com foto, laudo médico (PCD) ou comprovante de vínculo/residência. O pagamento ou requerimento de isenção deve ser realizado no <strong>site oficial da Prefeitura de Jijoca de Jericoacoara</strong> ou nos postos fiscais de atendimento na entrada do município.
        </p>
      </div>
    ),
  },
  {
    id: 'isencao-beach-clubs-atrativos',
    category: 'passeios-roteiros',
    question: 'Como funcionam as isenções de entrada em Beach Clubs e atrativos turísticos (Lagun Beach, Buraco Azul e Alchymist)?',
    answerText: 'As isenções aplicam-se exclusivamente aos ingressos de entrada em atrativos específicos (e NÃO ao transporte): no Lagun Beach e Buraco Azul (Caiçara - Cruz/CE), crianças (geralmente até 10 anos), idosos acima de 60 anos e Pessoas com Deficiência (PCD comprovada) possuem isenção de entrada. Já o Alchymist Beach Club (Lagoa do Paraíso) NÃO possui isenção de entrada por idade ou PCD, cobrando ingresso integral segundo tabela própria.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          As isenções aplicam-se <strong>exclusivamente aos ingressos de entrada em atrativos específicos</strong> (e não ao serviço de transporte da agência):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs my-3">
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
            <strong className="text-emerald-900 block mb-1">Lagun Beach e Buraco Azul (Caiçara - Cruz/CE):</strong>
            <p className="text-gray-700 mb-1">Têm direito à isenção de entrada no local:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-gray-600 text-[11px]">
              <li>Crianças (geralmente até 10 anos, conforme política da atração);</li>
              <li>Idosos acima de 60 anos;</li>
              <li>Pessoas com Deficiência (PCD), mediante documento comprobatório.</li>
            </ul>
          </div>
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
            <strong className="text-amber-900 block mb-1">Alchymist Beach Club (Lagoa do Paraíso):</strong>
            <p className="text-gray-700 text-[11px] leading-relaxed">
              <strong>NÃO possui isenção de entrada</strong> para faixas etárias ou PCD. A cobrança de day-use/ingresso é feita integralmente pelo estabelecimento segundo tabela própria.
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600">
          Lembramos que nos passeios da Jericoacoara Premium o valor contratado inclui o veículo 4x4, guia credenciado e seguro passageiro, ficando o day-use dos clubes como despesa opcional paga diretamente nos locais.
        </p>
      </div>
    ),
  },

  // 4. PAGAMENTOS E CANCELAMENTO
  {
    id: 'politica-cancelamento-oficial',
    category: 'pagamentos-cancelamento',
    question: 'Qual é a política oficial de cancelamento com 100% de reembolso em 7 dias?',
    answerText: 'Nossa política garante 100% de reembolso integral para solicitações formalizadas com no mínimo 7 dias corridos de antecedência da data agendada do serviço (em conformidade com o Código de Defesa do Consumidor). Para cancelamentos entre 7 dias e 48 horas antes do embarque, você pode optar por 100% do valor em Voucher de Crédito (válido por 12 meses para remarcação) ou reembolso financeiro com retenção operacional de 50%. Com menos de 48 horas ou não comparecimento (no-show), o valor não é reembolsável devido à escala exclusiva do veículo e motorista credenciado.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          Nossa política de cancelamento é transparente e segue as normas do Código de Defesa do Consumidor:
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
          <li>
            <strong>Até 7 dias antes do serviço:</strong> 100% de reembolso financeiro integral, sem qualquer retenção ou multa.
          </li>
          <li>
            <strong>Entre 7 dias e 48 horas antes:</strong> 100% convertido em Voucher de Crédito (válido por 12 meses para reagendamento livre) ou reembolso com retenção de 50% para custos operacionais.
          </li>
          <li>
            <strong>Menos de 48 horas ou No-Show:</strong> sem reembolso, pois o veículo 4x4 e o motorista credenciado já estão travados e escalados para a data com bloqueio de novos passageiros.
          </li>
        </ul>
      </div>
    ),
    highlight: true,
  },
  {
    id: 'formas-pagamento-pix',
    category: 'pagamentos-cancelamento',
    question: 'Quais são as formas de pagamento aceitas e como funciona o desconto no PIX?',
    answerText: 'Aceitamos PIX Dinâmico com 5% de desconto automático imediato no checkout, cartões de crédito em até 12x via Mercado Pago e cartões de crédito internacionais via Stripe para clientes estrangeiros (sem exigência de CPF). Também disponibilizamos a condição especial de pagamento de 50% de sinal online para confirmar a data e os 50% restantes quitados no momento do embarque.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          Oferecemos condições flexíveis e seguras de pagamento:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>PIX Dinâmico com 5% de desconto imediato:</strong> gerado automaticamente no checkout com confirmação em tempo real.
          </li>
          <li>
            <strong>Cartão de Crédito em até 12x:</strong> processamento seguro via Mercado Pago.
          </li>
          <li>
            <strong>Cartões Internacionais (Stripe):</strong> para turistas estrangeiros, sem necessidade de CPF brasileiro.
          </li>
          <li>
            <strong>Sinal de 50%:</strong> pague 50% online para travar a data na agenda e os 50% restantes diretamente no embarque.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'autoridade-cadastur-cnpj',
    category: 'pagamentos-cancelamento',
    question: 'A Jericoacoara Premium possui CNPJ e registro no CADASTUR?',
    answerText: 'Sim! Somos uma empresa e agência 100% regularizada: CNPJ 51.790.615/0001-08 e CADASTUR 51.790.615/0001-08 emitido pelo Ministério do Turismo. Atendemos diariamente com suporte 24 horas no WhatsApp +55 (88) 98846-3182 cobrindo toda a região de Jericoacoara, Jijoca, Preá, Aeroporto de Cruz (JJD) e Fortaleza.',
    renderAnswer: () => (
      <div>
        <p className="mb-2">
          Sim! A <strong>Jericoacoara Premium</strong> opera sob o <strong>CNPJ 51.790.615/0001-08</strong> e possui registro oficial ativo no <strong>CADASTUR 51.790.615/0001-08</strong> (Ministério do Turismo).
        </p>
        <p>
          Atendemos presencialmente e com motoristas credenciados nas regiões de <strong>Jericoacoara, Jijoca de Jericoacoara, Praia do Preá, Aeroporto de Cruz (JJD) e Fortaleza</strong>, com suporte 24h via WhatsApp no número <strong>+55 (88) 98846-3182</strong>.
        </p>
      </div>
    ),
  },
];

const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndices, setExpandedIndices] = useState({ 0: true });

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
        faq.answerText.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Schema.org FAQPage e BreadcrumbList JSON-LD para SEO
  const faqPageSchema = [
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
          name: 'Perguntas Frequentes (FAQ)',
          item: 'https://www.jericoacoarapremium.com/faq',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ALL_FAQ_DATA.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answerText,
        },
      })),
    },
  ];

  return (
    <>
      <SEOHead
        title="FAQ Jericoacoara Premium | Dúvidas sobre Transfers, Passeios e Cancelamento"
        description="Tire todas as suas dúvidas sobre bagagem, horários, atrasos de voo, taxa de turismo, crianças e política de cancelamento com reembolso garantido."
        canonical="https://www.jericoacoarapremium.com/faq"
        schema={faqPageSchema}
      />

      <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-gray-900 selection:bg-[#D4AF37]/30 selection:text-gray-950">
        <Header />

        <main className="flex-1 pt-24 pb-20">
          
          {/* HERO HEADER DA PÁGINA */}
          <section className="relative bg-gradient-to-b from-[#0B1517] via-[#0F1E20] to-[#142629] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Central de Ajuda & Transparência
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Perguntas Frequentes{' '}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">
                  (FAQ) & Políticas
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
                Tire suas dúvidas sobre transfers 4x4, passeios pelas dunas, bagagem, crianças,
                formas de pagamento e nossa garantia oficial de reembolso.
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
                      {' — '}
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">100% de Reembolso</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                      {CANCELLATION_POLICY.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory('pagamentos-cancelamento');
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

          {/* SINAIS CONCRETOS DE AUTORIDADE LOCAL */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#2C7A7B] shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">CADASTUR Regular</span>
                  <span className="text-gray-500">51.790.615/0001-08</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#2C7A7B] shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">CNPJ Ativo</span>
                  <span className="text-gray-500">51.790.615/0001-08</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-[#2C7A7B] shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">Cobertura Regional</span>
                  <span className="text-gray-500">Jeri, Preá, Jijoca, JJD e FOR</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#2C7A7B] shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block">WhatsApp 24h</span>
                  <span className="text-gray-500">+55 (88) 98846-3182</span>
                </div>
              </div>
            </div>
          </section>

          {/* NAVEGAÇÃO POR CATEGORIAS (TABS / PILLS) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Categorias de Dúvidas</h2>
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
                      <>
                        {' '}
                        <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black">
                          {cat.badge}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* LISTA DE PERGUNTAS E RESPOSTAS (RENDERIZADAS DIRETAMENTE NO HTML) */}
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
                  <article
                    key={faq.id || faq.question}
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
                      aria-controls={`faq-answer-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        {faq.highlight && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#D4AF37] text-gray-950 text-[10px] font-black uppercase tracking-wider">
                            Destaque
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {faq.question}
                        </h3>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 bg-[#142629] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* CONTEÚDO RENDERIZADO DIRETAMENTE NO HTML (ACESSIBILIDADE & GOOGLEBOT) */}
                    <div
                      id={`faq-answer-${index}`}
                      className={`px-6 pb-5 pt-1 text-gray-600 text-sm sm:text-[15px] leading-relaxed border-t border-gray-100 ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      {faq.renderAnswer ? faq.renderAnswer() : <p>{faq.answerText}</p>}
                    </div>
                  </article>
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
                  Atendimento 24 Horas no WhatsApp +55 (88) 98846-3182
                </div>

                <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white">
                  Ainda possui dúvidas ou deseja um roteiro personalizado?
                </h3>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  Nossos consultores credenciados CADASTUR em Jericoacoara estão disponíveis no WhatsApp
                  para montar pacotes combinados, verificar horários de voos e garantir as melhores tarifas.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => openWhatsApp(WA_MESSAGES.generic)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A028] text-gray-950 font-black text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Falar no WhatsApp Oficial</span>
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
