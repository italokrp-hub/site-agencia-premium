import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    import('@/utils/whatsapp').then(({ openWhatsApp, WA_MESSAGES }) => {
      openWhatsApp(WA_MESSAGES.generic);
    });
  };

  const handleSocialClick = (platform) => {
    if (platform === 'instagram') {
      window.open('https://instagram.com/jericoacoarapremium', '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://${platform}.com/jericoacoara.premium`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer id="contato" className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* About */}
          <div>
            <img 
              src="https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/494a72a51bf12600f9dbf641b2fc783a.png"
              alt="Jericoacoara Premium"
              width="180"
              height="64"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {t('footer.about')}
            </p>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider">Cadastur</span>
              </div>
              <p className="text-sm font-mono text-gray-300">51.790.615/0001-08</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <button 
                    onClick={handleWhatsApp}
                    data-tracking="whatsapp-cta-footer"
                    className="text-white hover:text-[#D4AF37] transition-colors text-left font-semibold cursor-pointer"
                    aria-label="WhatsApp Jericoacoara Premium"
                  >
                    {t('nav.whatsappBtn')}
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a 
                    href="mailto:contato@jericoacoarapremium.com"
                    className="text-white hover:text-[#D4AF37] transition-colors"
                  >
                    contato@jericoacoarapremium.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-400">Jericoacoara, Ceará</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">{t('trust.support24h')}</h3>
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-white mb-1 font-semibold">{t('trust.support24h')}</p>
                <p className="text-sm text-gray-400">{t('trust.support24hDesc')}</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Redes Sociais</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialClick('instagram')}
                aria-label="Instagram Jericoacoara Premium"
                className="w-10 h-10 bg-white/10 hover:bg-[#D4AF37] hover:text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => handleSocialClick('facebook')}
                aria-label="Facebook Jericoacoara Premium"
                className="w-10 h-10 bg-white/10 hover:bg-[#D4AF37] hover:text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>@jericoacoarapremium</p>
            </div>
          </div>

          {/* SEO Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Serviços Exclusivos</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="/transfer-fortaleza-jericoacoara" className="hover:text-[#D4AF37] transition-colors">Transfer Fortaleza ↔ Jeri</a>
              <a href="/transfer-aeroporto-jericoacoara" className="hover:text-[#D4AF37] transition-colors">Transfer Aeroporto ↔ Jeri</a>
              <a href="/passeios-jericoacoara" className="hover:text-[#D4AF37] transition-colors">Passeios em Jericoacoara</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Jericoacoara Premium. {t('footer.rights')}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#privacidade" className="hover:text-[#D4AF37] transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#termos" className="hover:text-[#D4AF37] transition-colors">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;