import React, { useState, useEffect, useCallback } from 'react';
import { X, MessageCircle } from 'lucide-react';

const STORAGE_KEY = 'has_seen_reveillon_promo_2027';
const DELAY_MS = 2500; // 2.5s de delay para otimização dos Core Web Vitals (FCP/LCP/CLS)

const WHATSAPP_CONVERSION_URL =
  'https://wa.me/5588988463182?text=Ol%C3%A1!%20Vi%20a%20promo%C3%A7%C3%A3o%20de%20R%C3%A9veillon%202027%20no%20site%20e%20quero%20garantir%20uma%20cota%C3%A7%C3%A3o%20com%2010%25%20OFF%20no%20Pix.%20Somos%20em%20[__]%20pessoas.';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Não foi possível salvar o estado do modal no localStorage.', e);
    }
  }, []);

  // Listener para fechar com a tecla Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Exibição com delay de 2,5s após o carregamento da página
  useEffect(() => {
    // Permite override via URL query param (?promo=true) para testes em desenvolvimento
    let forceShow = false;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('promo') === 'true') {
        forceShow = true;
      }
    }

    if (!forceShow) {
      try {
        const isDismissedLocal = localStorage.getItem(STORAGE_KEY);
        const isDismissedSession = sessionStorage.getItem(STORAGE_KEY);
        if (isDismissedLocal === 'true' || isDismissedSession === 'true') {
          return;
        }
      } catch (e) {
        // Ignora falhas no acesso ao storage
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleCtaClick = () => {
    // Rastreamento de conversão (Google Tag / GTM / Meta Pixel)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Promocao',
        event_label: 'Reveillon 2027 10 OFF',
      });
    }

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'lead_whatsapp_promo',
        origem: 'modal_reveillon_2027',
      });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: 'Reveillon 2027 10 OFF',
        content_category: 'Promocao',
      });
    }

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Promoção Pacote Réveillon 2027 em Jericoacoara"
    >
      <div
        className="relative max-w-[360px] sm:max-w-[420px] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar ("X") com área de toque mínima de 44x44px e alto contraste */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar modal de promoção Réveillon 2027"
          className="absolute top-3 right-3 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/70 hover:bg-black/90 text-white shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer border border-white/20"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Flyer promocional clicável com redirecionamento para WhatsApp */}
        <a
          href={WHATSAPP_CONVERSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
          aria-label="Garantir vaga no 1º Lote do Réveillon 2027 em Jericoacoara via WhatsApp"
          className="relative w-full overflow-hidden flex-1 flex items-center justify-center bg-slate-950 min-h-0 select-none group cursor-pointer"
        >
          <img
            src="/images/promo-reveillon-2027.webp"
            alt="Pacote Réveillon 2027 em Jericoacoara - 10% OFF no PIX - Jericoacoara Premium"
            className="w-full h-full object-contain max-h-[calc(85vh-76px)] sm:max-h-[calc(85vh-84px)] transition-transform duration-300 group-hover:scale-[1.01]"
            loading="eager"
          />
        </a>

        {/* Botão CTA em destaque abaixo da imagem */}
        <div className="p-3.5 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <a
            href={WHATSAPP_CONVERSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-98 tracking-wide cursor-pointer uppercase"
          >
            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
            <span className="tracking-wider drop-shadow-sm text-center">
              Garantir Vaga no 1º Lote via WhatsApp
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

