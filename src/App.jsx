import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Differentials from '@/components/Differentials';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Jericoacoara Premium - Transfer, Passeios e Experiências Exclusivas</title>
        <meta name="description" content="Experiências excepcionais em Jericoacoara com transfer premium, passeios exclusivos e atendimento personalizado. Reserve agora seu transfer Fortaleza ↔ Jeri com conforto e segurança." />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <About />
        <Services />
        <Differentials />
        <Testimonials />
        <Pricing />
        <Gallery />
        <Footer />
        <WhatsAppFloat />
        <Toaster />
      </div>
    </>
  );
}

export default App;