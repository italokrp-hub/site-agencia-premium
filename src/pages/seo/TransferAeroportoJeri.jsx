import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plane, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';

const TransferAeroportoJeri = () => {
  const handleWhatsApp = () => {
    openWhatsApp("Olá! Chego pelo Aeroporto de Cruz (JJD) e quero saber mais sobre o Transfer até a Vila de Jericoacoara.");
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
            className="w-full h-full object-cover opacity-50"
            alt="Aeroporto de Jericoacoara Cruz"
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
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
              onClick={handleWhatsApp}
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Garantir Minha Vaga
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
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <Plane className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Monitoramento de Voo</h3>
              <p className="text-sm text-gray-600">Acompanhamos possíveis atrasos da Azul, Gol ou Latam para garantir que seu motorista estará lá.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <CheckCircle className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Recepção com Placa</h3>
              <p className="text-sm text-gray-600">Estaremos lhe aguardando na área de desembarque com seu nome para facilitar o encontro.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <ShieldCheck className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Acesso ao Parque Nacional</h3>
              <p className="text-sm text-gray-600">Nossos veículos 4x4 credenciados cruzam o parque e as dunas direto para o centro da vila.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <Clock className="w-10 h-10 text-[#2C7A7B] mb-4" />
              <h3 className="font-bold mb-2">Trajeto Super Rápido</h3>
              <p className="text-sm text-gray-600">Apenas ~45 minutos separam você de um banho de mar após sair do avião.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Frota e CTA */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Nossa Frota 4x4</h2>
          <p className="text-lg text-gray-600 mb-10">
            Veículos espaçosos, climatizados, e higienizados. Ideal para acomodar suas malas e começar a viagem com o conforto que você merece. Temos opções privativas e compartilhadas alinhadas aos horários dos voos!
          </p>
          <Button
            onClick={handleWhatsApp}
            size="lg"
            className="bg-[#2C7A7B] hover:bg-teal-700 text-white font-bold px-10 py-6 text-xl rounded-full shadow-lg"
          >
            Reservar Transfer JJD
          </Button>
        </div>
      </section>
    </SEOLayout>
  );
};

export default TransferAeroportoJeri;
