import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transfersData, toursData } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

const FinalCTA = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [bookingItem, setBookingItem] = useState(null);

  const handleReserveNow = () => {
    // Open booking with first available transfer as default
    const defaultItem = transfersData[0];
    if (defaultItem) {
      setBookingItem({ ...defaultItem, selectedType: 'Privativo', selectedTripType: 'roundTrip' });
    }
  };

  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/5592981038749?text=' + encodeURIComponent('Olá! Quero ajuda para montar meu roteiro em Jericoacoara. Pode me indicar as melhores experiências?'),
      '_blank'
    );
  };

  return (
    <section id="reservar" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg"
          alt="Jericoacoara — Lagoa da Tatajuba"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-5">
            Pronto para Jericoacoara?
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Vamos planejar sua experiência{' '}
            <span className="text-[#D4AF37]">em Jericoacoara?</span>
          </h2>

          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Escolha sua forma preferida de começar — reserve diretamente online ou fale com um de nossos especialistas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Path 1: Já sei o que quero */}
            <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                Já sei o que quero
              </span>
              <Button
                onClick={handleReserveNow}
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-10 py-6 text-base rounded-full shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar agora
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Divider */}
            <span className="text-white/30 text-sm hidden sm:block">ou</span>
            <div className="w-full sm:hidden h-px bg-white/10" />

            {/* Path 2: Quero ajuda */}
            <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
              <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                Quero ajuda para montar minha viagem
              </span>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                variant="outline"
                className="border-2 border-white/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-10 py-6 text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar com especialista
              </Button>
            </div>
          </div>

          {/* Reassurance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/50 text-xs"
          >
            {['Pagamento seguro', '5% OFF no PIX', 'Sinal de 50% online', 'Suporte 24 horas'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                {item}
              </span>
            ))}
          </motion.div>
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

export default FinalCTA;
