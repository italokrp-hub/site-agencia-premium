/**
 * JeriDuneTrail — Ultra-Optimized Scrollytelling Experience
 * ─────────────────────────────────────────────────────────────
 * 1. DYNAMIC SECTION TIMING:
 *    - Waypoint thresholds are dynamically computed from DOM element offsets (`#home`, `#experiencias`, `#tours`, `#transfers`, `#mapa`, `#planner`, `#depoimentos`).
 *    - Section labels update IMMEDIATELY as each section's top boundary enters the viewport threshold.
 *
 * 2. MOBILE PERFORMANCE GUARANTEE (< 1024px):
 *    - Strict guard `window.innerWidth < 1024` returns `null` at initial render — zero DOM overhead, zero GSAP loops, zero scroll listeners on mobile devices.
 *    - Clean teardown on resize.
 *
 * 3. VECTOR INLINE BUGGY + ANCHORED LABEL:
 *    - 100% SVG vector alpha transparency.
 *    - Label attached directly to buggy position (px, py).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BASE_WAYPOINTS = [
  { id: 'home',        label: 'Home',              defaultPct: 0.00 },
  { id: 'experiencias', label: 'Experiências',     defaultPct: 0.14 },
  { id: 'tours',       label: 'Passeios & Tours',  defaultPct: 0.28 },
  { id: 'transfers',   label: 'Transfers VIP',     defaultPct: 0.44 },
  { id: 'mapa',        label: 'Mapa de Jeri',      defaultPct: 0.58 },
  { id: 'planner',     label: 'Travel Planner',    defaultPct: 0.72 },
  { id: 'depoimentos', label: 'Depoimentos',       defaultPct: 0.88 },
];

// Pure Inline SVG Top-Down Buggy Vector
function BuggyVectorSvg() {
  return (
    <svg
      width="44"
      height="60"
      viewBox="0 0 44 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] pointer-events-none"
    >
      {/* Front Left Tire */}
      <rect x="2" y="8" width="7" height="14" rx="2" fill="#1F2937" stroke="#111827" strokeWidth="1" />
      <line x1="2" y1="12" x2="9" y2="12" stroke="#374151" strokeWidth="1" />
      <line x1="2" y1="17" x2="9" y2="17" stroke="#374151" strokeWidth="1" />

      {/* Front Right Tire */}
      <rect x="35" y="8" width="7" height="14" rx="2" fill="#1F2937" stroke="#111827" strokeWidth="1" />
      <line x1="35" y1="12" x2="42" y2="12" stroke="#374151" strokeWidth="1" />
      <line x1="35" y1="17" x2="42" y2="17" stroke="#374151" strokeWidth="1" />

      {/* Rear Left Tire */}
      <rect x="1" y="38" width="8" height="16" rx="2" fill="#111827" stroke="#030712" strokeWidth="1" />
      <line x1="1" y1="42" x2="9" y2="42" stroke="#374151" strokeWidth="1" />
      <line x1="1" y1="48" x2="9" y2="48" stroke="#374151" strokeWidth="1" />

      {/* Rear Right Tire */}
      <rect x="35" y="38" width="8" height="16" rx="2" fill="#111827" stroke="#030712" strokeWidth="1" />
      <line x1="35" y1="42" x2="43" y2="42" stroke="#374151" strokeWidth="1" />
      <line x1="35" y1="48" x2="43" y2="48" stroke="#374151" strokeWidth="1" />

      {/* Axles */}
      <rect x="8" y="14" width="28" height="2" fill="#4B5563" />
      <rect x="8" y="45" width="28" height="3" fill="#374151" />

      {/* Main Red Body */}
      <path
        d="M 12 18 C 12 10, 32 10, 32 18 L 34 32 C 34 46, 31 52, 22 52 C 13 52, 10 46, 10 32 Z"
        fill="url(#buggyRedGradOpt)"
      />

      {/* Hood & Windshield Highlights */}
      <path d="M 14 16 L 22 8 L 30 16 Z" fill="#EF4444" opacity="0.8" />
      <path d="M 15 17 C 22 13, 29 17, 29 17" stroke="#FCA5A5" strokeWidth="1" fill="none" opacity="0.6" />

      {/* Front Bull Bar Bumper */}
      <rect x="10" y="5" width="24" height="4" rx="2" fill="#1F2937" />
      {/* Spotlights */}
      <circle cx="14" cy="5" r="2" fill="#FEF08A" />
      <circle cx="30" cy="5" r="2" fill="#FEF08A" />

      {/* Cockpit & Bucket Seats */}
      <rect x="14" y="24" width="16" height="18" rx="2" fill="#0F172A" />
      <rect x="15" y="26" width="6" height="9" rx="1.5" fill="#334155" />
      <rect x="23" y="26" width="6" height="9" rx="1.5" fill="#334155" />

      {/* Steering Wheel */}
      <circle cx="18" cy="23" r="2.5" fill="none" stroke="#94A3B8" strokeWidth="1" />

      {/* Roll Cage & Screws */}
      <path d="M 13 20 L 13 44 M 31 20 L 31 44" stroke="#1E293B" strokeWidth="1.5" />
      <path d="M 13 22 L 31 22 M 13 36 L 31 36 M 13 44 L 31 44" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="13" cy="22" r="1.5" fill="#D4AF37" />
      <circle cx="31" cy="22" r="1.5" fill="#D4AF37" />

      {/* Rear Engine & Spare Tire */}
      <circle cx="22" cy="47" r="4.5" fill="#1F2937" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="22" cy="47" r="2" fill="#4B5563" />

      <defs>
        <linearGradient id="buggyRedGradOpt" x1="12" y1="10" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function JeriDuneTrail() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024;
  });

  const canvasRef   = useRef(null);
  const buggyRef    = useRef(null);
  const svgRef      = useRef(null);
  const pathRef     = useRef(null);

  const [progress,  setProgress]  = useState(0);
  const [activeWpt, setActiveWpt] = useState(BASE_WAYPOINTS[0]);
  const [buggyPos,  setBuggyPos]  = useState({ x: 70, y: 15 });
  const waypointsRef = useRef(BASE_WAYPOINTS);

  // Resize listener strictly for desktop detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute dynamic section entry thresholds directly from DOM section offsets
  const updateDynamicWaypoints = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const updated = BASE_WAYPOINTS.map((wp) => {
      const el = document.getElementById(wp.id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        // Trigger threshold: 100px before section top enters viewport for instant label update
        const pct = Math.max(0, Math.min(1, (top - 100) / maxScroll));
        return { ...wp, pct };
      }
      return { ...wp, pct: wp.defaultPct };
    });

    waypointsRef.current = updated;
  }, []);

  useEffect(() => {
    // Mobile check: skip ALL GSAP initialization if under 1024px or prefers-reduced-motion
    if (!isDesktop || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    updateDynamicWaypoints();
    window.addEventListener('resize', updateDynamicWaypoints, { passive: true });

    let pathLen = 0;
    if (pathRef.current) pathLen = pathRef.current.getTotalLength();
    let lastWptIdx = -1;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: document.body,
        start:   'top top',
        end:     'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Path Motion & Steering
          if (pathRef.current && pathLen > 0) {
            const len  = Math.min(pathLen, p * pathLen);
            const pt   = pathRef.current.getPointAtLength(len);
            const nLen = Math.min(pathLen, len + 3);
            const nPt  = pathRef.current.getPointAtLength(nLen);

            const dx = nPt.x - pt.x;
            const dy = nPt.y - pt.y;
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

            if (buggyRef.current) {
              const svgEl = svgRef.current;
              const svgW  = svgEl ? svgEl.clientWidth  || 120 : 120;
              const svgH  = svgEl ? svgEl.clientHeight || 800 : 800;
              const vw = 140;
              const vh = 800;

              const px = (pt.x / vw) * svgW;
              const py = (pt.y / vh) * svgH;

              setBuggyPos({ x: px, y: py });
              buggyRef.current.style.transform = `translate(${px - 22}px, ${py - 30}px) rotate(${angle}deg)`;
            }
          }

          // Instant Section Entry Timing Calculation
          const currentWaypoints = waypointsRef.current;
          let wptIdx = 0;
          for (let i = currentWaypoints.length - 1; i >= 0; i--) {
            if (p >= currentWaypoints[i].pct) {
              wptIdx = i;
              break;
            }
          }
          if (wptIdx !== lastWptIdx) {
            lastWptIdx = wptIdx;
            setActiveWpt(currentWaypoints[wptIdx]);
          }
        },
      });
      return () => st.kill();
    }, canvasRef);

    return () => {
      window.removeEventListener('resize', updateDynamicWaypoints);
      ctx.revert();
    };
  }, [isDesktop, updateDynamicWaypoints]);

  // Mobile optimization: Render absolute NULL to ensure 0% DOM/JS overhead on phones
  if (!isDesktop) {
    return null;
  }

  const TRAIL_D = 'M 70 15 C 130 200, 10 340, 70 480 C 130 620, 10 730, 70 790';

  return (
    <aside
      aria-hidden="true"
      ref={canvasRef}
      className="fixed right-3 top-0 bottom-0 w-[110px] xl:w-[130px] z-30 pointer-events-none select-none hidden lg:block overflow-visible bg-transparent"
      style={{ pointerEvents: 'none' }}
    >
      {/* SVG Trail Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 140 800"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          <linearGradient id="goldTrailGradOpt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="50%"  stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
          </linearGradient>

          <clipPath id="trailProgressClipOpt">
            <rect x="0" y="0" width="140" height={800 * progress} />
          </clipPath>
        </defs>

        {/* Faint base trail */}
        <path
          d={TRAIL_D}
          ref={pathRef}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.2"
        />

        {/* Active illuminated golden trail */}
        <path
          d={TRAIL_D}
          fill="none"
          stroke="url(#goldTrailGradOpt)"
          strokeWidth="1.5"
          strokeLinecap="round"
          clipPath="url(#trailProgressClipOpt)"
          opacity="0.9"
        />

        {/* Dynamic Waypoint Dots */}
        {waypointsRef.current.map((wp) => {
          const isActive = activeWpt.id === wp.id;
          const passed   = progress >= wp.pct;
          const t  = wp.pct;
          const sy = 15 + t * 775;
          const sx = 70 + 60 * Math.sin(t * Math.PI * 2);

          return (
            <g key={wp.id} transform={`translate(${sx}, ${sy})`}>
              {isActive && (
                <circle r="7" fill="#D4AF37" opacity="0.25">
                  <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                r={isActive ? 3 : 2}
                fill={passed ? '#D4AF37' : '#FFFFFF'}
                opacity={passed ? 0.95 : 0.35}
              />
            </g>
          );
        })}
      </svg>

      {/* Buggy Container */}
      <div
        ref={buggyRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-11 h-15 pointer-events-none flex items-center justify-center"
        style={{
          transform: 'translate(48px, -15px) rotate(180deg)',
          willChange: 'transform',
          transformOrigin: 'center center',
          transition: 'transform 40ms linear',
        }}
      >
        <BuggyVectorSvg />
      </div>

      {/* Dynamic Section Label — Synchronized directly to buggy coordinates */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${buggyPos.x - 175}px, ${buggyPos.y - 14}px)`,
          willChange: 'transform',
        }}
      >
        <div className="flex items-center gap-1.5 bg-[#0A1214]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-xl px-2.5 py-1 rounded-full whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[9px] font-medium text-white/70">Estamos em:</span>
          <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider">
            {activeWpt.label}
          </span>
        </div>
      </div>
    </aside>
  );
}
