'use client';

import { DENSITIES, PRODUCTS } from '@/data/products';
import { useStore } from '@/lib/store';
import FilterPanel from '@/components/FilterPanel';
import { SlabCard, CrushedCard } from '@/components/ProductCard';

function MiniTicks({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full"
          style={{
            height: i % 5 === 0 ? 16 : 10,
            background: i < 14 ? accent : 'rgba(255,255,255,0.12)',
          }}
        />
      ))}
    </div>
  );
}

function SlabRow({ productId }: { productId: 'white' | 'black' }) {
  const { t, lang } = useStore();
  const product = PRODUCTS[productId];
  const accent = product.accent;

  return (
    <div className="mt-10 sm:mt-14">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-white/40">
            {product.code} · EPS
          </div>
          <h3 className="mt-1 text-[34px] font-extrabold uppercase leading-[0.95] tracking-[0.01em] text-white min-[420px]:text-5xl lg:text-6xl xl:text-7xl">
            {product.name[lang].split(' ').map((w, i, arr) =>
              i === arr.length - 1 ? (
                <span
                  key={i}
                  className="block"
                  style={{ WebkitTextStroke: `1.2px ${accent}`, color: 'transparent' }}
                >
                  {w}
                </span>
              ) : (
                <span key={i} className="block">{w}</span>
              )
            )}
          </h3>
        </div>
        <div className="hidden shrink-0 sm:block">
          <MiniTicks accent={accent} />
        </div>
      </div>

      <div className="fade-x no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-7 sm:gap-4 sm:px-7 lg:-mx-9 lg:px-9">
        {DENSITIES.map((d) => (
          <SlabCard key={d} productId={productId} d={d} />
        ))}
      </div>
    </div>
  );
}

export default function CatalogSection() {
  const { t } = useStore();

  return (
    <section
      id="mahsulotlar"
      aria-labelledby="mahsulotlar-title"
      className="relative px-3 pb-14 pt-10 sm:px-7 sm:pb-20 sm:pt-14 lg:px-9"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-blue/70" />
            <span className="eyebrow">Plast City</span>
          </div>
          <h2 id="mahsulotlar-title" className="mt-3 text-4xl font-extrabold uppercase leading-none text-white sm:text-6xl">
            {t.catalog.title}
          </h2>
          <p className="mt-2 max-w-md text-[12px] text-white/[0.48] sm:text-[13px]">{t.catalog.subtitle}</p>
        </div>
      </div>

      <FilterPanel />

      <SlabRow productId="white" />
      <SlabRow productId="black" />

      <div className="mt-10 sm:mt-14">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-white/40">
              PC-CRH-03 · EPS
            </div>
            <h3 className="mt-1 text-[34px] font-extrabold uppercase leading-[0.95] text-white min-[420px]:text-5xl lg:text-6xl">
              MAYDALANGAN<br />
              <span style={{ WebkitTextStroke: '1.2px #C9B79C', color: 'transparent' }}>PENAPLAST</span>
            </h3>
          </div>
          <div className="hidden shrink-0 sm:block">
            <MiniTicks accent="#C9B79C" />
          </div>
        </div>
        <CrushedCard />
      </div>

      <p className="mt-8 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.18em] text-white/[0.32]">
        {t.catalog.allPricesNote}
      </p>
    </section>
  );
}
