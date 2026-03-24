import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: 'Ana Carolina Silva',
      location: 'São Paulo, SP',
      rating: 5,
      text: 'Experiência impecável do início ao fim! O transfer foi pontual, confortável e o motorista super atencioso. Os passeios foram organizados com perfeição. Recomendo de olhos fechados!',
      image: '/user1.jpg'
    },
    {
      name: 'Roberto Mendes',
      location: 'Rio de Janeiro, RJ',
      rating: 5,
      text: 'Serviço premium de verdade. Veículos novos e limpos, motoristas educados e pontuais. A equipe nos ajudou com todas as dúvidas e tornaram nossa viagem inesquecível. Vale cada centavo!',
      image: '/user2.jpg'
    },
    {
      name: 'Juliana & Marcos Costa',
      location: 'Brasília, DF',
      rating: 5,
      text: 'Fizemos nossa lua de mel em Jeri e escolhemos a Jericoacoara Premium. Foi a melhor decisão! Atendimento personalizado, passeios exclusivos e muita atenção aos detalhes. Perfeito!',
      image: '/user3.jpg'
    },
    {
      name: 'Carlos Eduardo Santos',
      location: 'Belo Horizonte, MG',
      rating: 5,
      text: 'Já viajei muito pelo Brasil e esse foi o melhor serviço de transfer que já contratei. Profissionalismo, pontualidade e conforto. O passeio pela Lagoa do Paraíso foi surreal!',
      image: '/user4.jpg'
    },
    {
      name: 'Fernanda Oliveira',
      location: 'Curitiba, PR',
      rating: 5,
      text: 'Atendimento excepcional! Desde o primeiro contato pelo WhatsApp até o fim da viagem, tudo perfeito. Os motoristas são super simpáticos e conhecem muito bem a região. Voltarei com certeza!',
      image: '/user5.jpg'
    }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            O Que Dizem Nossos <span className="text-[#2C7A7B]">Clientes</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experiências reais de quem confiou na Jericoacoara Premium
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-[#F7F3E9] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-12 h-12 text-[#2C7A7B]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    className="w-full h-full object-cover"
                    alt={testimonial.name}
                   src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;