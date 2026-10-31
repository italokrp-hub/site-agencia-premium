#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const templatePath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] Erro: dist/index.html não encontrado. Execute o vite build primeiro.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(templatePath, 'utf8');

const SITE_URL = 'https://www.jericoacoarapremium.com';
const WHATSAPP_URL = 'https://wa.me/5588988463182?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20e%20reserva%20de%20transfer%20ou%20passeio%20em%20Jericoacoara.';
const CADASTUR_TEXT = 'CADASTUR: 51.790.615/0001-08 | Jericoacoara Premium Receptivo & Turismo';

// Shared Header Navigation HTML
function getHeaderNav() {
  return `
    <header class="bg-[#0B1517] text-white border-b border-emerald-900/40 sticky top-0 z-50 py-3.5 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-white font-bold text-lg tracking-wider" aria-label="Jericoacoara Premium Home">
          <span class="text-[#D4AF37]">JERICOACOARA</span>
          <span class="text-xs uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-black tracking-widest border border-[#D4AF37]/30">PREMIUM</span>
        </a>
        <nav aria-label="Navegação Principal" class="hidden md:flex items-center gap-6 text-sm text-gray-200">
          <a href="/passeios-jericoacoara" class="hover:text-[#D4AF37] transition-colors">Passeios</a>
          <a href="/transfer-fortaleza-jericoacoara" class="hover:text-[#D4AF37] transition-colors">Transfer Fortaleza</a>
          <a href="/transfer-aeroporto-jericoacoara" class="hover:text-[#D4AF37] transition-colors">Transfer Aeroporto</a>
          <a href="/roteiro-jericoacoara" class="hover:text-[#D4AF37] transition-colors">Roteiro Jeri</a>
          <a href="/faq" class="hover:text-[#D4AF37] transition-colors">FAQ</a>
        </nav>
        <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors shadow">
          Reservar via WhatsApp
        </a>
      </div>
    </header>
  `;
}

// Shared Footer HTML
function getFooter(currentPath) {
  return `
    <footer class="bg-[#0B1517] text-gray-300 border-t border-emerald-950/60 pt-12 pb-8 px-4 sm:px-6 mt-16">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-sm">
        <div>
          <p class="font-bold text-white text-base mb-2">Jericoacoara Premium</p>
          <p class="text-xs text-gray-400 mb-3">Receptivo de luxo, transfers 4x4 privativos e compartilhados, e passeios exclusivos no Parque Nacional de Jericoacoara.</p>
          <p class="text-xs text-[#D4AF37] font-semibold">${CADASTUR_TEXT}</p>
        </div>
        <div>
          <p class="font-semibold text-white mb-3">Passeios Exclusivos</p>
          <ul class="space-y-2 text-xs">
            <li><a href="/passeios-jericoacoara" class="hover:text-[#D4AF37]">Todos os Passeios em Jericoacoara</a></li>
            <li><a href="/passeio-lado-leste-jericoacoara" class="hover:text-[#D4AF37]">Passeio Lado Leste (Lagoa do Paraíso)</a></li>
            <li><a href="/passeio-lado-oeste-jericoacoara" class="hover:text-[#D4AF37]">Passeio Lado Oeste (Tatajuba & Mangue Seco)</a></li>
            <li><a href="/passeio-buggy-utv-jericoacoara" class="hover:text-[#D4AF37]">Passeios de Buggy, UTV e Quadriciclo</a></li>
          </ul>
        </div>
        <div>
          <p class="font-semibold text-white mb-3">Transfers 4x4 Oficiais</p>
          <ul class="space-y-2 text-xs">
            <li><a href="/transfer-fortaleza-jericoacoara" class="hover:text-[#D4AF37]">Transfer Fortaleza ↔ Jericoacoara</a></li>
            <li><a href="/transfer-aeroporto-jericoacoara" class="hover:text-[#D4AF37]">Transfer Aeroporto Cruz (JJD) ↔ Jeri</a></li>
            <li><a href="/transfer-jijoca-jericoacoara" class="hover:text-[#D4AF37]">Transfer Jijoca ↔ Jericoacoara</a></li>
            <li><a href="/transfer-prea-jericoacoara" class="hover:text-[#D4AF37]">Transfer Preá ↔ Jericoacoara</a></li>
          </ul>
        </div>
        <div>
          <p class="font-semibold text-white mb-3">Planejamento & Dúvidas</p>
          <ul class="space-y-2 text-xs">
            <li><a href="/roteiro-jericoacoara" class="hover:text-[#D4AF37]">Roteiro Jericoacoara (3, 5 e 7 Dias)</a></li>
            <li><a href="/faq" class="hover:text-[#D4AF37]">Perguntas Frequentes (FAQ 7 Dias)</a></li>
            <li><a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="hover:text-[#D4AF37]">Atendimento 24h via WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto pt-6 border-t border-gray-800/60 text-center text-xs text-gray-500">
        <p>© 2026 Jericoacoara Premium. Todos os direitos reservados. Garantia Oficial — 100% de Reembolso até 7 dias antes da viagem.</p>
      </div>
    </footer>
  `;
}

