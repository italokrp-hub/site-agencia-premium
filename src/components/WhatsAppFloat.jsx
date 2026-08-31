import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.031 0C5.395 0 0 5.394 0 12.031c0 2.12.553 4.184 1.6 6.002L.15 23.473l5.59-1.464a11.972 11.972 0 0 0 6.291 1.772h.005C18.667 23.781 24 18.388 24 11.751 24 5.115 18.67 0 12.031 0zm0 19.785h-.003a10.021 10.021 0 0 1-5.111-1.396l-.367-.217-3.794.994 1.014-3.7-.238-.38A9.973 9.973 0 0 1 2.015 11.75c0-5.526 4.498-10.024 10.023-10.024 5.524 0 10.024 4.498 10.024 10.024 0 5.527-4.498 10.023-10.022 10.023zm5.497-7.514c-.301-.15-1.782-.879-2.06-.979-.278-.1-.48-.15-.681.15-.202.301-.78 1.01-.955 1.22-.176.21-.352.235-.653.085-1.528-.755-2.73-1.41-3.79-3.26-.176-.305-.018-.47.132-.62.136-.135.302-.352.453-.527.151-.176.202-.302.302-.503.1-.2.05-.376-.025-.526-.075-.15-.681-1.642-.932-2.25-.246-.59-.496-.51-.681-.52-.176-.01-.377-.01-.578-.01s-.527.075-.803.376c-.276.302-1.054 1.03-1.054 2.511s1.079 2.91 1.23 3.111c.15.2 2.122 3.238 5.14 4.54 1.954.84 2.658.91 3.541.765.733-.12 2.36-.963 2.695-1.892.335-.93.335-1.728.235-1.892-.1-.165-.377-.265-.678-.415z"/>
  </svg>
);

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
      aria-label="Falar no WhatsApp"
    >
      <WhatsAppIcon className="w-9 h-9" />
      
      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Fale conosco no WhatsApp!
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
      
      {/* Flaticon Attribution */}
      <span className="sr-only">
        <a href="https://www.flaticon.com/br/icones-gratis/whatsapp" title="whatsapp ícones">Whatsapp ícones criados por Magnific - Flaticon</a>
      </span>
    </motion.button>
  );
};

export default WhatsAppFloat;