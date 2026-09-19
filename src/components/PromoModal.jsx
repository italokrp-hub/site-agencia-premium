import React, { useState, useEffect, useCallback } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/utils/whatsapp';

const STORAGE_KEY = 'promo_mes_do_cliente_dismissed_v1';
const START_DATE = new Date('2026-09-18T00:00:00');
const END_DATE = new Date('2026-09-21T00:00:00'); // Expira em 21/09/2026 00:00

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  const checkCampaignActive = useCallback(() => {
    // Permite override via URL query param (?promo=true) para testes em desenvolvimento
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('promo') === 'true') return true;
    }

    const now = new Date();
    return now >= START_DATE && now < END_DATE;
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Não foi possível salvar o estado do modal promocional no storage.', e);
    }
  }, []);

  // Listener para fechar com tecla Esc
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

  // Gerenciador de exibição (Timer 3s ou Scroll 20%)
  useEffect(() => {
    // 1. Verifica data da campanha
    if (!checkCampaignActive()) return;

    // 2. Controle de frequência: verifica se já foi fechado nesta sessão
    try {
      const isDismissedSession = sessionStorage.getItem(STORAGE_KEY);
      const isDismissedLocal = localStorage.getItem(STORAGE_KEY);
      if (isDismissedSession === 'true' || isDismissedLocal === 'true') {
        return;
      }
    } catch (e) {
      // Ignora falhas no acesso ao storage
    }

    let timerId = null;
    let hasTriggered = false;

    const triggerOpen = () => {
      if (!hasTriggered) {
        hasTriggered = true;
        setIsOpen(true);
        cleanup();
      }
    };

    // Gatilho 1: Permanência de 3 segundos
    timerId = setTimeout(() => {
      triggerOpen();
    }, 3000);

    // Gatilho 2: Rolar 20% da página
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0 && (scrollTop / scrollHeight) >= 0.20) {
        triggerOpen();
      }
    };

    const cleanup = () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cleanup();
    };
  }, [checkCampaignActive]);

  const handleCtaClick = (e) => {
    e.preventDefault();

    // Rastreamento de conversão (Google Tag / GTM)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Promocao',
        event_label: 'Mes do Cliente 10 OFF',
      });
    }

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'lead_whatsapp_promo',
        origem: 'modal_mes_do_cliente',
      });
    }

    // Rastreamento de conversão (Meta Pixel)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: 'Mes do Cliente 10 OFF',
        content_category: 'Promocao',
      });
    }

    // Mensagem pré-definida codificada
    const message = 'Olá! Vi a promoção de 10% OFF do Mês do Cliente no site e quero garantir minha reserva para 2026.';
    const whatsappUrl = buildWhatsAppLink(message);

    // Salva o fechamento no storage ao converter
    handleClose();

    // Redireciona em nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Promoção Mês do Cliente - 10% OFF no PIX"
    >
      <div
        className="relative max-w-[360px] sm:max-w-[420px] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar ("X") com área de toque mínima de 44x44px */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar modal de promoção"
          className="absolute top-3 right-3 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-black/85 text-white shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Arte Promocional Vertical (Format 9:16) */}
        <div className="relative w-full overflow-hidden flex-1 flex items-center justify-center bg-slate-950 min-h-0 select-none">
          <img
            src="/images/promo-mes-do-cliente.jpg"
            alt="Promoção Especial Mês do Cliente - 10% OFF no PIX para Transfers Executivos e Passeios Privativos em Jericoacoara"
            className="w-full h-full object-contain max-h-[calc(85vh-76px)] sm:max-h-[calc(85vh-84px)]"
            loading="eager"
          />
        </div>

        {/* Botão de Ação Principal (CTA para WhatsApp) */}
        <div className="p-3.5 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-98 tracking-wide cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current shrink-0" />
            <span className="uppercase tracking-wider drop-shadow-sm">
              APROVEITAR 10% OFF NO WHATSAPP
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
