'use client';

import Image from 'next/image';
import { useStore } from '@/lib/store';

export default function About() {
  const { t } = useStore();
  const stats = [
    { v: t.about.stat1v, u: t.about.stat1u, k: t.about.stat1k },
    { v: t.about.stat2v, u: t.about.stat2u, k: t.about.stat2k },
    { v: t.about.stat3v, u: t.about.stat3u, k: t.about.stat3k },
  ];

  return (
    <section
      id="biz-haqimizda"
      aria-labelledby="about-title"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.055] px-3 py-14 sm:px-7 sm:py-20 lg:px-9"
    >
      {/* gigant ghost yozuv */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-4 left-0 select-none whitespace-nowrap text-[17vw] font-extrabold uppercase leading-none text-white/[0.022] sm:text-[13vw]">
        PENAPLAST
      </div>

      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-blue/70" />
            <span className="eyebrow">{t.about.eyebrow}</span>
          </div>
          <h2 id="about-title" className="mt-4 text-4xl font-extrabold uppercase leading-[0.98] text-white min-[420px]:text-5xl sm:text-6xl">
            PLAST<br />
            <span className="font-light text-brand-blue">CITY</span>
          </h2>
          <p className="mt-5 max-w-lg text-base font-semibold leading-snug text-white/[0.78] sm:text-lg">
            {t.about.p1}
          </p>
          <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/[0.48]">{t.about.p2}</p>
        </div>

        <div className="lg:col-span-6">
          <figure className="relative overflow-hidden rounded-[28px] border border-white/[0.1] shadow-[0_35px_90px_rgba(0,0,0,0.6)]">
            <Image
              src="/images/factory.jpg"
              alt="Plast City — Penaplast Zavodi ishlab chiqarish sexi"
              width={880}
              height={620}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.78] via-black/[0.18] to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-5 sm:left-5">
              <div>
                <div className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-white/55">PLAST CITY</div>
                <div className="mt-0.5 text-sm font-bold uppercase tracking-[0.1em] text-white">Penaplast Zavodi</div>
              </div>
              <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.26em] text-white/80 backdrop-blur-md">
                EPS
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ko'rsatkichlar */}
      <dl className="relative mt-10 grid grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.07] py-6 sm:mt-14 sm:py-8">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1 px-2 text-center sm:gap-2">
            <dt className="order-2 font-mono text-[8px] uppercase tracking-[0.3em] text-white/40 sm:text-[9.5px]">
              {s.k}
            </dt>
            <dd className="order-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold leading-none text-white min-[420px]:text-4xl sm:text-6xl">{s.v}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand-blue sm:text-[11px]">{s.u}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
