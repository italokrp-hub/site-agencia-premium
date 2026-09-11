import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, ShieldCheck, Map, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import BookingModal from '@/components/BookingModal';
import { transfersData, formatPrice } from '@/data/catalog';

const TransferPreaJeri = () => {
  const [bookingItem, setBookingItem] = useState(null);

  // Load actual data from catalog
  const preaTransfer = transfersData.find(t => t.id === 'prea');
  
  const handleWhatsApp = () => {
    openWhatsApp("Olá! Vi a página de Transfer Preá -> Jericoacoara e gostaria de tirar uma dúvida.");
  };

  const handleBook = (item, modality) => {
    setBookingItem({
      ...item,
      initialModality: modality
    });
  };

  return (
    <SEOLayout 
      title="Transfer Preá para Jericoacoara 4x4 | Jericoacoara Premium"
      description="Deslocamento rápido e confortável entre a Praia do Preá e a Vila de Jeri via praia e dunas do Parque Nacional."
      canonical="https://jericoacoarapremium.com/transfer-prea-jericoacoara"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 nas dunas do Preá"
            src="/images/transfer-4x4-dunas.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transfer Preá <span className="text-[#D4AF37]">Jericoacoara</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light"
          >
            Conexão rápida e exclusiva entre a Praia do Preá e Jericoacoara via beira-mar e Parque Nacional.
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
              Ver Opções Exclusivas
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">A Melhor Rota do Preá para Jeri</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Shield className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Trajeto Off-Road Seguro</h3>
              <p className="text-gray-600">Nossos veículos são preparados e os motoristas treinados para cruzar as areias e dunas que separam o Preá da Vila de Jeri.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Conveniência Porta a Porta</h3>
              <p className="text-gray-600">Te buscamos diretamente no seu hotel/pousada no Preá e te deixamos exatamente onde você vai se hospedar em Jeri.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Map className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Visuais Incríveis</h3>
              <p className="text-gray-600">O transfer não é só um deslocamento, é um breve passeio. Curta a paisagem do litoral enquanto se dirige a Jericoacoara.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Opções */}
      <section id="opcoes" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Transfer Exclusivo (4x4)</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="flex justify-center">
            {/* Privativo 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37] flex flex-col w-full relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                VIP
              </div>
              <div className="bg-[#2C7A7B] text-white p-8 text-center pt-10">
                <h3 className="text-2xl font-bold">Privativo 4x4</h3>
                <p className="opacity-90 text-sm mt-1">Hilux / SW4 (Até 4 pax)</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatPrice(preaTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /veículo (trecho)</span>
                </div>
                <p className="text-xs text-white/70 mt-2">Ida e Volta: selecione a opção no checkout para agendar o retorno</p>
              </div>
              <div className="p-8 flex-grow bg-gray-50">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Exclusividade total. Só você e sua família/amigos.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Viagem super rápida (aprox. 30 a 40 min).</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Horário flexível: saia na hora que desejar.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Acomoda perfeitamente suas pranchas de Kite (avise com antecedência).</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto bg-gray-50 space-y-3">
                <Button onClick={() => handleBook(preaTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-14 text-lg text-white relative shadow-md hover:shadow-xl transition-all">
                  Reservar Transfer Privativo
                  <span className="absolute -top-3 right-4 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-200 shadow-sm">
                    Economize 5% pagando via PIX
                  </span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={handleWhatsApp} variant="ghost" className="text-gray-500 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Precisa de ajuda ou horário especial? Fale conosco
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

export default TransferPreaJeri;
