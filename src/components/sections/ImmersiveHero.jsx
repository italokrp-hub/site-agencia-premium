import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Calendar, MessageCircle, ShieldCheck, Car, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingBar from '@/components/BookingBar';
import BookingModal from '@/components/BookingModal';
import { useLanguage } from '@/i18n/LanguageContext';
import { openWhatsApp as triggerWhatsApp } from '@/utils/whatsapp';

const ImmersiveHero = () => {
  const [bookingItem, setBookingItem] = useState(null);
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  const handleBookingBarSubmit = (rawItem, { date, passengers }) => {
    setBookingItem({
      ...rawItem,
      initialDate: date,
      initialPassengers: passengers,
    });
  };

  const scrollToExplore = () => {
    const el = document.querySelector('#experiencias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const el = document.querySelector('#tours');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    triggerWhatsApp('Olá! Gostaria de informações sobre passeios e transfers em Jericoacoara.');
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=1920&q=80"
          alt="Jericoacoara — dunas ao pôr do sol"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-28 md:pt-36 pb-12">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-black/30 backdrop-blur-md text-[#D4AF37] text-[11px] font-semibold tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            {t('hero.badge')}
          </span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight max-w-5xl [text-wrap:balance]">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block"
          >
            Transfers e Passeios Exclusivos em <span className="text-[#D4AF37]">Jericoacoara</span>
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-5 text-base sm:text-lg md:text-xl text-white/80 font-light max-w-2xl leading-relaxed [text-wrap:balance]"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTAs */}
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
              {t('hero.exploreTours')}
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
              {t('hero.whatsappAction')}
            </Button>
          </motion.div>
        </motion.div>

        {/* Micro-Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/70 text-xs font-medium tracking-wide"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> {t('trust.cadastur')}
          </span>
          <span className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#D4AF37]" /> {t('trust.drivers')}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {t('trust.support24h')}
          </span>
        </motion.div>

        {/* Booking Bar */}
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
        className="relative z-10 mt-auto mb-6 flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group cursor-pointer"
        aria-label="Rolar para baixo"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
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
