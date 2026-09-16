import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { LanguageProvider } from '@/i18n/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Layout (Loaded synchronously for critical initial render)
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Toaster } from '@/components/ui/toaster';

// Above-the-fold critical homepage sections
import ImmersiveHero from '@/components/sections/ImmersiveHero';
import ExperienceSelector from '@/components/sections/ExperienceSelector';
import FeaturedExperiences from '@/components/sections/FeaturedExperiences';

// Below-the-fold homepage sections (Lazy loaded for Performance)
const ToursExplorer = lazy(() => import('@/components/sections/ToursExplorer'));
const TransfersSection = lazy(() => import('@/components/sections/TransfersSection'));
const ExploreJericoMap = lazy(() => import('@/components/sections/ExploreJericoMap'));
const TravelPlanner = lazy(() => import('@/components/sections/TravelPlanner'));
const PremiumExperiences = lazy(() => import('@/components/sections/PremiumExperiences'));
const TrustSection = lazy(() => import('@/components/sections/TrustSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));
const FAQSection = lazy(() => import('@/components/sections/FAQSection'));
const FinalCTA = lazy(() => import('@/components/sections/FinalCTA'));
const JeriDuneTrail = lazy(() => import('@/components/effects/JeriDuneTrail'));

// Secondary & Admin routes (Lazy loaded)
const Reservas = lazy(() => import('@/pages/agencia/Reservas'));
const VoucherPage = lazy(() => import('@/pages/VoucherPage'));
const ObrigadoPage = lazy(() => import('@/pages/ObrigadoPage'));

// SEO Landing Pages (Lazy loaded)
const TransferFortalezaJeri = lazy(() => import('@/pages/seo/TransferFortalezaJeri'));
const TransferAeroportoJeri = lazy(() => import('@/pages/seo/TransferAeroportoJeri'));
const TransferJijocaJeri = lazy(() => import('@/pages/seo/TransferJijocaJeri'));
const TransferPreaJeri = lazy(() => import('@/pages/seo/TransferPreaJeri'));
const PasseiosJeri = lazy(() => import('@/pages/seo/PasseiosJeri'));

function SectionFallback() {
  return <div className="py-12 bg-white flex items-center justify-center min-h-[120px]" />;
}

function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Jericoacoara Premium | Transfer Mais Barato, Passeios & Agência Segura</title>
        <meta
          name="description"
          content="Encontre o transfer mais barato para Jericoacoara com a agência mais confiável e segura. Reserve transfer compartilhado econômico, VIP 4x4 e passeios com melhor preço, motoristas credenciados e reserva 100% garantida!"
        />
        <meta name="keywords" content="transfer mais barato jericoacoara, transfer economico jeri, melhor preco transfer jeri, agencia segura jericoacoara, motoristas credenciados, reserva garantida, Transfer VIP Jericoacoara, Passeios de Buggy, Ceará" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://jericoacoarapremium.com/" />
        <meta property="og:url" content="https://jericoacoarapremium.com/" />
        <meta property="og:title" content="Jericoacoara Premium | Transfer Mais Barato & Agência Confiável" />
        <meta property="og:description" content="Reserve o transfer mais barato e econômico para Jericoacoara com segurança total, motoristas credenciados e reserva 100% garantida." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=1200&q=80" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
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
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/obrigado" element={<ObrigadoPage />} />
              <Route path="/voucher/:code" element={<VoucherPage />} />
              <Route path="/agencia/reservas" element={<Reservas />} />
              <Route path="/reservas" element={<Reservas />} />
              
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