import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const handleClick = () => {
    window.open('https://wa.me/5592981038749?text=' + encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Jericoacoara Premium'), '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 group"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Fale conosco no WhatsApp!
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </motion.button>
  );
};

export default WhatsAppFloat;