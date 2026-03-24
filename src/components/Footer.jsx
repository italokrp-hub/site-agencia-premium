import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, CheckCircle } from 'lucide-react';

const Footer = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/5592981038749', '_blank');
  };

  const handleSocialClick = (platform) => {
    if (platform === 'instagram') {
      window.open('https://instagram.com/jericoacoarapremium', '_blank');
    } else {
      window.open(`https://${platform}.com/jericoacoara.premium`, '_blank');
    }
  };

  return (
    <footer id="contato" className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <img 
              src="https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/494a72a51bf12600f9dbf641b2fc783a.png"
              alt="Jericoacoara Premium"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Proporcionando experiências únicas e memoráveis em Jericoacoara com excelência, conforto e segurança.
            </p>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cadastur</span>
              </div>
              <p className="text-sm font-mono text-gray-300">51.790.615/0001-08</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <button 
                    onClick={handleWhatsApp}
                    className="text-white hover:text-[#D4AF37] transition-colors"
                  >
                    (92) 98103-8749
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a 
                    href="mailto:contato@jericoacoara.premium"
                    className="text-white hover:text-[#D4AF37] transition-colors"
                  >
                    contato@jericoacoara.premium
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Localização</p>
                  <p className="text-white">Jericoacoara, Ceará</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Horário de Atendimento</h3>
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white mb-1">Atendimento 24 horas</p>
                <p className="text-sm text-gray-400">Todos os dias da semana</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Suporte via WhatsApp disponível a qualquer momento para sua comodidade e segurança.
            </p>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Redes Sociais</h3>
            <p className="text-gray-400 text-sm mb-4">
              Siga-nos e acompanhe nossas novidades, promoções e dicas de viagem!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialClick('instagram')}
                className="w-10 h-10 bg-white/10 hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('facebook')}
                className="w-10 h-10 bg-white/10 hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>@jericoacoarapremium</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Jericoacoara Premium. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">
                Política de Privacidade
              </span>
              <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">
                Termos de Uso
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;