'use client';

import { Send, Phone } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PHONE_DISPLAY, PHONE_TEL, TELEGRAM_HANDLE, TELEGRAM_URL } from '@/data/products';
import Logo from '@/components/Logo';

export default function Footer() {
  const { t, lang } = useStore();

  const menu = [
    { label: t.menu.home, href: '#main' },
    { label: t.menu.products, href: '#mahsulotlar' },
    { label: t.menu.production, href: '#ishlab-chiqarish' },
    { label: t.menu.why, href: '#nega' },
    { label: t.menu.applications, href: '#qayerda' },
    { label: t.menu.contact, href: '#aloqa' },
  ];
  const products = [
    { label: 'Oq penaplast', href: '#mahsulotlar' },
    { label: 'Qora penaplast', href: '#mahsulotlar' },
    { label: lang === 'uz' ? 'Maydalangan penaplast' : 'Крошка пенопласта', href: '#mahsulotlar' },
  ];

  return (
    <footer className="relative overflow-hidden rounded-b-[21px] border-t border-white/[0.06] sm:rounded-b-[29px] lg:rounded-b-[35px]">
      <div className="px-5 py-10 sm:px-9 sm:py-14 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12">
          {/* brend */}
          <div className="col-span-2 md:col-span-4">
            <Logo iconClassName="h-11 w-11" />
            <p className="mt-4 max-w-[260px] text-[12px] leading-relaxed text-white/45">{t.footer.tagline}</p>
            <div className="mt-5 flex items-center gap-2.5">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="icon-btn h-11 w-11" aria-label="Telegram">
                <Send size={18} strokeWidth={1.6} />
              </a>
              <a href={PHONE_TEL} className="icon-btn h-11 w-11" aria-label="Telefon">
                <Phone size={18} strokeWidth={1.6} />
              </a>
            </div>
          </div>

          {/* menyular */}
          <nav className="md:col-span-2" aria-label={t.footer.menu}>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-white/[0.36]">{t.footer.menu}</div>
            <ul className="mt-3 flex flex-col gap-2">
              {menu.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[12px] font-semibold text-white/[0.58] transition-colors duration-300 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label={t.footer.products}>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-white/[0.36]">{t.footer.products}</div>
            <ul className="mt-3 flex flex-col gap-2">
              {products.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[12px] font-semibold text-white/[0.58] transition-colors duration-300 hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* kontaktlar */}
          <div className="col-span-2 md:col-span-4">
            <div className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-white/[0.36]">{t.footer.contacts}</div>
            <a href={PHONE_TEL} className="mt-3 block text-xl font-extrabold leading-tight text-white transition-colors duration-300 hover:text-brand-blue sm:text-2xl">
              {PHONE_DISPLAY}
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-mono text-[12px] text-white/[0.58] transition-colors duration-300 hover:text-brand-blue">
              <Send size={13} strokeWidth={1.8} />
              {TELEGRAM_HANDLE}
            </a>
            <p className="mt-4 max-w-[240px] text-[10.5px] leading-relaxed text-white/[0.32]">
              {t.contact.note}
            </p>
          </div>
        </div>

        {/* pastki qator */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
          <p className="text-[10.5px] text-white/[0.38]">© 2026 Plast City. {t.footer.rights}</p>
          <p className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-white/[0.28]">EPS · 7–20 kg/m³ · 1–60 cm</p>
        </div>
      </div>

      {/* ulkan ghost wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none whitespace-nowrap text-center text-[16.5vw] font-extrabold uppercase leading-[0.78] text-white/[0.028]">
        Plast City
      </div>
    </footer>
  );
}
