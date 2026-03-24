import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5592981038749', '_blank');
  };

  const handleReserve = () => {
    const element = document.querySelector('#valores');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover"
          alt="Praia de Jericoacoara ao pôr do sol com dunas"
         src="https://images.unsplash.com/photo-1517347748150-029cea4cc0fd" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Experiências Excepcionais em Jericoacoara
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/95 mb-4 font-light"
          >
            Transfer, Passeios e Serviços Exclusivos
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Conforto, segurança e atendimento personalizado para tornar sua viagem inesquecível
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-white/90"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
              <span className="text-sm font-medium">Atendimento 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
              <span className="text-sm font-medium">Motoristas Experientes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
              <span className="text-sm font-medium">Veículos Premium</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full p-1"
        >
          <div className="w-1.5 h-3 bg-white/50 rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;