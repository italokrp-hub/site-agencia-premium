import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle2,
  UserCheck,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  CalendarCheck,
  AlertCircle,
  Database,
  Globe,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEOHead';
import { Toaster } from '@/components/ui/toaster';
import { openWhatsApp, WA_MESSAGES } from '@/utils/whatsapp';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleWhatsApp = () => {
    openWhatsApp('Olá! Li a Política de Privacidade e gostaria de tirar uma dúvida sobre meus dados e reservas.');
  };

  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Política de Privacidade | Jericoacoara Premium',
    description: 'Política de Privacidade e Proteção de Dados (LGPD) da Jericoacoara Premium Receptivo & Turismo Ltda. CNPJ: 51.790.615/0001-08.',
    url: 'https://www.jericoacoarapremium.com/politica-de-privacidade',
    publisher: {
      '@type': 'TravelAgency',
      name: 'Jericoacoara Premium',
      legalName: 'Jericoacoara Premium Receptivo & Turismo Ltda.',
      taxID: '51.790.615/0001-08',
      url: 'https://www.jericoacoarapremium.com/',
      telephone: '+5588988463182',
      email: 'contato@jericoacoarapremium.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vila de Jericoacoara',
        addressLocality: 'Jericoacoara',
        addressRegion: 'CE',
        postalCode: '62598-000',
        addressCountry: 'BR',
      },
    },
  };

  const sections = [
    { id: 'controlador', label: '1. Controlador de Dados' },
    { id: 'lgpd-principios', label: '2. Conformidade LGPD' },
    { id: 'dados-coletados', label: '3. Dados Coletados' },
    { id: 'finalidade', label: '4. Finalidades do Uso' },
    { id: 'pagamentos', label: '5. Pagamentos e Segurança' },
    { id: 'compartilhamento', label: '6. Compartilhamento' },
    { id: 'retencao', label: '7. Armazenamento e Retenção' },
    { id: 'direitos', label: '8. Seus Direitos (Art. 18 LGPD)' },
    { id: 'cookies', label: '9. Cookies e Sessão' },
    { id: 'cancelamentos', label: '10. Reservas e Cancelamento' },
    { id: 'dpo', label: '11. Contato do Encarregado (DPO)' },
    { id: 'foro', label: '12. Legislação e Foro' },
  ];

  return (
    <>
      <SEOHead
        title="Política de Privacidade e LGPD | Jericoacoara Premium"
        description="Conheça a Política de Privacidade e Tratamento de Dados da Jericoacoara Premium (CNPJ 51.790.615/0001-08). Transparência, segurança e conformidade estrita com a LGPD."
        canonical="https://www.jericoacoarapremium.com/politica-de-privacidade"
        schema={privacySchema}
      />

      <div className="min-h-screen bg-[#0B1517] text-gray-200 flex flex-col selection:bg-[#D4AF37]/30 selection:text-white">
        <Header />

        <main className="flex-1 pt-24 pb-20">
          {/* HERO BANNER - DARK SLATE & GOLD */}
          <section className="relative bg-gradient-to-b from-[#0B1517] via-[#0F1E20] to-[#0B1517] border-b border-slate-800/80 py-14 sm:py-18 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <Link to="/" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Início
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-[#D4AF37] font-semibold">Política de Privacidade</span>
              </nav>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
                <ShieldCheck className="w-4 h-4" />
                Segurança, LGPD & Transparência
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Política de Privacidade &{' '}
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">
                  Proteção de Dados
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
                A <strong>Jericoacoara Premium Receptivo & Turismo Ltda.</strong> tem o compromisso inegociável
                com a privacidade, o sigilo e a segurança das informações dos nossos clientes, viajantes e parceiros.
                Esta política detalha como coletamos, tratamos, protegemos e armazenamos seus dados pessoais
                em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - LGPD).
              </p>

              {/* Informações da Empresa em Cartão Dark/Gold */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Empresa Regularizada</span>
                    <strong className="text-white">CNPJ: 51.790.615/0001-08</strong>
                  </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Ministério do Turismo</span>
                    <strong className="text-white">CADASTUR 51.790.615/0001-08</strong>
                  </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Última Atualização</span>
                    <strong className="text-white">Novembro de 2026 (Vigente)</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTEÚDO PRINCIPAL COM SIDEBAR DE NAVEGAÇÃO */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* SIDEBAR DE ÍNDICE RÁPIDO (DESKTOP) */}
              <aside className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-28 bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Índice da Política
                  </p>
                  <nav className="space-y-1.5 text-xs">
                    {sections.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block py-1.5 px-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-6 pt-5 border-t border-slate-800">
                    <p className="text-[11px] text-gray-400 mb-3">Dúvida sobre seus dados?</p>
                    <button
                      onClick={handleWhatsApp}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Falar no WhatsApp
                    </button>
                  </div>
                </div>
              </aside>

              {/* ARTIGO COMPLETO DE PRIVACIDADE */}
              <div className="lg:col-span-3 space-y-10 text-sm leading-relaxed text-gray-300">
                {/* 1. CONTROLADOR DE DADOS */}
                <section id="controlador" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">1. Identificação do Controlador de Dados</h2>
                  </div>
                  <p className="mb-3">
                    Para fins de cumprimento do artigo 5º, inciso VI da Lei Geral de Proteção de Dados (LGPD), o
                    Controlador das suas informações pessoais é:
                  </p>
                  <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-1.5 text-xs font-mono text-gray-300">
                    <p><strong className="text-white">Razão Social:</strong> Jericoacoara Premium Receptivo & Turismo Ltda.</p>
                    <p><strong className="text-white">Nome Fantasia:</strong> Jericoacoara Premium</p>
                    <p><strong className="text-white">CNPJ:</strong> 51.790.615/0001-08</p>
                    <p><strong className="text-white">CADASTUR:</strong> 51.790.615/0001-08 (Ministério do Turismo)</p>
                    <p><strong className="text-white">Endereço Operacional:</strong> Vila de Jericoacoara, Jijoca de Jericoacoara - CE, CEP 62598-000</p>
                    <p><strong className="text-white">Canal de Privacidade:</strong> contato@jericoacoarapremium.com</p>
                    <p><strong className="text-white">Atendimento Operacional 24h:</strong> +55 (88) 98846-3182</p>
                  </div>
                </section>

                {/* 2. CONFORMIDADE LGPD */}
                <section id="lgpd-principios" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">2. Princípios e Conformidade com a LGPD</h2>
                  </div>
                  <p className="mb-3">
                    A Jericoacoara Premium realiza todas as atividades de tratamento de dados pessoais pautada nos
                    princípios fundamentais do Artigo 6º da Lei nº 13.709/2018:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                    <li className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <strong className="text-[#D4AF37] block mb-1">Finalidade & Adequação</strong>
                      Coleta restrita a propósitos legítimos e específicos informados ao titular.
                    </li>
                    <li className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <strong className="text-[#D4AF37] block mb-1">Necessidade (Mínimo de Dados)</strong>
                      Limitamos o tratamento ao estritamente indispensável para a prestação do serviço turístico.
                    </li>
                    <li className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <strong className="text-[#D4AF37] block mb-1">Livre Acesso & Transparência</strong>
                      Garantia de consulta facilitada e gratuita sobre a exatidão e tratamento dos dados.
                    </li>
                    <li className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <strong className="text-[#D4AF37] block mb-1">Segurança & Prevenção</strong>
                      Adoção de medidas técnicas e administrativas aptas a proteger os dados de acessos não autorizados.
                    </li>
                  </ul>
                </section>

                {/* 3. DADOS COLETADOS */}
                <section id="dados-coletados" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Database className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">3. Dados Pessoais Coletados</h2>
                  </div>
                  <p className="mb-4">
                    Para viabilizar transfers 4x4, passeios turísticos no Parque Nacional e emissão de vouchers oficiais, coletamos as seguintes categorias de dados:
                  </p>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <strong className="text-white text-sm block mb-1">A. Dados de Identificação do Passageiro Principal e Acompanhantes</strong>
                      <p className="text-gray-300">
                        Nome completo, número de CPF ou Passaporte (obrigatório para seguro APP e fiscalizações rodoviárias ARCE/ANTT/Cadastur) e data de nascimento/faixa etária (para crianças, visando a alocação obrigatória de assento individual e dispositivo de retenção regulamentado pelo CONTRAN/CTB, como bebê conforto, cadeirinha ou assento de elevação).
                      </p>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <strong className="text-white text-sm block mb-1">B. Dados de Contato e Comunicação</strong>
                      <p className="text-gray-300">
                        Número de telefone / WhatsApp (para contato operacional de embarque, envio de placa do veículo e localização em tempo real) e endereço de e-mail (para envio do voucher, comprovante de pagamento e notas fiscais).
                      </p>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <strong className="text-white text-sm block mb-1">C. Dados de Logística de Viagem e Hospedagem</strong>
                      <p className="text-gray-300">
                        Número e companhia do voo de chegada/partida nos aeroportos de Fortaleza (FOR) ou Jericoacoara (JJD - Cruz) para rastreamento de atrasos em tempo real; nome do hotel ou pousada de origem e destino na Vila de Jericoacoara ou Preá.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 4. FINALIDADES DO USO */}
                <section id="finalidade" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">4. Finalidades do Tratamento de Dados</h2>
                  </div>
                  <p className="mb-3">
                    Seus dados pessoais são tratados com base nas hipóteses legais do Artigo 7º da LGPD (execução de contrato, cumprimento de obrigação legal ou regulatória e legítimo interesse):
                  </p>
                  <ul className="space-y-2 list-disc pl-5 text-gray-300 text-xs sm:text-sm">
                    <li><strong>Emissão de Voucher e Contrato Turístico:</strong> confirmação oficial da reserva com dados auditáveis e código único de validação.</li>
                    <li><strong>Seguro Obrigatório contra Acidentes Pessoais (APP):</strong> inclusão dos passageiros na apólice de seguro exigida pelos órgãos reguladores de transporte de turismo.</li>
                    <li><strong>Rastreamento de Voos e Pontualidade:</strong> acompanhamento do status do voo para tolerância gratuita de espera no aeroporto sem surpresas.</li>
                    <li><strong>Cumprimento Legal e Barreiras Ambientais:</strong> apresentação de manifesto de passageiros aos postos de fiscalização da Prefeitura Municipal de Jijoca de Jericoacoara e ICMBio (Instituto Chico Mendes de Conservação da Biodiversidade).</li>
                    <li><strong>Comunicação Transparente:</strong> suporte pré, durante e pós-viagem via WhatsApp e e-mail.</li>
                  </ul>
                </section>

                {/* 5. PAGAMENTOS E SEGURANÇA */}
                <section id="pagamentos" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">5. Pagamentos, Criptografia e Segurança Financeira</h2>
                  </div>
                  <p className="mb-3">
                    <strong>Nenhum dado sensível de cartão de crédito é armazenado nos servidores da Jericoacoara Premium.</strong>
                  </p>
                  <p className="mb-3 text-xs sm:text-sm text-gray-300">
                    Todas as transações de pagamento online são processadas através de instituições financeiras e gateways
                    de pagamento homologados pelo Banco Central do Brasil (Mercado Pago, Stripe e Rede do Sistema de Pagamentos Instantâneos - PIX).
                  </p>
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Criptografia SSL/TLS 256-bit</strong>
                        Toda navegação e tráfego de dados ocorrem sob protocolo seguro HTTPS certificado.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Certificação PCI-DSS Compliant</strong>
                        Transações com cartão atendem ao mais alto padrão de segurança da indústria de pagamentos.
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6. COMPARTILHAMENTO DE DADOS */}
                <section id="compartilhamento" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">6. Compartilhamento Estritamente Operacional</h2>
                  </div>
                  <p className="mb-3">
                    A Jericoacoara Premium <strong>NUNCA comercializa, aluga ou cede dados pessoais a empresas terceiras para fins de marketing ou publicidade</strong>. O compartilhamento ocorre exclusivamente quando necessário para a execução do serviço:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-300 list-disc pl-5">
                    <li><strong>Motoristas e Guias Credenciados Cadastur:</strong> recebem exclusivamente o nome do passageiro, telefone de contato e local de embarque/desembarque para realização da viagem.</li>
                    <li><strong>Companhia Seguradora:</strong> dados de identificação para emissão da apólice de seguro passageiro (APP).</li>
                    <li><strong>Órgãos Públicos e Fiscais:</strong> quando exigido por determinação legal, ordens judiciais ou em barreiras fiscais municipais/estaduais no Parque Nacional.</li>
                  </ul>
                </section>

                {/* 7. ARMAZENAMENTO E RETENÇÃO */}
                <section id="retencao" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">7. Armazenamento e Prazos de Retenção</h2>
                  </div>
                  <p className="mb-3">
                    Os dados são mantidos pelo período necessário para a execução dos contratos turísticos e cumprimento de obrigações legais brasileiras:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <strong className="text-white block mb-0.5">Dados Fiscais e Contábeis (Notas Fiscais e Vouchers):</strong>
                      Retidos pelo prazo regulamentar de 5 (cinco) anos, conforme determinado pelo Código Tributário Nacional (Lei nº 5.172/1966) e Código de Defesa do Consumidor.
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <strong className="text-white block mb-0.5">Logs de Acesso e Segurança:</strong>
                      Retidos pelo prazo legal mínimo de 6 (seis) meses, em conformidade com o Artigo 15 do Marco Civil da Internet (Lei nº 12.965/2014).
                    </div>
                  </div>
                </section>

                {/* 8. SEUS DIREITOS (ART. 18 LGPD) */}
                <section id="direitos" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">8. Seus Direitos como Titular (Art. 18 LGPD)</h2>
                  </div>
                  <p className="mb-3">
                    Como titular dos dados, você pode exercer os seguintes direitos a qualquer momento mediante requisição formal:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <span className="text-[#D4AF37] font-bold block mb-1">✔ Confirmação e Acesso</span>
                      Saber se realizamos tratamento dos seus dados e receber cópia das informações.
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <span className="text-[#D4AF37] font-bold block mb-1">✔ Correção e Atualização</span>
                      Solicitar a retificação imediata de dados incompletos, inexatos ou desatualizados.
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <span className="text-[#D4AF37] font-bold block mb-1">✔ Anonimização ou Bloqueio</span>
                      Requerer a restrição de dados desnecessários ou tratados em desconformidade com a lei.
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <span className="text-[#D4AF37] font-bold block mb-1">✔ Eliminação e Revogação</span>
                      Pedir a exclusão de dados tratados mediante consentimento (salvo obrigações legais de retenção).
                    </div>
                  </div>
                </section>

                {/* 9. COOKIES E SESSÃO */}
                <section id="cookies" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Database className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">9. Cookies e Tecnologias de Sessão</h2>
                  </div>
                  <p className="mb-3 text-xs sm:text-sm">
                    Utilizamos cookies exclusivamente para garantir a correta operação técnica da aplicação web:
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300 list-disc pl-5">
                    <li><strong>Cookies Estritamente Necessários:</strong> manter sua sessão de navegação, roteamento de páginas e prevenção a fraudes.</li>
                    <li><strong>Preferências de Idioma:</strong> memorizar a escolha do usuário entre Português, Inglês e Espanhol.</li>
                    <li><strong>Métricas Anônimas:</strong> medição de performance para carregamento ultra-rápido em conexões móveis de praia.</li>
                  </ul>
                </section>

                {/* 10. RESERVAS E CANCELAMENTO */}
                <section id="cancelamentos" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] block">Cláusula de Transparência</span>
                      <h2 className="text-xl font-bold text-white">10. Política de Reservas e Cancelamentos Integrada</h2>
                    </div>
                  </div>

                  <p className="mb-4 text-xs sm:text-sm text-gray-300">
                    Em conformidade com o Código de Defesa do Consumidor e as normas operacionais do transporte receptivo no Parque Nacional, nossa política de cancelamento garante:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30">
                      <span className="text-emerald-400 font-bold block mb-1">Até 7 Dias Antes</span>
                      <strong className="text-base text-white block mb-1">100% Reembolso</strong>
                      <p className="text-gray-400 text-[11px]">Devolução integral sem taxas de retenção ou multas contratuais.</p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/30">
                      <span className="text-amber-400 font-bold block mb-1">De 7 Dias a 48h Antes</span>
                      <strong className="text-base text-white block mb-1">50% ou Voucher</strong>
                      <p className="text-gray-400 text-[11px]">Reagendamento gratuito com crédito em voucher válido por 12 meses ou retenção de 50%.</p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-red-500/30">
                      <span className="text-red-400 font-bold block mb-1">Menos de 48h / No-Show</span>
                      <strong className="text-base text-white block mb-1">Não Reembolsável</strong>
                      <p className="text-gray-400 text-[11px]">Veículo 4x4 e motorista alocados exclusivamente para sua rota.</p>
                    </div>
                  </div>
                </section>

                {/* 11. CONTATO DO DPO */}
                <section id="dpo" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">11. Canal de Atendimento do Encarregado (DPO)</h2>
                  </div>
                  <p className="mb-3 text-xs sm:text-sm">
                    Para exercer quaisquer de seus direitos de titular, solicitar esclarecimentos ou relatar qualquer dúvida sobre a privacidade de suas informações, entre em contato direto com nosso Encarregado de Proteção de Dados:
                  </p>
                  <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-1.5 text-xs text-gray-300">
                    <p><strong className="text-white">Encarregado (DPO):</strong> Gestão de Privacidade & Compliance</p>
                    <p><strong className="text-white">E-mail Oficial:</strong> contato@jericoacoarapremium.com</p>
                    <p><strong className="text-white">WhatsApp Operacional:</strong> +55 (88) 98846-3182</p>
                    <p><strong className="text-white">Prazo de Resposta:</strong> Até 5 (cinco) dias úteis para manifestação inicial fundamentada.</p>
                  </div>
                </section>

                {/* 12. LEGISLAÇÃO E FORO */}
                <section id="foro" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">12. Legislação Aplicável e Foro de Eleição</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Esta Política de Privacidade é regida e interpretada de acordo com as Leis da República Federativa do Brasil, em especial a Lei Federal nº 13.709/2018 (LGPD) e o Marco Civil da Internet. Fica eleito o Foro da Comarca de Jijoca de Jericoacoara / Fortaleza, Estado do Ceará, com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir eventuais controvérsias oriundas deste instrumento.
                  </p>
                </section>

                {/* CTA FINAL DE APOIO */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Ficou com alguma dúvida sobre seus dados?</h3>
                    <p className="text-xs text-gray-400">Nossa equipe está à disposição 24h para esclarecer qualquer ponto antes ou depois da sua reserva.</p>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Falar com a Agência
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </>
  );
}
