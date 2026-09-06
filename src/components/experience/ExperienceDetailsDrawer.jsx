import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Star,
  Users,
  Car,
  Calendar,
  Tag,
  ChevronRight,
  MessageCircle,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatPrice,
  PIX_DISCOUNT_PERCENT,
} from '@/data/catalog';
import { buildWhatsAppLink } from '@/utils/whatsapp';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers to derive display data from catalog items
// ─────────────────────────────────────────────────────────────────────────────
function resolveCategory(item) {
  if (item?.category === 'transfer' || item?.options?.private?.tiers) return 'transfer';
  if (item?.category === 'tour') return 'tour';
  if (item?.raw?.category) return item.raw.category;
  return 'tour';
}

function resolveStartingPrice(item, category) {
  if (category === 'transfer') {
    const raw = item?.raw || item;
    const shared = raw?.options?.shared;
    const tiers = raw?.options?.private?.tiers;
    if (tiers?.length) return { price: tiers[0].oneWay, label: 'por veículo · somente ida' };
    if (shared?.available) return { price: shared.oneWay, label: 'por pessoa · somente ida' };
    return null;
  }
  if (category === 'tour') {
    const raw = item?.raw || item;
    if (raw?.requireWhatsApp) return null;
    const vehicles = raw?.options?.private?.vehicles;
    const sharedPrice = raw?.options?.shared?.price;
    if (vehicles?.length) return { price: vehicles[0].price, label: 'por veículo' };
    if (sharedPrice) return { price: sharedPrice, label: 'por pessoa' };
  }
  return null;
}

function resolveLocations(item) {
  return item?.locations || item?.raw?.locations || [];
}

function resolveVehicles(item) {
  return item?.options?.private?.vehicles || item?.raw?.options?.private?.vehicles || [];
}

function resolveTiers(item) {
  return item?.options?.private?.tiers || item?.raw?.options?.private?.tiers || [];
}

function resolveDescription(item) {
  return item?.description || item?.raw?.description || '';
}

function resolveTitle(item) {
  return item?.title || item?.raw?.title || 'Experiência';
}

function resolveImage(item) {
  return item?.image || item?.raw?.image || 'https://images.unsplash.com/photo-1517347748150-029cea4cc0fd?w=800&q=75';
}

function resolveIsWhatsAppOnly(item) {
  return item?.requireWhatsApp || item?.raw?.requireWhatsApp || false;
}

