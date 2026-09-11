import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, ShieldCheck, Map, Clock, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp, WA_MESSAGES } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';

const TransferFortalezaJeri = () => {
  const handleWhatsApp = () => {
    openWhatsApp("Olá! Vi a página de Transfer Fortaleza -> Jericoacoara e gostaria de uma cotação.");
  };

  return (
    <SEOLayout 
      title="Transfer Fortaleza Jericoacoara Privativo 4x4 | Jericoacoara Premium"
      description="Transfer seguro e confortável de Fortaleza para Jericoacoara. Veículos 4x4 (Hilux e SW4) com ar-condicionado, motoristas credenciados e saída do Aeroporto ou Hotel. Reserve já!"
      canonical="https://jericoacoarapremium.com/transfer-fortaleza-jericoacoara"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Veículo 4x4 em Jericoacoara"
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80"
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
            Viagem rápida, privativa e 100% segura com veículos 4x4 direto do Aeroporto ou do seu Hotel.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Solicitar Cotação Agora
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
              <p className="text-gray-600">Veículos novos (Hilux e SW4 4x4), revisados e motoristas nativos experientes e credenciados.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Conforto Porta a Porta</h3>
              <p className="text-gray-600">Buscamos você no aeroporto ou hotel em Fortaleza e deixamos na porta da sua pousada em Jeri.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Map className="w-12 h-12 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-3">Assistência Completa</h3>
              <p className="text-gray-600">Suporte 24h, ar-condicionado em todo o trajeto e cadeirinha para crianças sem custo adicional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
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

      {/* Opções */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Escolha seu Transfer</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Privativo */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-[#2C7A7B] text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Transfer Privativo 4x4</h3>
                <p className="opacity-90">Exclusividade total para você e sua família.</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Horário flexível (saída na hora que você quiser)</li>
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Veículo exclusivo (Toyota Hilux ou SW4)</li>
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Sem esperas e sem compartilhar com estranhos</li>
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Capacidade para até 4 a 6 passageiros</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Button onClick={handleWhatsApp} className="w-full bg-[#2C7A7B] hover:bg-teal-700 h-12 text-lg">
                  Cotar Privativo
                </Button>
              </div>
            </div>

            {/* Compartilhado */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white p-6 text-center">
                <h3 className="text-2xl font-bold">Transfer Compartilhado</h3>
                <p className="opacity-90">A opção mais econômica para quem viaja sozinho ou casais.</p>
              </div>
              <div className="p-8 flex-grow">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Horários fixos programados (ida e volta)</li>
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Veículos confortáveis (Van/Micro) até Jijoca</li>
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Jardineira 4x4 de Jijoca até a Vila de Jeri</li>
                  <li className="flex items-center"><Check className="text-emerald-500 w-5 h-5 mr-3" /> Ideal para reduzir custos sem perder segurança</li>
                </ul>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Button onClick={handleWhatsApp} variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-50 h-12 text-lg">
                  Cotar Compartilhado
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Dúvidas Frequentes</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold flex items-center text-lg mb-2"><Info className="w-5 h-5 text-[#D4AF37] mr-2" /> Qual o tempo de viagem?</h4>
              <p className="text-gray-600 pl-7">A viagem de Fortaleza a Jericoacoara leva em média de 4h a 4h30, dependendo das condições de trânsito e do trecho off-road nas dunas.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold flex items-center text-lg mb-2"><Info className="w-5 h-5 text-[#D4AF37] mr-2" /> Tenho que pagar a Taxa de Turismo?</h4>
              <p className="text-gray-600 pl-7">Sim, a Prefeitura cobra uma taxa de turismo sustentável por dia de permanência. Ela não está inclusa no valor do transfer e deve ser paga antecipadamente online no site da prefeitura.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold flex items-center text-lg mb-2"><Info className="w-5 h-5 text-[#D4AF37] mr-2" /> Vocês buscam no aeroporto de madrugada?</h4>
              <p className="text-gray-600 pl-7">O transfer privativo funciona 24h. Nós monitoramos o seu voo e o motorista estará lhe esperando no desembarque, independente do horário (mediante reserva prévia).</p>
            </div>
          </div>
        </div>
      </section>

    </SEOLayout>
  );
};

export default TransferFortalezaJeri;