// Routes Definitions with 100% Complete Technical & Commercial Data
const ROUTES = [
  // 1. Home
  {
    path: '/',
    title: 'Passeios e Transfers em Jericoacoara | Jericoacoara Premium',
    description: 'Reserve transfers 4x4 privativos e compartilhados e passeios em Jericoacoara com agência credenciada CADASTUR, veículos revisados e suporte 24h via WhatsApp.',
    canonical: `${SITE_URL}/`,
    ogImage: `${SITE_URL}/images/hero-jeri-mobile.webp`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Jericoacoara Premium',
      legalName: 'Jericoacoara Premium Transfer e Turismo',
      taxID: '51.790.615/0001-08',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo.webp`,
      image: `${SITE_URL}/images/hero-jeri-mobile.webp`,
      description: 'Agência credenciada CADASTUR especializada em transfers 4x4 privativos e compartilhados e passeios exclusivos em Jericoacoara.',
      telephone: '+5588988463182',
      email: 'contato@jericoacoarapremium.com',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vila de Jericoacoara',
        addressLocality: 'Jericoacoara',
        addressRegion: 'CE',
        postalCode: '62598-000',
        addressCountry: 'BR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -2.7956,
        longitude: -40.514,
      },
      areaServed: [
        { '@type': 'City', name: 'Jericoacoara' },
        { '@type': 'City', name: 'Jijoca de Jericoacoara' },
        { '@type': 'City', name: 'Praia do Preá' },
        { '@type': 'City', name: 'Cruz' },
        { '@type': 'City', name: 'Fortaleza' },
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    },
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <section class="text-center mb-12">
          <span class="inline-block px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-wider mb-4">Agência Credenciada CADASTUR</span>
          <h1 class="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Passeios e Transfers em Jericoacoara com Conforto, Pontualidade e Segurança
          </h1>
          <p class="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            Reserve transfers 4x4 privativos ou compartilhados e os passeios mais cobiçados de Jericoacoara com agência credenciada CADASTUR (${CADASTUR_TEXT}). Frotas modernas de Hilux 4x4, SW4 e Jardineiras com motoristas profissionais e suporte 24h via WhatsApp.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition shadow">
              Falar com Concierge no WhatsApp
            </a>
            <a href="/roteiro-jericoacoara" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl transition">
              Ver Roteiro Recomendado (3 a 7 Dias)
            </a>
          </div>
        </section>

        <!-- Serviços de Transfer -->
        <section class="mb-14">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Transfers Oficiais em Jericoacoara</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Fortaleza ↔ Jeri</h3>
              <p class="text-xs text-gray-600 mb-3">Opção regular compartilhada a partir de <strong>R$ 175,00 por pessoa</strong> ou Hilux 4x4 privativa a partir de <strong>R$ 900,00 por veículo</strong>.</p>
              <a href="/transfer-fortaleza-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Ver detalhes do transfer Fortaleza →</a>
            </article>
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Aeroporto Cruz (JJD) ↔ Jeri</h3>
              <p class="text-xs text-gray-600 mb-3">Recepção no saguão e monitoramento de voo. Compartilhado por <strong>R$ 100,00 por pessoa</strong> ou Hilux privativa por <strong>R$ 275,00 por veículo</strong>.</p>
              <a href="/transfer-aeroporto-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Ver detalhes do Aeroporto JJD →</a>
            </article>
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Jijoca ↔ Jericoacoara</h3>
              <p class="text-xs text-gray-600 mb-3">Travessia segura pelas dunas. Compartilhado por <strong>R$ 60,00 por pessoa</strong> ou Jardineira privativa por <strong>R$ 250,00 por veículo</strong>.</p>
              <a href="/transfer-jijoca-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Ver detalhes do transfer Jijoca →</a>
            </article>
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Preá ↔ Jericoacoara</h3>
              <p class="text-xs text-gray-600 mb-3">Ligação rápida à beira-mar para kitesurfistas e pousadas no Preá. Jardineira privativa por <strong>R$ 250,00 por veículo</strong>.</p>
              <a href="/transfer-prea-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Ver detalhes do transfer Preá →</a>
            </article>
          </div>
        </section>

        <!-- Passeios Principais -->
        <section class="mb-14">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Passeios Mais Desejados de Jericoacoara</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Passeio Lado Leste</h3>
              <p class="text-xs text-gray-600 mb-3">Lagoa do Paraíso, Buraco Azul, Árvore da Preguiça e Preá. A partir de <strong>R$ 75,00 por pessoa</strong> compartilhado ou <strong>R$ 450,00 por veículo</strong> em Buggy privativo.</p>
              <a href="/passeio-lado-leste-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Ver roteiro completo Lado Leste →</a>
            </article>
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Passeio Lado Oeste</h3>
              <p class="text-xs text-gray-600 mb-3">Dunas de Tatajuba, Mangue Seco com cavalos-marinhos e balsa de Guriú. A partir de <strong>R$ 80,00 por pessoa</strong> compartilhado ou <strong>R$ 500,00 por veículo</strong> em Buggy privativo.</p>
              <a href="/passeio-lado-oeste-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Ver roteiro completo Lado Oeste →</a>
            </article>
            <article class="bg-white border rounded-xl p-5 shadow-sm">
              <h3 class="font-bold text-gray-900 text-lg mb-2">Buggy, UTV & Quadriciclo</h3>
              <p class="text-xs text-gray-600 mb-3">Experiência off-road privativa nas dunas e lagoas. Veículos revisados e guias nativos credenciados a partir de <strong>R$ 450,00 por veículo</strong>.</p>
              <a href="/passeio-buggy-utv-jericoacoara" class="text-emerald-700 text-xs font-bold underline">Comparar Buggy, UTV e Quadri →</a>
            </article>
          </div>
        </section>

        <!-- Perguntas Frequentes -->
        <section class="bg-gray-50 border rounded-2xl p-6 sm:p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes (FAQ)</h2>
          <div class="space-y-4 text-sm text-gray-700">
            <div>
              <p class="font-bold text-gray-900">Qual o transfer mais econômico para Jericoacoara?</p>
              <p>O transfer compartilhado de ônibus/van regular a partir de R$ 175,00 por pessoa de Fortaleza, ou a jardineira compartilhada saindo de Jijoca por R$ 60,00 por pessoa.</p>
            </div>
            <div>
              <p class="font-bold text-gray-900">Como funciona o cancelamento com 100% de reembolso?</p>
              <p>Cancelamentos solicitados com até 7 dias de antecedência da viagem têm direito a 100% de reembolso integral sem multas nem burocracia.</p>
            </div>
            <div>
              <p class="font-bold text-gray-900">A agência é credenciada pelo Ministério do Turismo?</p>
              <p>Sim! Somos credenciados pelo CADASTUR sob o CNPJ 51.790.615/0001-08, oferecendo total conformidade legal, seguro passageiro e atendimento 24h.</p>
            </div>
          </div>
          <div class="mt-6 text-center">
            <a href="/faq" class="inline-block text-xs font-bold text-emerald-800 underline">Acessar Central Completa de Dúvidas (FAQ) →</a>
          </div>
        </section>
      </main>
      ${getFooter('/')}
    `
  },

  // 2. Roteiro Jericoacoara
  {
    path: '/roteiro-jericoacoara',
    title: 'Roteiro Jericoacoara 3, 5 e 7 Dias: O Que Fazer e Como Chegar | Guia Oficial',
    description: 'Planeje sua viagem para Jericoacoara: roteiro completo de 3 e 5 dias, comparativo Lado Leste vs Lado Oeste, como chegar saindo de Fortaleza ou Aeroporto JJD e Taxa de Turismo.',
    canonical: `${SITE_URL}/roteiro-jericoacoara`,
    ogImage: `${SITE_URL}/images/tours/leste-completo.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Roteiro Jericoacoara', item: `${SITE_URL}/roteiro-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Roteiro Jericoacoara 3, 5 e 7 Dias: O Que Fazer e Como Chegar',
        description: 'Guia definitivo e prático para planejar sua viagem a Jericoacoara: roteiros dia a dia, logística de transfers e passeios imperdíveis.',
        image: `${SITE_URL}/images/tours/leste-completo.webp`,
        author: { '@type': 'Organization', name: 'Jericoacoara Premium' },
        publisher: { '@type': 'Organization', name: 'Jericoacoara Premium', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.webp` } },
        datePublished: '2026-10-31',
        dateModified: '2026-10-31'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Quantos dias são necessários para conhecer Jericoacoara?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Recomendamos no mínimo 3 a 4 dias inteiros para conhecer as atrações essenciais (Lado Leste e Lado Oeste). Com 5 a 7 dias, você aproveita o vilarejo com calma, incluindo passeios de Buggy nas dunas, Praia do Preá e esportes de vento.'
            }
          },
          {
            '@type': 'Question',
            name: 'Qual o melhor aeroporto para chegar em Jeri?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O Aeroporto Regional de Jericoacoara (JJD), em Cruz, fica a apenas 40 minutos da Vila de Jericoacoara. Caso opte por voar para Fortaleza (FOR), o trajeto leva cerca de 4h30 a 5h em transfer 4x4 privativo.'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Roteiro Jericoacoara</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Roteiro Jericoacoara 3, 5 e 7 Dias: O Que Fazer e Como Chegar
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          Jericoacoara é um dos destinos mais espetaculares do litoral brasileiro. Com lagoas de água doce cristalina, dunas douradas e um pôr do sol inesquecível, este guia reúne tudo o que você precisa para planejar sua viagem passo a passo.
        </p>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Como Chegar a Jericoacoara</h2>
          <p class="text-sm text-gray-700 mb-3">Você possui duas opções principais de chegada aérea:</p>
          <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
            <li><strong>Via Aeroporto de Cruz (JJD):</strong> Apenas 33 km de distância (cerca de 40 a 50 minutos de <a href="/transfer-aeroporto-jericoacoara" class="text-emerald-700 underline font-semibold">transfer 4x4 do Aeroporto de Jeri</a>).</li>
            <li><strong>Via Aeroporto de Fortaleza (FOR):</strong> Cerca de 300 km (aproximadamente 4h30 a 5h em <a href="/transfer-fortaleza-jericoacoara" class="text-emerald-700 underline font-semibold">transfer 4x4 de Fortaleza</a> ou 6h a 7h de ônibus regular).</li>
            <li><strong>Deixando carro próprio em Jijoca:</strong> Se vier dirigindo pela estrada asfaltada, estacione em Jijoca e contrate o <a href="/transfer-jijoca-jericoacoara" class="text-emerald-700 underline font-semibold">transfer 4x4 Jijoca ↔ Jeri</a>.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Roteiro de 3 Dias em Jericoacoara (Essencial)</h2>
          <div class="space-y-4 text-sm text-gray-700">
            <div class="bg-gray-50 p-4 rounded-xl border">
              <p class="font-bold text-gray-900 text-base mb-1">Dia 1: Chegada, Vila de Jeri e Pôr do Sol na Duna</p>
              <p>Chegue na sua pousada, caminhe pelas ruas de areia da Vila de Jeri, almoce em bistrôs locais e termine a tarde subindo a icônica Duna do Pôr do Sol para aplaudir o espetáculo no mar.</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border">
              <p class="font-bold text-gray-900 text-base mb-1">Dia 2: Passeio Lado Leste (Lagoa do Paraíso e Buraco Azul)</p>
              <p>Roteiro completo pelo litoral leste: fotos na Árvore da Preguiça, parada na Praia do Preá, banho nas águas turquesas do Buraco Azul e relaxamento total nas redes dentro da água da Lagoa do Paraíso. Saiba mais no <a href="/passeio-lado-leste-jericoacoara" class="text-emerald-700 underline font-semibold">Passeio Lado Leste</a>.</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border">
              <p class="font-bold text-gray-900 text-base mb-1">Dia 3: Passeio Lado Oeste (Tatajuba e Mangue Seco)</p>
              <p>Aventura off-road: visita ao Mangue Seco com cavalos-marinhos, travessia tradicional de balsa em Guriú e muita emoção nas dunas móveis e toboágua de Tatajuba. Saiba mais no <a href="/passeio-lado-oeste-jericoacoara" class="text-emerald-700 underline font-semibold">Passeio Lado Oeste</a>.</p>
            </div>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Roteiro de 5 a 7 Dias (Experiência VIP Completa)</h2>
          <p class="text-sm text-gray-700 mb-3">Com mais dias, adicione experiências exclusivas:</p>
          <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li><strong>Dia 4:</strong> Passeio privativo de UTV Can-Am ou Buggy pelas dunas secretas (<a href="/passeio-buggy-utv-jericoacoara" class="text-emerald-700 underline font-semibold">ver opções de Buggy e UTV</a>).</li>
            <li><strong>Dia 5:</strong> Caminhada matinal até a Pedra Furada na maré baixa e tarde de kitesurf ou descanso na Praia do Preá (<a href="/transfer-prea-jericoacoara" class="text-emerald-700 underline font-semibold">transfer Preá</a>).</li>
            <li><strong>Dias 6 e 7:</strong> Dia livre para beach clubs exclusivos (Alchymist), passeios de helicóptero e compras no centrinho da vila.</li>
          </ul>
        </section>

        <section class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <h2 class="text-xl font-bold text-emerald-950 mb-2">Quer Montar um Roteiro Personalizado?</h2>
          <p class="text-sm text-emerald-800 mb-4">Nosso concierge local monta seu pacote sob medida com transfer + passeios com desconto exclusivo no PIX.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Chamar Concierge no WhatsApp
          </a>
        </section>
      </main>
      ${getFooter('/roteiro-jericoacoara')}
    `
  },

  // 3. Passeios Jericoacoara (Catálogo Geral)
  {
    path: '/passeios-jericoacoara',
    title: 'Passeios em Jericoacoara: Lado Leste, Oeste, Buggy e UTV | Jericoacoara Premium',
    description: 'Explore a Lagoa do Paraíso, Pedra Furada, Mangue Seco e Tatajuba com guias credenciados em Jericoacoara. Opções privativas e compartilhadas com reserva online.',
    canonical: `${SITE_URL}/passeios-jericoacoara`,
    ogImage: `${SITE_URL}/images/tours/leste-completo.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Passeios em Jericoacoara', item: `${SITE_URL}/passeios-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Passeios Turísticos em Jericoacoara',
        serviceType: 'Passeios Turísticos Off-Road 4x4',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: { '@type': 'City', name: 'Jericoacoara' },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '75.00',
          highPrice: '1200.00',
          offerCount: '6'
        }
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Passeios em Jericoacoara</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Passeios em Jericoacoara: Lado Leste, Lado Oeste, Buggy e UTV
        </h1>
        <p class="text-base text-gray-700 leading-relaxed max-w-3xl mb-10">
          Descubra as mais belas paisagens do Parque Nacional de Jericoacoara com motoristas e guias credenciados pelo CADASTUR. Opções privativas em Buggy, UTV Can-Am, Quadriciclo e SW4, além de opções econômicas em Jardineira compartilhada.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <article class="border rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Mais Procurado</span>
              <h2 class="text-xl font-bold text-gray-900 mt-3 mb-2">Passeio Lado Leste</h2>
              <p class="text-xs text-gray-600 mb-4">Visite a Lagoa do Paraíso com redes na água, Buraco Azul / Lagun Beach, Árvore da Preguiça e Praia do Preá.</p>
              <ul class="text-xs text-gray-700 space-y-1 mb-4">
                <li>• Compartilhado: <strong>R$ 75,00 por pessoa</strong></li>
                <li>• Buggy Privativo (até 4 pessoas): <strong>R$ 450,00 por veículo</strong></li>
                <li>• SW4 VIP (até 6 pessoas): <strong>R$ 600,00 por veículo</strong></li>
              </ul>
            </div>
            <a href="/passeio-lado-leste-jericoacoara" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center transition">
              Ver Roteiro e Reservar Leste →
            </a>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">Aventura & Dunas</span>
              <h2 class="text-xl font-bold text-gray-900 mt-3 mb-2">Passeio Lado Oeste</h2>
              <p class="text-xs text-gray-600 mb-4">Tatajuba com toboágua e tirolesa, balsa rústica no Rio Guriú, mangue seco e dunas com emoção.</p>
              <ul class="text-xs text-gray-700 space-y-1 mb-4">
                <li>• Compartilhado: <strong>R$ 80,00 por pessoa</strong></li>
                <li>• Buggy Privativo (até 4 pessoas): <strong>R$ 500,00 por veículo</strong></li>
                <li>• SW4 VIP (até 6 pessoas): <strong>R$ 700,00 por veículo</strong></li>
              </ul>
            </div>
            <a href="/passeio-lado-oeste-jericoacoara" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center transition">
              Ver Roteiro e Reservar Oeste →
            </a>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">Experiência VIP</span>
              <h2 class="text-xl font-bold text-gray-900 mt-3 mb-2">Buggy, UTV & Quadriciclo</h2>
              <p class="text-xs text-gray-600 mb-4">Pilote seu próprio Quadriciclo ou UTV Can-Am Maverick X3 com guia à frente, ou relaxe a bordo do buggy tradicional.</p>
              <ul class="text-xs text-gray-700 space-y-1 mb-4">
                <li>• Quadriciclo (2 pessoas): <strong>R$ 450,00 por veículo</strong></li>
                <li>• Buggy Privativo (até 4 pessoas): <strong>R$ 450,00 por veículo</strong></li>
                <li>• UTV Can-Am Maverick: <strong>Sob consulta no WhatsApp</strong></li>
              </ul>
            </div>
            <a href="/passeio-buggy-utv-jericoacoara" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center transition">
              Comparar Veículos Off-Road →
            </a>
          </article>
        </div>

        <section class="border-t pt-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Precisa de Transporte até Jericoacoara?</h2>
          <p class="text-sm text-gray-700 mb-4">Conheça nossos serviços de transfers oficiais:</p>
          <div class="flex flex-wrap gap-3 text-xs">
            <a href="/transfer-fortaleza-jericoacoara" class="bg-gray-100 hover:bg-gray-200 font-semibold px-3 py-2 rounded-lg text-gray-800">Transfer Fortaleza ↔ Jeri</a>
            <a href="/transfer-aeroporto-jericoacoara" class="bg-gray-100 hover:bg-gray-200 font-semibold px-3 py-2 rounded-lg text-gray-800">Transfer Aeroporto JJD ↔ Jeri</a>
            <a href="/transfer-jijoca-jericoacoara" class="bg-gray-100 hover:bg-gray-200 font-semibold px-3 py-2 rounded-lg text-gray-800">Transfer Jijoca ↔ Jeri</a>
            <a href="/transfer-prea-jericoacoara" class="bg-gray-100 hover:bg-gray-200 font-semibold px-3 py-2 rounded-lg text-gray-800">Transfer Preá ↔ Jeri</a>
          </div>
        </section>
      </main>
      ${getFooter('/passeios-jericoacoara')}
    `
  },

  // 4. Passeio Lado Leste
  {
    path: '/passeio-lado-leste-jericoacoara',
    title: 'Passeio Lado Leste em Jericoacoara: Lagoa do Paraíso e Buraco Azul | Jericoacoara Premium',
    description: 'Roteiro completo pelo Lado Leste de Jeri: Lagoa do Paraíso, Buraco Azul, Árvore da Preguiça e Praia do Preá. Opções em Buggy, Quadriciclo e Jardineira com guia credenciado.',
    canonical: `${SITE_URL}/passeio-lado-leste-jericoacoara`,
    ogImage: `${SITE_URL}/images/tours/leste-completo.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Passeios em Jericoacoara', item: `${SITE_URL}/passeios-jericoacoara` },
          { '@type': 'ListItem', position: 3, name: 'Passeio Lado Leste', item: `${SITE_URL}/passeio-lado-leste-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Passeio Lado Leste em Jericoacoara',
        serviceType: 'Passeio Turístico Off-Road 4x4',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: { '@type': 'City', name: 'Jericoacoara' },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '75.00',
          highPrice: '600.00',
          offerCount: '4'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Qual o valor do Passeio Lado Leste?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O Passeio Lado Leste custa R$ 75,00 por pessoa na opção compartilhada em Jardineira, ou a partir de R$ 450,00 por veículo no privativo em Buggy (até 4 passageiros) e Quadriciclo (2 passageiros).'
            }
          },
          {
            '@type': 'Question',
            name: 'Quais as paradas do Passeio Lado Leste?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O roteiro inclui paradas na Árvore da Preguiça, Praia do Preá, Buraco Azul ou Lagun Beach, Lagoa Azul / Lagoa do Amâncio e almoço na Lagoa do Paraíso com redes na água.'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <a href="/passeios-jericoacoara" class="underline hover:text-gray-900">Passeios</a> &gt; <span>Lado Leste</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Passeio Lado Leste em Jericoacoara: Lagoa do Paraíso, Buraco Azul e Preá
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          O Passeio Lado Leste é o cartão-postal de Jericoacoara. Visite a famosa Árvore da Preguiça, a charmosa vila de pescadores do Preá, o oásis de água turquesa do Buraco Azul e relaxe nas clássicas redes montadas dentro da Lagoa do Paraíso.
        </p>

        <!-- Ficha Técnica -->
        <section class="bg-gray-50 border rounded-2xl p-6 mb-8 text-sm">
          <h2 class="font-bold text-gray-900 text-lg mb-3">Ficha Técnica do Roteiro Leste</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span class="text-gray-500">Duração:</span> <strong>6h a 7h (aproximadamente)</strong></div>
            <div><span class="text-gray-500">Horário de Saída:</span> <strong>Entre 08h30 e 09h00</strong></div>
            <div><span class="text-gray-500">Embarque:</span> <strong>Direto na sua pousada em Jericoacoara</strong></div>
            <div><span class="text-gray-500">Retorno:</span> <strong>Por volta das 15h30 a 16h00</strong></div>
          </div>
        </section>

        <!-- Tarifas -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarifas Transparentes — Passeio Lado Leste</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Compartilhado</span>
              <p class="font-bold text-gray-900 text-base mt-2">Jardineira 4x4 Coletiva</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 75,00 <span class="text-xs font-normal text-gray-600">por pessoa</span></p>
              <p class="text-xs text-gray-500">Desconto de 5% no PIX. Motorista credenciado e reserva garantida.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded">Privativo Exclusivo</span>
              <p class="font-bold text-gray-900 text-base mt-2">Buggy Tradicional (até 4 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 450,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
              <p class="text-xs text-gray-500">Total flexibilidade de tempo em cada atração para você e seu grupo.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Off-Road Individual</span>
              <p class="font-bold text-gray-900 text-base mt-2">Quadriciclo 4x4 (2 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 450,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
              <p class="text-xs text-gray-500">Pilote com guia credenciado à frente liderando a trilha.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">VIP Máximo Conforto</span>
              <p class="font-bold text-gray-900 text-base mt-2">Toyota SW4 Ar-Condicionado (até 6 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 600,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
              <p class="text-xs text-gray-500">Conforto total com ar-condicionado durante todo o roteiro.</p>
            </div>
          </div>
        </section>

        <!-- Roteiro Parada a Parada -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Roteiro Parada a Parada</h2>
          <ol class="space-y-3 text-sm text-gray-700 list-decimal pl-5">
            <li><strong>Árvore da Preguiça:</strong> Famosa árvore esculpida pelos ventos alísios que parece repousar na areia da praia.</li>
            <li><strong>Praia do Preá:</strong> Vila costeira autêntica e polo mundial dos esportes de vento (kitesurf e wingfoil).</li>
            <li><strong>Buraco Azul ou Lagun Beach:</strong> Oásis de águas de tom azul-turquesa cristalino, com trampolim e estrutura de restaurante.</li>
            <li><strong>Lagoa Azul / Lagoa do Amâncio:</strong> Banho refrescante em lagoa natural cercada por dunas preservadas.</li>
            <li><strong>Lagoa do Paraíso:</strong> Parada principal do dia para almoço, descanso nas redes na água e visita a beach clubs.</li>
          </ol>
        </section>

        <!-- CTA & FAQ -->
        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Reserve o Passeio Lado Leste</h2>
          <p class="text-xs text-gray-600 mb-4">Reserva 100% garantida com motoristas credenciados CADASTUR e política de reembolso integral até 7 dias.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Reservar Lado Leste no WhatsApp
          </a>
        </section>

        <section class="border-t pt-6 text-xs text-gray-600">
          <p>Conheça também: <a href="/passeio-lado-oeste-jericoacoara" class="underline font-semibold text-emerald-800">Passeio Lado Oeste</a> | <a href="/passeio-buggy-utv-jericoacoara" class="underline font-semibold text-emerald-800">Passeios de Buggy e UTV</a> | <a href="/roteiro-jericoacoara" class="underline font-semibold text-emerald-800">Roteiro de Viagem</a></p>
        </section>
      </main>
      ${getFooter('/passeio-lado-leste-jericoacoara')}
    `
  },

  // 5. Passeio Lado Oeste
  {
    path: '/passeio-lado-oeste-jericoacoara',
    title: 'Passeio Lado Oeste em Jericoacoara: Tatajuba e Mangue Seco | Jericoacoara Premium',
    description: 'Aventura e emoção nas Dunas de Tatajuba, Mangue Seco, balsa no Rio Guriú e toboágua. Passeio privativo e compartilhado em Jericoacoara com guias credenciados.',
    canonical: `${SITE_URL}/passeio-lado-oeste-jericoacoara`,
    ogImage: `${SITE_URL}/images/tours/tatajuba.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Passeios em Jericoacoara', item: `${SITE_URL}/passeios-jericoacoara` },
          { '@type': 'ListItem', position: 3, name: 'Passeio Lado Oeste', item: `${SITE_URL}/passeio-lado-oeste-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Passeio Lado Oeste em Jericoacoara',
        serviceType: 'Passeio Turístico Off-Road 4x4',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: { '@type': 'City', name: 'Jericoacoara' },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '80.00',
          highPrice: '700.00',
          offerCount: '4'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Qual a diferença entre o Lado Leste e o Lado Oeste?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O Lado Leste é focado em relaxamento, redes na água e fotos na Lagoa do Paraíso e Buraco Azul. O Lado Oeste é mais aventureiro, com travessia rústica de balsa em Guriú, dunas móveis e toboágua em Tatajuba.'
            }
          },
          {
            '@type': 'Question',
            name: 'Quanto custa o Passeio Lado Oeste?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O valor é de R$ 80,00 por pessoa na Jardineira compartilhada, ou a partir de R$ 500,00 por veículo no Buggy privativo (até 4 passageiros).'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <a href="/passeios-jericoacoara" class="underline hover:text-gray-900">Passeios</a> &gt; <span>Lado Oeste</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Passeio Lado Oeste em Jericoacoara: Tatajuba, Mangue Seco e Guriú
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          Muita adrenalina e paisagens intocadas! O Passeio Lado Oeste inclui travessia rústica de balsa com barqueiros nativos em Guriú, manguezal histórico com cavalos-marinhos, dunas móveis com emoção e as famosas tirolesas e toboáguas na Lagoa de Tatajuba.
        </p>

        <!-- Ficha Técnica -->
        <section class="bg-gray-50 border rounded-2xl p-6 mb-8 text-sm">
          <h2 class="font-bold text-gray-900 text-lg mb-3">Ficha Técnica do Roteiro Oeste</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span class="text-gray-500">Duração:</span> <strong>5h a 6h (aproximadamente)</strong></div>
            <div><span class="text-gray-500">Horário de Saída:</span> <strong>Entre 08h30 e 09h00</strong></div>
            <div><span class="text-gray-500">Embarque:</span> <strong>Direto na porta da sua pousada em Jeri</strong></div>
            <div><span class="text-gray-500">Retorno:</span> <strong>Por volta das 14h30 a 15h30</strong></div>
          </div>
        </section>

        <!-- Tarifas -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarifas Transparentes — Passeio Lado Oeste</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Compartilhado</span>
              <p class="font-bold text-gray-900 text-base mt-2">Jardineira 4x4 Coletiva</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 80,00 <span class="text-xs font-normal text-gray-600">por pessoa</span></p>
              <p class="text-xs text-gray-500">A opção mais econômica com motorista nativo credenciado.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded">Privativo Tradicional</span>
              <p class="font-bold text-gray-900 text-base mt-2">Buggy Off-Road (até 4 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 500,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
              <p class="text-xs text-gray-500">Opção "com emoção" pelas dunas de Tatajuba inclusa sob sua escolha.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Aventura Individual</span>
              <p class="font-bold text-gray-900 text-base mt-2">Quadriciclo 4x4 (2 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 500,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
              <p class="text-xs text-gray-500">Pilote com guia liderando pela beira da praia e dunas.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">VIP Climatizado</span>
              <p class="font-bold text-gray-900 text-base mt-2">Toyota SW4 Ar-Condicionado (até 6 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 700,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
              <p class="text-xs text-gray-500">Conforto absoluto para famílias e grupos exigentes.</p>
            </div>
          </div>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Reserve o Passeio Lado Oeste</h2>
          <p class="text-xs text-gray-600 mb-4">Garantia oficial de reembolso integral até 7 dias antes do passeio.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Reservar Lado Oeste no WhatsApp
          </a>
        </section>

        <section class="border-t pt-6 text-xs text-gray-600">
          <p>Conheça também: <a href="/passeio-lado-leste-jericoacoara" class="underline font-semibold text-emerald-800">Passeio Lado Leste</a> | <a href="/passeios-jericoacoara" class="underline font-semibold text-emerald-800">Todos os Passeios</a> | <a href="/roteiro-jericoacoara" class="underline font-semibold text-emerald-800">Roteiro Recomendado</a></p>
        </section>
      </main>
      ${getFooter('/passeio-lado-oeste-jericoacoara')}
    `
  },

  // 6. Buggy, UTV e Quadriciclo
  {
    path: '/passeio-buggy-utv-jericoacoara',
    title: 'Passeio de Buggy, UTV e Quadriciclo em Jericoacoara | Privativo e Credenciado',
    description: 'Passeios privativos off-road em Jericoacoara: compare Buggy, UTV Can-Am Maverick e Quadriciclo 4x4. Roteiros Leste e Oeste com guias nativos credenciados.',
    canonical: `${SITE_URL}/passeio-buggy-utv-jericoacoara`,
    ogImage: `${SITE_URL}/images/tours/buggy-dunas.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Passeios em Jericoacoara', item: `${SITE_URL}/passeios-jericoacoara` },
          { '@type': 'ListItem', position: 3, name: 'Buggy, UTV e Quadriciclo', item: `${SITE_URL}/passeio-buggy-utv-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Passeios de Buggy, UTV e Quadriciclo em Jericoacoara',
        serviceType: 'Passeios Off-Road Privativos',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: { '@type': 'City', name: 'Jericoacoara' },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '450.00',
          highPrice: '1200.00',
          offerCount: '3'
        }
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <a href="/passeios-jericoacoara" class="underline hover:text-gray-900">Passeios</a> &gt; <span>Buggy, UTV e Quadriciclo</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Passeios de Buggy, UTV Can-Am e Quadriciclo em Jericoacoara
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          Viva a experiência off-road definitiva em Jericoacoara. Compare as melhores opções de veículos privativos para explorar tanto o Lado Leste quanto o Lado Oeste: Buggy clássico com motorista experiente, Quadriciclo 4x4 pilotado por você ou o luxo e a potência extrema do UTV Can-Am Maverick X3.
        </p>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm">
          <div class="border rounded-2xl p-5 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">Buggy Tradicional</h2>
            <p class="text-xs text-gray-600 mb-3">O clássico absoluto de Jericoacoara. Capacidade para até 4 passageiros, com motorista nativo credenciado.</p>
            <p class="text-emerald-700 font-bold text-lg mb-2">A partir de R$ 450,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Leste: R$ 450,00 por veículo</li>
              <li>• Oeste: R$ 500,00 por veículo</li>
            </ul>
          </div>
          <div class="border rounded-2xl p-5 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">Quadriciclo 4x4</h2>
            <p class="text-xs text-gray-600 mb-3">Você no controle! Autonomia de pilotagem para 2 pessoas (condutor + garupa) com guia à frente.</p>
            <p class="text-emerald-700 font-bold text-lg mb-2">A partir de R$ 450,00 <span class="text-xs font-normal text-gray-600">por veículo</span></p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• CNH B obrigatória para o condutor</li>
              <li>• Equipamentos de proteção inclusos</li>
            </ul>
          </div>
          <div class="border rounded-2xl p-5 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">UTV Can-Am Maverick</h2>
            <p class="text-xs text-gray-600 mb-3">A máquina off-road mais rápida e confortável do mundo. Suspensão de alta absorção e segurança avançada.</p>
            <p class="text-emerald-700 font-bold text-lg mb-2">Sob consulta <span class="text-xs font-normal text-gray-600">no WhatsApp</span></p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Trilha VIP exclusiva</li>
              <li>• Guia de suporte técnico</li>
            </ul>
          </div>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Garanta seu Veículo com Antecedência</h2>
          <p class="text-xs text-gray-600 mb-4">Durante a alta temporada os veículos privativos esgotam rápido. Reserve agora com 5% de desconto no PIX.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Consultar Disponibilidade no WhatsApp
          </a>
        </section>
      </main>
      ${getFooter('/passeio-buggy-utv-jericoacoara')}
    `
  },

  // 7. Transfer Fortaleza ↔ Jeri
  {
    path: '/transfer-fortaleza-jericoacoara',
    title: 'Transfer Fortaleza para Jericoacoara | 4x4 Privativo e Compartilhado',
    description: 'Reserve seu transfer de Fortaleza (Aeroporto FOR ou hotéis) para Jericoacoara em veículo 4x4 credenciado, com seguro, conforto e suporte 24h via WhatsApp.',
    canonical: `${SITE_URL}/transfer-fortaleza-jericoacoara`,
    ogImage: `${SITE_URL}/images/hero-jeri-mobile.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Transfer Fortaleza Jericoacoara', item: `${SITE_URL}/transfer-fortaleza-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Transfer Fortaleza para Jericoacoara',
        serviceType: 'Transporte Turístico Terrestre e Off-Road',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: [
          { '@type': 'City', name: 'Fortaleza' },
          { '@type': 'City', name: 'Jericoacoara' }
        ],
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '175.00',
          highPrice: '2200.00',
          offerCount: '4'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Quanto tempo dura a viagem de Fortaleza para Jericoacoara?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No transfer 4x4 privativo (Hilux ou SW4), o tempo médio é de 4h30 a 5 horas. No transfer compartilhado de ônibus/van regular, a duração varia entre 6h e 7 horas devido às paradas de embarque e transbordo seguro para as dunas.'
            }
          },
          {
            '@type': 'Question',
            name: 'Qual o valor do transfer de Fortaleza para Jeri?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O transfer compartilhado regular custa R$ 175,00 por pessoa (ida) ou R$ 340,00 por pessoa (ida e volta). O transfer privativo em Hilux 4x4 (até 4 passageiros) custa R$ 900,00 por veículo (ida) ou R$ 1.800,00 por veículo (ida e volta).'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Transfer Fortaleza Jericoacoara</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Transfer Fortaleza para Jericoacoara: 4x4 Privativo e Opção Compartilhada
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          Viagem segura, pontual e confortável entre Fortaleza (Aeroporto Pinto Martins FOR ou hotéis da Orla) e a Vila de Jericoacoara. Escolha entre o serviço privativo porta a porta em Hilux 4x4 ou a opção compartilhada econômica com embarque regular.
        </p>

        <!-- Ficha Técnica -->
        <section class="bg-gray-50 border rounded-2xl p-6 mb-8 text-sm">
          <h2 class="font-bold text-gray-900 text-lg mb-3">Ficha Técnica da Rota Fortaleza ↔ Jeri</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span class="text-gray-500">Distância Total:</span> <strong>Aproximadamente 300 km</strong></div>
            <div><span class="text-gray-500">Duração Privativo 4x4:</span> <strong>4h30 a 5 horas</strong></div>
            <div><span class="text-gray-500">Duração Compartilhado:</span> <strong>6h a 7 horas</strong></div>
            <div><span class="text-gray-500">Embarque em Fortaleza:</span> <strong>Aeroporto Pinto Martins (FOR) ou hotéis da Orla (Beira-Mar, Meireles, Iracema)</strong></div>
            <div><span class="text-gray-500">Desembarque em Jeri:</span> <strong>Direto na porta da sua pousada ou hotel</strong></div>
          </div>
        </section>

        <!-- Tarifas -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarifas Transparentes — Fortaleza ↔ Jericoacoara</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Mais Econômico</span>
              <p class="font-bold text-gray-900 text-base mt-2">Ônibus/Van Regular Compartilhado</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 175,00 <span class="text-xs font-normal text-gray-600">por pessoa (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 340,00 por pessoa</strong></p>
              <p class="text-xs text-gray-500">Horários fixos diários. Transbordo 4x4 seguro incluso até a pousada.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">4x4 Compartilhado</span>
              <p class="font-bold text-gray-900 text-base mt-2">Hilux 4x4 Coletiva</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 280,00 <span class="text-xs font-normal text-gray-600">por pessoa (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 560,00 por pessoa</strong></p>
              <p class="text-xs text-gray-500">Viagem mais ágil dividindo a caminhonete com outros passageiros.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded">Privativo Exclusivo</span>
              <p class="font-bold text-gray-900 text-base mt-2">Toyota Hilux 4x4 (até 4 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 900,00 <span class="text-xs font-normal text-gray-600">por veículo (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 1.800,00 por veículo</strong></p>
              <p class="text-xs text-gray-500">Horário livre escolhido por você. Busca porta a porta e parada para refeição.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">VIP Máximo Conforto</span>
              <p class="font-bold text-gray-900 text-base mt-2">Toyota SW4 Ar-Condicionado (até 6 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 1.100,00 <span class="text-xs font-normal text-gray-600">por veículo (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 2.200,00 por veículo</strong></p>
              <p class="text-xs text-gray-500">Espaço amplo e conforto absoluto para famílias e bagagens.</p>
            </div>
          </div>
        </section>

        <!-- Regras Operacionais -->
        <section class="bg-white border rounded-2xl p-6 mb-8 text-sm text-gray-700 space-y-3">
          <h2 class="font-bold text-gray-900 text-base">Regras Transparentes de Operação</h2>
          <p><strong>Bagagem:</strong> No privativo, até 2 malas despachadas (23kg) + 1 de mão por passageiro. No compartilhado, 1 mala média de até 23kg + 1 mochila de mão por passageiro.</p>
          <p><strong>Crianças:</strong> Crianças de colo até 2 anos completos viajam gratuitamente no colo de um adulto. Cadeirinhas infantis estão disponíveis sob solicitação prévia.</p>
          <p><strong>Atrasos de Voo:</strong> Monitoramos seu voo com tolerância gratuita de até 1 hora de espera no aeroporto sem custo extra.</p>
          <p><strong>Taxa de Turismo (TTS):</strong> A taxa municipal da Prefeitura de Jijoca (R$ 41,50 por visitante) não está inclusa no valor do transfer e deve ser paga previamente online ou no posto de controle.</p>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Reserve seu Transfer de Fortaleza</h2>
          <p class="text-xs text-gray-600 mb-4">Garantia oficial de 100% de reembolso até 7 dias e desconto de 5% no PIX.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Reservar Transfer Fortaleza no WhatsApp
          </a>
        </section>

        <section class="border-t pt-6 text-xs text-gray-600">
          <p>Rotas complementares: <a href="/transfer-aeroporto-jericoacoara" class="underline font-semibold text-emerald-800">Transfer Aeroporto Cruz JJD</a> | <a href="/transfer-jijoca-jericoacoara" class="underline font-semibold text-emerald-800">Transfer Jijoca</a> | <a href="/passeios-jericoacoara" class="underline font-semibold text-emerald-800">Passeios em Jericoacoara</a></p>
        </section>
      </main>
      ${getFooter('/transfer-fortaleza-jericoacoara')}
    `
  },

  // 8. Transfer Aeroporto Regional de Cruz (JJD) ↔ Jeri
  {
    path: '/transfer-aeroporto-jericoacoara',
    title: 'Transfer do Aeroporto de Jericoacoara (JJD) para a Vila | 4x4 Oficial',
    description: 'Chegue com tranquilidade: transfer receptivo do Aeroporto Regional de Jericoacoara (Cruz/JJD) direto para sua pousada na Vila ou Preá com acompanhamento de voo.',
    canonical: `${SITE_URL}/transfer-aeroporto-jericoacoara`,
    ogImage: `${SITE_URL}/images/hero-jeri-mobile.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Transfer Aeroporto Jericoacoara', item: `${SITE_URL}/transfer-aeroporto-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Transfer Aeroporto Regional de Jericoacoara (Cruz/JJD) para a Vila',
        serviceType: 'Transporte Turístico Terrestre e Off-Road',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: [
          { '@type': 'City', name: 'Cruz' },
          { '@type': 'City', name: 'Jericoacoara' }
        ],
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '100.00',
          highPrice: '700.00',
          offerCount: '3'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Qual a distância do Aeroporto de Cruz (JJD) até a Vila de Jeri?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A distância é de apenas 33 km. A viagem leva de 40 a 50 minutos em veículo 4x4 com ar-condicionado direto para a porta da sua pousada.'
            }
          },
          {
            '@type': 'Question',
            name: 'Quanto custa o transfer do Aeroporto JJD?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O transfer compartilhado custa R$ 100,00 por pessoa (ida) ou R$ 200,00 por pessoa (ida e volta). O transfer privativo em Hilux 4x4 (até 4 passageiros) custa R$ 275,00 por veículo (ida) ou R$ 550,00 por veículo (ida e volta).'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Transfer Aeroporto Jericoacoara</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Transfer do Aeroporto de Jericoacoara (Cruz/JJD) para a Vila em 4x4
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          A forma mais rápida e confortável de começar sua viagem a Jericoacoara. Recepção com placa de identificação no saguão do Aeroporto de Cruz (SBJE/JJD), monitoramento em tempo real do seu voo e transporte direto para sua pousada na Vila ou Praia do Preá.
        </p>

        <!-- Ficha Técnica -->
        <section class="bg-gray-50 border rounded-2xl p-6 mb-8 text-sm">
          <h2 class="font-bold text-gray-900 text-lg mb-3">Ficha Técnica da Rota Aeroporto JJD ↔ Jeri</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span class="text-gray-500">Distância:</span> <strong>Apenas 33 km</strong></div>
            <div><span class="text-gray-500">Tempo de Viagem:</span> <strong>40 a 50 minutos</strong></div>
            <div><span class="text-gray-500">Ponto de Embarque:</span> <strong>Saguão de desembarque com placa nominal</strong></div>
            <div><span class="text-gray-500">Ponto de Desembarque:</span> <strong>Porta da pousada em Jeri ou Preá</strong></div>
          </div>
        </section>

        <!-- Tarifas -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarifas Transparentes — Aeroporto Cruz (JJD)</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Compartilhado</span>
              <p class="font-bold text-gray-900 text-base mt-2">4x4 Coletivo</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 100,00 <span class="text-xs font-normal text-gray-600">por pessoa (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 200,00 por pessoa</strong></p>
              <p class="text-xs text-gray-500">Saída sincronizada com a chegada dos voos comerciais (Azul, Gol e Latam).</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded">Privativo Hilux</span>
              <p class="font-bold text-gray-900 text-base mt-2">Toyota Hilux 4x4 (até 4 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 275,00 <span class="text-xs font-normal text-gray-600">por veículo (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 550,00 por veículo</strong></p>
              <p class="text-xs text-gray-500">Veículo exclusivo. Sem espera de outros passageiros.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">VIP SW4</span>
              <p class="font-bold text-gray-900 text-base mt-2">Toyota SW4 Ar-Condicionado (até 6 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 350,00 <span class="text-xs font-normal text-gray-600">por veículo (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 700,00 por veículo</strong></p>
              <p class="text-xs text-gray-500">Conforto executivo para grupos e famílias com bagagem extra.</p>
            </div>
          </div>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Reserve com Monitoramento de Voo</h2>
          <p class="text-xs text-gray-600 mb-4">Caso o voo atrase, nossa equipe acompanha e aguarda gratuitamente por até 1 hora.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Reservar Transfer Aeroporto JJD no WhatsApp
          </a>
        </section>

        <section class="border-t pt-6 text-xs text-gray-600">
          <p>Conheça também: <a href="/transfer-fortaleza-jericoacoara" class="underline font-semibold text-emerald-800">Transfer Fortaleza</a> | <a href="/transfer-prea-jericoacoara" class="underline font-semibold text-emerald-800">Transfer Preá</a> | <a href="/roteiro-jericoacoara" class="underline font-semibold text-emerald-800">Roteiro Completo</a></p>
        </section>
      </main>
      ${getFooter('/transfer-aeroporto-jericoacoara')}
    `
  },

  // 9. Transfer Jijoca ↔ Jeri
  {
    path: '/transfer-jijoca-jericoacoara',
    title: 'Transfer Jijoca para Jericoacoara | Hilux e Jardineira 4x4 Credenciada',
    description: 'Travessia oficial pelas dunas de Jijoca até a sua pousada na Vila de Jericoacoara em veículos 4x4 autorizados, opções privativas ou compartilhadas.',
    canonical: `${SITE_URL}/transfer-jijoca-jericoacoara`,
    ogImage: `${SITE_URL}/images/hero-jeri-mobile.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Transfer Jijoca Jericoacoara', item: `${SITE_URL}/transfer-jijoca-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Transfer Jijoca para Jericoacoara',
        serviceType: 'Transporte Turístico Off-Road 4x4',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: [
          { '@type': 'City', name: 'Jijoca de Jericoacoara' },
          { '@type': 'City', name: 'Jericoacoara' }
        ],
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '60.00',
          highPrice: '500.00',
          offerCount: '2'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Carro de passeio comum chega em Jericoacoara?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Não. O trecho entre Jijoca e Jericoacoara é composto exclusivamente por dunas e areia fofa, acessível apenas por veículos 4x4 com tração integral e motoristas experientes. Os viajantes deixam seus carros nos estacionamentos seguros de Jijoca e seguem de transfer.'
            }
          },
          {
            '@type': 'Question',
            name: 'Qual o valor da travessia de Jijoca para Jericoacoara?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O valor compartilhado em Jardineira 4x4 é de R$ 60,00 por pessoa (ida) ou R$ 120,00 por pessoa (ida e volta). O veículo privativo para até 10 pessoas custa R$ 250,00 por veículo (ida) ou R$ 500,00 por veículo (ida e volta).'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Transfer Jijoca Jericoacoara</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Transfer Jijoca para Jericoacoara: Travessia Oficial pelas Dunas em 4x4
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          A travessia tradicional e segura entre a cidade de Jijoca de Jericoacoara e a Vila de Jeri. Para quem viaja com carro próprio até o fim do asfalto, nossos motoristas credenciados fazem o embarque no estacionamento de apoio e a travessia das dunas com conforto e segurança.
        </p>

        <section class="bg-gray-50 border rounded-2xl p-6 mb-8 text-sm">
          <h2 class="font-bold text-gray-900 text-lg mb-3">Ficha Técnica da Rota Jijoca ↔ Jeri</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span class="text-gray-500">Distância:</span> <strong>Cerca de 22 km de trilhas de duna</strong></div>
            <div><span class="text-gray-500">Tempo de Percurso:</span> <strong>Aproximadamente 40 minutos</strong></div>
            <div><span class="text-gray-500">Ponto de Embarque:</span> <strong>Estacionamentos credenciados ou centro de Jijoca</strong></div>
            <div><span class="text-gray-500">Ponto de Desembarque:</span> <strong>Porta da sua pousada na Vila de Jeri</strong></div>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarifas Transparentes — Jijoca ↔ Jericoacoara</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Compartilhado</span>
              <p class="font-bold text-gray-900 text-base mt-2">Jardineira 4x4 Coletiva</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 60,00 <span class="text-xs font-normal text-gray-600">por pessoa (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 120,00 por pessoa</strong></p>
              <p class="text-xs text-gray-500">A opção mais tradicional e econômica para atravessar o Parque Nacional.</p>
            </div>
            <div class="border rounded-xl p-4 bg-white">
              <span class="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded">Privativo</span>
              <p class="font-bold text-gray-900 text-base mt-2">Jardineira / Hilux Privativa (até 10 pessoas)</p>
              <p class="text-emerald-700 font-black text-xl my-1">R$ 250,00 <span class="text-xs font-normal text-gray-600">por veículo (ida)</span></p>
              <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 500,00 por veículo</strong></p>
              <p class="text-xs text-gray-500">Ideal para famílias e grupos de amigos com bagagens volumosas.</p>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">* Saídas noturnas entre 18h e 06h têm taxa adicional de R$ 20,00.</p>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Reserve sua Travessia de Jijoca</h2>
          <p class="text-xs text-gray-600 mb-4">Garantia oficial de 100% de reembolso até 7 dias e desconto no PIX.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Reservar Transfer Jijoca no WhatsApp
          </a>
        </section>
      </main>
      ${getFooter('/transfer-jijoca-jericoacoara')}
    `
  },

  // 10. Transfer Preá ↔ Jeri
  {
    path: '/transfer-prea-jericoacoara',
    title: 'Transfer Preá e Jericoacoara | Transporte 4x4 Privativo e Seguro',
    description: 'Transporte rápido e seguro em 4x4 entre a Praia do Preá, Aeroporto JJD e a Vila de Jericoacoara para turistas e praticantes de kitesurf.',
    canonical: `${SITE_URL}/transfer-prea-jericoacoara`,
    ogImage: `${SITE_URL}/images/hero-jeri-mobile.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Transfer Preá Jericoacoara', item: `${SITE_URL}/transfer-prea-jericoacoara` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Transfer Praia do Preá para Jericoacoara',
        serviceType: 'Transporte Turístico Off-Road 4x4',
        provider: { '@type': 'TravelAgency', name: 'Jericoacoara Premium', url: `${SITE_URL}/` },
        areaServed: [
          { '@type': 'City', name: 'Praia do Preá' },
          { '@type': 'City', name: 'Jericoacoara' }
        ],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: '250.00'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Qual o tempo de deslocamento entre o Preá e Jericoacoara?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O trajeto é feito à beira-mar e por trilhas de areia, levando cerca de 25 a 30 minutos em veículo 4x4 com tração integral.'
            }
          },
          {
            '@type': 'Question',
            name: 'É possível transportar pranchas e equipamentos de kitesurf?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! Nossos veículos privativos têm amplo espaço e suportes adequados para o transporte seguro de pranchas de kitesurf, wingfoil e bagagens volumosas.'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Transfer Preá Jericoacoara</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Transfer Praia do Preá para Jericoacoara em 4x4 Privativo
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-8">
          Ligação rápida e confortável à beira-mar entre a Praia do Preá (capital do kitesurf e pousadas boutique de luxo) e a Vila de Jericoacoara. Atendemos praticantes de esportes náuticos com acomodação para pranchas e transfers do Aeroporto JJD.
        </p>

        <section class="bg-gray-50 border rounded-2xl p-6 mb-8 text-sm">
          <h2 class="font-bold text-gray-900 text-lg mb-3">Ficha Técnica da Rota Preá ↔ Jeri</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span class="text-gray-500">Distância:</span> <strong>Cerca de 12 km à beira-mar</strong></div>
            <div><span class="text-gray-500">Duração Média:</span> <strong>25 a 30 minutos</strong></div>
            <div><span class="text-gray-500">Embarque:</span> <strong>Direto na sua pousada no Preá ou Jeri</strong></div>
            <div><span class="text-gray-500">Equipamentos:</span> <strong>Transporte de pranchas e kites incluso</strong></div>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarifa Privativa — Preá ↔ Jericoacoara</h2>
          <div class="border rounded-xl p-5 bg-white max-w-md">
            <span class="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded">Privativo Exclusivo</span>
            <p class="font-bold text-gray-900 text-base mt-2">Jardineira / Hilux Privativa (até 10 pessoas)</p>
            <p class="text-emerald-700 font-black text-2xl my-1">R$ 250,00 <span class="text-xs font-normal text-gray-600">por veículo (ida)</span></p>
            <p class="text-xs text-gray-500 mb-2">Ida e Volta: <strong>R$ 500,00 por veículo</strong></p>
            <p class="text-xs text-gray-500">Desconto de 5% no PIX. Motoristas credenciados experientes nas marés.</p>
          </div>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Reserve seu Transfer do Preá</h2>
          <p class="text-xs text-gray-600 mb-4">Garantia oficial de 100% de reembolso até 7 dias antes do serviço.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Reservar Transfer Preá no WhatsApp
          </a>
        </section>
      </main>
      ${getFooter('/transfer-prea-jericoacoara')}
    `
  },

  // 11. FAQ Central
  {
    path: '/faq',
    title: 'FAQ Jericoacoara Premium | Dúvidas sobre Transfers, Passeios e Cancelamento',
    description: 'Tire todas as suas dúvidas sobre bagagem, horários, atrasos de voo, taxa de turismo, crianças e política de cancelamento com reembolso garantido.',
    canonical: `${SITE_URL}/faq`,
    ogImage: `${SITE_URL}/images/hero-jeri-mobile.webp`,
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Qual é a política de cancelamento e reembolso?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Cancelamentos solicitados com até 7 dias de antecedência da viagem têm direito a 100% de reembolso integral. Entre 7 dias e 48 horas antes da viagem, é feita a retenção de 50% ou emissão de voucher 100% para remarcação futura. Cancelamentos com menos de 48 horas ou não comparecimento (no-show) não são reembolsáveis.'
            }
          },
          {
            '@type': 'Question',
            name: 'Qual é o limite de bagagem permitido nos transfers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No transfer privativo, permitimos até 2 malas despachadas (até 23kg cada) mais 1 mala de mão por passageiro. No transfer compartilhado, o limite é de 1 mala média (até 23kg) mais 1 mochila de mão por assento reservado.'
            }
          },
          {
            '@type': 'Question',
            name: 'O que acontece se meu voo para Fortaleza ou Cruz atrasar?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Nossa equipe operacional monitora os voos em tempo real pelo código informado na reserva. Em transfers privativos, oferecemos até 1 hora de espera gratuita inclusa sem qualquer custo adicional.'
            }
          },
          {
            '@type': 'Question',
            name: 'Crianças pagam valor integral? É possível solicitar cadeirinha?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Crianças de colo de até 2 anos completos viajam gratuitamente no colo de um adulto. A partir de 2 anos, ocupam assento individual regulamentado. Disponibilizamos cadeirinha infantil e assento de elevação mediante solicitação prévia.'
            }
          },
          {
            '@type': 'Question',
            name: 'O que é a Taxa de Turismo Sustentável (TTS) de Jericoacoara?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A TTS é um tributo municipal obrigatório cobrado pela Prefeitura de Jijoca de Jericoacoara de todos os visitantes (R$ 41,50 por pessoa por até 10 dias). Ela NÃO está inclusa nos valores de transfer ou passeios e pode ser gerada previamente no site oficial da prefeitura.'
            }
          },
          {
            '@type': 'Question',
            name: 'A Jericoacoara Premium é uma agência credenciada?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! Somos uma agência oficial credenciada pelo Ministério do Turismo através do CADASTUR sob o CNPJ 51.790.615/0001-08. Todos os nossos veículos possuem seguro passageiro integral (APP) e nossos motoristas são guiados por normas rigorosas de segurança.'
            }
          }
        ]
      }
    ],
    semanticBody: `
      ${getHeaderNav()}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav aria-label="Breadcrumb" class="text-xs text-gray-500 mb-6">
          <a href="/" class="underline hover:text-gray-900">Início</a> &gt; <span>Perguntas Frequentes</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Perguntas Frequentes (FAQ) — Jericoacoara Premium
        </h1>
        <p class="text-base text-gray-700 leading-relaxed mb-10">
          Encontre respostas diretas, transparentes e oficiais sobre regras de cancelamento, franquia de bagagem, atrasos de voo, taxas municipais e segurança em passeios e transfers.
        </p>

        <section class="space-y-6 text-sm text-gray-700 mb-12">
          <article class="border rounded-2xl p-6 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">1. Qual é a política de cancelamento e reembolso?</h2>
            <p class="leading-relaxed">Cancelamentos solicitados com <strong>até 7 dias de antecedência da viagem têm direito a 100% de reembolso integral</strong>. Entre 7 dias e 48 horas antes da viagem, há retenção de 50% ou disponibilização de voucher integral para remarcação. Cancelamentos com menos de 48 horas ou não comparecimento não são reembolsáveis.</p>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">2. Qual é o limite de bagagem permitido nos transfers?</h2>
            <p class="leading-relaxed">No serviço <strong>privativo</strong>, são permitidas até 2 malas despachadas (até 23kg cada) + 1 mala de mão por passageiro. No <strong>compartilhado</strong>, o limite é de 1 mala média (até 23kg) + 1 mochila de mão por assento.</p>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">3. O que acontece se meu voo para Fortaleza ou Cruz atrasar?</h2>
            <p class="leading-relaxed">Nossa equipe operacional rastreia o status do seu voo em tempo real. Nos transfers privativos, disponibilizamos <strong>até 1 hora de espera gratuita</strong> no saguão sem cobrança extra.</p>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">4. Crianças pagam valor integral? Como funciona a cadeirinha?</h2>
            <p class="leading-relaxed">Crianças de colo de até 2 anos completos viajam gratuitamente no colo de um adulto responsável. A partir de 2 anos completos, ocupam assento individual. Cadeirinhas e assentos de elevação podem ser solicitados gratuitamente com aviso prévio.</p>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">5. O que é a Taxa de Turismo Sustentável (TTS) de Jericoacoara?</h2>
            <p class="leading-relaxed">A TTS é um tributo municipal instituído pela Prefeitura de Jijoca de Jericoacoara (R$ 41,50 por visitante para até 10 dias de estadia). Ela não está inclusa no valor dos serviços e recomendamos o pagamento antecipado no site oficial da prefeitura para evitar filas no posto de controle.</p>
          </article>

          <article class="border rounded-2xl p-6 bg-white shadow-sm">
            <h2 class="font-bold text-gray-900 text-lg mb-2">6. A agência é credenciada pelo Ministério do Turismo?</h2>
            <p class="leading-relaxed">Sim! Somos registrados no CADASTUR sob o CNPJ <strong>51.790.615/0001-08</strong>. Nossos passageiros contam com seguro contra acidentes (APP), motoristas credenciados e assistência 24h via WhatsApp.</p>
          </article>
        </section>

        <section class="bg-gray-50 border rounded-2xl p-6 text-center">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Ainda tem alguma dúvida?</h2>
          <p class="text-xs text-gray-600 mb-4">Fale em tempo real com nossa equipe de concierge no WhatsApp.</p>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl inline-block transition">
            Falar no WhatsApp
          </a>
        </section>
      </main>
      ${getFooter('/faq')}
    `
  }
];

// Execute Pre-rendering
console.log('🚀 [prerender] Iniciando pré-renderização estática de rotas...');

let generatedCount = 0;

for (const route of ROUTES) {
  let html = baseTemplate;

  // 1. Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);

  // 2. Meta description
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${route.description}" />`);

  // 3. Link canonical
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${route.canonical}" />`);

  // 4. OpenGraph tags
  html = html.replace(/<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${route.canonical}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image" content="${route.ogImage}" />`);

  // 5. Twitter tags
  html = html.replace(/<meta\s+property="twitter:url"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="twitter:url" content="${route.canonical}" />`);
  html = html.replace(/<meta\s+property="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta\s+property="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="twitter:description" content="${route.description}" />`);
  html = html.replace(/<meta\s+property="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="twitter:image" content="${route.ogImage}" />`);

  // 6. Structured Data (JSON-LD)
  const jsonLdString = JSON.stringify(route.schema, null, 2);
  const routeJsonLdReplacement = `<script id="route-jsonld" type="application/ld+json">\n${jsonLdString}\n\t\t</script>`;

  if (html.includes('<script id="route-jsonld"')) {
    html = html.replace(/<script\s+id="route-jsonld"[\s\S]*?<\/script>/i, routeJsonLdReplacement);
  } else {
    html = html.replace('</head>', `\t${routeJsonLdReplacement}\n\t</head>`);
  }

  // 7. Inject Semantic HTML into <div id="root">
  const cleanBody = route.semanticBody.trim();
  html = html.replace('<div id="root"></div>', `<div id="root">${cleanBody}</div>`);

  // 8. Determine destination file path
  let targetFile;
  if (route.path === '/') {
    targetFile = path.resolve(distDir, 'index.html');
  } else {
    const routeFolder = path.resolve(distDir, route.path.replace(/^\//, ''));
    if (!fs.existsSync(routeFolder)) {
      fs.mkdirSync(routeFolder, { recursive: true });
    }
    targetFile = path.resolve(routeFolder, 'index.html');
  }

  fs.writeFileSync(targetFile, html, 'utf8');
  generatedCount++;
  console.log(` ✅ [prerender] Gerado: ${path.relative(rootDir, targetFile)} (${route.path})`);
}

console.log(`🎉 [prerender] Concluído com sucesso! ${generatedCount} rotas canônicas pré-renderizadas.`);
