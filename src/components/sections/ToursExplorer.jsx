import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'compartilhado', label: 'Compartilhados' },
  { id: 'privativo', label: 'Privativos' },
  { id: 'premium', label: 'Premium' },
];

const ToursExplorer = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeFilter, setActiveFilter] = useState('todos');
  const [bookingItem, setBookingItem] = useState(null);

  const filteredTours = useMemo(() => {
    if (activeFilter === 'todos') return toursData;
    if (activeFilter === 'compartilhado') return toursData.filter((t) => t.options?.shared?.available);
    if (activeFilter === 'privativo') return toursData.filter((t) => t.options?.private?.available && !t.requireWhatsApp);
    if (activeFilter === 'premium') return toursData.filter((t) => t.requireWhatsApp);
    return toursData;
  }, [activeFilter]);

  const handleBook = (tour) => {
    if (tour.requireWhatsApp) {
      window.open(
        `https://wa.me/5592981038749?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre: ${tour.title}`)}`,
        '_blank'
      );
      return;
    }
    const isShared = tour.options?.shared?.available && !tour.options?.private?.available;
    setBookingItem({
      ...tour,
      selectedType: isShared ? 'Compartilhado' : 'Privativo',
      selectedVehicleType: tour.options?.private?.vehicles?.[0]?.type || 'Buggy',
    });
  };

  function getTourStartingPrice(tour) {
    if (tour.requireWhatsApp) return null;
    const sharedPrice = tour.options?.shared?.price;
    const vehicles = tour.options?.private?.vehicles;
    if (!tour.options?.private?.available && sharedPrice) return sharedPrice;
    if (vehicles?.length) return vehicles[0].price;
    if (sharedPrice) return sharedPrice;
    return null;
  }

  function getTourPriceLabel(tour) {
    if (!tour.options?.private?.available && tour.options?.shared?.available) return 'por pessoa';
    return 'por veículo';
  }

  return (
    <section id="tours" className="py-20 md:py-28 bg-[#F7F3E9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[#2C7A7B] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Roteiros
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Explore nossos <span className="text-[#2C7A7B]">passeios</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto">
            Do compartilhado econômico ao privativo exclusivo — escolha como você quer explorar Jericoacoara.
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-10 flex-wrap"
        >
          <Filter className="w-4 h-4 text-gray-400 mr-1" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === f.id
                  ? 'bg-[#2C7A7B] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2C7A7B] hover:text-[#2C7A7B]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Tours grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTours.map((tour, index) => {
            const isPremium = tour.requireWhatsApp;
            const startPrice = getTourStartingPrice(tour);
            const priceLabel = getTourPriceLabel(tour);
            const vehicles = tour.options?.private?.vehicles || [];
            const isSharedOnly = tour.options?.shared?.available && !tour.options?.private?.available;

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {isPremium && (
                      <span className="bg-[#D4AF37] text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Premium
                      </span>
                    )}
                    {isSharedOnly && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Compartilhado
                      </span>
                    )}
                    {!isPremium && !isSharedOnly && (
                      <span className="bg-[#2C7A7B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Privativo
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 leading-snug">{tour.title}</h3>

                  {/* Locations */}
                  {tour.locations && (
                    <ul className="space-y-1.5 mb-4">
                      {tour.locations.slice(0, 4).map((loc) => (
                        <li key={loc} className="flex items-start gap-1.5 text-xs text-gray-500">
                          <Check className="w-3 h-3 text-[#2C7A7B] mt-0.5 shrink-0" />
                          {loc}
                        </li>
                      ))}
                      {tour.locations.length > 4 && (
                        <li className="text-xs text-gray-400 pl-4">+{tour.locations.length - 4} paradas</li>
                      )}
                    </ul>
                  )}

                  {/* Vehicle pills */}
                  {vehicles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {vehicles.map((v) => (
                        <span
                          key={v.type}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md"
                        >
                          {v.type} · {formatPrice(v.price)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description for premium */}
                  {tour.description && (
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">{tour.description}</p>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {isPremium ? (
                      <p className="text-[#D4AF37] font-bold text-base mb-3">Sob consulta</p>
                    ) : startPrice ? (
                      <div className="mb-3">
                        <span className="text-xs text-gray-400 block">A partir de</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-[#2C7A7B]">{formatPrice(startPrice)}</span>
                          <span className="text-xs text-gray-400">{priceLabel}</span>
                        </div>
                      </div>
                    ) : null}

                    <Button
                      onClick={() => handleBook(tour)}
                      className={`w-full h-11 text-sm font-bold rounded-xl transition-all duration-300 ${
                        isPremium
                          ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900'
                          : 'bg-[#2C7A7B] hover:bg-[#235f60] text-white'
                      }`}
                    >
                      {isPremium ? 'Consultar no WhatsApp' : 'Reservar agora'}
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

export default ToursExplorer;
