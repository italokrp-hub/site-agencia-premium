import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import BookingModal from '@/components/BookingModal';
import { toursData, formatPrice } from '@/data/catalog';

const PasseiosJeri = () => {
  const [bookingItem, setBookingItem] = useState(null);

  // Load actual data from catalog
  const tourLesteShared = toursData.find(t => t.id === 'tour-leste-shared');
  const tourLestePrivate = toursData.find(t => t.id === 'tour-leste-private');
  const tourOesteShared = toursData.find(t => t.id === 'tour-oeste-shared');
  const tourOestePrivate = toursData.find(t => t.id === 'tour-oeste-private');
  const buggyLesteOpt = tourLestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Buggy');
  const buggyOesteOpt = tourOestePrivate?.options?.private?.vehicles?.find(v => v.type === 'Buggy');

  const handleWhatsApp = () => {
    openWhatsApp("Olá! Quero montar um roteiro personalizado para os passeios Leste e Oeste em Jeri.");
  };

  const handleBook = (item, modality, vehicleType) => {
    setBookingItem({
      ...item,
      initialModality: modality,
      initialVehicle: vehicleType
    });
  };

  return (
    <SEOLayout 
      title="Passeios em Jericoacoara: Lado Leste e Lado Oeste | Jericoacoara Premium"
      description="Conheça a Lagoa do Paraíso, Buraco Azul, Tatajuba e Pedra Furada com os passeios exclusivos de 4x4 e buggy. Roteiros compartilhados (Econômico) e privativos."
      canonical="https://jericoacoarapremium.com/passeios-jericoacoara"
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Passeios em Jericoacoara Lagoa do Paraíso"
            src="https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Explore as Maravilhas de <span className="text-[#D4AF37]">Jericoacoara</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 font-light"
            >
              Descubra os roteiros do Lado Leste e Lado Oeste em Buggy, Quadriciclo ou Jardineira (Econômico) com guias nativos credenciados.
            </motion.p>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <Button
                onClick={() => {
                  const element = document.querySelector('#roteiros');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
              >
                Ver Valores dos Roteiros
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roteiros (Leste) */}
      <section id="roteiros" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Roteiro Lado Leste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              O roteiro perfeito para relaxar nas lagoas de águas cristalinas, visitar a Árvore da Preguiça, o famoso Buraco Azul e a deslumbrante Lagoa do Paraíso (Alchymist).
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Leste Compartilhado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#D4AF37] flex flex-col hover:shadow-xl transition-all relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-gray-900 font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                Econômico / Destaque
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2">Compartilhado em Jardineira</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(tourLesteShared?.options?.shared?.price)}</span>
                  <span className="text-sm opacity-80 text-gray-500"> /pessoa</span>
                </div>
                <h4 className="font-bold text-[#2C7A7B] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Incluso no roteiro:</h4>
                <ul className="space-y-2 mb-8">
                  {tourLesteShared?.locations?.slice(0,4).map((loc, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600"><Check className="text-emerald-500 w-4 h-4 mr-2 shrink-0" /> {loc}</li>
                  ))}
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-emerald-500 w-4 h-4 mr-2 shrink-0" /> Saída do Centro de Jeri</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Button onClick={() => handleBook(tourLesteShared, 'shared', 'Jardineira')} className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold h-12">
                  Reservar Leste Econômico
                </Button>
              </div>
            </div>

            {/* Leste Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-xl transition-all">
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2">Privativo (Buggy / Quadri)</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(buggyLesteOpt?.price)}</span>
                  <span className="text-sm opacity-80 text-gray-500"> /veículo (até 4 pessoas)</span>
                </div>
                <h4 className="font-bold text-[#2C7A7B] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Vantagens Premium:</h4>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Exclusividade total do veículo (Buggy, UTV ou Quadriciclo)</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Tempo livre em cada atração</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Guia fotógrafo para fazer os melhores registros</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Paradas personalizadas no trajeto leste</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Button onClick={() => handleBook(tourLestePrivate, 'private', 'Buggy')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 font-bold">
                  Reservar Leste Privativo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roteiros (Oeste) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Roteiro Lado Oeste</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Aventura garantida nas Dunas de Tatajuba, Mangue Seco, visual de cavalos marinhos e descida emocionante na tirolesa / toboágua.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Oeste Compartilhado */}
            <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-xl transition-all relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                Econômico
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2">Compartilhado em Jardineira</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-[#2C7A7B]">{formatPrice(tourOesteShared?.options?.shared?.price)}</span>
                  <span className="text-sm opacity-80 text-gray-500"> /pessoa</span>
                </div>
                <h4 className="font-bold text-[#2C7A7B] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Incluso no roteiro:</h4>
                <ul className="space-y-2 mb-8">
                  {tourOesteShared?.locations?.slice(0,4).map((loc, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600"><Check className="text-emerald-500 w-4 h-4 mr-2 shrink-0" /> {loc}</li>
                  ))}
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-emerald-500 w-4 h-4 mr-2 shrink-0" /> Travessia de Balsa inclusa</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Button onClick={() => handleBook(tourOesteShared, 'shared', 'Jardineira')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 text-white font-bold h-12">
                  Reservar Oeste Econômico
                </Button>
              </div>
            </div>

            {/* Oeste Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col hover:shadow-xl transition-all">
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold mb-2">Privativo (Buggy / Quadri)</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(buggyOesteOpt?.price)}</span>
                  <span className="text-sm opacity-80 text-gray-500"> /veículo (até 4 pessoas)</span>
                </div>
                <h4 className="font-bold text-[#2C7A7B] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Vantagens Premium:</h4>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Mais aventura pelas trilhas nas dunas da Tatajuba</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Roteiro 100% flexível ao seu ritmo</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Paradas sem pressa para curtir o Toboágua e as barracas</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Button onClick={() => handleBook(tourOestePrivate, 'private', 'Buggy')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 font-bold">
                  Reservar Oeste Privativo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiência Premium */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-[#2C7A7B] text-white rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 text-center">
              <Star className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Padrão Jericoacoara Premium</h2>
              <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                Não vendemos apenas assentos, entregamos experiências exclusivas. Nossos passeios privativos oferecem <strong className="text-[#D4AF37]">guias nativos credenciados</strong>, paradas estratégicas para <strong className="text-[#D4AF37]">fotos impecáveis</strong> e <strong className="text-[#D4AF37]">tempo 100% flexível</strong> em cada atração.
              </p>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="bg-white text-[#2C7A7B] hover:bg-gray-100 font-bold px-10 py-6 text-xl rounded-full shadow-lg"
              >
                Falar com um Consultor Especialista
              </Button>
            </div>
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

export default PasseiosJeri;
