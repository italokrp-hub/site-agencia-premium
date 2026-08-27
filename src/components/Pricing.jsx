import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Check, Moon, ArrowRightLeft, Car, CreditCard, Tag, Flame, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transfersData, toursData, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

const Pricing = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState('transfers');
  const [bookingItem, setBookingItem] = useState(null);

  const handleOpenBooking = (item, type = 'Privativo', tripType = 'roundTrip', selectedVehicleType = 'Buggy') => {
    setBookingItem({
      ...item,
      selectedType: type,
      selectedTripType: tripType,
      selectedVehicleType: selectedVehicleType,
    });
  };

  return (
    <section id="valores" className="py-20 bg-gradient-to-b from-white to-[#F7F3E9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Tabela de <span className="text-[#2C7A7B]">Preços</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Transparência e qualidade para sua viagem perfeita
          </p>

          <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-inner mb-8">
            <button
              onClick={() => setActiveTab('transfers')}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 'transfers'
                  ? 'bg-[#2C7A7B] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2C7A7B]'
              }`}
            >
              Transfers
            </button>
            <button
              onClick={() => setActiveTab('tours')}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === 'tours'
                  ? 'bg-[#2C7A7B] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2C7A7B]'
              }`}
            >
              Passeios
            </button>
          </div>

          {/* Selo de Condição de Pagamento e Parcelamento */}
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-[#2C7A7B]/20 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2C7A7B]/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[#2C7A7B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Parcelamos em até 10x no cartão
                </p>
                <p className="text-[11px] text-gray-500">
                  *Consulte taxas da operadora para parcelamento.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#25D366]/10 px-3.5 py-1.5 rounded-xl border border-[#25D366]/30 text-xs font-bold text-[#1E7E43] shrink-0">
              <Tag className="w-4 h-4 text-[#25D366]" />
              <span>5% OFF no PIX</span>
            </div>
          </div>
        </motion.div>

        {activeTab === 'transfers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid gap-6">
              {transfersData.map((transfer) => {
                const IconComponent = transfer.icon || Car;
                const sharedOpt = transfer.options.shared;
                const privateOpt = transfer.options.private;

                return (
                  <div
                    key={transfer.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                      {/* Título & Ícone */}
                      <div className="flex items-center gap-4 w-full md:w-1/3">
                        <div className="w-12 h-12 bg-[#2C7A7B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-[#2C7A7B]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{transfer.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <ArrowRightLeft className="w-3 h-3 text-[#2C7A7B]" />
                              Ida ou Ida e Volta
                            </span>
                            {transfer.nightFee && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Moon className="w-3 h-3 text-amber-600" />
                                Taxa Noturna (>=18h)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Opções Privativo vs Compartilhado */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {/* Privativo */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col justify-between">
                          <div>
                            <div className="text-xs font-semibold text-[#2C7A7B] uppercase mb-1">
                              Privativo
                            </div>
                            {privateOpt?.tiers ? (
                              <div className="space-y-1.5 my-2">
                                {privateOpt.tiers.map((tier, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-gray-700">
                                      {tier.vehicle} ({tier.maxCapacity}p):
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      {formatPrice(tier.roundTrip)}{' '}
                                      <span className="text-[10px] text-gray-400 font-normal">(I/V)</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-2xl font-bold text-gray-900">Sob consulta</div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleOpenBooking(transfer, 'Privativo')}
                            variant="ghost"
                            className="mt-3 w-full h-8 text-xs font-bold hover:bg-[#2C7A7B] hover:text-white border border-[#2C7A7B]/20"
                          >
                            Reservar Privativo
                          </Button>
                        </div>

                        {/* Compartilhado */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-xs font-semibold text-gray-500 uppercase">
                                Compartilhado
                              </div>
                              {sharedOpt?.available && (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full flex items-center gap-0.5">
                                  <Flame className="w-3 h-3 text-orange-500" /> 🔥 Mais Vendido
                                </span>
                              )}
                            </div>
                            {sharedOpt?.available ? (
                              <div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {formatPrice(sharedOpt.roundTrip)}
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  Ida e Volta (por pessoa)
                                </div>
                                <div className="text-[11px] text-gray-400 mt-1">
                                  Somente Ida: {formatPrice(sharedOpt.oneWay)}
                                </div>
                              </div>
                            ) : (
                              <div className="py-3 text-center">
                                <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                                  Somente Privativo
                                </span>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleOpenBooking(transfer, 'Compartilhado')}
                            disabled={!sharedOpt?.available}
                            variant="ghost"
                            className="mt-3 w-full h-8 text-xs font-bold hover:bg-gray-600 hover:text-white border border-gray-200 disabled:opacity-40"
                          >
                            {sharedOpt?.available ? 'Reservar Compartilhado' : 'Indisponível'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center bg-[#2C7A7B]/5 rounded-lg p-4 border border-[#2C7A7B]/10">
              <p className="text-[#2C7A7B] font-medium flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Transfers com conforto, ar-condicionado, pontualidade e motoristas credenciados. Desconto de 5% no PIX!
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'tours' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toursData.map((tour) => {
                const isPremium = tour.requireWhatsApp;
                const isSharedOnly = tour.options?.shared?.available && !tour.options?.private?.available;
                const isPrivateOnly = tour.options?.private?.available && !tour.options?.shared?.available;

                const sharedPrice = tour.options?.shared?.price;
                const vehicles = tour.options?.private?.vehicles || [];
                const startingPrice = vehicles[0]?.price || 0;

                let borderClass = 'border-[#2C7A7B]';

                return (
                  <div
                    key={tour.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border-t-4 ${
                      isPremium || isPrivateOnly ? 'border-[#D4AF37]' : borderClass
                    }`}
                  >
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Selos / Badges */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          {isPremium && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                              Experiência Premium
                            </span>
                          )}
                          {isSharedOnly && (
                            <>
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2C7A7B]/10 text-[#2C7A7B]">
                                Econômico
                              </span>
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 text-orange-500" /> 🔥 Mais Vendido
                              </span>
                            </>
                          )}
                          {isPrivateOnly && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                              Privativo Exclusivo
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>

                        {/* Preço */}
                        <div className="mb-4">
                          {isPremium ? (
                            <div>
                              <span className="text-2xl font-bold text-[#D4AF37]">Sob Consulta</span>
                              <p className="text-xs text-gray-500 mt-1">Atendimento exclusivo via WhatsApp</p>
                            </div>
                          ) : isSharedOnly ? (
                            <div>
                              <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(sharedPrice)}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">por pessoa (Jardineira)</p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(startingPrice)}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                a partir de (por veículo Buggy ou Quadri)
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Pílulas Visuais de Veículos (Para Passeios Privativos) */}
                        {isPrivateOnly && vehicles.length > 0 && (
                          <div className="mb-4 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5">
                              Veículos Disponíveis:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {vehicles.map((v, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-white text-emerald-700 text-xs font-semibold rounded border border-emerald-200 shadow-2xs"
                                >
                                  {v.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Roteiro Inclui */}
                        {tour.locations && (
                          <div className="space-y-2 mb-6">
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                              Roteiro Inclui:
                            </h4>
                            <ul className="space-y-1.5">
                              {tour.locations.map((loc, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                  <Check className="w-3.5 h-3.5 text-[#2C7A7B] mt-0.5 flex-shrink-0" />
                                  <span>{loc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {tour.description && (
                          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                            {tour.description}
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={() =>
                          handleOpenBooking(
                            tour,
                            isSharedOnly ? 'Compartilhado' : 'Privativo',
                            'roundTrip',
                            vehicles[0]?.type || 'Buggy'
                          )
                        }
                        className={`w-full font-semibold mt-4 ${
                          isPremium || isPrivateOnly
                            ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-white'
                            : 'bg-[#2C7A7B] hover:bg-[#1A5557] text-white'
                        }`}
                      >
                        {isPremium ? 'Consultar no WhatsApp' : isSharedOnly ? 'Reservar Compartilhado' : 'Reservar Privativo'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
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

export default Pricing;
