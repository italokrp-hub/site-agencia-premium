import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: 'home', label: 'Inicio' },
  { id: 'experiencias', label: 'Destaques' },
  { id: 'tours', label: 'Passeios' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'planner', label: 'Roteiro' },
  { id: 'depoimentos', label: 'Avaliações' },
];

const RouteAnimation = () => {
  const containerRef = useRef(null);
  const buggyRef = useRef(null);
  const trackRef = useRef(null);
  const wheelsRef = useRef([]);

  const [activeSection, setActiveSection] = useState('home');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Accessibility check: disable if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Refresh ScrollTrigger after DOM load
    const ctx = gsap.context(() => {
      // Main timeline tracking document scroll percentage
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          // Move the Buggy vehicle along the vertical track height
          if (buggyRef.current && trackRef.current) {
            const trackHeight = trackRef.current.offsetHeight - 48;
            const targetY = p * trackHeight;

            gsap.to(buggyRef.current, {
              y: targetY,
              duration: 0.3,
              ease: 'power1.out',
              overwrite: 'auto',
            });

            // Spin wheels according to scroll velocity
            const velocity = Math.abs(self.getVelocity());
            if (wheelsRef.current.length) {
              gsap.to(wheelsRef.current, {
                rotation: `+=${velocity * 0.15}`,
                duration: 0.2,
                ease: 'none',
              });
            }
          }

          // Active section detection
          const scrollPos = window.scrollY + window.innerHeight / 3;
          for (const sec of SECTIONS) {
            const el = document.getElementById(sec.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection(sec.id);
                break;
              }
            }
          }
        },
      });

      return () => st.kill();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed right-6 top-1/4 bottom-1/4 z-40 pointer-events-none hidden lg:flex flex-col items-center justify-between"
      style={{ pointerEvents: 'none' }}
    >
      {/* Vertical Dune Trail Line */}
      <div
        ref={trackRef}
        className="relative h-full w-12 flex flex-col items-center justify-between"
      >
        {/* Track Line background */}
        <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37]/20 via-[#2C7A7B]/30 to-[#D4AF37]/20 rounded-full" />
        <div
          className="absolute top-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#2C7A7B] rounded-full transition-all duration-150"
          style={{ height: `${progress * 100}%` }}
        />

        {/* Section Checkpoint Dots */}
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-center group"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                  isActive
                    ? 'bg-[#D4AF37] border-white scale-125 shadow-md shadow-[#D4AF37]/50'
                    : 'bg-white border-gray-300'
                }`}
              />

              {/* Tooltip Label */}
              <span
                className={`absolute right-6 px-2 py-0.5 rounded text-[10px] font-bold transition-all duration-300 whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-gray-900 text-[#D4AF37] opacity-100 translate-x-0'
                    : 'bg-white text-gray-600 border border-gray-200 opacity-0 translate-x-2'
                }`}
              >
                {sec.label}
              </span>
            </div>
          );
        })}

        {/* Animated 4x4 Buggy Vehicle Element */}
        <div
          ref={buggyRef}
          className="absolute top-0 -left-4 w-20 h-12 flex items-center justify-center"
          style={{ transform: 'translateY(0px)' }}
        >
          {/* Dust particle trail behind Buggy */}
          <div className="absolute -top-3 left-3 w-6 h-6 rounded-full bg-[#D4AF37]/20 blur-sm animate-pulse" />

          {/* SVG Buggy 4x4 Illustration */}
          <svg
            viewBox="0 0 100 60"
            className="w-16 h-10 drop-shadow-md transition-transform duration-200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Roll cage / frame */}
            <path
              d="M25 30 L40 10 L70 10 L80 30"
              stroke="#111827"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Canvas soft top */}
            <path
              d="M38 10 L72 10"
              stroke="#D4AF37"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Body hood & side panels */}
            <path
              d="M10 32 L90 32 C93 32 95 35 93 38 L88 44 C86 46 83 46 80 46 L20 46 C16 46 13 44 11 40 L8 35 C7 33 8 32 10 32 Z"
              fill="#2C7A7B"
            />
            {/* Golden side accent stripe */}
            <path
              d="M15 36 L85 36"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Headlight Glow */}
            <circle cx="90" cy="38" r="3.5" fill="#FEF08A" />
            <polygon points="90,36 100,32 100,44 90,40" fill="#FEF08A" opacity="0.4" />

            {/* Rear spare tire */}
            <circle cx="12" cy="34" r="6" fill="#1F2937" stroke="#374151" strokeWidth="2" />

            {/* Front Wheel */}
            <g
              ref={(el) => (wheelsRef.current[0] = el)}
              style={{ transformOrigin: '75px 44px' }}
            >
              <circle cx="75" cy="44" r="9" fill="#111827" stroke="#374151" strokeWidth="2" />
              <circle cx="75" cy="44" r="4" fill="#9CA3AF" />
              <line x1="75" y1="35" x2="75" y2="53" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="66" y1="44" x2="84" y2="44" stroke="#D1D5DB" strokeWidth="1.5" />
            </g>

            {/* Rear Wheel */}
            <g
              ref={(el) => (wheelsRef.current[1] = el)}
              style={{ transformOrigin: '30px 44px' }}
            >
              <circle cx="30" cy="44" r="9" fill="#111827" stroke="#374151" strokeWidth="2" />
              <circle cx="30" cy="44" r="4" fill="#9CA3AF" />
              <line x1="30" y1="35" x2="30" y2="53" stroke="#D1D5DB" strokeWidth="1.5" />
              <line x1="21" y1="44" x2="39" y2="44" stroke="#D1D5DB" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RouteAnimation;
