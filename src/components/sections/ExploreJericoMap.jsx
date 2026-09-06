import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { MapPin, ArrowRight, Compass, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toursData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

// ─────────────────────────────────────────────────────────────────────────────
// Destination data for Jericoacoara coastal route
// ─────────────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    id: 'jeri-centro',
    name: 'Vila de Jericoacoara',
    region: 'Vila & Centro',
    icon: '🏖️',
    badge: 'Ponto Central',
    // Coastline canvas coordinates (% relative to map area)
    x: 48,
    y: 35,
    tagline: 'O coração pulsante do paraíso',
    description: 'Ruas cobertas de areia fina, vilarejo charmoso sem postes nem asfalto, gastronomia internacional e a energia mística de Jeri.',
    highlights: ['Ruas de Areia', 'Duna do Pôr do Sol', 'Gastronomia & Nightlife'],
    image: 'https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=800&q=75',
    relatedCatalogIds: [],
    accentColor: '#D4AF37',
  },
  {
    id: 'pedra-furada',
    name: 'Pedra Furada',
    region: 'Litoral Leste',
    icon: '🪨',
    badge: 'Cartão Postal',
    x: 58,
    y: 25,
    tagline: 'Escultura natural lapidada pelas ondas',
    description: 'Arco rochoso magnífico à beira-mar. Em julho, o sol se põe exatamente no centro da fenda da pedra.',
    highlights: ['Caminhada Ecológica', 'Foto Icônica', 'Fenda do Sol'],
    image: '/images/transfer-4x4-dunas.webp',
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    accentColor: '#2C7A7B',
  },
  {
    id: 'arvore-preguica',
    name: 'Árvore da Preguiça',
    region: 'Litoral Leste',
    icon: '🌴',
    badge: 'Roteiro Leste',
    x: 68,
    y: 32,
    tagline: 'Inclinada pelos ventos alísios do Atlântico',
    description: 'Uma planta da espécie mangue-de-botão que cresceu deitada em direção à praia por conta dos ventos constantes.',
    highlights: ['Beira da Praia', 'Parada Fotográfica', 'Ventos Alísios'],
    image: '/images/transfer-4x4-dunas.webp',
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    accentColor: '#2C7A7B',
  },
  {
    id: 'lagoa-paraiso',
    name: 'Lagoa do Paraíso',
    region: 'Litoral Leste',
    icon: '💎',
    badge: 'Destaque Imperdível',
    x: 82,
    y: 62,
    tagline: 'Redes dentro d’água e azul cristalino',
    description: 'A mais famosa lagoa de águas mornas e transparentes do Ceará, cercada por beach clubs sofisticados e redes flutuantes.',
    highlights: ['Redes na Água', 'Beach Clubs Sophisticated', 'Águas Cristalinas'],
    image: '/videos/lagoa_do_paraiso.jpg',
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    accentColor: '#059669',
  },
  {
    id: 'buraco-azul',
    name: 'Buraco Azul Caiçara',
    region: 'Litoral Leste',
    icon: '🔵',
    badge: 'Roteiro Leste',
    x: 88,
    y: 48,
    tagline: 'Oásis de azul turquesa surreal',
    description: 'Lagoa formada por águas da chuva com tonalidade azul turquesa intensa devido ao solo calcário da região.',
    highlights: ['Azul Turquesa Intenso', 'Mergulho', 'Cenário Único'],
    image: '/videos/video-lagoaazul.jpg',
    relatedCatalogIds: ['tour-leste-private', 'tour-leste-shared'],
    accentColor: '#2563EB',
  },
  {
    id: 'lagoa-tatajuba',
    name: 'Lagoa da Tatajuba',
    region: 'Litoral Oeste',
    icon: '🎢',
    badge: 'Aventura Oeste',
    x: 25,
    y: 48,
    tagline: 'Dunas móveis, tirolesa e esquibunda',
    description: 'Oceano de dunas brancas com lagoas calmas de água doce, restaurantes pé-na-areia com peixe fresco e brinquedos de aventura.',
    highlights: ['Tirolesa nas Dunas', 'Esquibunda', 'Peixe na Brasa'],
    image: '/images/passeio-utv-maverick.webp',
    relatedCatalogIds: ['tour-oeste-private', 'tour-oeste-shared'],
    accentColor: '#D97706',
  },
  {
    id: 'mangue-seco',
    name: 'Mangue Seco & Cavalos-Marinhos',
    region: 'Litoral Oeste',
    icon: '🌿',
    badge: 'Ecoturismo',
    x: 16,
    y: 38,
    tagline: 'Ecossistema único e passeio de balsa',
    description: 'Santuário ecológico com travessia de balsa tradicional, raízes aéreas de mangues e santuário dos cavalos-marinhos.',
    highlights: ['Cavalos-Marinhos', 'Balsa Tradicional', 'Manguezal Preservado'],
    image: '/images/transfer-hilux.webp',
    relatedCatalogIds: ['tour-oeste-private', 'tour-oeste-shared'],
    accentColor: '#16A34A',
  },
  {
    id: 'duna-por-do-sol',
    name: 'Duna do Pôr do Sol',
    region: 'Vila & Centro',
    icon: '🌅',
    badge: 'Espetáculo Diário',
    x: 44,
    y: 20,
    tagline: 'O ritual mais bonito do fim de tarde',
    description: 'Duna gigante ao lado da vila onde turistas e locais se reúnem diariamente para aplaudir o sol submergindo no mar.',
    highlights: ['Pôr do Sol no Mar', 'Vista 360°', 'Tradição Local'],
    image: 'https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=800&q=75',
    relatedCatalogIds: ['tour-leste-private'],
    accentColor: '#EA580C',
  },
];

