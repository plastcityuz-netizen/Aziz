'use client';

import { Boxes, Cloud, Box, Scissors, ShieldCheck, PackageCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

const STEP_ICONS = [Boxes, Cloud, Box, Scissors, ShieldCheck, PackageCheck];

export default function Production() {
  const { t } = useStore();
  const steps = t.production.steps;

  return (
    <section
      id="ishlab-chiqarish"
      aria-labelledby="production-title"
      className="relative scroll-mt-24 border-t border-white/[0.055] px-3 py-14 sm:px-7 sm:py-20 lg:px-9"
    >
      {/* fon yorug'lik */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-0 h-[420px] w-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(30,139,195,0.09) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-blue/70" />
            <span className="eyebrow">{t.production.eyebrow}</span>
          </div>
          <h2 id="production-title" className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] text-white sm:text-6xl">
            {t.production.title}
          </h2>
        </div>
        <p className="max-w-[240px] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/40 sm:max-w-xs">
          {t.production.subtitle}
        </p>
      </div>

      {/* tick-timeline */}
      <div className="relative mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <div
              key={i}
              className="card-hover group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.02] p-4 sm:p-5"
            >
              <span aria-hidden="true" className="pointer-events-none absolute -right-1 -top-3 select-none text-[64px] font-extrabold leading-none text-white/[0.045] transition-colors duration-500 group-hover:text-white/[0.08] sm:text-7xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-blue/30 bg-brand-blue/[0.12] text-brand-blue transition-transform duration-500 ease-premium group-hover:scale-110">
                <Icon size={21} strokeWidth={1.5} />
              </div>
              <div className="relative mt-4 font-mono text-[9px] uppercase tracking-[0.26em] text-white/[0.42]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="relative mt-1 text-[13px] font-extrabold uppercase tracking-[0.06em] text-white sm:text-[13.5px]">
                {step.name}
              </h3>
              <p className="relative mt-1.5 text-[10.5px] leading-snug text-white/[0.48]">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
