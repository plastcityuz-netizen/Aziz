'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductionModal() {
  const { overlay, closeOverlay, t } = useStore();
  const open = overlay === 'production';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOverlay]);

  const goCatalog = () => {
    closeOverlay();
    requestAnimationFrame(() => {
      document.querySelector('#mahsulotlar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div key="production" className="fixed inset-0 z-[58] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={t.modal.productionTitle}>
          <motion.button
            type="button"
            aria-label={t.nav.close}
            className="absolute inset-0 cursor-default bg-[#02040a]/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
          />
          <motion.div
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[26px] border border-white/[0.1] bg-[#0A0E15] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 48, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="relative h-56 sm:h-80">
              <Image
                src="/images/factory.jpg"
                alt={t.modal.productionTitle}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E15] via-black/30 to-transparent" />
              <button type="button" onClick={closeOverlay} className="icon-btn absolute right-4 top-4 h-11 w-11 bg-black/45 backdrop-blur-md" aria-label={t.nav.close}>
                <X size={19} strokeWidth={1.8} />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.36em] text-brand-blue">EPS</div>
                <h3 className="mt-1 text-3xl font-extrabold uppercase text-white sm:text-4xl">{t.modal.productionTitle}</h3>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <p className="max-w-md text-[13px] leading-relaxed text-white/[0.58]">{t.modal.productionSub}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['6 bosqich', '7–20 kg/m³', '1–60 cm', '3 asosiy mahsulot'].map((s) => (
                  <span key={s} className="rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                    {s}
                  </span>
                ))}
              </div>
              <button type="button" onClick={goCatalog} className="btn-primary mt-6 h-12">
                {t.contact.order}
                <ArrowRight size={17} strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
