'use client';

import Image from 'next/image';
import { useStore } from '@/lib/store';

const APP_IMAGES = [
  '/images/app-house.jpg',
  '/images/app-wall.jpg',
  '/images/app-roof.jpg',
  '/images/app-floor.jpg',
  '/images/construction.jpg',
  '/images/factory.jpg',
  '/images/crushed-eps.webp',
];

/** 7 ta qo'llanilish sohasi — mozaika uslubidagi rasmli kartalar */
export default function Applications() {
  const { t, lang } = useStore();

  return (
    <section
      id="qayerda"
      aria-labelledby="apps-title"
      className="relative scroll-mt-24 border-t border-white/[0.055] px-3 py-14 sm:px-7 sm:py-20 lg:px-9"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-copper/70" />
            <span className="eyebrow">{t.apps.eyebrow}</span>
          </div>
          <h2 id="apps-title" className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] text-white sm:text-6xl">
            {t.apps.title}
          </h2>
        </div>
        <p className="max-w-[240px] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/40 sm:max-w-xs">
          {t.apps.subtitle}
        </p>
      </div>

      <ul className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[190px] lg:auto-rows-[215px]">
        {t.apps.items.map((name, i) => {
          const featured = i === 0;
          return (
            <li
              key={i}
              className={`group relative overflow-hidden rounded-[22px] border border-white/[0.09] ${
                featured ? 'col-span-2 row-span-2 min-h-[220px]' : 'min-h-[118px] sm:min-h-[150px]'
              }`}
            >
              <Image
                src={APP_IMAGES[i]}
                alt={name}
                fill
                sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                className="object-cover opacity-78 transition-all duration-[900ms] ease-premium group-hover:scale-[1.06] group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.88] via-black/[0.28] to-transparent transition-opacity duration-500" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                <span className={`font-extrabold uppercase leading-tight tracking-[0.05em] text-white ${featured ? 'text-lg sm:text-2xl' : 'text-[11px] sm:text-[13px]'}`}>
                  {name}
                </span>
                <span className="font-mono text-[8.5px] tabular-nums text-white/45">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
