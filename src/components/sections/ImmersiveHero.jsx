import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingBar from '@/components/BookingBar';
import BookingModal from '@/components/BookingModal';

const ImmersiveHero = () => {
  const [bookingItem, setBookingItem] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const handleBookingBarSubmit = (rawItem, { date, passengers }) => {
    setBookingItem({
      ...rawItem,
      initialDate: date,
      initialPassengers: passengers,
    });
  };

  const scrollToExplore = () => {
    const el = document.querySelector('#como-viver');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const el = document.querySelector('#experiencias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5592981038749?text=' + encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Jericoacoara Premium.'), '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* --- Background --- */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=1920&q=80"
          alt="Jericoacoara — dunas ao pôr do sol"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Multi-layer overlay for editorial depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* --- Grain texture overlay for premium feel --- */}
      <div className="absolute inset-0 z-[1] opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-24 pb-8">

        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-bold tracking-widest uppercase bg-black/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            Jericoacoara Premium · Experiências Exclusivas
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight max-w-5xl"
        >
          Jericoacoara não é apenas{' '}
          <br className="hidden sm:block" />
          <span className="text-[#D4AF37]">um destino.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-white/85 font-light max-w-2xl leading-relaxed"
        >
          É uma experiência que merece ser vivida do seu jeito.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-3 text-sm sm:text-base text-white/65 max-w-xl"
        >
          Passeios, transfers e experiências exclusivas personalizadas para você descobrir Jericoacoara sem preocupações.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 items-center"
        >
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.04 }} whileTap={shouldReduceMotion ? {} : { scale: 0.97 }} className="w-full sm:w-auto">
            <Button
              onClick={scrollToPricing}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-base rounded-full shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 w-full sm:w-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Explorar experiências
            </Button>
          </motion.div>

          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.04 }} whileTap={shouldReduceMotion ? {} : { scale: 0.97 }} className="w-full sm:w-auto">
            <Button
              onClick={openWhatsApp}
              size="lg"
              variant="outline"
              className="border-2 border-white/60 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-8 py-6 text-base rounded-full shadow-lg transition-all duration-300 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Planejar minha viagem
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust micro-badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/70"
        >
          {['Atendimento 24h', 'Motoristas Certificados', 'Pague por PIX · 5% OFF', 'Cadastur Regularizado'].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Booking bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-10"
        >
          <BookingBar onBook={handleBookingBarSubmit} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToExplore}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative z-10 mt-auto mb-8 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors group"
        aria-label="Rolar para baixo"
      >
        <span className="text-[10px] font-medium tracking-widest uppercase">Explorar</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* BookingModal trigger */}
      {bookingItem && (
        <BookingModal
          item={bookingItem}
          open={!!bookingItem}
          onOpenChange={(open) => !open && setBookingItem(null)}
        />
      )}
    </section>
  );
};

export default ImmersiveHero;
