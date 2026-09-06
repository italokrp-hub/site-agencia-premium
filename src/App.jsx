import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Layout
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Toaster } from '@/components/ui/toaster';

// New immersive sections
import ImmersiveHero from '@/components/sections/ImmersiveHero';
import ExperienceSelector from '@/components/sections/ExperienceSelector';
import FeaturedExperiences from '@/components/sections/FeaturedExperiences';
import ToursExplorer from '@/components/sections/ToursExplorer';
import TransfersSection from '@/components/sections/TransfersSection';
import ExploreJericoMap from '@/components/sections/ExploreJericoMap';
import TravelPlanner from '@/components/sections/TravelPlanner';
import PremiumExperiences from '@/components/sections/PremiumExperiences';
import TrustSection from '@/components/sections/TrustSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTA from '@/components/sections/FinalCTA';
import JeriDuneTrail from '@/components/effects/JeriDuneTrail';

// Admin route
import Reservas from '@/pages/agencia/Reservas';

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
          {/* 1. Immersive Hero */}
          <ImmersiveHero />

          {/* 2. Experience Selector */}
          <ExperienceSelector />

          {/* 3. Featured Experiences */}
          <FeaturedExperiences />

          {/* 4. Tours Explorer */}
          <ToursExplorer />

          {/* 5. Transfers Section */}
          <TransfersSection />

          {/* 6. Explore Jericoacoara Map */}
          <ExploreJericoMap />

          {/* 7. Jeri Travel Planner */}
          <TravelPlanner />

          {/* 8. Premium Experiences */}
          <PremiumExperiences />

          {/* 7. Trust Section */}
          <TrustSection />

          {/* 8. Testimonials */}
          <TestimonialsSection />

          {/* 9. FAQ */}
          <FAQSection />

          {/* 10. Final CTA */}
          <FinalCTA />
        </main>
        <Footer />
        <JeriDuneTrail />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agencia/reservas" element={<Reservas />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;