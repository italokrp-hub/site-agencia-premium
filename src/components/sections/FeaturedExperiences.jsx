import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ArrowRight, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData, transfersData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';
import ExperienceDetailsDrawer from '@/components/experience/ExperienceDetailsDrawer';

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
  const [drawerItem, setDrawerItem] = useState(null);

  const handleViewDetails = (item) => {
    setDrawerItem(item);
  };

  // Called from cards or from the drawer — triggers BookingModal
  const handleBook = (item) => {
    const raw = item?.raw || item;
    if (!raw) return;
    const isShared = raw.options?.shared?.available && !raw.options?.private?.available;
    setBookingItem({
      ...raw,
      selectedType: isShared ? 'Compartilhado' : 'Privativo',
      selectedVehicleType:
        raw.options?.private?.vehicles?.[0]?.type ||
        raw.options?.private?.tiers?.[0]?.vehicle ||
        'Buggy',
    });
    setDrawerItem(null);
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
                {/* Image — click opens drawer */}
                <div
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => handleViewDetails(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${item.title}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* "Ver detalhes" hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Ver detalhes
                    </span>
                  </div>

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
                  <h3
                    className="font-bold text-gray-900 text-base leading-snug mb-2 cursor-pointer hover:text-[#2C7A7B] transition-colors"
                    onClick={() => handleViewDetails(item)}
                  >
                    {item.title}
                  </h3>

                  {/* Locations */}
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

                  {/* Price + CTAs */}
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

                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={() => handleViewDetails(item)}
                        variant="outline"
                        className="flex-1 h-9 text-xs font-bold rounded-xl border-gray-200 text-gray-600 hover:border-[#2C7A7B] hover:text-[#2C7A7B] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Detalhes
                      </Button>

                      <Button
                        onClick={() =>
                          isWhatsAppOnly
                            ? window.open(
                                `https://wa.me/5592981038749?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre: ${item.title}`)}`,
                                '_blank'
                              )
                            : handleBook(item)
                        }
                        className={`flex-1 h-9 text-xs font-bold rounded-xl transition-all duration-300 ${
                          isWhatsAppOnly
                            ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900'
                            : 'bg-[#2C7A7B] hover:bg-[#235f60] text-white'
                        }`}
                      >
                        {isWhatsAppOnly ? 'WhatsApp' : 'Reservar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Experience Details Drawer */}
      <ExperienceDetailsDrawer
        item={drawerItem}
        open={!!drawerItem}
        onClose={() => setDrawerItem(null)}
        onBook={handleBook}
      />

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
