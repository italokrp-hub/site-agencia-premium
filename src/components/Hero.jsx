import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingBar from '@/components/BookingBar';
import BookingModal from '@/components/BookingModal';

const Hero = () => {
  const [bookingItem, setBookingItem] = useState(null);

  const handleWhatsApp = () => {
    window.open('https://wa.me/5592981038749', '_blank');
  };

  const handleReserve = () => {
    const element = document.querySelector('#valores');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingBarSubmit = (rawItem, { date, passengers }) => {
    setBookingItem({
      ...rawItem,
      initialDate: date,
      initialPassengers: passengers,
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover"
          alt="Praia de Jericoacoara ao pôr do sol com dunas"
          src="https://images.unsplash.com/photo-1517347748150-029cea4cc0fd"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Experiências Excepcionais em Jericoacoara
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/95 font-light"
          >
            Transfer, Passeios e Serviços Exclusivos
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto"
          >
            Conforto, segurança e atendimento personalizado para tornar sua viagem inesquecível
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Button
              onClick={handleReserve}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reservar Agora
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white font-bold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Fale no WhatsApp
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Search Bar (BookingBar) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pt-4"
        >
          <BookingBar onBook={handleBookingBarSubmit} />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-6 text-white/90 pt-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
            <span className="text-xs sm:text-sm font-medium">Atendimento 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
            <span className="text-xs sm:text-sm font-medium">Motoristas Experientes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
            <span className="text-xs sm:text-sm font-medium">Veículos Premium</span>
          </div>
        </motion.div>
      </div>

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

export default Hero;