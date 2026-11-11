'use client';

import { PRODUCT_ORDER, PRODUCTS } from '@/data/products';
import { useStore } from '@/lib/store';

/**
 * Tashqi xira fon — tanlangan mahsulotga ko'ra silliq rang o'zgaradi.
 * Har mahsulot uchun alohida gradient qatlami; opacity transition bilan fade qilinadi
 * (GPU-friendly, transform/opacity).
 */
export default function AmbientBackground() {
  const { heroIndex } = useStore();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#04060a]">
      {PRODUCT_ORDER.map((id, i) => {
        const p = PRODUCTS[id];
        return (
          <div
            key={id}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-premium"
            style={{ opacity: heroIndex === i ? 1 : 0 }}
          >
            <div
              className="absolute -left-[15%] top-[-22%] h-[70vmax] w-[70vmax] rounded-full"
              style={{ background: `radial-gradient(circle, ${p.ambient} 0%, transparent 62%)`, filter: 'blur(90px)' }}
            />
            <div
              className="absolute -right-[18%] bottom-[-25%] h-[72vmax] w-[72vmax] rounded-full"
              style={{ background: `radial-gradient(circle, ${p.ambient} 0%, transparent 60%)`, filter: 'blur(110px)', opacity: 0.75 }}
            />
            <div
              className="absolute left-[38%] top-[30%] h-[46vmax] w-[46vmax] rounded-full"
              style={{ background: `radial-gradient(circle, ${p.glow} 0%, transparent 65%)`, filter: 'blur(120px)', opacity: 0.35 }}
            />
          </div>
        );
      })}
      {/* donador tekstura (noiz) */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
      {/* vinyetka */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  );
}
