import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData, transfersData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

// Curated featured items — referencing catalog IDs, no prices hardcoded
const FEATURED_IDS = [
  { catalogId: 'tour-leste-private', category: 'tour', badge: 'Mais Popular' },
  { catalogId: 'tour-oeste-private', category: 'tour', badge: 'Aventura' },
  { catalogId: 'fortaleza', category: 'transfer', badge: 'Transfer VIP' },
  { catalogId: 'tour-leste-shared', category: 'tour', badge: 'Melhor Custo' },
];

function resolveItem(catalogId, category) {
  if (category === 'tour') return toursData.find((t) => t.id === catalogId);
  return transfersData.find((t) => t.id === catalogId);
}

function getStartingPrice(item, category) {
  if (category === 'tour') {
    if (item.requireWhatsApp) return null;
    const vehicles = item.options?.private?.vehicles;
    if (vehicles?.length) return vehicles[0].price;
    if (item.options?.shared?.price) return item.options.shared.price;
    return null;
  }
  // transfer
  const shared = item.options?.shared;
  const priv = item.options?.private?.tiers;
  if (shared?.available) return shared.oneWay;
  if (priv?.length) return priv[0].oneWay;
  return null;
}

function getPriceLabel(item, category) {
  if (category === 'tour') {
    if (item.requireWhatsApp) return 'Sob consulta';
    if (item.options?.shared?.available && !item.options?.private?.available) return 'por pessoa';
    return 'por veículo';
  }
  if (item.options?.shared?.available) return 'por pessoa · ida';
  return 'por veículo';
}

const FeaturedExperiences = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [bookingItem, setBookingItem] = useState(null);

  const handleBook = (item, category) => {
    if (!item) return;
    const isShared = item.options?.shared?.available && !item.options?.private?.available;
    setBookingItem({
      ...item,
      selectedType: isShared ? 'Compartilhado' : 'Privativo',
      selectedVehicleType: item.options?.private?.vehicles?.[0]?.type || item.options?.private?.tiers?.[0]?.vehicle || 'Buggy',
    });
  };

  const featured = FEATURED_IDS.map(({ catalogId, category, badge }) => {
    const item = resolveItem(catalogId, category);
    if (!item) return null;
    return { item, category, badge };
  }).filter(Boolean);

  return (
    <section id="experiencias" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-[#2C7A7B] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Nossas Experiências
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-lg">
              Experiências que você{' '}
              <span className="text-[#2C7A7B]">não pode perder</span>
            </h2>
          </div>
          <a
            href="#tours"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#tours')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 text-sm font-bold text-[#2C7A7B] hover:text-[#1a5a5b] transition-colors shrink-0"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map(({ item, category, badge }, index) => {
            const startPrice = getStartingPrice(item, category);
            const priceLabel = getPriceLabel(item, category);
            const isWhatsAppOnly = !!item.requireWhatsApp;
            const locations = item.locations || [];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-[#D4AF37] text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {badge}
                  </span>

                  {/* Category chip */}
                  <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full capitalize">
                    {category === 'tour' ? 'Passeio' : 'Transfer'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
                    {item.title}
                  </h3>

                  {/* Locations / description */}
                  {locations.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {locations.slice(0, 3).map((loc) => (
                        <li key={loc} className="flex items-start gap-1.5 text-xs text-gray-500">
                          <Check className="w-3 h-3 text-[#2C7A7B] mt-0.5 shrink-0" />
                          {loc}
                        </li>
                      ))}
                      {locations.length > 3 && (
                        <li className="text-xs text-gray-400">+{locations.length - 3} pontos</li>
                      )}
                    </ul>
                  )}
                  {item.description && !locations.length && (
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {isWhatsAppOnly ? (
                      <p className="text-[#D4AF37] font-bold text-base">Sob consulta</p>
                    ) : startPrice ? (
                      <div>
                        <span className="text-xs text-gray-400">A partir de</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-[#2C7A7B]">
                            {formatPrice(startPrice)}
                          </span>
                          <span className="text-xs text-gray-400">{priceLabel}</span>
                        </div>
                      </div>
                    ) : null}

                    <Button
                      onClick={() => isWhatsAppOnly
                        ? window.open(`https://wa.me/5592981038749?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre: ${item.title}`)}`, '_blank')
                        : handleBook(item, category)
                      }
                      className={`w-full mt-3 h-10 text-sm font-bold rounded-xl transition-all duration-300 ${
                        isWhatsAppOnly
                          ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900'
                          : 'bg-[#2C7A7B] hover:bg-[#235f60] text-white'
                      }`}
                    >
                      {isWhatsAppOnly ? 'Consultar no WhatsApp' : 'Reservar agora'}
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

export default FeaturedExperiences;
