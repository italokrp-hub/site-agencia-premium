import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEOHead from '@/components/SEOHead';

// Layout (Loaded synchronously for critical initial render)
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PromoModal from '@/components/PromoModal';
import { Toaster } from '@/components/ui/toaster';

// Above-the-fold critical homepage sections
import ImmersiveHero from '@/components/sections/ImmersiveHero';
import ExperienceSelector from '@/components/sections/ExperienceSelector';
import FeaturedExperiences from '@/components/sections/FeaturedExperiences';

// Synchronous import for FAQ to completely eliminate chunk loading / MIME type errors on footer navigation
import FaqPage from '@/pages/FaqPage';

// Robust lazy loader with chunk-load auto-retry and cache-busting reload recovery.
// Completely prevents and handles:
// - TypeError: Failed to fetch dynamically imported module
// - TypeError: 'text/html' is not a valid JavaScript MIME type
// - ChunkLoadError after new production deployments
function lazyWithRetry(importFn) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const retryKey = `chunk_retry_${pathname}`;

      const execute = (retriesLeft) => {
        importFn()
          .then((module) => {
            if (typeof window !== 'undefined') {
              try {
                sessionStorage.removeItem(retryKey);
              } catch (_) {}
            }
            resolve(module);
          })
          .catch((error) => {
            const errorMsg = String(error?.message || error || '');
            const isMimeOrChunkError =
              errorMsg.includes('text/html') ||
              errorMsg.includes('MIME type') ||
              errorMsg.includes('Failed to fetch dynamically imported module') ||
              errorMsg.includes('error loading dynamically imported module') ||
              errorMsg.includes('Loading chunk') ||
              errorMsg.includes('ChunkLoadError');

            if (isMimeOrChunkError && typeof window !== 'undefined') {
              try {
                const lastAttempt = sessionStorage.getItem(retryKey);
                const now = Date.now();
                if (!lastAttempt || now - parseInt(lastAttempt, 10) > 15000) {
                  sessionStorage.setItem(retryKey, now.toString());
                  window.location.reload();
                  return;
                }
              } catch (_) {
                window.location.reload();
                return;
              }
            }

            if (retriesLeft > 0) {
              setTimeout(() => {
                execute(retriesLeft - 1);
              }, 1000);
            } else {
              reject(error);
            }
          });
      };

      execute(2);
    });
  });
}

// Below-the-fold homepage sections (Lazy loaded for Performance)
const ToursExplorer = lazyWithRetry(() => import('@/components/sections/ToursExplorer'));
const TransfersSection = lazyWithRetry(() => import('@/components/sections/TransfersSection'));
const ExploreJericoMap = lazyWithRetry(() => import('@/components/sections/ExploreJericoMap'));
const TravelPlanner = lazyWithRetry(() => import('@/components/sections/TravelPlanner'));
const PremiumExperiences = lazyWithRetry(() => import('@/components/sections/PremiumExperiences'));
const TrustSection = lazyWithRetry(() => import('@/components/sections/TrustSection'));
const TestimonialsSection = lazyWithRetry(() => import('@/components/sections/TestimonialsSection'));
const FAQSection = lazyWithRetry(() => import('@/components/sections/FAQSection'));
const FinalCTA = lazyWithRetry(() => import('@/components/sections/FinalCTA'));
const JeriDuneTrail = lazyWithRetry(() => import('@/components/effects/JeriDuneTrail'));

// Secondary & Admin routes (Lazy loaded)
const Reservas = lazyWithRetry(() => import('@/pages/agencia/Reservas'));
const VoucherPage = lazyWithRetry(() => import('@/pages/VoucherPage'));
const ObrigadoPage = lazyWithRetry(() => import('@/pages/ObrigadoPage'));
const PlanejamentoUeinerJajah = lazyWithRetry(() => import('@/components/PlanejamentoUeinerJajah'));

// SEO Landing Pages (Lazy loaded)
const TransferFortalezaJeri = lazyWithRetry(() => import('@/pages/seo/TransferFortalezaJeri'));
const TransferAeroportoJeri = lazyWithRetry(() => import('@/pages/seo/TransferAeroportoJeri'));
const TransferJijocaJeri = lazyWithRetry(() => import('@/pages/seo/TransferJijocaJeri'));
const TransferPreaJeri = lazyWithRetry(() => import('@/pages/seo/TransferPreaJeri'));
const PasseiosJeri = lazyWithRetry(() => import('@/pages/seo/PasseiosJeri'));

