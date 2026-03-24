import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Waves, Car, Compass, Map, Plane, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleScrollToPricing = () => {
    const element = document.querySelector('#valores');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Waves,
      title: 'Passeios Lado Leste',
      description: 'Explore a famosa Lagoa do Paraíso, Lagoa Azul, Árvore da Preguiça e o incrível Buraco Azul. Opções em Buggy ou Quadriciclo.',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/60e44b9dea0091329faa9886903a5733.jpg'
    },
    {
      icon: Compass,
      title: 'Passeios Lado Oeste',
      description: 'Aventura garantida com Lagoa de Tatajuba, Mangue Seco, travessia de balsa e os cavalos marinhos. Natureza exuberante.',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/3643652f8af5660a1eb0f16e7bd78113.jpg'
    },
    // The "Transfer Executivo" service has been removed as per the request.
    {
      icon: Map,
      title: 'Roteiros Personalizados',
      description: 'Monte seu pacote ideal. Combine transfers e passeios privativos ou compartilhados de acordo com sua necessidade.',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/0376391c7db96ffaf93689b92c2eeb11.webp'
    },
    {
      icon: Plane,
      title: 'Passeio de Helicóptero',
      description: 'Viva a experiência única de sobrevoar Jericoacoara de helicóptero, contemplando do alto as dunas, lagoas e o litoral paradisíaco da região.',
      image: 'https://images.unsplash.com/photo-1700644860189-b244bdb52a4d'
    },
    {
      icon: Car,
      title: 'Passeio de UTV',
      description: 'Aventure-se em um emocionante passeio de UTV pelas dunas e trilhas de Jericoacoara, com muita adrenalina, segurança e contato direto com a natureza.',
      image: 'https://images.unsplash.com/photo-1676954054657-223a1bdb8f0c'
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nossos <span className="text-[#2C7A7B]">Serviços</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experiências completas com a garantia de qualidade Jericoacoara Premium
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden shrink-0">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={service.title}
                 src={service.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <service.icon className="w-7 h-7 text-[#2C7A7B]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>

                {/* Specific Pricing Display for Transfer Executivo */}
                {/* This block is now effectively removed as the "Transfer Executivo" service is no longer in the array */}
                {service.title === 'Transfer Executivo' && service.pricing ? (
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    {service.pricing.map((priceOption, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center hover:border-[#2C7A7B] transition-colors">
                        <div className="flex justify-center mb-1 text-[#2C7A7B]">
                          <priceOption.icon className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{priceOption.type}</p>
                        <p className="text-lg font-bold text-[#2C7A7B]">{priceOption.price}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{priceOption.subtext}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <Button
                  onClick={handleScrollToPricing}
                  className="w-full bg-[#2C7A7B] hover:bg-[#1A5557] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg mt-auto"
                >
                  Ver Valores Detalhados
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;