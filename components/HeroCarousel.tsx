'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowLeft, ArrowRight, BadgeCheck, Truck, Play } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCT_ORDER, PRODUCTS, CRUSHED_PRICE_PER_KG, calcSlabPrice } from '@/data/products';
import TickIndicator from '@/components/TickIndicator';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroCarousel() {
  const { t, lang, heroIndex, setHeroIndex, openDetail, openOverlay, overlay, addToCart, density, thickness, showToast } =
    useStore();
  const touchX = useRef<number | null>(null);

  const count = PRODUCT_ORDER.length;
  const index = ((heroIndex % count) + count) % count;
  const product = PRODUCTS[PRODUCT_ORDER[index]];
  const prevProduct = PRODUCTS[PRODUCT_ORDER[(index - 1 + count) % count]];
  const nextProduct = PRODUCTS[PRODUCT_ORDER[(index + 1) % count]];

  const go = useCallback(
    (dir: 1 | -1) => setHeroIndex((index + dir + count) % count),
    [index, count, setHeroIndex]
  );

  // Klaviatura strelkalari (faqat overlaylar yopiq bo'lsa)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (overlay !== 'none') return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const accent = product.accent;
  const heroLines = product.name[lang].split(' ');
  const quickPrice =
    product.unit === 'kg' ? CRUSHED_PRICE_PER_KG : calcSlabPrice(density, thickness);

  const quickAdd = () => {
    if (product.unit === 'kg') {
      addToCart({ productId: 'crushed', density: null, thickness: null, quantity: 10, unit: 'kg' });
    } else {
      addToCart({ productId: product.id, density, thickness, quantity: 1, unit: 'dona' });
    }
    showToast(t.toast.added);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-roledescription="carousel"
        aria-label="Plast City — mahsulotlar"
        className="relative flex flex-col overflow-hidden rounded-t-[22px] sm:rounded-t-[30px] lg:rounded-t-[36px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* frame ichidagi nur */}
        <div aria-hidden="true" className="radial-light pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[42%] h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[900ms] ease-premium"
          style={{ background: `radial-gradient(ellipse, ${product.glow} 0%, transparent 62%)`, opacity: 0.5, filter: 'blur(70px)' }}
        />

        {/* yuqori qator: badge + MAVJUD */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-4 pt-4 sm:px-7 sm:pt-5 lg:px-9">
          <div
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.045] py-1.5 pl-2 pr-4 backdrop-blur-md"
            key={product.id + '-badge'}
          >
            <span
              className="inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#06080c]"
              style={{ background: accent }}
            >
              {t.hero.factoryPrice}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/[0.78] sm:text-[10.5px]">
              {product.available === 'stock' ? (
                <BadgeCheck size={13} strokeWidth={1.8} style={{ color: accent }} />
              ) : (
                <Truck size={13} strokeWidth={1.8} style={{ color: accent }} />
              )}
              {product.available === 'stock' ? t.hero.inStock : t.hero.fastDelivery}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 sm:text-[11px]">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" />
            <span className="hidden min-[420px]:inline">{t.hero.available}</span>
            <span>·</span>
            <span className="text-white/75">2026</span>
          </div>
        </div>

        {/* asosiy qism */}
        <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-1 px-4 pb-2 pt-1 sm:px-7 sm:pt-2 lg:grid-cols-12 lg:gap-4 lg:px-9">
          {/* chap: matn */}
          <div className="order-2 flex flex-col items-start pt-1 sm:pt-4 lg:order-1 lg:col-span-4 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
                transition={{ duration: 0.55, ease: EASE }}
                className="flex flex-col items-start"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.4em] text-white/45 sm:text-[11px]">
                  {product.code}
                </span>
                <h1 className="mt-2 text-[44px] font-extrabold uppercase leading-[0.98] tracking-[0.01em] text-white min-[420px]:text-6xl sm:text-7xl xl:text-[84px]">
                  {heroLines.map((line) => (
                    <span key={line} className="block" style={line === heroLines[heroLines.length - 1] ? { color: 'transparent', WebkitTextStroke: `1.3px ${accent}` } : undefined}>
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-white/55 sm:mt-4 sm:max-w-sm sm:text-sm">
                  {product.tagline[lang]}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
                  <button
                    type="button"
                    onClick={quickAdd}
                    className="btn-primary h-11 px-5 text-[11.5px] sm:h-12 sm:px-7 sm:text-[12.5px]"
                    style={{ '--acc': accent, '--acc-glow': product.glow } as React.CSSProperties}
                  >
                    {t.hero.orderNow}
                  </button>
                  <button type="button" onClick={() => openDetail(product.id)} className="btn-ghost h-11 px-5 text-[11.5px] sm:h-12 sm:px-7 sm:text-[12.5px]">
                    {t.hero.details}
                  </button>
                </div>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/[0.38]">
                  {product.unit === 'kg' ? `$${quickPrice.toFixed(2)} / kg` : `$${quickPrice} / ${t.detail.unitDona}`}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* markaz/o'ng: mahsulot rasmi */}
          <div className="relative order-1 flex h-[240px] items-center justify-center min-[420px]:h-[300px] sm:h-[380px] lg:order-2 lg:col-span-8 lg:h-auto lg:min-h-[540px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(16px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(14px)' }}
                transition={{ duration: 0.65, ease: EASE }}
                className="relative flex h-full w-full items-center justify-center"
              >
                {/* aksent nuri mahsulot orqasida */}
                <div
                  aria-hidden="true"
                  className="absolute h-[75%] w-[75%] rounded-full"
                  style={{ background: `radial-gradient(circle, ${product.glow} 0%, transparent 65%)`, filter: 'blur(60px)', opacity: 0.85 }}
                />
                <div className="animate-floaty relative h-full w-full max-w-[560px] lg:max-w-[680px]">
                  <Image
                    src={product.image}
                    alt={product.name[lang]}
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 640px"
                    className="object-contain mix-blend-screen drop-shadow-[0_45px_60px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* preview thumbnail — ishlab chiqarish */}
            <button
              type="button"
              onClick={() => openOverlay('production')}
              className="group absolute bottom-1 right-0 hidden overflow-hidden rounded-2xl border border-white/[0.14] shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-premium hover:-translate-y-1 sm:bottom-4 sm:block"
              aria-label={t.hero.watchProduction}
            >
              <Image
                src="/images/factory.jpg"
                alt={t.modal.productionTitle}
                width={196}
                height={120}
                className="h-20 w-32 object-cover opacity-85 transition-all duration-500 group-hover:opacity-100 sm:h-24 sm:w-44"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35 transition-colors duration-500 group-hover:bg-black/20">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                  <Play size={14} strokeWidth={1.6} fill="white" className="ml-0.5 text-white" />
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-white/85">
                  {t.hero.watchProduction}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* pastki qator: prev | indikator | next */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/[0.07] px-4 py-3 sm:px-7 sm:py-4 lg:px-9">
          <button
            type="button"
            onClick={() => go(-1)}
            className="group flex min-w-0 items-center gap-2 text-left sm:gap-4"
            aria-label={t.hero.prev}
          >
            <span className="icon-btn h-11 w-11 shrink-0 transition-all duration-300 group-hover:border-white/35">
              <ArrowLeft size={18} strokeWidth={1.6} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            </span>
            <span className="hidden min-w-0 flex-col md:flex">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.38]">{t.hero.prev}</span>
              <span className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-[0.14em] text-white/[0.72]">{prevProduct.name[lang]}</span>
            </span>
          </button>

          <TickIndicator total={count} index={index} accent={accent} />

          <button
            type="button"
            onClick={() => go(1)}
            className="group flex min-w-0 items-center gap-2 text-right sm:gap-4"
            aria-label={t.hero.next}
          >
            <span className="hidden min-w-0 flex-col items-end md:flex">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.38]">{t.hero.next}</span>
              <span className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-[0.14em] text-white/[0.72]">{nextProduct.name[lang]}</span>
            </span>
            <span className="icon-btn h-11 w-11 shrink-0 transition-all duration-300 group-hover:border-white/35">
              <ArrowRight size={18} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {product.name[lang]}
        </span>
      </section>
    </MotionConfig>
  );
}
