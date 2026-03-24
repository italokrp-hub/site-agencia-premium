import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const Gallery = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const images = [
    {
      title: 'Lagoa do Paraíso',
      description: 'Águas cristalinas e relaxamento',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/2536918860cd6edd74fcd3911758044f.webp'
    },
    {
      title: 'Pôr do Sol nas Dunas',
      description: 'Momento mágico do dia',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/a7043af71d371c32ff636c4b232c1e39.jpg'
    },
    {
      title: 'Pedra Furada',
      description: 'Cartão postal de Jeri',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/f8733608a68a1e9be0ca6091bca8494d.jpg'
    },
    {
      title: 'Passeio de Buggy',
      description: 'Aventura pelas dunas',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/e9f92fc3e94dec8860f06293a32de6c1.jpg'
    },
    {
      title: 'Tatajuba',
      description: 'Paraíso escondido',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/0376391c7db96ffaf93689b92c2eeb11.webp'
    },
    {
      title: 'Praia de Jericoacoara',
      description: 'Beleza natural incomparável',
      image: 'https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/c41e7ba1c6dcdd06e4d8c07e14a1e531.jpg'
    }
  ];

  return (
    <section id="galeria" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Galeria de <span className="text-[#2C7A7B]">Momentos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra as maravilhas que aguardam por você em Jericoacoara
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {images.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square"
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={item.title}
               src={item.image} />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;