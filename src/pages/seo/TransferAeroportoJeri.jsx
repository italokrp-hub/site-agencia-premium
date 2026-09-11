import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plane, CheckCircle, ShieldCheck, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import BookingModal from '@/components/BookingModal';
import { transfersData, formatPrice } from '@/data/catalog';

const TransferAeroportoJeri = () => {
  const [bookingItem, setBookingItem] = useState(null);

  // Load actual data from catalog
  const cruzTransfer = transfersData.find(t => t.id === 'cruz');

  const handleWhatsApp = () => {
    openWhatsApp("Olá! Chego pelo Aeroporto de Cruz (JJD) e quero saber mais sobre o Transfer até a Vila de Jericoacoara.");
  };

  const handleBook = (item, modality) => {
    setBookingItem({
      ...item,
      initialModality: modality
    });
  };

  return (
    <SEOLayout 
      title="Transfer Aeroporto Jericoacoara (JJD) para a Vila | Jericoacoara Premium"
      description="Desembarque com tranquilidade no Aeroporto Regional de Jericoacoara (Cruz). Transfer direto para sua pousada em veículos 4x4 com conforto e pontualidade."
      canonical="https://jericoacoarapremium.com/transfer-aeroporto-jericoacoara"
    >
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-60"
            alt="Aeroporto de Jericoacoara Cruz"
            src="/images/transfer-hilux.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full mb-6 font-semibold uppercase tracking-widest text-sm backdrop-blur-sm">
            Aeroporto de Cruz (JJD)
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
          >
            Transfer do Aeroporto de Jericoacoara direto para sua Pousada
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light"
          >
            O trajeto leva apenas ~45 minutos. Chegue no paraíso sem estresse com nossa frota 4x4.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Button
              onClick={() => {
                const element = document.querySelector('#opcoes');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              Ver Opções de Transfer
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recepção Premium no Desembarque</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all">
              <Plane className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Monitoramento de Voo</h3>
              <p className="text-sm text-gray-600">Acompanhamos possíveis atrasos da Azul ou Gol para garantir que seu motorista estará lá.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all">
              <CheckCircle className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Recepção com Placa</h3>
              <p className="text-sm text-gray-600">Estaremos lhe aguardando na área de desembarque com seu nome para facilitar o encontro.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all">
              <ShieldCheck className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Acesso ao Parque Nacional</h3>
              <p className="text-sm text-gray-600">Nossos veículos 4x4 credenciados cruzam o parque e as dunas direto para o centro da vila.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all">
              <Clock className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Trajeto Super Rápido</h3>
              <p className="text-sm text-gray-600">Apenas ~45 minutos separam você de um banho de mar após sair do avião.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Opções e Preços */}
      <section id="opcoes" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha a Categoria Ideal (Saindo de JJD)</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Compartilhado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Transfer Compartilhado</h3>
                <p className="opacity-90 text-sm mt-1">Saindo do Aeroporto JJD</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(cruzTransfer?.options?.shared?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /pessoa (trecho)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Ida e Volta: selecione a opção no checkout para agendar o retorno</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Ideal para viajantes solo ou casais.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Horários alinhados com a chegada dos voos (Azul e Gol).</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Veículos 4x4 (Hilux ou SW4) compartilhados.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(cruzTransfer, 'shared')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-lg relative">
                  Reservar Compartilhado
                  <span className="absolute -top-3 right-2 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-200">
                    Economize 5% pagando via PIX
                  </span>
                </Button>
              </div>
            </div>

            {/* Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#2C7A7B] flex flex-col h-full hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm">
                Exclusivo
              </div>
              <div className="bg-[#2C7A7B] text-white p-6 text-center pt-8">
                <h3 className="text-2xl font-bold">Privativo VIP</h3>
                <p className="opacity-90 text-sm mt-1">Hilux / SW4 Exclusiva</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(cruzTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /veículo (trecho)</span>
                </div>
                <p className="text-xs text-white/70 mt-2">Ida e Volta: selecione a opção no checkout para agendar o retorno</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Exclusividade total. Só você e sua família/amigos.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Deslocamento imediato assim que você pegar as malas.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Motorista à disposição no desembarque com placa de identificação.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Sem tempo de espera por outros passageiros.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(cruzTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-lg text-white relative">
                  Reservar Privativo
                  <span className="absolute -top-3 right-2 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-200">
                    Economize 5% pagando via PIX
                  </span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={handleWhatsApp} variant="ghost" className="text-gray-500 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Falar com suporte via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {bookingItem && (
        <BookingModal
          item={bookingItem}
          open={!!bookingItem}
          onOpenChange={(open) => !open && setBookingItem(null)}
        />
      )}
    </SEOLayout>
  );
};

export default TransferAeroportoJeri;
