import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { WA_MESSAGES, buildWhatsAppLink } from '@/utils/whatsapp';
import { toursData } from '@/data/catalog';

const PremiumExperiences = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Only include WhatsApp-only premium tours from the catalog
  const premiumTours = toursData.filter((t) => t.requireWhatsApp);

  const getWaMessage = (tour) => {
    if (tour.id === 'tour-helicoptero') return WA_MESSAGES.helicopter;
    if (tour.id === 'tour-utv') return WA_MESSAGES.utv;
    return WA_MESSAGES.custom(tour.title);
  };

  const premiumMeta = {
    'tour-helicoptero': {
      icon: '🚁',
      highlight: 'Vista 360° de Jericoacoara',
      detail: 'Sobrevoe as dunas, lagoas e o litoral paradisíaco do alto, numa experiência única e inesquecível.',
      bgGradient: 'from-slate-900 via-slate-800 to-gray-900',
      accentColor: '#D4AF37',
    },
    'tour-utv': {
      icon: '🏎️',
      highlight: 'Off-Road nas Dunas',
      detail: 'Adrenalina e segurança em um passeio exclusivo de UTV pelas trilhas e dunas de Jericoacoara.',
      bgGradient: 'from-orange-950 via-red-950 to-slate-900',
      accentColor: '#F97316',
    },
  };

  return (
    <section id="premium" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Exclusivo
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Experiências{' '}
            <span className="text-[#D4AF37]">Premium</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto">
            Para quem busca o extraordinário. Disponibilidade limitada — consulte via WhatsApp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumTours.map((tour, index) => {
            const meta = premiumMeta[tour.id] || {
              icon: '✨',
              highlight: 'Experiência VIP',
              detail: tour.description || '',
              bgGradient: 'from-slate-900 to-gray-900',
              accentColor: '#D4AF37',
            };

            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="relative group rounded-3xl overflow-hidden min-h-[420px] flex flex-col"
              >
                {/* Background image */}
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${meta.bgGradient} opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-1 p-8 md:p-10 justify-end">
                  {/* Badge */}
                  <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase mb-6"
                    style={{ borderColor: `${meta.accentColor}60`, color: meta.accentColor, background: `${meta.accentColor}15` }}
                  >
                    <span>{meta.icon}</span>
                    Experiência Premium
                  </span>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {tour.title}
                  </h3>

                  <p className="text-white/60 text-sm mb-1 font-semibold" style={{ color: meta.accentColor }}>
                    {meta.highlight}
                  </p>

                  <p className="text-white/70 text-sm mb-8 leading-relaxed max-w-sm">
                    {meta.detail}
                  </p>

                  <a
                    href={buildWhatsAppLink(getWaMessage(tour))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: meta.accentColor,
                      color: meta.accentColor === '#F97316' ? 'white' : '#111',
                    }}
                    aria-label={`Consultar disponibilidade para ${tour.title} no WhatsApp`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Consultar disponibilidade
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PremiumExperiences;