function resolveSharedAvailable(item) {
  return item?.options?.shared?.available || item?.raw?.options?.shared?.available || false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function DrawerBadge({ children, color = 'teal' }) {
  const colors = {
    teal: 'bg-[#2C7A7B]/10 text-[#2C7A7B] border-[#2C7A7B]/20',
    gold: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[color]}`}>
      {children}
    </span>
  );
}

function PriceSection({ item, category, isWhatsAppOnly }) {
  const priceInfo = resolveStartingPrice(item, category);
  const pix5pct = priceInfo ? priceInfo.price * (1 - PIX_DISCOUNT_PERCENT) : null;

  if (isWhatsAppOnly) {
    return (
      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4">
        <p className="text-[#D4AF37] font-bold text-lg">Sob consulta</p>
        <p className="text-sm text-gray-500 mt-0.5">Disponibilidade e valores via WhatsApp</p>
      </div>
    );
  }

  if (!priceInfo) return null;

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-extrabold text-[#2C7A7B]">
          {formatPrice(priceInfo.price)}
        </span>
        <span className="text-sm text-gray-400">{priceInfo.label}</span>
      </div>
      {pix5pct && (
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">
            {formatPrice(pix5pct)} no PIX (5% OFF)
          </span>
        </div>
      )}
      <p className="text-xs text-gray-400">
        Parcele em até 10x no cartão · sinal de 50% online
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Drawer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ExperienceDetailsDrawer
 *
 * @param {Object} item        - Catalog item (tour or transfer raw data)
 * @param {boolean} open       - Whether the drawer is open
 * @param {function} onClose   - Close handler
 * @param {function} onBook    - Called with the item when user wants to book
 */
const ExperienceDetailsDrawer = ({ item, open, onClose, onBook }) => {
  const scrollRef = useRef(null);
  const firstFocusRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // ── Focus trap & keyboard handling ──────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    // Scroll to top when item changes
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setImageLoaded(false);

    // Focus first focusable element
    const timer = setTimeout(() => firstFocusRef.current?.focus(), 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, item, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!item) return null;

  // ── Derived data ─────────────────────────────────────────────────────────
  const category = resolveCategory(item);
  const title = resolveTitle(item);
  const description = resolveDescription(item);
  const image = resolveImage(item);
  const locations = resolveLocations(item);
  const vehicles = resolveVehicles(item);
  const tiers = resolveTiers(item);
  const isWhatsAppOnly = resolveIsWhatsAppOnly(item);
  const sharedAvailable = resolveSharedAvailable(item);
  const isTransfer = category === 'transfer';

  const waMessage = `Olá! Gostaria de saber mais sobre: ${title}`;

  // ── Inner drawer panel (shared between mobile and desktop) ────────────────
  const DrawerPanel = (
    <div
      className="flex flex-col h-full bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes: ${title}`}
    >
      {/* ── Hero image ──────────────────────────────────────────────────── */}
      <div className="relative shrink-0 h-52 md:h-64 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Close button */}
        <button
          ref={firstFocusRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <DrawerBadge color={isTransfer ? 'teal' : isWhatsAppOnly ? 'gold' : 'teal'}>
            {isTransfer ? '🚗 Transfer' : isWhatsAppOnly ? '✨ Premium' : '🧭 Passeio'}
          </DrawerBadge>
        </div>

        {/* Title on image */}
        <div className="absolute bottom-4 left-4 right-14">
          <h2 className="text-white font-bold text-xl md:text-2xl leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="p-5 md:p-6 space-y-5">

          {/* Modality / availability chips */}
          <div className="flex flex-wrap gap-2">
            {sharedAvailable && (
              <DrawerBadge color="green">
                <Users className="w-3 h-3 mr-1" />
                Compartilhado disponível
              </DrawerBadge>
            )}
            {(vehicles.length > 0 || tiers.length > 0) && (
              <DrawerBadge color="teal">
                <Car className="w-3 h-3 mr-1" />
                Privativo disponível
              </DrawerBadge>
            )}
            {!isWhatsAppOnly && (
              <DrawerBadge color="gray">
                <Tag className="w-3 h-3 mr-1" />
                5% OFF no PIX
              </DrawerBadge>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          )}

          {/* Locations / itinerary */}
          {locations.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <span className="w-1 h-4 rounded-full bg-[#2C7A7B] inline-block" />
                Roteiro / Paradas
              </h3>
              <ul className="space-y-2">
                {locations.map((loc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-[#2C7A7B]/10 text-[#2C7A7B] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {loc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transfer tiers */}
          {isTransfer && tiers.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <span className="w-1 h-4 rounded-full bg-[#2C7A7B] inline-block" />
                Opções de Veículo
              </h3>
              <div className="space-y-2">
                {tiers.map((tier) => (
                  <div
                    key={tier.vehicle}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-gray-900">{tier.vehicle}</span>
                      <span className="text-gray-400 ml-2 text-xs">até {tier.maxCapacity} pessoas</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#2C7A7B]">{formatPrice(tier.roundTrip)}</p>
                      <p className="text-[10px] text-gray-400">ida e volta</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tour vehicles */}
          {!isTransfer && vehicles.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <span className="w-1 h-4 rounded-full bg-[#2C7A7B] inline-block" />
                Veículos Disponíveis
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {vehicles.map((v) => (
                  <div
                    key={v.type}
                    className="bg-gray-50 rounded-xl px-3 py-3 text-center border border-gray-100"
                  >
                    <p className="font-bold text-gray-900 text-sm">{v.type}</p>
                    <p className="text-[#2C7A7B] font-bold text-sm">{formatPrice(v.price)}</p>
                    <p className="text-xs text-gray-400">até {v.maxCapacity}p</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared price for tours */}
          {!isTransfer && sharedAvailable && (() => {
            const raw = item?.raw || item;
            const sharedPrice = raw?.options?.shared?.price;
            if (!sharedPrice) return null;
            return (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-800 font-bold text-sm">Compartilhado (Jardineira)</p>
                    <p className="text-emerald-600 text-xs">por pessoa — ótimo custo-benefício</p>
                  </div>
                  <p className="text-emerald-700 font-extrabold text-lg">{formatPrice(sharedPrice)}</p>
                </div>
              </div>
            );
          })()}

          {/* Price section */}
          <PriceSection item={item} category={category} isWhatsAppOnly={isWhatsAppOnly} />

          {/* Trust items */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Shield, text: 'Cadastur regularizado' },
              { icon: Star, text: 'Motoristas certificados' },
              { icon: Calendar, text: 'Sinal de 50% online' },
              { icon: Check, text: 'Suporte 24 horas' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                <Icon className="w-3.5 h-3.5 text-[#2C7A7B] shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky CTA footer ────────────────────────────────────────────── */}
      <div className="shrink-0 px-5 pb-5 pt-4 md:px-6 border-t border-gray-100 bg-white space-y-2.5">
        {isWhatsAppOnly ? (
          <a
            href={buildWhatsAppLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A028] text-gray-900 font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar disponibilidade
          </a>
        ) : (
          <Button
            onClick={() => onBook && onBook(item)}
            className="w-full h-12 rounded-2xl bg-[#2C7A7B] hover:bg-[#235f60] text-white font-bold text-base shadow-lg shadow-[#2C7A7B]/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#2C7A7B] focus-visible:ring-offset-2"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Reservar experiência
          </Button>
        )}
        <button
          onClick={onClose}
          className="w-full h-10 rounded-xl text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          Fechar
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* ── Mobile: slide-up bottom sheet ──────────────────────────── */}
          <motion.div
            key="drawer-mobile"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl overflow-hidden shadow-2xl"
            style={{ maxHeight: '92dvh' }}
          >
            {/* Handle bar */}
            <div className="absolute top-2.5 left-0 right-0 flex justify-center pointer-events-none z-10">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="pt-5 h-full">
              {DrawerPanel}
            </div>
          </motion.div>

          {/* ── Desktop: slide-in right panel ──────────────────────────── */}
          <motion.div
            key="drawer-desktop"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 40 }}
            className="hidden md:flex fixed top-0 right-0 bottom-0 z-[60] w-[420px] xl:w-[480px] shadow-2xl flex-col"
          >
            {DrawerPanel}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExperienceDetailsDrawer;
