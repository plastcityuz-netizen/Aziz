'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TICKS = 72;

/**
 * Kirish loaderi — xira ko'k fonda zichlik o'lchagichi.
 * Sun'iy kechikish yo'q: rAF progress ~1.05s, tuggach silliq ochiladi.
 * prefers-reduced-motion da darhol o'tkazib yuboriladi.
 */
export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let booted = false;
    try {
      booted = window.sessionStorage.getItem('pc_booted') === '1';
    } catch {
      /* ignore */
    }
    if (booted) {
      // bir sessiyada takror ko'rsatmaymiz — silliq o'tkazib yuboramiz
      setProgress(1);
      setDone(true);
      return;
    }

    function finish() {
      try {
        window.sessionStorage.setItem('pc_booted', '1');
      } catch {
        /* ignore */
      }
      setDone(true);
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setProgress(1);
      const id = window.setTimeout(finish, 120);
      return () => window.clearTimeout(id);
    }
    const duration = 1050;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finish, 130);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needleDeg = -90 + progress * 360;
  const activeTicks = Math.round(progress * TICKS);
  const densityValue = (progress * 20).toFixed(1);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#04060a]"
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* atmosfera */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(30,139,195,0.16) 0%, transparent 62%)', filter: 'blur(70px)' }}
          />

          <div className="relative flex flex-col items-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/[0.42]">
              Penaplast Zavodi
            </span>

            {/* o'lchagich */}
            <svg viewBox="0 0 240 240" className="mt-5 h-56 w-56 sm:h-64 sm:w-64" role="img" aria-label="Plast City yuklanmoqda">
              <circle cx="120" cy="120" r="98" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="rgba(255,255,255,0.015)" />
              {Array.from({ length: TICKS }).map((_, i) => {
                const angle = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
                const long = i % 6 === 0;
                const r1 = long ? 70 : 78;
                const r2 = 88;
                const x1 = 120 + Math.cos(angle) * r1;
                const y1 = 120 + Math.sin(angle) * r1;
                const x2 = 120 + Math.cos(angle) * r2;
                const y2 = 120 + Math.sin(angle) * r2;
                const active = i < activeTicks;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={active ? '#FF5346' : 'rgba(255,255,255,0.09)'}
                    strokeWidth={long ? 2.4 : 1.4}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 140ms linear' }}
                  />
                );
              })}
              {/* zichlik raqamlari */}
              <text x="120" y="34" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="var(--font-mono, monospace)" letterSpacing="2">5</text>
              <text x="206" y="124" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" letterSpacing="2">10</text>
              <text x="120" y="216" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" letterSpacing="2">15</text>
              <text x="34" y="124" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" letterSpacing="2">20</text>
              {/* mil */}
              <g transform={`rotate(${needleDeg} 120 120)`} style={{ filter: 'drop-shadow(0 0 6px rgba(255,83,70,0.65))' }}>
                <line x1="120" y1="120" x2="120" y2="52" stroke="#FF5346" strokeWidth="3" strokeLinecap="round" />
                <line x1="120" y1="120" x2="120" y2="136" stroke="#FF5346" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
              </g>
              <circle cx="120" cy="120" r="9" fill="#0B0F16" stroke="#FF5346" strokeWidth="2" />
              <circle cx="120" cy="120" r="2.4" fill="#FF8A7A" />
            </svg>

            {/* raqamli ko'rsatkich */}
            <div className="mt-4 flex flex-col items-center">
              <span className="font-mono text-4xl font-semibold tabular-nums text-white">{densityValue}</span>
              <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.4em] text-white/35">kg/m³ · zichlik</span>
            </div>

            <span className="mt-6 text-lg font-extrabold uppercase tracking-[0.3em] text-white/[0.92]">
              PLAST <span className="font-light text-brand-blue">CITY</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
