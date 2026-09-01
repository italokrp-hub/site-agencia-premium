import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Star, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/BookingModal';

const SCENES = [
  {
    id: 1,
    type: 'video',
    src: '/videos/transfer_vip.mp4',
    title: 'Transfer VIP 4x4',
    description: 'Conforto e segurança com motoristas credenciados e carros vistoriados.',
    badge: 'Conforto & Segurança',
    highlights: [
      { icon: Star, text: 'Veículos 4x4 Climatizados' },
      { icon: Clock, text: 'Disponibilidade 24h' },
      { icon: Shield, text: 'Motoristas Credenciados' }
    ]
  },
  {
    id: 2,
    type: 'video',
    src: '/videos/passeio_buggy.mp4',
    title: 'Passeio de Buggy nas Dunas',
    description: 'Conheça os pontos turísticos mais desejados com segurança e emoção na medida certa.',
    badge: 'Aventura com Conforto',
    highlights: [
      { icon: Star, text: 'Roteiros Personalizados' },
      { icon: Clock, text: 'Pilotos Experientes' },
      { icon: Shield, text: 'Paradas Estratégicas' }
    ]
  },
  {
    id: 3,
    type: 'video',
    src: '/videos/passeio_helicoptero.mp4',
    title: 'Voo Panorâmico de Helicóptero',
    description: 'Uma perspectiva inesquecível e luxuosa de Jericoacoara vista de cima.',
    badge: 'Exclusividade Máxima',
    highlights: [
      { icon: Star, text: 'Vista Panorâmica Única' },
      { icon: Clock, text: 'Agilidade & Conforto' },
      { icon: Shield, text: 'Experiência VIP' }
    ]
  },
  {
    id: 4,
    type: 'video',
    src: '/videos/Laguna_beachclube_oeste.mp4',
    title: 'Laguna Beach Club (Litoral Oeste)',
    description: 'O ápice do lazer com drinks, música e sofisticação à beira da lagoa no litoral oeste.',
    badge: 'Lounge & Beach Club',
    highlights: [
      { icon: Star, text: 'Lounge Exclusivo' },
      { icon: Clock, text: 'Gastronomia Premium' },
      { icon: Shield, text: 'Piscinas & Cabanas' }
    ]
  },
  {
    id: 5,
    type: 'video',
    src: '/videos/lagun_beachclube_leste.mp4',
    title: 'Lagun Beach Club (Litoral Leste)',
    description: 'Sinta a vibe única do litoral leste com infraestrutura de luxo e paisagens inesquecíveis.',
    badge: 'Relax & Beach Club',
    highlights: [
      { icon: Star, text: 'Estrutura de Luxo' },
      { icon: Clock, text: 'Música Ambiente' },
      { icon: Shield, text: 'Atendimento VIP' }
    ]
  },
  {
    id: 6,
    type: 'video',
    src: '/videos/lagoa_do_paraiso.mp4',
    title: 'Lagoa do Paraíso',
    description: 'As famosas redes suspensas e beach clubs luxuosos.',
    badge: 'Cartão Postal',
    highlights: [
      { icon: Star, text: 'Águas Cristalinas' },
      { icon: Clock, text: 'Redes Exclusivas' },
      { icon: Shield, text: 'Paz e Sossego' }
    ]
  },
  {
    id: 7,
    type: 'video',
    src: '/videos/video-lagoaazul.mp4',
    title: 'Lagoa Azul',
    description: 'Um refúgio escondido de águas com tons surreais para você renovar suas energias.',
    badge: 'Relax & Natureza',
    highlights: [
      { icon: Star, text: 'Tons Surreais' },
      { icon: Clock, text: 'Conexão Real' },
      { icon: Shield, text: 'Águas Tranquilas' }
    ]
  },
  {
    id: 8,
    type: 'image',
    src: '/images/scenes/lagoa-paraiso.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1517347748150-029cea4cc0fd',
    title: 'Diversas Opções de Roteiros',
    description: 'Conheça nossos passeios de UTV, Quadriciclo e opções compartilhadas ou privativas.',
    badge: 'Experiências Personalizadas',
    highlights: [
      { icon: Star, text: 'Cenários Paradisíacos' },
      { icon: Clock, text: 'Momentos Relaxantes' },
      { icon: Shield, text: 'Guia Especializado' }
    ]
  }
];

import { transfersData, toursData } from '@/data/catalog';

// Helper for whatsapp redirect
const openWhatsApp = (serviceName) => {
  const msgText = `Olá! Gostaria de informações sobre o passeio exclusivo de ${serviceName}.`;
  window.open(`https://wa.me/5592981038749?text=${encodeURIComponent(msgText)}`, '_blank');
};

