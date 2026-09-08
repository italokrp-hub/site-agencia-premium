import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Calendar, MessageCircle, ShieldCheck, Car, Clock } from 'lucide-react';
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
    window.open('https://wa.me/5592981038749?text=' + encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Jericoacoara Premium.'), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* --- Background Image --- */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=1920&q=80"
          alt="Jericoacoara — dunas ao pôr do sol"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
        {/* Multi-layer editorial overlay for crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* --- Grain texture overlay --- */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* --- Main Content Container --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-28 md:pt-36 pb-12">

        {/* 1. Subtle Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-black/30 backdrop-blur-md text-[#D4AF37] text-[11px] font-semibold tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            Jericoacoara Premium · Viagens & Roteiros Privativos
          </span>
        </motion.div>

        {/* 2. Fluid & Balanced H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight max-w-5xl [text-wrap:balance]"
        >
          Transfers e Passeios Exclusivos em{' '}
          <span className="text-[#D4AF37]">Jericoacoara</span>
        </motion.h1>

        {/* 3. Single High-Impact Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-5 text-base sm:text-lg md:text-xl text-white/80 font-light max-w-2xl leading-relaxed [text-wrap:balance]"
        >
          Pontualidade do aeroporto ao hotel e roteiros privativos pelas dunas e lagoas. Sua viagem com veículos credenciados e conforto absoluto.
        </motion.p>

        {/* 4. Streamlined CTAs */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.7, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-3.5 items-center"
        >
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.97 }} className="w-full sm:w-auto">
            <Button
              onClick={scrollToPricing}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-base rounded-full shadow-2xl hover:shadow-[#D4AF37]/25 transition-all duration-300 w-full sm:w-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Explorar Experiências
            </Button>
          </motion.div>

          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.97 }} className="w-full sm:w-auto">
            <Button
              onClick={openWhatsApp}
              size="lg"
              variant="outline"
              className="border border-white/30 bg-black/20 backdrop-blur-sm hover:bg-white/15 text-white font-medium px-7 py-6 text-base rounded-full transition-all duration-300 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-[#25D366]" />
              Falar com Consultor
            </Button>
          </motion.div>
        </motion.div>

        {/* 5. Minimalist Micro-Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/70 text-xs font-medium tracking-wide"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Cadastur Regularizado
          </span>
          <span className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> Veículos 4x4 Credenciados
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Atendimento 24h
          </span>
        </motion.div>

        {/* 6. Booking Quote Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-8"
        >
          <BookingBar onBook={handleBookingBarSubmit} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToExplore}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-10 mt-auto mb-6 flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group"
        aria-label="Rolar para baixo"
      >
        <span className="text-[10px] font-medium tracking-widest uppercase">Explorar</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
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
