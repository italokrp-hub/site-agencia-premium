import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

const languages = [
  { code: 'pt', label: 'PT', name: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'ES', name: 'Español', flag: '🇪🇸' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const menuItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.experiences'), href: '#experiencias' },
    { label: 'Passeios', href: '/passeios-jericoacoara' },
    { 
      label: 'Transfers', 
      isDropdown: true,
      items: [
        { label: 'Fortaleza ↔ Jeri', href: '/transfer-fortaleza-jericoacoara' },
        { label: 'Aeroporto (JJD) ↔ Jeri', href: '/transfer-aeroporto-jericoacoara' }
      ]
    },
    { label: t('nav.destinations'), href: '#mapa' },
    { label: t('nav.planner'), href: '#planner' },
    { label: t('nav.testimonials'), href: '#depoimentos' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const handleWhatsApp = () => {
    import('@/utils/whatsapp').then(({ openWhatsApp, WA_MESSAGES }) => {
      openWhatsApp(WA_MESSAGES.generic);
    });
  };

  const handleNavClick = (href) => {
    setIsOpen(false);
    
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    
    setTimeout(() => {
      if (href.startsWith('#') && window.location.pathname !== '/') {
        navigate(`/${href}`);
        return;
      }
      
      try {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = href;
        }
      } catch (error) {
        // Fallback for unexpected hash formats
        window.location.href = href;
      }
    }, 50);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/40 backdrop-blur-md md:bg-white md:shadow-md' 
          : 'bg-black/20 backdrop-blur-md md:bg-white/95 md:backdrop-blur-sm border-b border-white/10 md:border-none'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}>
              <img 
                src="https://horizons-cdn.hostinger.com/67b0df74-75a2-46e8-8af4-a8cc83829ca5/494a72a51bf12600f9dbf641b2fc783a.png"
                alt="Jericoacoara Premium - Agência de Viagens Premium"
                width="64"
                height="64"
                className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-full shadow-sm"
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => {
              if (item.isDropdown) {
                return (
                  <div key={item.label} className="relative group">
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#2C7A7B] transition-colors duration-200 relative">
                      {item.label}
                    </button>
                    <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                      {item.items.map(subItem => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(subItem.href);
                          }}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-[#2C7A7B] transition-colors"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#2C7A7B] transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2C7A7B] transition-all duration-300 group-hover:w-full" />
                </motion.a>
              );
            })}
          </div>

          {/* Right Actions: Language Selector & WhatsApp */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 bg-white/90 hover:bg-gray-100 transition-all duration-200 shadow-2xs"
                title="Selecione o Idioma / Change Language"
              >
                <span className="text-base">{currentLangObj.flag}</span>
                <span>{currentLangObj.label}</span>
                <Globe className="w-3.5 h-3.5 text-gray-500 ml-0.5" />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left hover:bg-teal-50 hover:text-[#2C7A7B] transition-colors ${
                          language === lang.code ? 'bg-teal-50/70 text-[#2C7A7B] font-bold' : 'text-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {language === lang.code && <Check className="w-3.5 h-3.5 text-[#2C7A7B]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WhatsApp Button - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={handleWhatsApp}
                data-tracking="whatsapp-cta-header"
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-xs"
              >
                <Phone className="w-4 h-4" />
                {t('nav.whatsappBtn')}
              </Button>
            </motion.div>
          </div>

          {/* Mobile Right Controls: Language Selector + Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Language Selector Pill */}
            <div className="flex items-center bg-white/90 border border-gray-200 rounded-full p-0.5 shadow-2xs">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all ${
                    language === lang.code
                      ? 'bg-[#2C7A7B] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
              aria-expanded={isOpen}
              className="p-2 rounded-md text-white md:text-gray-700 hover:text-white/80 md:hover:text-[#2C7A7B] transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6 drop-shadow-md" /> : <Menu className="w-6 h-6 drop-shadow-md" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-3 pt-2 pb-4 space-y-1 bg-white shadow-xl rounded-xl mb-4 border border-gray-100">
                {menuItems.map((item) => {
                  if (item.isDropdown) {
                    return (
                      <div key={item.label} className="py-2">
                        <div className="px-3 py-2 text-sm font-bold text-gray-900 border-b border-gray-100 mb-1">{item.label}</div>
                        {item.items.map(subItem => (
                          <a
                            key={subItem.href}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(subItem.href);
                            }}
                            className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2C7A7B] hover:bg-teal-50/50 rounded-lg transition-colors duration-200"
                          >
                            - {subItem.label}
                          </a>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#2C7A7B] hover:bg-teal-50/50 rounded-lg transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  );
                })}
                
                <div className="pt-2 border-t border-gray-100">
                  <Button
                    onClick={handleWhatsApp}
                    data-tracking="whatsapp-cta-header-mobile"
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {t('nav.whatsappBtn')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;