import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Award, Heart, Star } from 'lucide-react';

const About = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Award,
      title: 'Excelência',
      description: 'Padrão premium em todos os serviços prestados'
    },
    {
      icon: Heart,
      title: 'Atendimento Personalizado',
      description: 'Cuidado individual para cada cliente'
    },
    {
      icon: Star,
      title: 'Especialização',
      description: 'Experts em passeios e transfers em Jericoacoara'
    }
  ];

  return (
    <section id="sobre" className="py-12 md:py-20 bg-gradient-to-b from-white to-[#F7F3E9]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Sobre a <span className="text-[#2C7A7B]">Jericoacoara Premium</span>
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Somos uma agência especializada em proporcionar experiências únicas e memoráveis 
            em um dos destinos mais paradisíacos do Brasil. Com anos de experiência e profundo 
            conhecimento da região, oferecemos serviços de transfer e passeios com o mais alto 
            padrão de qualidade, conforto e segurança.
          </p>
        </motion.div>

        <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 md:pb-0 -mx-4 px-4 md:mx-auto md:px-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="min-w-[80vw] sm:min-w-[300px] md:min-w-0 snap-center bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 md:hover:-translate-y-2 shrink-0 md:shrink"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#2C7A7B] to-[#1A5557] rounded-full flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;