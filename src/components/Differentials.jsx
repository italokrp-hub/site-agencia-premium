import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Zap, ShieldCheck, MessageCircle, Users, Car, Star, CheckCircle2 } from 'lucide-react';

const Differentials = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const differentials = [
    {
      icon: ShieldCheck,
      title: 'Conforto e Segurança',
      description: 'Sua tranquilidade é nossa prioridade, com protocolos rigorosos de segurança.'
    },
    {
      icon: Users,
      title: 'Motoristas e Guias Credenciados',
      description: 'Profissionais experientes e registrados para garantir a melhor experiência.'
    },
    {
      icon: Car,
      title: 'Atendimento Personalizado',
      description: 'Foco total na sua experiência de navegação e satisfação.'
    },
    {
      icon: Zap,
      title: 'Atendimento Rápido',
      description: 'Resposta imediata e agilidade em todos os processos.'
    },
    {
      icon: Star,
      title: 'Excelência Comprovada',
      description: 'Avaliações positivas e clientes extremamente satisfeitos.'
    },
    {
      icon: MessageCircle,
      title: 'Suporte 24h',
      description: 'Estamos sempre disponíveis no WhatsApp para lhe atender.'
    }
  ];

  return (
    <section id="diferenciais" className="py-20 bg-gradient-to-b from-[#F7F3E9] to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Por que Escolher a <span className="text-[#2C7A7B]">Jericoacoara Premium</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Mais do que uma viagem, proporcionamos uma experiência segura e inesquecível.
          </p>
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-[#2C7A7B] text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Empresa Certificada CADASTUR: 51.790.615/0001-08
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {differentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-lg flex items-center justify-center shadow-md">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-8 bg-white rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2C7A7B] mb-1">100%</div>
              <div className="text-sm text-gray-600">Segurança</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2C7A7B] mb-1">24h</div>
              <div className="text-sm text-gray-600">Suporte</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2C7A7B] mb-1">5.0</div>
              <div className="text-sm text-gray-600">Avaliação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2C7A7B] mb-1">Top</div>
              <div className="text-sm text-gray-600">Destinos</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Differentials;