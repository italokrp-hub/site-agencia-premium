import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Check, Car, Plane, Map, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transfers, tours, formatPrice } from '@/data/catalog';
import BookingModal from '@/components/BookingModal';

const Pricing = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState('transfers');
  const [bookingItem, setBookingItem] = useState(null);

  const handleOpenBooking = (item, type) => {
    setBookingItem({ ...item, selectedType: type });
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
        </motion.div>

        {activeTab === 'transfers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid gap-6">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-1/3">
                      <div className="w-12 h-12 bg-[#2C7A7B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <transfer.icon className="w-6 h-6 text-[#2C7A7B]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{transfer.title}</h3>
                        <p className="text-xs text-gray-500">{transfer.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                        <div className="text-xs font-semibold text-[#2C7A7B] uppercase mb-1">Privativo</div>
                        <div className="text-2xl font-bold text-gray-900">{formatPrice(transfer.privatePrice)}</div>
                        <div className="text-xs text-gray-500">{transfer.privateNote}</div>
                        <Button
                          onClick={() => handleOpenBooking(transfer, 'Privativo')}
                          variant="ghost"
                          className="mt-2 w-full h-8 text-xs hover:bg-[#2C7A7B] hover:text-white"
                        >
                          Reservar
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Compartilhado</div>
                        <div className="text-2xl font-bold text-gray-900">{formatPrice(transfer.sharedPrice)}</div>
                        <div className="text-xs text-gray-500">{transfer.sharedNote}</div>
                        <Button
                          onClick={() => handleOpenBooking(transfer, 'Compartilhado')}
                          variant="ghost"
                          className="mt-2 w-full h-8 text-xs hover:bg-gray-600 hover:text-white"
                        >
                          Reservar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center bg-[#2C7A7B]/5 rounded-lg p-4 border border-[#2C7A7B]/10">
              <p className="text-[#2C7A7B] font-medium flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Transfers com conforto, ar-condicionado, pontualidade e motoristas credenciados.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border-t-4 ${
                    tour.type === 'Privativo' ? 'border-[#D4AF37]' : 'border-[#2C7A7B]'
                  }`}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        tour.type === 'Privativo'
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'bg-[#2C7A7B]/10 text-[#2C7A7B]'
                      }`}>
                        {tour.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900">{formatPrice(tour.unitPrice)}</span>
                      <p className="text-xs text-gray-500 mt-1">{tour.per}</p>
                    </div>

                    <ul className="space-y-3 mb-6 flex-1">
                      {tour.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-[#2C7A7B] mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleOpenBooking(tour, tour.type)}
                      className={`w-full font-semibold ${
                        tour.type === 'Privativo'
                          ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-white'
                          : 'bg-[#2C7A7B] hover:bg-[#1A5557] text-white'
                      }`}
                    >
                      Reservar Agora
                    </Button>
                  </div>
                </div>
              ))}
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
