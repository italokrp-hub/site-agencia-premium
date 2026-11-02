import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Car,
  Compass,
  CalendarCheck,
  AlertTriangle,
  Clock,
  Luggage,
  Baby,
  ShieldCheck,
  Plane,
  HeartHandshake,
  Scale,
  Phone,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEOHead';
import { Toaster } from '@/components/ui/toaster';
import { openWhatsApp } from '@/utils/whatsapp';

export default function TermsOfUse() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleWhatsApp = () => {
    openWhatsApp('Olá! Li os Termos de Uso e gostaria de tirar uma dúvida sobre as regras de transfer ou passeio.');
  };

  const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Termos de Uso e Condições Gerais | Jericoacoara Premium',
    description: 'Termos de Uso, condições de contratação de transfers e passeios em Jericoacoara com a Jericoacoara Premium Receptivo & Turismo Ltda. CNPJ: 51.790.615/0001-08.',
    url: 'https://www.jericoacoarapremium.com/termos-de-uso',
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
    { id: 'partes', label: '1. Partes e Objeto' },
    { id: 'regras-transfers', label: '2. Regras de Transfers 4x4' },
    { id: 'bagagem-criancas', label: '3. Bagagem e Crianças' },
    { id: 'voos-atrasos', label: '4. Voos e Tolerância' },
    { id: 'regras-passeios', label: '5. Regras dos Passeios' },
    { id: 'incluso-excluso', label: '6. Inclusões e Exclusões' },
    { id: 'taxa-turismo', label: '7. Taxa de Turismo (TTS)' },
    { id: 'cancelamento', label: '8. Cancelamento e Reembolso' },
    { id: 'conduta', label: '9. Conduta e Preservação' },
    { id: 'responsabilidades', label: '10. Limites de Responsabilidade' },
    { id: 'modificacoes', label: '11. Alterações dos Termos' },
    { id: 'foro', label: '12. Legislação e Foro' },
  ];

  return (
    <>
      <SEOHead
        title="Termos de Uso e Regras de Contratação | Jericoacoara Premium"
        description="Termos de Uso e Condições Gerais dos serviços de transfers 4x4 e passeios turísticos da Jericoacoara Premium (CNPJ 51.790.615/0001-08). Regras claras, prazos e direitos do passageiro."
        canonical="https://www.jericoacoarapremium.com/termos-de-uso"
        schema={termsSchema}
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
                <span className="text-[#D4AF37] font-semibold">Termos de Uso</span>
              </nav>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
                <FileCheck2 className="w-4 h-4" />
                Contrato & Condições Gerais
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Termos de Uso &{' '}
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">
                  Regras Contratuais
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
                Bem-vindo à <strong>Jericoacoara Premium Receptivo & Turismo Ltda.</strong> Este documento
                estabelece as regras, deveres, responsabilidades e procedimentos operacionais aplicáveis
                à contratação de transfers 4x4, passeios turísticos, aluguel de veículos e serviços de receptivo
                em Jericoacoara, Jijoca, Preá, Cruz (JJD) e Fortaleza.
              </p>

              {/* Informações Oficiais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Agência Credenciada</span>
                    <strong className="text-white">CNPJ: 51.790.615/0001-08</strong>
                  </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Cadastro Oficial de Turismo</span>
                    <strong className="text-white">CADASTUR 51.790.615/0001-08</strong>
                  </div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[11px]">Seguro Incluso</span>
                    <strong className="text-white">Cobertura APP Passageiros</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTEÚDO PRINCIPAL COM SIDEBAR DE NAVEGAÇÃO */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* SIDEBAR DE ÍNDICE RÁPIDO */}
              <aside className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-28 bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Índice dos Termos
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
                    <p className="text-[11px] text-gray-400 mb-3">Dúvida sobre as condições?</p>
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

              {/* ARTIGO COMPLETO DE TERMOS */}
              <div className="lg:col-span-3 space-y-10 text-sm leading-relaxed text-gray-300">
                {/* 1. PARTES E OBJETO */}
                <section id="partes" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">1. Partes Contratantes e Objeto</h2>
                  </div>
                  <p className="mb-3">
                    Ao confirmar uma reserva por este site, canal WhatsApp oficial ou agência parceira, o cliente (doravante denominado <strong>"CONTRATANTE"</strong> ou <strong>"PASSAGEIRO"</strong>) celebra contrato de prestação de serviços turísticos com a <strong>Jericoacoara Premium Receptivo & Turismo Ltda.</strong>, inscrita no CNPJ sob o nº <strong>51.790.615/0001-08</strong> e CADASTUR nº <strong>51.790.615/0001-08</strong> (denominada <strong>"CONTRATADA"</strong>).
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    <strong>Objeto:</strong> prestação de serviços de transporte receptivo (transfers privativos e compartilhados em veículos 4x4, vans ou ônibus executivos) e passeios turísticos off-road no Parque Nacional de Jericoacoara e litoral oeste/leste cearense.
                  </p>
                </section>

                {/* 2. REGRAS DE TRANSFERS 4X4 */}
                <section id="regras-transfers" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Car className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">2. Modalidades e Regras de Transfers 4x4</h2>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <strong className="text-white text-base block mb-1">A. Transfer Privativo 4x4 (Hilux / SW4 / Corolla Cross)</strong>
                      <ul className="space-y-1.5 text-gray-300 list-disc pl-5 mt-2">
                        <li>Veículo 100% exclusivo para o titular e seus acompanhantes, sem paradas intermediárias não contratadas.</li>
                        <li>Horário livre e flexível de embarque, ajustado de acordo com o plano do passageiro ou horário do voo.</li>
                        <li>Atendimento porta a porta: busca no aeroporto ou hotel e desembarque na porta da sua pousada em Jericoacoara.</li>
                        <li>Travessia de balsa (quando aplicável) já inclusa no valor total.</li>
                      </ul>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <strong className="text-white text-base block mb-1">B. Transfer Compartilhado</strong>
                      <ul className="space-y-1.5 text-gray-300 list-disc pl-5 mt-2">
                        <li>Horários de saída pré-estabelecidos e rigorosamente pontuais.</li>
                        <li>Tolerância máxima de espera de 10 minutos no local combinado para não penalizar os demais passageiros.</li>
                        <li>Veículo executivo compartilhado com outros clientes (trecho asfalto em van/ônibus e transbordo para 4x4 jardineira em Jijoca para travessia das dunas).</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 3. BAGAGEM E CRIANÇAS */}
                <section id="bagagem-criancas" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Luggage className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">3. Política de Bagagem e Transporte de Crianças</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm mb-2">
                        <Luggage className="w-4 h-4" />
                        <span>Franquia de Bagagem</span>
                      </div>
                      <p className="mb-2"><strong>Transfer Privativo:</strong> até 2 malas despachadas (até 23kg cada) + 1 mala de mão por passageiro.</p>
                      <p className="mb-2"><strong>Transfer Compartilhado:</strong> 1 mala média (até 23kg) + 1 mochila de mão por passageiro.</p>
                      <p className="text-gray-400 text-[11px]">Pranchas de kitesurf, wingfoil ou bagagens fora do padrão devem ser informadas com antecedência para alocação de bagageiro adequado.</p>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                        <Baby className="w-4 h-4" />
                        <span>Transporte de Crianças & Dispositivos de Retenção (Obrigatório por Lei)</span>
                      </div>
                      <p className="mb-2"><strong>Proibição Estrita de Colo:</strong> Em cumprimento rigoroso às normas do CONTRAN/CTB e órgãos fiscalizadores de trânsito, é estritamente proibido o transporte de crianças ou bebês no colo em qualquer veículo (transfers ou passeios).</p>
                      <p className="mb-2"><strong>Assento Individual Obrigatório:</strong> Toda criança, independentemente da idade, ocupa assento individual regulamentado e deve utilizar o dispositivo de retenção adequado (bebê conforto, cadeirinha ou assento de elevação).</p>
                      <p className="text-gray-400 text-[11px]">Dispositivos de retenção certificados são disponibilizados gratuitamente em transfers privativos mediante solicitação prévia no ato da reserva.</p>
                    </div>
                  </div>
                </section>

                {/* 4. VOOS E TOLERÂNCIA */}
                <section id="voos-atrasos" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Plane className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">4. Monitoramento de Voos e Tolerância de Atraso</h2>
                  </div>
                  <p className="mb-3 text-xs sm:text-sm">
                    Nossa equipe operacional rastreia o status em tempo real de todos os voos de chegada informados nos aeroportos de Fortaleza (FOR) e Jericoacoara (JJD - Cruz).
                  </p>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                    <ul className="space-y-2 text-gray-300">
                      <li>
                        <strong className="text-white">Tolerância Gratuita no Transfer Privativo:</strong> disponibilizamos até <strong>1 (uma) hora de espera gratuita</strong> no saguão após o pouso efetivo da aeronave, sem qualquer cobrança adicional.
                      </li>
                      <li>
                        <strong className="text-white">Atrasos Excessivos ou Cancelamento de Voo:</strong> caso a companhia aérea cancele ou remarque o voo para outro dia, o passageiro deverá notificar nossa equipe imediatamente pelo WhatsApp 24h para reagendamento sem custo adicional do transfer conforme disponibilidade de frota.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* 5. REGRAS DOS PASSEIOS */}
                <section id="regras-passeios" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">5. Regras Operacionais dos Passeios (Leste e Oeste)</h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <p>
                      Os passeios pelo litoral leste (Árvore da Preguiça, Preá, Buraco Azul, Lagoa do Paraíso) e litoral oeste (Guriú, mangue seco, dunas móveis e Tatajuba) seguem padrões rigorosos de segurança:
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-gray-300">
                      <li><strong>Horário de Saída:</strong> habitualmente entre 08h30 e 09h00 da manhã, com retorno previsto entre 15h30 e 16h30.</li>
                      <li><strong>Veículos Off-Road:</strong> passeios realizados em Buggy credenciado (até 4 passageiros), UTV Maverick, Quadriciclo 4x4 (pilotagem guiada) ou Jardineira 4x4 privativa/compartilhada.</li>
                      <li><strong>Condições Meteorológicas:</strong> em situações excepcionais de maré alta extrema ou chuvas fortes que comprometam a segurança, o guia credenciado poderá alterar a ordem das paradas para garantir a integridade dos passageiros.</li>
                    </ul>
                  </div>
                </section>

                {/* 6. INCLUSÕES E EXCLUSÕES */}
                <section id="incluso-excluso" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">6. O Que Está e Não Está Incluso nos Serviços</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-500/30">
                      <strong className="text-emerald-400 text-sm block mb-2 font-bold">✔ Estão Inclusos nos Passeios:</strong>
                      <ul className="space-y-1.5 text-gray-300 list-disc pl-4">
                        <li>Veículo 4x4 revisado e vistoriado pelos órgãos competentes;</li>
                        <li>Motorista e guia profissional credenciado pelo Cadastur;</li>
                        <li>Busca e retorno na porta da sua pousada na Vila de Jericoacoara;</li>
                        <li>Seguro passageiro contra acidentes (APP) obrigatório;</li>
                        <li>Suporte operacional 24h via WhatsApp.</li>
                      </ul>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/30">
                      <strong className="text-amber-400 text-sm block mb-2 font-bold">✕ Não Estão Inclusos:</strong>
                      <ul className="space-y-1.5 text-gray-300 list-disc pl-4">
                        <li>Entradas, consumações ou day-use em clubes privados (Alchymist Club, Lagun Beach, Buraco Azul);</li>
                        <li>Passeio de barco dos cavalos-marinhos no Guriú (opcional);</li>
                        <li>Atrações esportivas opcionais (tirolesa, toboágua na Tatajuba);</li>
                        <li>Alimentos, bebidas e petiscos nos restaurantes;</li>
                        <li>Taxa de Turismo Sustentável da Vila de Jericoacoara (Prefeitura de Jijoca).</li>
                      </ul>
                    </div>
                  </div>

                  {/* REGRAS DE ISENÇÃO EM ATRATIVOS E BEACH CLUBS */}
                  <div className="mt-4 p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-gray-300 space-y-2">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Regras de Isenção em Ingressos de Atrativos & Beach Clubs</span>
                    </div>
                    <p className="text-gray-400">
                      As isenções aplicam-se <strong>exclusivamente aos ingressos de entrada nos atrativos específicos</strong> (e não ao serviço de transporte da agência):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <strong className="text-white block mb-1">Lagun Beach e Buraco Azul (Caiçara - Cruz/CE):</strong>
                        <p className="text-gray-300">Têm direito à isenção de entrada:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-gray-400">
                          <li>Crianças (geralmente até 10 anos, conforme política do local);</li>
                          <li>Idosos acima de 60 anos;</li>
                          <li>Pessoas com Deficiência (PCD), mediante comprovação oficial.</li>
                        </ul>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <strong className="text-white block mb-1">Alchymist Beach Club (Lagoa do Paraíso):</strong>
                        <p className="text-gray-300 text-[11px] leading-relaxed">
                          <strong>NÃO possui isenção de entrada</strong> para faixas etárias ou PCD. A cobrança de ingresso/day-use é feita integralmente pelo estabelecimento segundo tabela própria vigente.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 7. TAXA DE TURISMO (TTS) */}
                <section id="taxa-turismo" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">7. Taxa de Turismo Sustentável (TTS - Vila de Jericoacoara)</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mb-3 leading-relaxed">
                    A Taxa de Turismo Sustentável é um tributo municipal instituído pela Prefeitura de Jijoca de Jericoacoara (Lei Municipal nº 440/2015) para preservação ambiental e infraestrutura da Vila. Ela é de responsabilidade individual do viajante e <strong>não integra nem pode ser embutida no valor dos serviços da agência</strong>.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-slate-800">
                        <strong className="text-white text-sm">Valor Oficial Vigente</strong>
                        <span className="text-[#D4AF37] font-bold text-base">R$ 41,50 por pessoa</span>
                      </div>
                      <p className="text-gray-300">
                        O valor padrão de <strong>R$ 41,50</strong> é válido para até <strong>10 dias de permanência</strong> na Vila de Jericoacoara. Para períodos superiores, aplica-se acréscimo diário regulamentado pela prefeitura.
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                      <strong className="text-[#D4AF37] text-sm block mb-2">Quem tem direito à Isenção da TTS (Legislação Municipal):</strong>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300 list-disc pl-4">
                        <li><strong>Crianças com até 12 anos</strong> de idade;</li>
                        <li><strong>Idosos com mais de 60 anos</strong> de idade;</li>
                        <li><strong>Pessoas com Deficiência (PCD)</strong>, mediante apresentação de laudo médico;</li>
                        <li><strong>Moradores residentes</strong> no município de Jijoca de Jericoacoara e familiares diretos;</li>
                        <li><strong>Trabalhadores e prestadores de serviço</strong> com vínculo empregatício ou atuação profissional comprovada no local;</li>
                        <li><strong>Proprietários de imóveis ou estabelecimentos</strong> comerciais na vila.</li>
                      </ul>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] text-gray-400">
                      <strong className="text-white">Comprovação e Emissão Obrigatória:</strong> É obrigatória a apresentação de documento oficial com foto, laudo médico (PCD) ou comprovante de residência/vínculo profissional. A geração do boleto/código de pagamento ou a solicitação de isenção deve ser realizada previamente no <strong>Site Oficial da Prefeitura Municipal de Jijoca de Jericoacoara</strong> ou nos postos de atendimento fiscal instalados na entrada da vila e do município.
                    </div>
                  </div>
                </section>

                {/* 8. CANCELAMENTO E REEMBOLSO */}
                <section id="cancelamento" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] block">Garantia Oficial</span>
                      <h2 className="text-xl font-bold text-white">8. Política de Cancelamento, Remarcação e Reembolso</h2>
                    </div>
                  </div>

                  <p className="mb-4 text-xs sm:text-sm text-gray-300">
                    Nossa política segue o Artigo 49 do Código de Defesa do Consumidor e as diretrizes da Embratur/Cadastur:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-emerald-500/30">
                      <span className="text-emerald-400 font-bold block mb-1">Até 7 Dias Antes</span>
                      <strong className="text-base text-white block mb-1">100% de Reembolso</strong>
                      <p className="text-gray-400 text-[11px]">Cancelamento com antecedência igual ou superior a 7 dias da viagem: estorno integral imediato sem multas.</p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/30">
                      <span className="text-amber-400 font-bold block mb-1">De 7 Dias a 48h Antes</span>
                      <strong className="text-base text-white block mb-1">Voucher ou 50%</strong>
                      <p className="text-gray-400 text-[11px]">Opção entre crédito em voucher integral válido por 12 meses para remarcação ou estorno com retenção de 50%.</p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-red-500/30">
                      <span className="text-red-400 font-bold block mb-1">Menos de 48h / No-Show</span>
                      <strong className="text-base text-white block mb-1">Sem Devolução</strong>
                      <p className="text-gray-400 text-[11px]">Veículo e motorista credenciado já estão bloqueados exclusivamente, impossibilitando realocação na frota.</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-gray-400">
                    <strong className="text-white">Força Maior ou Interdição Oficial:</strong> Em situações de fechamento de vias pelo ICMBio, Defesa Civil ou condições climáticas extremas comprovadas, a agência oferecerá nova data de execução ou devolução proporcional.
                  </div>
                </section>

                {/* 9. CONDUTA E PRESERVAÇÃO */}
                <section id="conduta" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">9. Deveres do Passageiro e Preservação Ambiental</h2>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-gray-300">
                    <p>O Parque Nacional de Jericoacoara é uma unidade de conservação federal com regras rígidas de preservação:</p>
                    <ul className="space-y-2 list-disc pl-5 text-xs">
                      <li><strong>Documentação Obrigatória:</strong> É obrigatória a apresentação de documento de identidade oficial com foto no ato do embarque.</li>
                      <li><strong>Cinto de Segurança:</strong> Obrigatório o uso de cinto de segurança em todos os veículos e posições regulamentadas.</li>
                      <li><strong>Preservação Ambiental:</strong> É expressamente proibido descartar qualquer tipo de resíduo nas dunas, lagoas e restingas. Recolha todo o seu lixo.</li>
                      <li><strong>Conduta a Bordo:</strong> É vedado o consumo de substâncias ilícitas ou comportamento que coloque em risco a condução do veículo pelo motorista. A agência se reserva o direito de interromper o serviço em caso de desrespeito grave.</li>
                    </ul>
                  </div>
                </section>

                {/* 10. LIMITES DE RESPONSABILIDADE */}
                <section id="responsabilidades" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">10. Limites de Responsabilidade</h2>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                    <p>
                      <strong>Objetos Pessoais:</strong> A agência não se responsabiliza por perda, esquecimento ou avarias de joias, equipamentos eletrônicos e quantias em dinheiro deixados nos veículos sem declaração formal prévia. Mantemos serviço voluntário de achados e perdidos com devolução facilitada.
                    </p>
                    <p>
                      <strong>Fatores Externos de Tráfego:</strong> Não nos responsabilizamos por atrasos decorrentes de acidentes em rodovias estaduais alheios à nossa condução, bloqueios de manifestações populares ou atrasos operacionais decorrentes de companhias aéreas.
                    </p>
                  </div>
                </section>

                {/* 11. ALTERAÇÕES DOS TERMOS */}
                <section id="modificacoes" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">11. Alterações e Atualizações Contratuais</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    A Jericoacoara Premium reserva-se o direito de atualizar estes termos periodicamente para refletir mudanças regulatórias, fiscais ou melhorias operacionais. A versão em vigor no momento da confirmação da reserva rege a prestação dos serviços contratados.
                  </p>
                </section>

                {/* 12. LEGISLAÇÃO E FORO */}
                <section id="foro" className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">12. Legislação Aplicável e Foro de Eleição</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Este contrato é regido exclusivamente pelas Leis da República Federativa do Brasil, em particular o Código de Defesa do Consumidor (Lei Federal nº 8.078/1990) e o Código Civil Brasileiro. Fica eleito o Foro da Comarca de Jijoca de Jericoacoara ou Fortaleza, Estado do Ceará, com exclusão expressa de qualquer outro, por mais privilegiado que seja, para dirimir eventuais controvérsias judiciais decorrentes desta relação.
                  </p>
                </section>

                {/* CTA FINAL DE APOIO */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Tem dúvidas sobre regras de transfers ou passeios?</h3>
                    <p className="text-xs text-gray-400">Nossa equipe de concierge está à disposição no WhatsApp para lhe atender.</p>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Falar com Concierge
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
