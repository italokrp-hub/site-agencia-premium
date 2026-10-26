import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { LanguageProvider } from '@/i18n/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';

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

// Safe lazy loader with auto-retry and cache-busting reload recovery.
// Completely prevents and handles:
// - TypeError: Failed to fetch dynamically imported module
// - TypeError: 'text/html' is not a valid JavaScript MIME type
// - ChunkLoadError after new production deployments
function safeLazy(importFn, retriesLeft = 2, interval = 1000) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const execute = (remainingRetries) => {
        importFn()
          .then((module) => {
            if (typeof window !== 'undefined') {
              try {
                sessionStorage.removeItem(`lazy_retry_${window.location.pathname}`);
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
              const storageKey = `lazy_retry_${window.location.pathname}`;
              try {
                const lastAttempt = sessionStorage.getItem(storageKey);
                const now = Date.now();
                if (!lastAttempt || now - parseInt(lastAttempt, 10) > 15000) {
                  sessionStorage.setItem(storageKey, now.toString());
                  window.location.reload();
                  return;
                }
              } catch (_) {
                window.location.reload();
                return;
              }
            }

            if (remainingRetries > 0) {
              setTimeout(() => {
                execute(remainingRetries - 1);
              }, interval);
            } else {
              reject(error);
            }
          });
      };

      execute(retriesLeft);
    });
  });
}

// Below-the-fold homepage sections (Lazy loaded for Performance)
const ToursExplorer = safeLazy(() => import('@/components/sections/ToursExplorer'));
const TransfersSection = safeLazy(() => import('@/components/sections/TransfersSection'));
const ExploreJericoMap = safeLazy(() => import('@/components/sections/ExploreJericoMap'));
const TravelPlanner = safeLazy(() => import('@/components/sections/TravelPlanner'));
const PremiumExperiences = safeLazy(() => import('@/components/sections/PremiumExperiences'));
const TrustSection = safeLazy(() => import('@/components/sections/TrustSection'));
const TestimonialsSection = safeLazy(() => import('@/components/sections/TestimonialsSection'));
const FAQSection = safeLazy(() => import('@/components/sections/FAQSection'));
const FinalCTA = safeLazy(() => import('@/components/sections/FinalCTA'));
const JeriDuneTrail = safeLazy(() => import('@/components/effects/JeriDuneTrail'));

// Secondary & Admin routes (Lazy loaded)
const Reservas = safeLazy(() => import('@/pages/agencia/Reservas'));
const VoucherPage = safeLazy(() => import('@/pages/VoucherPage'));
const ObrigadoPage = safeLazy(() => import('@/pages/ObrigadoPage'));
const FaqPage = safeLazy(() => import('@/pages/FaqPage'));
const PlanejamentoUeinerJajah = safeLazy(() => import('@/components/PlanejamentoUeinerJajah'));

// SEO Landing Pages (Lazy loaded)
const TransferFortalezaJeri = safeLazy(() => import('@/pages/seo/TransferFortalezaJeri'));
const TransferAeroportoJeri = safeLazy(() => import('@/pages/seo/TransferAeroportoJeri'));
const TransferJijocaJeri = safeLazy(() => import('@/pages/seo/TransferJijocaJeri'));
const TransferPreaJeri = safeLazy(() => import('@/pages/seo/TransferPreaJeri'));
const PasseiosJeri = safeLazy(() => import('@/pages/seo/PasseiosJeri'));

function SectionFallback() {
  return <div className="py-12 bg-white flex items-center justify-center min-h-[120px]" />;
}

function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Jericoacoara Premium | Exclusividade, Conforto & Segurança em Passeios e Transfers</title>
        <meta
          name="description"
          content="Seu receptivo exclusivo em Jericoacoara. Transfers privativos 4x4, passeios personalizados, helicóptero e experiências de alto padrão com conforto e segurança."
        />
        <meta name="keywords" content="Jericoacoara Premium, transfer privativo jericoacoara, transfer 4x4 jeri, passeios exclusivos jericoacoara, helicoptero jericoacoara, receptivo de luxo jericoacoara, conforto e seguranca, Transfer VIP Jericoacoara, Ceará" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://jericoacoarapremium.com/" />
        <meta property="og:url" content="https://jericoacoarapremium.com/" />
        <meta property="og:title" content="Jericoacoara Premium | Exclusividade, Conforto & Segurança em Passeios e Transfers" />
        <meta property="og:description" content="Seu receptivo exclusivo em Jericoacoara. Transfers privativos 4x4, passeios personalizados, helicóptero e experiências de alto padrão com conforto e segurança." />
        <meta property="og:image" content="https://jericoacoarapremium.com/images/hero-jeri-mobile.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jericoacoara Premium | Exclusividade, Conforto & Segurança em Passeios e Transfers" />
        <meta name="twitter:description" content="Seu receptivo exclusivo em Jericoacoara. Transfers privativos 4x4, passeios personalizados, helicóptero e experiências de alto padrão com conforto e segurança." />
        <meta name="twitter:url" content="https://jericoacoarapremium.com/" />
      </Helmet>

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