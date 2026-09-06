import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { trustItems } from '@/data/experiences';

const TrustSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="confianca" className="py-20 md:py-28 bg-[#F7F3E9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#2C7A7B] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Por que nos escolher
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Sua experiência começa{' '}
            <span className="text-[#2C7A7B]">com confiança.</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto">
            Cada detalhe foi pensado para que você viaje com tranquilidade, conforto e segurança.
          </p>
        </motion.div>

        {/* Trust items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2C7A7B]/10 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Institutional strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 bg-[#0F1A1C] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <img
              src="https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/494a72a51bf12600f9dbf641b2fc783a.png"
              alt="Jericoacoara Premium"
              className="h-14 w-14 rounded-full object-cover shrink-0"
            />
            <div>
              <p className="text-white font-bold text-lg">Jericoacoara Premium</p>
              <p className="text-white/50 text-sm">Jericoacoara, Ceará · Atendimento 24h</p>
              <p className="text-white/40 text-xs mt-0.5 font-mono">Cadastur: 51.790.615/0001-08</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {[
              { label: '+5 anos', sub: 'no turismo' },
              { label: '24h', sub: 'de suporte' },
              { label: '5% OFF', sub: 'no PIX' },
              { label: '10x', sub: 'no cartão' },
            ].map((badge) => (
              <div key={badge.label} className="text-center px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[#D4AF37] font-bold text-base">{badge.label}</p>
                <p className="text-white/40 text-xs">{badge.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
