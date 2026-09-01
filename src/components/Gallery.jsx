import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Sparkles, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const images = [
  {
    id: 1,
    title: 'Lagoa do Paraíso',
    description: 'Águas cristalinas e redes famosas sobre a água',
    location: 'Jericoacoara - CE',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/2536918860cd6edd74fcd3911758044f.webp'
  },
  {
    id: 2,
    title: 'Pôr do Sol nas Dunas',
    description: 'Espetáculo único com vista panorâmica do mar',
    location: 'Duna do Pôr do Sol',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/a7043af71d371c32ff636c4b232c1e39.jpg'
  },
  {
    id: 3,
    title: 'Pedra Furada',
    description: 'O maior cartão postal de Jericoacoara',
    location: 'Litoral Leste',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/f8733608a68a1e9be0ca6091bca8494d.jpg'
  },
  {
    id: 4,
    title: 'Passeio de Buggy',
    description: 'Adrenalina e aventura pelas trilhas do Parque Nacional',
    location: 'Dunas e Lagoas',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/e9f92fc3e94dec8860f06293a32de6c1.jpg'
  },
  {
    id: 5,
    title: 'Tatajuba e Lagoa de Tatajuba',
    description: 'Esquibunda, tirolesa e gastronomia pé na areia',
    location: 'Litoral Oeste',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/0376391c7db96ffaf93689b92c2eeb11.webp'
  },
  {
    id: 6,
    title: 'Praia Principal de Jeri',
    description: 'Vibe tropical, bons restaurantes e ventos perfeitos',
    location: 'Vila de Jericoacoara',
    image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/c41e7ba1c6dcdd06e4d8c07e14a1e531.jpg'
  }
];

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, []);

  // Auto-play do carrossel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section id="galeria" className="py-12 md:py-20 bg-gradient-to-b from-[#F7F3E9]/50 via-white to-[#F7F3E9]/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C7A7B]/10 border border-[#2C7A7B]/20 text-[#2C7A7B] text-xs font-bold mb-4 uppercase tracking-wider">
            <Camera className="w-4 h-4 text-[#2C7A7B]" />
            Galeria Exclusiva
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galeria de <span className="text-[#2C7A7B]">Momentos</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore as paisagens deslumbrantes e viva a magia de Jericoacoara antes mesmo de embarcar
          </p>
        </motion.div>

        {/* Container do Carrossel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Card Principal em Destaque */}
          <div className="relative h-[350px] sm:h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={images[currentIndex].image}
                  alt={images[currentIndex].title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Gradiente Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                {/* Conteúdo sobre a Imagem */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white mb-3 border border-white/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      {images[currentIndex].location}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 drop-shadow-md">
                      {images[currentIndex].title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium max-w-xl">
                      {images[currentIndex].description}
                    </p>
                  </div>

                  <Button
                    onClick={() => setSelectedImage(images[currentIndex])}
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white shrink-0 shadow-lg"
                    title="Ampliar imagem"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Seta Esquerda */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 hover:bg-[#2C7A7B] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl z-20 hover:scale-110 active:scale-95"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Seta Direita */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/40 hover:bg-[#2C7A7B] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl z-20 hover:scale-110 active:scale-95"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Miniaturas de Navegação (Thumbnails & Indicadores) */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Contador de Slides */}
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Foto <span className="text-[#2C7A7B] font-extrabold text-sm">{currentIndex + 1}</span> de {images.length}
            </div>

            {/* Miniaturas Selecionáveis */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 max-w-full no-scrollbar">
              {images.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden transition-all duration-300 shrink-0 border-2 ${
                    idx === currentIndex
                      ? 'border-[#2C7A7B] ring-2 ring-[#2C7A7B]/40 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-100'
                  }`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  {idx === currentIndex && (
                    <div className="absolute inset-0 bg-[#2C7A7B]/10" />
                  )}
                </button>
              ))}
            </div>

            {/* Indicadores Dot */}
            <div className="flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-[#2C7A7B]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para a foto ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lightbox para Ampliar Imagem */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full rounded-2xl overflow-hidden bg-black shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-red-600 flex items-center justify-center transition-colors duration-200 backdrop-blur-md border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative flex-1 max-h-[75vh] flex items-center justify-center bg-black">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-gradient-to-t from-gray-900 to-black text-white">
                <span className="text-xs font-semibold text-[#2C7A7B] bg-[#2C7A7B]/20 px-2.5 py-1 rounded-full border border-[#2C7A7B]/30">
                  {selectedImage.location}
                </span>
                <h3 className="text-2xl font-bold mt-2 text-white">{selectedImage.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;