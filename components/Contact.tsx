'use client';

import { Phone, Send, ArrowDownRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PHONE_DISPLAY, PHONE_TEL, TELEGRAM_URL } from '@/data/products';

export default function Contact() {
  const { t, openOverlay, cartCount } = useStore();

  const goOrder = () => {
    if (cartCount > 0) openOverlay('cart');
    else document.querySelector('#mahsulotlar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="aloqa"
      aria-labelledby="contact-title"
      className="relative scroll-mt-24 border-t border-white/[0.055] px-3 py-14 sm:px-7 sm:py-20 lg:px-9"
    >
      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-gradient-to-br from-[#0C1220] via-[#06080C] to-[#0A0E15] px-5 py-12 text-center sm:px-10 sm:py-16">
        {/* nur dog'lari */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(30,139,195,0.28) 0%, transparent 62%)', filter: 'blur(70px)' }} />

        <div className="relative">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-brand-blue/70" />
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <span className="h-px w-10 bg-brand-blue/70" />
          </div>
          <h2 id="contact-title" className="mt-4 text-4xl font-extrabold uppercase leading-[0.98] text-white min-[420px]:text-5xl sm:text-7xl">
            {t.contact.title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] text-white/[0.52]">{t.contact.subtitle}</p>

          <a
            href={PHONE_TEL}
            className="mt-8 inline-flex items-center gap-3 text-[30px] font-extrabold leading-none tracking-[0.01em] text-white transition-colors duration-300 hover:text-brand-blue min-[420px]:text-4xl sm:text-6xl"
          >
            <Phone className="h-7 w-7 shrink-0 text-brand-blue sm:h-10 sm:w-10" strokeWidth={1.6} />
            {PHONE_DISPLAY}
          </a>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.34em] text-white/[0.36]">{t.contact.call}</div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={goOrder} className="btn-primary min-h-[52px] px-8 text-[12px]">
              {t.contact.order}
              <ArrowDownRight size={17} strokeWidth={2} />
            </button>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost min-h-[52px] px-8 text-[12px]">
              <Send size={17} strokeWidth={1.8} className="text-brand-blue" />
              {t.contact.telegram}
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-sm text-[11px] leading-relaxed text-white/35">{t.contact.note}</p>
        </div>
      </div>
    </section>
  );
}