function SectionFallback() {
  return <div className="py-12 bg-white flex items-center justify-center min-h-[120px]" />;
}

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Jericoacoara Premium',
  legalName: 'Jericoacoara Premium Transfer e Turismo',
  taxID: '51.790.615/0001-08',
  url: 'https://www.jericoacoarapremium.com/',
  logo: 'https://www.jericoacoarapremium.com/images/logo.webp',
  image: 'https://www.jericoacoarapremium.com/images/hero-jeri-mobile.webp',
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
};

function LandingPage() {
  return (
    <>
      <SEOHead
        title="Passeios e Transfers em Jericoacoara | Jericoacoara Premium"
        description="Reserve transfers 4x4 privativos e compartilhados e passeios em Jericoacoara com agência credenciada CADASTUR, veículos revisados e suporte 24h via WhatsApp."
        canonical="https://www.jericoacoarapremium.com/"
        schema={HOME_SCHEMA}
      />

      <div className="min-h-screen bg-white">
        <Header />
        <main>
          {/* 1. Immersive Hero (Critical - Instant Render) */}
          <ErrorBoundary>
            <ImmersiveHero />
          </ErrorBoundary>

          {/* 2. Experience Selector */}
          <ErrorBoundary>
            <ExperienceSelector />
          </ErrorBoundary>

          {/* 3. Featured Experiences */}
          <ErrorBoundary>
            <FeaturedExperiences />
          </ErrorBoundary>

          {/* 4. Tours Explorer */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <ToursExplorer />
            </Suspense>
          </ErrorBoundary>

          {/* 5. Transfers Section */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <TransfersSection />
            </Suspense>
          </ErrorBoundary>

          {/* 6. Explore Jericoacoara Map */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <ExploreJericoMap />
            </Suspense>
          </ErrorBoundary>

          {/* 7. Jeri Travel Planner */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <TravelPlanner />
            </Suspense>
          </ErrorBoundary>

          {/* 8. Premium Experiences */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <PremiumExperiences />
            </Suspense>
          </ErrorBoundary>

          {/* 9. Trust Section */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <TrustSection />
            </Suspense>
          </ErrorBoundary>

          {/* 10. Testimonials */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <TestimonialsSection />
            </Suspense>
          </ErrorBoundary>

          {/* 11. FAQ */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <FAQSection />
            </Suspense>
          </ErrorBoundary>

          {/* 12. Final CTA */}
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <FinalCTA />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <JeriDuneTrail />
        </Suspense>
        <WhatsAppFloat />
        <Toaster />
      </div>
    </>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#0F1A1C] flex items-center justify-center text-white">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <PromoModal />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/obrigado" element={<ObrigadoPage />} />
              <Route path="/voucher/:code" element={<VoucherPage />} />
              <Route path="/agencia/reservas" element={<Reservas />} />
              <Route path="/reservas" element={<Reservas />} />

              {/* Roteiro Personalizado / Concierge VIP */}
              <Route path="/planejamento-uenner-jaja" element={<PlanejamentoUeinerJajah />} />
              <Route path="/planejamento-reiner" element={<PlanejamentoUeinerJajah />} />
              <Route path="/planejamento-ueiner-jajah" element={<PlanejamentoUeinerJajah />} />
              <Route path="/planejamento-rainer" element={<PlanejamentoUeinerJajah />} />

              {/* SEO Landing Pages */}
              <Route path="/transfer-fortaleza-jericoacoara" element={<TransferFortalezaJeri />} />
              <Route path="/transfer-aeroporto-jericoacoara" element={<TransferAeroportoJeri />} />
              <Route path="/transfer-jijoca-jericoacoara" element={<TransferJijocaJeri />} />
              <Route path="/transfer-prea-jericoacoara" element={<TransferPreaJeri />} />
              <Route path="/passeios-jericoacoara" element={<PasseiosJeri />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
