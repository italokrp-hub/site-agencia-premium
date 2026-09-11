import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, Camera, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsApp } from '@/utils/whatsapp';
import SEOLayout from '@/components/layout/SEOLayout';

const PasseiosJeri = () => {
  const handleWhatsApp = () => {
    openWhatsApp("Olá! Quero montar um roteiro personalizado para os passeios Leste e Oeste em Jeri.");
  };

  return (
    <SEOLayout 
      title="Passeios em Jericoacoara: Lado Leste e Lado Oeste | Jericoacoara Premium"
      description="Conheça a Lagoa do Paraíso, Buraco Azul, Tatajuba e Pedra Furada com os passeios exclusivos de 4x4 e buggy da Jericoacoara Premium. Roteiros personalizados!"
      canonical="https://jericoacoarapremium.com/passeios-jericoacoara"
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover"
            alt="Passeios em Jericoacoara Lagoa do Paraíso"
            src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80"
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
              Descubra os roteiros do Lado Leste e Lado Oeste em Buggy, Quadriciclo ou UTV com guias nativos credenciados.
            </motion.p>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:scale-105 transition-all"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Montar Roteiro Personalizado
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roteiros */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Os Passeios Mais Desejados</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Lado Leste */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:shadow-xl transition-all">
              <div className="h-64 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80" alt="Lado Leste" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">Lado Leste</h3>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <p className="text-gray-600 mb-6 line-clamp-3">
                  O roteiro perfeito para relaxar nas lagoas de águas cristalinas, visitar pontos turísticos famosos e tirar fotos inesquecíveis.
                </p>
                <h4 className="font-bold text-[#2C7A7B] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Principais Paradas:</h4>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Pedra Furada & Árvore da Preguiça</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Praia do Preá & Lagun Beach</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Buraco Azul (Caiçara ou Castelhano)</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Lagoa do Paraíso (Alchymist Beach Club)</li>
                </ul>
              </div>
            </div>

            {/* Lado Oeste */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:shadow-xl transition-all">
              <div className="h-64 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&q=80" alt="Lado Oeste" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">Lado Oeste</h3>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Um misto de emoção nas dunas, natureza exuberante do mangue e travessias emocionantes. Ideal para espírito aventureiro!
                </p>
                <h4 className="font-bold text-[#2C7A7B] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Principais Paradas:</h4>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Mangue Seco & Passeio de Canoa (Cavalos-Marinhos)</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Travessia de balsa em Guriú</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Trilhas off-road e descida na Tirolesa/Toboágua</li>
                  <li className="flex items-center text-sm text-gray-600"><Check className="text-[#D4AF37] w-4 h-4 mr-2 shrink-0" /> Dunas de Tatajuba & Lago Grande</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiência Premium */}
      <section className="py-20 bg-white">
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
                Garantir Minha Experiência
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SEOLayout>
  );
};

export default PasseiosJeri;
