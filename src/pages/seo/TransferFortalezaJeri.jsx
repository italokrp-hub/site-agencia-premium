import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, ShieldCheck, Map, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import BookingModal from '@/components/BookingModal';
import { transfersData, formatPrice } from '@/data/catalog';

const TransferFortalezaJeri = () => {
  const [bookingItem, setBookingItem] = useState(null);

  // Load actual data from catalog
  const busTransfer = transfersData.find(t => t.id === 'onibus-regular');
  const sharedTransfer = transfersData.find(t => t.id === 'fortaleza');
  
  const handleWhatsApp = () => {
    openWhatsApp("Olá! Vi a página de Transfer Fortaleza -> Jericoacoara e gostaria de tirar uma dúvida.");
  };

  const handleBook = (item, modality) => {
    // Add default initial parameters to auto-select modality
    setBookingItem({
      ...item,
      initialModality: modality
    });
  };

  return (
    <SEOLayout 
      title="Transfer Fortaleza Jericoacoara Privativo 4x4 e Ônibus | Jericoacoara Premium"
      description="Transfer seguro e confortável de Fortaleza para Jericoacoara. Opções Econômicas (Ônibus), Compartilhado (4x4) e Privativo. Reserve já!"
      canonical="https://jericoacoarapremium.com/transfer-fortaleza-jericoacoara"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 em Jericoacoara"
            src="/images/transfer-4x4-dunas.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transfer Fortaleza <span className="text-[#D4AF37]">Jericoacoara</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light"
          >
            Opções econômicas, compartilhadas ou privativas saindo do Aeroporto ou do seu Hotel direto para Jeri.
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
              Ver Opções e Preços
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher nosso Transfer?</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <ShieldCheck className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Segurança Total</h3>
              <p className="text-gray-600">Veículos novos (Hilux e SW4 4x4), ônibus executivos revisados e motoristas nativos experientes e credenciados.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Múltiplas Opções</h3>
              <p className="text-gray-600">Desde o Transfer Econômico de ônibus/van até a exclusividade da SW4 Privativa, temos a opção certa para seu orçamento.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Map className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Conforto e Suporte</h3>
              <p className="text-gray-600">Suporte 24h via WhatsApp, ar-condicionado em todo o trajeto e garantia de desembarque no centro da Vila.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Opções (Sincronizado) */}
      <section id="opcoes" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha a Categoria Ideal</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Econômico */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-[#D4AF37] flex flex-col h-full transform hover:-translate-y-2 transition-all relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-gray-900 font-bold px-4 py-1 rounded-bl-lg text-sm">
                Mais Buscado
              </div>
              <div className="bg-gray-900 text-white p-6 text-center pt-8">
                <h3 className="text-2xl font-bold">Transfer Econômico</h3>
                <p className="opacity-90 text-sm mt-1">Ônibus/Van Regular</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">{formatPrice(busTransfer?.options?.shared?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /pessoa</span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Melhor custo-benefício para quem viaja sozinho ou casais.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Horários fixos programados.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Ônibus confortável de Fortaleza até Jijoca.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Jardineira 4x4 de Jijoca até a porta da sua pousada em Jeri.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(busTransfer, 'shared')} className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold h-12 text-lg">
                  Reservar Econômico
                </Button>
              </div>
            </div>

            {/* Compartilhado 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 text-gray-800 p-6 text-center">
                <h3 className="text-2xl font-bold">Compartilhado 4x4</h3>
                <p className="opacity-70 text-sm mt-1">Hilux / SW4 Compartilhada</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{formatPrice(sharedTransfer?.options?.shared?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /pessoa</span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Saídas diárias com busca no hotel ou aeroporto.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Viagem direto no veículo 4x4 sem troca em Jijoca.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Grupos de até 4 a 6 pessoas no veículo.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(sharedTransfer, 'shared')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-lg">
                  Reservar Compartilhado
                </Button>
              </div>
            </div>

            {/* Privativo 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-[#2C7A7B] text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Privativo VIP</h3>
                <p className="opacity-90 text-sm mt-1">Veículo Exclusivo (Até 4 pax)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{formatPrice(sharedTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /veículo</span>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Exclusividade total. Só você e sua família/amigos.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Horário 100% livre. Saída na hora que você quiser.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Paradas flexíveis para refeição e descanso no trajeto.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Acomoda confortavelmente as malas de todos.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(sharedTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-lg text-white">
                  Reservar Privativo
                </Button>
              </div>
            </div>

          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={handleWhatsApp} variant="ghost" className="text-gray-500 hover:text-[#25D366]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Precisa de ajuda para escolher? Fale com um consultor
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">O Trajeto: Fortaleza ↔ Jericoacoara</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg mb-2">1. Embarque</h4>
                <p className="text-gray-600">Recepção no Aeroporto Pinto Martins ou no seu Hotel. Acomodação das malas e início da viagem no asfalto.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg mb-2">2. Trecho em Asfalto (~3.5h)</h4>
                <p className="text-gray-600">Viagem tranquila por rodovias pavimentadas até a cidade de Jijoca de Jericoacoara.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg mb-2">3. Trilha Off-Road Dunas/Praia (~40m)</h4>
                <p className="text-gray-600">Entrada no Parque Nacional. O veículo 4x4 percorre o trecho final de areia com segurança e emoção na medida certa.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#D4AF37] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[#2C7A7B] text-white rounded-2xl shadow-md border border-[#2C7A7B]">
                <h4 className="font-bold text-lg mb-2">4. Chegada em Jeri</h4>
                <p className="text-white/90">Desembarque exatamente na porta da sua pousada ou hotel, pronto para aproveitar o paraíso.</p>
              </div>
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

export default TransferFortalezaJeri;
