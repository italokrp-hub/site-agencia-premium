import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, ShieldCheck, Map, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';
import BookingModal from '@/components/BookingModal';
import { transfersData, formatPrice } from '@/data/catalog';

const TransferJijocaJeri = () => {
  const [bookingItem, setBookingItem] = useState(null);

  // Load actual data from catalog
  const jijocaTransfer = transfersData.find(t => t.id === 'jijoca');
  
  const handleWhatsApp = () => {
    openWhatsApp("Olá! Vi a página de Transfer Jijoca -> Jericoacoara e gostaria de tirar uma dúvida.");
  };

  const handleBook = (item, modality) => {
    setBookingItem({
      ...item,
      initialModality: modality
    });
  };

  return (
    <SEOLayout 
      title="Transfer Jijoca para Jericoacoara 4x4 | Jericoacoara Premium"
      description="Deixe seu carro seguro em Jijoca e viaje até a Vila de Jericoacoara em veículo 4x4 credenciado. Embarque na porta da pousada."
      canonical="https://jericoacoarapremium.com/transfer-jijoca-jericoacoara"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 em Jijoca de Jericoacoara"
            src="/images/transfer-4x4-dunas.webp"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Transfer Jijoca <span className="text-[#D4AF37]">Jericoacoara</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light"
          >
            Chegou em Jijoca de carro ou ônibus? Faça a travessia até a Vila em nossos veículos 4x4 credenciados com conforto e segurança.
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
            <h2 className="text-3xl font-bold mb-4">Por que reservar seu Transfer de Jijoca conosco?</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Shield className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Estacionamento Seguro</h3>
              <p className="text-gray-600">Indicamos os melhores estacionamentos em Jijoca para você deixar seu carro particular com total tranquilidade.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Veículos Credenciados</h3>
              <p className="text-gray-600">Todos os nossos 4x4 (Jardineiras e Caminhonetes) possuem autorização oficial para circular dentro do Parque Nacional.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Map className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Embarque na Pousada</h3>
              <p className="text-gray-600">O transfer não deixa você na rua. O desembarque e o embarque da volta ocorrem exatamente na porta da sua acomodação na Vila.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Opções */}
      <section id="opcoes" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha a Modalidade de Transfer</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Compartilhado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 text-gray-800 p-6 text-center">
                <h3 className="text-2xl font-bold">Transfer Compartilhado</h3>
                <p className="opacity-70 text-sm mt-1">Jardineira 4x4 (Jijoca ↔ Jeri)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{formatPrice(jijocaTransfer?.options?.shared?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /pessoa (trecho)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Ida e Volta: selecione a opção no checkout para agendar o retorno</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Ideal para viajantes solo ou casais (opção mais barata).</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Saídas frequentes de Jijoca após o preenchimento das vagas.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Viagem direta nas tradicionais Jardineiras 4x4 credenciadas.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(jijocaTransfer, 'shared')} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-lg relative">
                  Reservar Compartilhado
                  <span className="absolute -top-3 right-2 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-200">
                    Economize 5% pagando via PIX
                  </span>
                </Button>
              </div>
            </div>

            {/* Privativo 4x4 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow relative">
              <div className="absolute top-0 right-0 bg-[#2C7A7B] text-white font-bold px-4 py-1 rounded-bl-lg text-sm z-10">
                VIP
              </div>
              <div className="bg-[#2C7A7B] text-white p-6 text-center pt-8">
                <h3 className="text-2xl font-bold">Privativo 4x4</h3>
                <p className="opacity-90 text-sm mt-1">Veículo Exclusivo (Hilux/SW4/Jardineira)</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{formatPrice(jijocaTransfer?.options?.private?.tiers?.[0]?.oneWay)}</span>
                  <span className="text-sm opacity-80"> /veículo (trecho)</span>
                </div>
                <p className="text-xs text-white/70 mt-2">Ida e Volta: selecione a opção no checkout para agendar o retorno</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Exclusividade total para você e sua família. Sem filas.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Saída imediata assim que você chegar em Jijoca.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Acomoda todas as suas bagagens confortavelmente.</li>
                  <li className="flex items-start"><Check className="text-emerald-500 w-5 h-5 mr-3 mt-0.5 shrink-0" /> Suporte VIP via WhatsApp durante todo o trajeto.</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto space-y-3">
                <Button onClick={() => handleBook(jijocaTransfer, 'private')} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-lg text-white relative">
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
              Tem dúvidas sobre estacionamentos? Fale com um consultor
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

export default TransferJijocaJeri;
