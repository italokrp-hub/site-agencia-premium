import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HeroFlowCarousel from '@/components/HeroFlowCarousel';
import About from '@/components/About';
import Services from '@/components/Services';
import Differentials from '@/components/Differentials';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Toaster } from '@/components/ui/toaster';
import Reservas from '@/pages/agencia/Reservas';

function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Jericoacoara Premium | Transfer VIP 4x4, Passeios e Experiências Exclusivas</title>
        <meta
          name="description"
          content="Viva as melhores experiências em Jericoacoara com conforto e exclusividade. Oferecemos Transfer VIP 4x4 (Fortaleza, Cruz), Passeios de Buggy, UTV, Helicóptero e Beach Clubs."
        />
        <meta name="keywords" content="Jericoacoara, Transfer VIP Jericoacoara, Passeios de Buggy, Helicóptero Jeri, Agência de Turismo Jericoacoara, Transfer Fortaleza Jeri, Ceará, UTV Jericoacoara" />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroFlowCarousel />
          <About />
          <Services />
          <Differentials />
          <Testimonials />
          <Pricing />
          <Gallery />
        </main>
        <Footer />
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