import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Carolina Silva',
    location: 'São Paulo, SP',
    rating: 5,
    text: 'Experiência impecável do início ao fim! O transfer foi pontual, confortável e o motorista super atencioso. Os passeios foram organizados com perfeição. Recomendo de olhos fechados!',
    image: '/user1.jpg',
    tag: 'Transfer + Passeios',
  },
  {
    name: 'Roberto Mendes',
    location: 'Rio de Janeiro, RJ',
    rating: 5,
    text: 'Serviço premium de verdade. Veículos novos e limpos, motoristas educados e pontuais. A equipe nos ajudou com todas as dúvidas e tornaram nossa viagem inesquecível. Vale cada centavo!',
    image: '/user2.jpg',
    tag: 'Transfer VIP',
  },
  {
    name: 'Juliana & Marcos Costa',
    location: 'Brasília, DF',
    rating: 5,
    text: 'Fizemos nossa lua de mel em Jeri e escolhemos a Jericoacoara Premium. Foi a melhor decisão! Atendimento personalizado, passeios exclusivos e muita atenção aos detalhes. Perfeito!',
    image: '/user3.jpg',
    tag: 'Roteiro Personalizado',
  },
  {
    name: 'Carlos Eduardo Santos',
    location: 'Belo Horizonte, MG',
    rating: 5,
    text: 'Já viajei muito pelo Brasil e esse foi o melhor serviço de transfer que já contratei. Profissionalismo, pontualidade e conforto. O passeio pela Lagoa do Paraíso foi surreal!',
    image: '/user4.jpg',
    tag: 'Lagoa do Paraíso',
  },
  {
    name: 'Fernanda Oliveira',
    location: 'Curitiba, PR',
    rating: 5,
    text: 'Atendimento sensacional! Desde o primeiro contato pelo WhatsApp até o fim da viagem, tudo perfeito. Os motoristas são super simpáticos e conhecem muito bem a região. Voltarei com certeza!',
    image: '/user5.jpg',
    tag: 'Transfer + Passeio Oeste',
  },
];

const TestimonialsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Depoimentos
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            O que dizem nossos{' '}
            <span className="text-[#2C7A7B]">clientes</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto">
            Experiências reais de viajantes que confiaram na Jericoacoara Premium.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll; Desktop: grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 md:pb-0">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[85vw] sm:w-80 md:w-auto snap-center shrink-0 md:shrink relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Quote watermark */}
              <div className="absolute top-4 right-4 opacity-[0.07]">
                <Quote className="w-14 h-14 text-[#2C7A7B]" />
              </div>

              {/* Tag */}
              <span className="inline-flex w-fit px-2.5 py-1 bg-[#2C7A7B]/10 text-[#2C7A7B] text-[10px] font-bold rounded-full mb-4 uppercase tracking-wider">
                {testimonial.tag}
              </span>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-gray-400 text-xs">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
