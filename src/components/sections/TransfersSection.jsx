import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ArrowRight, Car, Plane, MapPin, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transfersData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

const TransfersSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [bookingItem, setBookingItem] = useState(null);
  const [selectedType, setSelectedType] = useState({});

  const handleBook = (transfer, type = 'Privativo') => {
    setBookingItem({
      ...transfer,
      selectedType: type,
      selectedTripType: 'roundTrip',
    });
  };

  const getIcon = (id) => {
    if (id === 'cruz') return Plane;
    if (id === 'onibus-regular') return Car;
    return MapPin;
  };

  return (
    <section id="transfers" className="py-20 md:py-28 bg-[#0F1A1C] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Transfers Seguros & Econômicos
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Transfer mais barato para Jeri{' '}
            <span className="text-[#D4AF37]">com segurança & conforto</span>
          </h2>
          <p className="mt-4 text-white/60 text-base max-w-xl mx-auto">
            Agência segura com motoristas credenciados e reserva 100% garantida. Escolha a opção mais econômica ou o conforto privativo VIP com o melhor preço.
          </p>
        </motion.div>

        {/* Transfers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {transfersData.map((transfer, index) => {
            const Icon = getIcon(transfer.id);
            const sharedOpt = transfer.options.shared;
            const privateOpt = transfer.options.private;
            const currentType = selectedType[transfer.id] || 'privativo';

            return (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.09 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 hover:bg-white/8 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={transfer.image}
                    alt={transfer.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Route label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <h3 className="text-white font-bold text-sm leading-snug">{transfer.title}</h3>
                    </div>
                  </div>

                  {/* Night fee badge */}
                  {transfer.nightFee && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Moon className="w-3 h-3" />
                      Taxa noturna
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Type toggle */}
                  {sharedOpt?.available && privateOpt?.available !== false && (
                    <div className="flex rounded-lg overflow-hidden border border-white/10 mb-4">
                      {[
                        { id: 'privativo', label: 'Privativo' },
                        { id: 'compartilhado', label: 'Compartilhado' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedType((prev) => ({ ...prev, [transfer.id]: t.id }))}
                          className={`flex-1 py-1.5 text-xs font-semibold transition-all duration-200 ${
                            currentType === t.id
                              ? 'bg-[#D4AF37] text-gray-900'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Prices */}
                  <div className="space-y-2 mb-5">
                    {currentType === 'privativo' && privateOpt?.tiers?.map((tier) => (
                      <div key={tier.vehicle} className="flex justify-between items-center text-sm">
                        <span className="text-white/60 text-xs">
                          {tier.vehicle} <span className="text-white/40">(até {tier.maxCapacity}p)</span>
                        </span>
                        <div className="text-right">
                          <span className="text-white font-bold">{formatPrice(tier.roundTrip)}</span>
                          <span className="text-white/40 text-[10px] ml-1">ida/volta</span>
                        </div>
                      </div>
                    ))}

                    {currentType === 'compartilhado' && sharedOpt?.available && (
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-xs">Por pessoa (econômico)</span>
                          <div className="text-right">
                            <span className="text-[#D4AF37] font-bold text-lg">{formatPrice(sharedOpt.roundTrip)}</span>
                            <span className="text-white/40 text-[10px] ml-1">ida/volta</span>
                          </div>
                        </div>
                        <p className="text-[#D4AF37]/80 text-[11px] font-medium mt-1">Opção mais econômica com motoristas credenciados</p>
                      </div>
                    )}

                    {!sharedOpt?.available && currentType === 'compartilhado' && (
                      <p className="text-white/40 text-xs text-center py-2">Somente privativo disponível</p>
                    )}
                  </div>

                  {/* PIX discount reminder */}
                  <div className="flex items-center gap-1.5 mb-4 text-emerald-400">
                    <span className="text-xs font-semibold">5% OFF no PIX</span>
                  </div>

                  <Button
                    onClick={() => handleBook(transfer, currentType === 'compartilhado' ? 'Compartilhado' : 'Privativo')}
                    disabled={currentType === 'compartilhado' && !sharedOpt?.available}
                    className="w-full h-10 text-sm font-bold rounded-xl bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 transition-all duration-300 disabled:opacity-40"
                  >
                    Reservar transfer
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
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

export default TransfersSection;