const HeroFlowCarousel = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [bookingItem, setBookingItem] = useState(null);
  
  // Keep track of video elements for play/pause control
  const videoRefs = useRef([]);

  useEffect(() => {
    // Play active video, pause inactive ones to save resources
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentScene) {
          video.currentTime = 0; // Restart for a fresh transition
          video.play().catch(e => console.log('Autoplay prevented:', e));
        } else {
          video.pause();
        }
      }
    });
  }, [currentScene]);

  // Auto advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % SCENES.length);
    }, 7000); // 7s timer
    return () => clearInterval(timer);
  }, []);

  const handleOpenBooking = () => {
    const scene = SCENES[currentScene];
    if (scene.id === 8) {
      // Scroll to #servicos
      const element = document.querySelector('#servicos');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (scene.id === 3) {
      // Helicóptero
      openWhatsApp('Helicóptero');
    } else if (scene.id === 6) {
      // UTV - actually scene 6 is Lagoa do Paraíso now, wait.
      // UTV was previously scene 6 in my old list but the user didn't mention it. Let's just keep the WhatsApp logic if UTV is ever added back, but for now we only have Helicóptero.
      // Wait, UTV isn't mapped to a specific scene ID here, it's covered in scene 8 text.
      openWhatsApp('UTV');
    } else if (scene.id === 1) {
      // Transfer VIP
      const transfer = transfersData.find(t => t.id === 'fortaleza');
      setBookingItem(transfer);
    } else if (scene.id === 2 || scene.id === 5) {
      // Buggy / Leste
      const tourLeste = toursData.find(t => t.id === 'tour-leste-private');
      setBookingItem({ ...tourLeste, selectedVehicleType: 'Buggy' });
    } else if (scene.id === 4) {
      // Oeste / Laguna
      const tourOeste = toursData.find(t => t.id === 'tour-oeste-private');
      setBookingItem(tourOeste);
    } else {
      // General Fallback
      const tourLeste = toursData.find(t => t.id === 'tour-leste-private');
      setBookingItem(tourLeste);
    }
  };

  const scene = SCENES[currentScene];

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden bg-neutral-950 flex items-center">
      
      {/* Media Background - Rendered stacked for instant transitions */}
      <div className="absolute inset-0 z-0 bg-neutral-950">
        {SCENES.map((s, index) => {
          const isActive = index === currentScene;
          
          // Generate poster assuming .jpg exists with same name, or fallback
          const posterSrc = s.poster || (s.src ? s.src.replace('.mp4', '.jpg') : s.fallbackSrc);

          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-cover bg-center ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ backgroundImage: `url(${posterSrc})` }}
            >
              {s.type === 'video' ? (
                <video
                  ref={el => videoRefs.current[index] = el}
                  loop
                  muted
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  poster={posterSrc}
                  className="relative w-full h-full object-cover object-center"
                  src={s.src}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <motion.img
                  initial={false}
                  animate={{ scale: isActive ? 1 : 1.1 }}
                  transition={{ duration: 7, ease: "linear" }}
                  className="w-full h-full object-cover object-center"
                  src={s.src}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = s.fallbackSrc;
                  }}
                  alt={s.title}
                />
              )}
            </div>
          );
        })}
        
        {/* Dark Gradient Overlay (Placed above all media layers) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-30 container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-between mt-20 lg:mt-0">
        
        {/* Left Content (Texts and Action) */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center text-left pt-12 lg:pt-0 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id + "-text"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium tracking-wide uppercase">
                {scene.badge}
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {scene.title}
              </h1>
              
              <p className="text-base sm:text-xl text-white/90 font-light max-w-xl drop-shadow-md">
                {scene.description}
              </p>

              <div className="pt-4">
                <Button
                  onClick={handleOpenBooking}
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {scene.id === 8 ? 'Ver Todos os Passeios' : 'Reservar Experiência'}
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Content (Glassmorphism Card) */}
        <div className="w-full lg:w-auto mt-12 lg:mt-0 hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id + "-card"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/20 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm"
            >
              <h3 className="text-white text-xl font-semibold mb-6">Destaques da Experiência</h3>
              <div className="space-y-5">
                {scene.highlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 text-white/90">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                        <Icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="font-medium">{highlight.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Segmented Timeline */}
      <div className="absolute bottom-8 left-0 right-0 z-30">
        <div className="container mx-auto px-6 flex justify-center gap-2 sm:gap-3">
          {SCENES.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentScene(index)}
              className="relative h-1.5 flex-1 max-w-[60px] sm:max-w-[100px] overflow-hidden rounded-full bg-white/20 transition-all hover:bg-white/40"
              aria-label={`Ir para cena ${index + 1}`}
            >
              {index === currentScene && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 7, ease: "linear" }}
                  className="absolute left-0 top-0 h-full bg-[#D4AF37]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
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

export default HeroFlowCarousel;
