'use client';

import { useEffect, useState } from 'react';
import { Send, Phone, ShoppingBag, Menu } from 'lucide-react';
import { useStore } from '@/lib/store';
import { TELEGRAM_URL, PHONE_TEL } from '@/data/products';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { t, lang, setLang, currency, toggleCurrency, cartCount, overlay, openOverlay, closeOverlay } =
    useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.products, href: '#mahsulotlar', active: true },
    { label: t.nav.production, href: '#ishlab-chiqarish', active: false },
    { label: t.nav.applications, href: '#qayerda', active: false },
    { label: t.nav.contact, href: '#aloqa', active: false },
  ];

  return (
    <header
      className={`sticky top-1.5 z-40 rounded-2xl transition-all duration-500 ease-premium sm:top-3 sm:rounded-[26px] ${
        scrolled
          ? 'border border-white/[0.08] bg-[#06080C]/78 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl'
          : 'border border-transparent bg-transparent'
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-4 sm:px-5 lg:px-7">
        {/* Chap: burger + logo */}
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={() => (overlay === 'menu' ? closeOverlay() : openOverlay('menu'))}
            className="icon-btn h-10 w-10 border-transparent bg-transparent sm:h-11 sm:w-11"
            aria-label={t.nav.menu}
            aria-expanded={overlay === 'menu'}
          >
            <Menu size={20} strokeWidth={1.6} />
          </button>
          <a href="#main" aria-label="Plast City" className="min-w-0">
            <Logo iconClassName="h-8 w-8 sm:h-10 sm:w-10" className="gap-2 sm:gap-3" />
          </a>
        </div>

        {/* Markaz: havolalar (desktop) */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Asosiy">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-[11px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
                l.active ? 'text-white' : 'text-white/[0.42] hover:text-white/85'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* O'ng: pill'lar + ikonlar */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={toggleCurrency}
            className="hidden h-10 items-center rounded-full border border-white/15 px-3.5 font-mono text-[11px] font-medium tracking-[0.14em] text-white/80 transition-all duration-300 hover:border-white/35 hover:text-white sm:inline-flex"
            aria-label="Valyuta / Валюта"
          >
            {currency === 'USD' ? 'USD $' : "SO'M"}
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
            className="hidden h-10 items-center rounded-full border border-white/15 px-3.5 font-mono text-[11px] font-medium tracking-[0.14em] text-white/80 transition-all duration-300 hover:border-white/35 hover:text-white sm:inline-flex"
            aria-label="Til / Язык"
          >
            {lang === 'uz' ? 'UZ' : 'RU'}
          </button>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn h-10 w-10"
            aria-label="Telegram @penaplast_uz"
          >
            <Send size={17} strokeWidth={1.6} />
          </a>
          <a href={PHONE_TEL} className="icon-btn hidden h-10 w-10 min-[420px]:inline-flex" aria-label="+998 99 513 22 22">
            <Phone size={17} strokeWidth={1.6} />
          </a>
          <button
            type="button"
            onClick={() => openOverlay('cart')}
            className="icon-btn relative h-10 w-10"
            aria-label={t.nav.cart}
          >
            <ShoppingBag size={18} strokeWidth={1.6} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 font-mono text-[10px] font-bold text-[#06080c] ring-2 ring-[#06080C]">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
