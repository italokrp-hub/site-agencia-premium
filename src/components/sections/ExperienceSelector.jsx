import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { experienceStyles } from '@/data/experiences';

const ExperienceSelector = ({ onStyleSelect }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(null);

  return (
    <section id="como-viver" className="py-20 md:py-28 bg-[#0F1A1C] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Sua Jericoacoara
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Como você quer{' '}
            <span className="text-[#D4AF37]">viver Jericoacoara?</span>
          </h2>
          <p className="mt-4 text-white/60 text-base md:text-lg max-w-xl mx-auto">
            Escolha seu estilo de viagem e descubra as experiências feitas para você.
          </p>
        </motion.div>

        {/* Experience grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {experienceStyles.map((style, index) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => onStyleSelect && onStyleSelect(style)}
              onMouseEnter={() => setHovered(style.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative group rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1A1C]"
              aria-label={`Selecionar estilo de viagem: ${style.label}`}
            >
              {/* Background image */}
              <img
                src={style.image}
                alt={style.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${style.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white text-center">
                <span className="text-2xl mb-2 drop-shadow-lg">{style.icon}</span>
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  {style.label}
                </h3>
                {/* Description shown on hover */}
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hovered === style.id ? 1 : 0,
                    height: hovered === style.id ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="mt-1 text-xs text-white/80 overflow-hidden leading-snug"
                >
                  {style.description}
                </motion.p>
              </div>

              {/* Border highlight on hover */}
              <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${hovered === style.id ? 'border-[#D4AF37]/80' : 'border-transparent'}`} />
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center text-white/40 text-xs mt-6"
        >
          Clique em um estilo para ver as experiências recomendadas ↓
        </motion.p>
      </div>
    </section>
  );
};

export default ExperienceSelector;