const REGIONS = [
  { id: 'todos', label: 'Todos os Destinos' },
  { id: 'Litoral Leste', label: 'Litoral Leste' },
  { id: 'Litoral Oeste', label: 'Litoral Oeste' },
  { id: 'Vila & Centro', label: 'Vila & Centro' },
];

function getRelatedTours(catalogIds) {
  return catalogIds
    .map((id) => toursData.find((t) => t.id === id))
    .filter(Boolean);
}

const ExploreJericoMap = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const shouldReduceMotion = useReducedMotion();

  const [activeRegion, setActiveRegion] = useState('todos');
  const [selectedDestId, setSelectedDestId] = useState('lagoa-paraiso');
  const [bookingItem, setBookingItem] = useState(null);

  const filteredDestinations = DESTINATIONS.filter(
    (d) => activeRegion === 'todos' || d.region === activeRegion
  );

  const currentDest =
    DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];
  const relatedTours = getRelatedTours(currentDest.relatedCatalogIds);

  const handleBook = (tour) => {
    const raw = tour?.raw || tour;
    const isShared = raw.options?.shared?.available && !raw.options?.private?.available;
    setBookingItem({
      ...raw,
      selectedType: isShared ? 'Compartilhado' : 'Privativo',
      selectedVehicleType: raw.options?.private?.vehicles?.[0]?.type || 'Buggy',
    });
  };

  return (
    <section id="mapa" className="py-20 md:py-28 bg-[#FAF8F5] relative overflow-hidden">
      {/* Soft background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2C7A7B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C7A7B]/10 text-[#2C7A7B] text-xs font-bold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            Guia Geográfico
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Mapa Interativo dos <span className="text-[#2C7A7B]">Destinos</span>
          </h2>
          <p className="mt-3 text-gray-600 text-base max-w-xl mx-auto">
            Explore os pontos turísticos mais bonitos de Jericoacoara divididos entre o Litoral Leste e Oeste.
          </p>

          {/* Region Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeRegion === r.id
                    ? 'bg-[#2C7A7B] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2C7A7B] hover:text-[#2C7A7B]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Map Container: Dual View (Visual Coastal Canvas + Active Destination Spotlight) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Clean Editorial Coastal Map Canvas (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-lg relative overflow-hidden"
          >
            {/* Coastal Canvas Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2C7A7B]" />
                <h3 className="font-bold text-gray-900 text-base">Percurso Turístico da Costa</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                Selecione um local no mapa
              </span>
            </div>

            {/* Styled Coastal Canvas */}
            <div
              className="relative w-full rounded-2xl bg-gradient-to-b from-[#F0F7F7] via-[#FAF8F5] to-[#F5EFE6] border border-gray-200/60 overflow-hidden shadow-inner"
              style={{ aspectRatio: '16/10', minHeight: '340px' }}
            >
              {/* Subtle Coastal Water Edge */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-[#2C7A7B]/10 rounded-b-[40%] blur-sm pointer-events-none" />
              <div className="absolute top-2 left-6 pointer-events-none">
                <span className="text-[11px] font-bold tracking-widest text-[#2C7A7B]/40 uppercase">
                  Oceano Atlântico
                </span>
              </div>

              {/* Litoral Divider Labels */}
              <div className="absolute bottom-3 left-4 pointer-events-none">
                <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-wider bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/60">
                  ← Litoral Oeste (Dunas & Aventuras)
                </span>
              </div>
              <div className="absolute bottom-3 right-4 pointer-events-none">
                <span className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-wider bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Litoral Leste (Lagoas) →
                </span>
              </div>

              {/* Pins placed on the Coastal Map Canvas */}
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDestId === dest.id;
                return (
                  <motion.button
                    key={dest.id}
                    onClick={() => setSelectedDestId(dest.id)}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md transition-all duration-300 z-20 ${
                      isSelected
                        ? 'bg-[#2C7A7B] text-white ring-4 ring-[#2C7A7B]/20 scale-105 shadow-xl'
                        : 'bg-white/95 text-gray-800 hover:bg-white hover:text-[#2C7A7B] border border-gray-200/80'
                    }`}
                    style={{
                      left: `${dest.x}%`,
                      top: `${dest.y}%`,
                    }}
                  >
                    <span className="text-sm leading-none">{dest.icon}</span>
                    <span className="text-xs font-bold whitespace-nowrap">{dest.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Destination Quick Pill selector list below canvas */}
            <div className="mt-5 flex flex-wrap gap-2">
              {filteredDestinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDestId(d.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1 ${
                    selectedDestId === d.id
                      ? 'bg-[#2C7A7B]/10 text-[#2C7A7B] font-bold border border-[#2C7A7B]/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{d.icon}</span>
                  {d.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Active Destination Spotlight Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 shadow-lg overflow-hidden flex flex-col h-full"
          >
            {/* Active Destination Header Image */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentDest.id}
                  src={currentDest.image}
                  alt={currentDest.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#D4AF37] text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {currentDest.badge}
                </span>
                <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  {currentDest.region}
                </span>
              </div>

              {/* Destination Title on Image */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white leading-tight flex items-center gap-2">
                  <span>{currentDest.icon}</span>
                  {currentDest.name}
                </h3>
                <p className="text-white/80 text-xs font-medium mt-1">
                  {currentDest.tagline}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {currentDest.description}
                </p>

                {/* Highlights */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Destaques do Local:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentDest.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Tours & Booking Action */}
              <div className="pt-4 border-t border-gray-100 mt-auto">
                {relatedTours.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Passeios que incluem este destino:
                    </span>
                    {relatedTours.map((tour) => {
                      const startPrice =
                        tour.options?.private?.vehicles?.[0]?.price ||
                        tour.options?.shared?.price;
                      return (
                        <div
                          key={tour.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 hover:border-[#2C7A7B] transition-all duration-200"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="font-bold text-gray-900 text-xs truncate">
                              {tour.title}
                            </h4>
                            {startPrice && (
                              <p className="text-[#2C7A7B] text-xs font-extrabold">
                                a partir de {formatPrice(startPrice)}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleBook(tour)}
                            size="sm"
                            className="bg-[#2C7A7B] hover:bg-[#235f60] text-white text-xs font-bold rounded-xl h-8 shrink-0"
                          >
                            Reservar
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500 mb-3">
                      Ponto turístico no centro do vilarejo de Jericoacoara.
                    </p>
                    <a
                      href="#tours"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#2C7A7B] hover:underline"
                    >
                      Ver todos os passeios disponíveis
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
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

export default ExploreJericoMap;
