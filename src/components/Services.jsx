import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Waves, Compass, Map, Plane, Car, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allServices, tours, toursData } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

const iconMap = {
  'Passeios Lado Leste': Waves,
  'Passeios Lado Oeste': Compass,
  'Roteiros Personalizados': Map,
  'Passeio de Helicóptero': Plane,
  'Passeio de UTV': Car,
};

const Services = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [bookingItem, setBookingItem] = useState(null);

  const handleScrollToPricing = () => {
    const element = document.querySelector('#valores');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickBook = (service) => {
    if (service.tourIds.length === 1) {
      const tourId = service.tourIds[0];
      const tour = toursData.find((t) => t.id === tourId) || tours.find((t) => t.id === tourId);
      if (tour) {
        const isShared = tour.options?.shared?.available && !tour.options?.private?.available;
        setBookingItem({
          ...tour,
          selectedType: isShared ? 'Compartilhado' : 'Privativo',
          selectedVehicleType: tour.options?.private?.vehicles?.[0]?.type || 'Buggy',
        });
      } else {
        handleScrollToPricing();
      }
    } else {
      handleScrollToPricing();
    }
  };

  return (
    <section id="servicos" className="py-12 md:py-20 bg-zinc-50/50 dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Frota & Roteiros Certificados</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Nossos <span className="text-emerald-600 dark:text-emerald-500">Serviços</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal">
            Experiências completas com a garantia de qualidade Jericoacoara Premium
          </p>
        </motion.div>

        <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-8 max-w-7xl overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 pb-4 md:pb-0 md:mx-auto md:px-0">
          {allServices.map((service, index) => {
            const Icon = iconMap[service.title] || Map;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="w-[82vw] sm:w-[360px] md:w-auto snap-center flex-shrink-0 md:shrink group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Imagem Flexível Mobile */}
                <div className="relative h-[180px] sm:h-[220px] md:h-[260px] w-full shrink-0 rounded-t-2xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={service.title}
                    src={service.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-zinc-200/50 dark:border-zinc-800">
                    <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm">
                      Jericoacoara Premium
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-400" /> 5% OFF no PIX
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <Button
                      onClick={() => handleQuickBook(service)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 h-12 rounded-xl transition-all duration-300 shadow-md hover:shadow-emerald-600/20"
                    >
                      {service.tourIds.length === 1 ? 'Reservar Agora' : 'Ver Valores Detalhados'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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

export default Services;
