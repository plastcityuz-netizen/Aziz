'use client';

import { DENSITIES, THICKNESSES } from '@/data/products';
import { useStore } from '@/lib/store';

/**
 * Katalog tepasidagi sticky tanlov paneli — qidiruv/filtr YO'Q, faqat zichlik va qalinlik chiplari.
 * Tanlov global: kartalar narxi va buyurtma narxi darhol yangilanadi.
 */
export default function FilterPanel() {
  const { t, density, setDensity, thickness, setThickness } = useStore();

  return (
    <div
      className="sticky top-[70px] z-30 mt-6 rounded-2xl border border-white/[0.09] bg-[#0A0E15]/88 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:top-[84px] sm:rounded-[22px] sm:p-4"
      style={{ '--acc': '#1E8BC3', '--acc-glow': 'rgba(30,139,195,0.45)' } as React.CSSProperties}
      role="group"
      aria-label="Zichlik va qalinlik tanlovi"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        {/* Zichlik */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-3 px-1">
            <span className="eyebrow !text-[10px]">{t.selection.density} <span className="text-white/30">KG/M³</span></span>
          </div>
          <div className="fade-x no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5 sm:gap-2">
            {DENSITIES.map((d) => (
              <button
                key={d}
                type="button"
                className="chip h-11 min-w-[2.75rem] text-[12px] sm:h-11 sm:min-w-[2.75rem]"
                data-active={density === d}
                onClick={() => setDensity(d)}
                aria-pressed={density === d}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden h-12 w-px bg-white/[0.08] lg:block" />

        {/* Qalinlik */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-3 px-1">
            <span className="eyebrow !text-[10px]">{t.selection.thickness} <span className="text-white/30">CM</span></span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-brand-blue sm:inline">
              {density} KG/M³ · {thickness} CM
            </span>
          </div>
          <div className="fade-x no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5 sm:gap-2">
            {THICKNESSES.map((th) => (
              <button
                key={th}
                type="button"
                className="chip h-11 min-w-[2.75rem] text-[12px] sm:h-11 sm:min-w-[2.75rem]"
                data-active={thickness === th}
                onClick={() => setThickness(th)}
                aria-pressed={thickness === th}
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
