'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Phone, Send, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PHONE_DISPLAY, PHONE_TEL, TELEGRAM_URL } from '@/data/products';
import Logo from '@/components/Logo';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MenuOverlay() {
  const { overlay, closeOverlay, t } = useStore();
  const open = overlay === 'menu';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOverlay]);

  const links = [
    { label: t.menu.home, href: '#main' },
    { label: t.menu.products, href: '#mahsulotlar' },
    { label: t.menu.production, href: '#ishlab-chiqarish' },
    { label: t.menu.why, href: '#nega' },
    { label: t.menu.applications, href: '#qayerda' },
    { label: t.menu.about, href: '#biz-haqimizda' },
    { label: t.menu.contact, href: '#aloqa' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          className="fixed inset-0 z-[65] overflow-y-auto bg-[#05070C]/88 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
        >
          <div className="mx-auto flex min-h-full max-w-[1760px] flex-col px-5 py-5 sm:px-10 sm:py-7 lg:px-14">
            {/* header */}
            <div className="flex items-center justify-between">
              <Logo iconClassName="h-10 w-10" />
              <button type="button" onClick={closeOverlay} className="icon-btn h-12 w-12" aria-label={t.nav.close}>
                <X size={22} strokeWidth={1.6} />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 items-center gap-8 py-8 lg:grid-cols-12">
              {/* katta havolalar */}
              <nav className="lg:col-span-8" aria-label={t.nav.menu}>
                <ul className="flex flex-col">
                  {links.map((l, i) => (
                    <motion.li
                      key={l.href + l.label}
                      initial={{ opacity: 0, x: -42, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.055 }}
                      className="border-b border-white/[0.06] last:border-none"
                    >
                      <a
                        href={l.href}
                        onClick={closeOverlay}
                        className="group flex items-baseline gap-4 py-2.5 sm:gap-7 sm:py-3.5"
                      >
                        <span className="font-mono text-[10px] tabular-nums text-white/30 transition-colors duration-300 group-hover:text-brand-blue sm:text-[11px]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[30px] font-extrabold uppercase leading-[1.02] tracking-[0.01em] text-white/[0.78] transition-all duration-[400ms] ease-premium group-hover:translate-x-2 group-hover:text-white min-[420px]:text-4xl sm:text-5xl lg:text-6xl">
                          {l.label}
                        </span>
                        <ArrowUpRight
                          size={22}
                          strokeWidth={1.5}
                          className="ml-auto shrink-0 self-center text-white/20 transition-all duration-[400ms] ease-premium group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/70"
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* kontakt paneli */}
              <motion.aside
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.35 }}
                className="lg:col-span-4"
              >
                <div className="font-mono text-[9.5px] uppercase tracking-[0.36em] text-white/[0.38]">
                  {t.menu.contactsTitle}
                </div>
                <a
                  href={PHONE_TEL}
                  className="mt-3 block text-[26px] font-extrabold leading-tight text-white transition-colors duration-300 hover:text-brand-blue min-[420px]:text-3xl sm:text-4xl"
                >
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-max items-center gap-3 rounded-full border border-brand-blue/40 bg-brand-blue/[0.12] py-3 pl-4 pr-6 transition-all duration-300 hover:border-brand-blue/70 hover:bg-brand-blue/20"
                >
                  <Send size={19} strokeWidth={1.6} className="text-brand-blue" />
                  <span className="font-mono text-[12px] font-medium tracking-[0.06em] text-white/90">
                    @penaplast_uz
                  </span>
                </a>
                <div className="mb-6 mt-8 hidden items-end justify-between border-t border-white/[0.07] pt-6 lg:flex">
                  <span className="font-mono text-[9px] uppercase leading-loose tracking-[0.3em] text-white/30">
                    EPS<br />Penaplast Zavodi
                  </span>
                  <a href={PHONE_TEL} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.12] text-white/70 transition-all hover:border-white/35 hover:text-white" aria-label="Telefon">
                    <Phone size={18} strokeWidth={1.6} />
                  </a>
                </div>
              </motion.aside>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
