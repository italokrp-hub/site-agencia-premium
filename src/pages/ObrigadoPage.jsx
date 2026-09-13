import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MessageCircle, Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppLink, WA_MESSAGES } from '@/utils/whatsapp';

const ObrigadoPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customMessage = searchParams.get('text') || searchParams.get('msg') || WA_MESSAGES.generic;

  const targetWhatsAppUrl = buildWhatsAppLink(customMessage);

  useEffect(() => {
    // 1. Disparar evento de conversão do Google Ads de forma segura
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
      }
      try {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18434748779/6pkrCI6Ii9kaEJSgo7s9',
        });
        console.log('[Google Ads] Tag de conversão disparada com sucesso: AW-18434748779/6pkrCI6Ii9kaEJSgo7s9');
      } catch (err) {
        console.error('[Google Ads] Erro ao disparar tag de conversão:', err);
      }
    }

    // 2. Redirecionar automaticamente para o WhatsApp após 1,2s (entre 1 e 1.5s)
    const timer = setTimeout(() => {
      window.location.href = targetWhatsAppUrl;
    }, 1200);

    return () => clearTimeout(timer);
  }, [targetWhatsAppUrl]);

  return (
    <>
      <Helmet>
        <title>Redirecionando para o Atendimento | Jericoacoara Premium</title>
        <meta name="description" content="Aguarde um momento enquanto redirecionamos você para o atendimento oficial via WhatsApp da Jericoacoara Premium." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-[#0F1A1C] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Blur Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 text-center relative z-10 shadow-2xl flex flex-col items-center space-y-6">
          
          {/* Logo Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-extrabold tracking-widest text-lg">JERICOACOARA</span>
            <span className="bg-[#D4AF37] text-gray-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">PREMIUM</span>
          </div>

          {/* Spinner and Status Icon */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-20 h-20 rounded-full border-2 border-white/10 border-t-[#25D366] animate-spin flex items-center justify-center" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center border border-[#25D366]/40">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Quase lá! Redirecionando para nosso atendimento...
            </h1>
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              Em instantes você será levado ao WhatsApp oficial da Jericoacoara Premium para receber seu orçamento.
            </p>
          </div>

          {/* Indicator text */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#D4AF37] font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Iniciando conversa segura no WhatsApp...</span>
          </div>

          {/* Fallback Button */}
          <div className="w-full pt-4 space-y-3">
            <a
              href={targetWhatsAppUrl}
              className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Clique aqui se o WhatsApp não abrir automaticamente
            </a>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-xs text-white/50 hover:text-white transition-colors pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o site da agência
            </Link>
          </div>

          {/* Trust Footer Badges */}
          <div className="pt-6 border-t border-white/10 w-full flex items-center justify-center gap-6 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> CNPJ & CADASTUR
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" /> Atendimento 24h
            </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default ObrigadoPage;
