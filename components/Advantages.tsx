'use client';

import { BadgeCheck, Ruler, Layers, ThermometerSun, Factory, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';

const ICONS = [BadgeCheck, Ruler, Layers, ThermometerSun, Factory, Zap];

export default function Advantages() {
  const { t } = useStore();

  return (
    <section
      id="nega"
      aria-labelledby="why-title"
      className="relative scroll-mt-24 border-t border-white/[0.055] px-3 py-14 sm:px-7 sm:py-20 lg:px-9"
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-[-12%] top-1/3 h-[460px] w-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,183,156,0.08) 0%, transparent 65%)', filter: 'blur(90px)' }} />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-brand-sand/70" />
          <span className="eyebrow">{t.why.eyebrow}</span>
        </div>
        <h2 id="why-title" className="mt-3 max-w-3xl text-4xl font-extrabold uppercase leading-[0.98] text-white sm:text-6xl">
          {t.why.title}
        </h2>
        <p className="mt-2 max-w-md text-[12.5px] text-white/[0.48] sm:text-sm">{t.why.subtitle}</p>

        <div className="mt-9 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {t.why.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                className="card-hover group flex items-start gap-4 rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-transparent p-5 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.045] text-brand-sand transition-all duration-500 ease-premium group-hover:border-brand-sand/40 group-hover:text-[#E4D6BC]">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-extrabold uppercase tracking-[0.05em] text-white sm:text-[15px]">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-white/[0.48]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
