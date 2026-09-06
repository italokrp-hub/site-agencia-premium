import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '@/data/experiences';

const FAQItem = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className={`w-5 h-5 transition-colors duration-200 ${isOpen ? 'text-[#2C7A7B]' : 'text-gray-400 group-hover:text-gray-600'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 bg-white">
              <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#F7F3E9] overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[#2C7A7B] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Dúvidas Frequentes
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Perguntas <span className="text-[#2C7A7B]">frequentes</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-lg mx-auto">
            Tire suas dúvidas antes de reservar. Não encontrou o que procura?{' '}
            <a
              href="https://wa.me/5592981038749"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2C7A7B] font-semibold hover:underline"
            >
              Fale pelo WhatsApp.
            </a>
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
