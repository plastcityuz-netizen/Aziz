'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { X, Heart, Share2, Info, Minus, Plus, ShoppingBag, BadgeCheck, Truck } from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  calcLineTotal,
  calcSlabPrice,
  CRUSHED_PRICE_PER_KG,
  DENSITIES,
  densityCode,
  formatMoney,
  formatUnitPrice,
  PRODUCTS,
  THICKNESSES,
  type Density,
} from '@/data/products';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductDetail() {
  const {
    overlay, closeOverlay, openOverlay, detailProduct,
    t, lang, currency, thickness, setThickness,
    density: globalDensity, setDensity: setGlobalDensity,
    favorites, toggleFavorite, addToCart, showToast,
  } = useStore();

  const open = overlay === 'detail' && !!detailProduct;
  const product = PRODUCTS[detailProduct ?? 'white'];
  const accent = product.accent;

  // Lokal holat (global tanlovdan boshlanadi)
  const [density, setDensityL] = useState<Density>(globalDensity);
  const [qty, setQty] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setDensityL(globalDensity);
      setQty(product.unit === 'kg' ? 10 : 1);
      setShowInfo(true);
      const id = window.setTimeout(() => closeRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, detailProduct]);

  // Escape bilan yopish
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOverlay]);

  // Sichqoncha parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 110, damping: 17, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 110, damping: 17, mass: 0.6 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 80, damping: 14 });
  const rotateX = useSpring(useMotionValue(0), { stiffness: 80, damping: 14 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mx.set(nx * 26);
    my.set(ny * 18);
    rotateY.set(nx * 7);
    rotateX.set(-ny * 6);
  };
  const onMouseLeave = () => {
    mx.set(0); my.set(0); rotateX.set(0); rotateY.set(0);
  };

  const isCrushed = product.unit === 'kg';
  const unitPriceVal = isCrushed ? CRUSHED_PRICE_PER_KG : calcSlabPrice(density, thickness);
  const lineTotal = calcLineTotal({ productId: product.id, density, thickness, quantity: qty });
  const code = isCrushed ? product.code : densityCode(product.code, density);
  const isFav = favorites.includes(product.id);

  const addAndGo = () => {
    addToCart(
      isCrushed
        ? { productId: 'crushed', density: null, thickness: null, quantity: Math.max(1, qty), unit: 'kg' }
        : { productId: product.id, density, thickness, quantity: Math.max(1, qty), unit: 'dona' }
    );
    setGlobalDensity(density);
    openOverlay('cart');
  };

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] + `#mahsulotlar` : '';
    try {
      await navigator.clipboard.writeText(url);
      showToast(t.toast.copied);
    } catch {
      showToast(t.toast.copied);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="detail"
          className="fixed inset-0 z-[60] overflow-y-auto bg-[#04060a]/92 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={product.name[lang]}
        >
          <div
            className="relative mx-auto flex min-h-full w-full max-w-[1760px] flex-col overflow-hidden border-white/[0.08] bg-[#06080C] sm:m-3 sm:min-h-[calc(100vh-1.5rem)] sm:rounded-[30px] sm:border lg:m-5 lg:min-h-[calc(100vh-2.5rem)] lg:rounded-[34px]"
            style={{ '--acc': accent, '--acc-glow': product.glow } as React.CSSProperties}
          >
            {/* fonda nur */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-[36%] h-[560px] w-[min(90vw,880px)] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: `radial-gradient(ellipse, ${product.glow} 0%, transparent 62%)`, opacity: 0.4, filter: 'blur(80px)' }} />
            </div>

            {/* yopish tugmasi */}
            <button
              ref={closeRef}
              type="button"
              onClick={closeOverlay}
              className="icon-btn absolute right-3 top-3 z-20 h-11 w-11 sm:right-5 sm:top-5"
              aria-label={t.detail.close}
            >
              <X size={20} strokeWidth={1.7} />
            </button>

            {/* kontent */}
            <div
              className="relative z-10 grid flex-1 grid-cols-1 items-center gap-2 px-4 pb-6 pt-14 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pt-10"
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              {/* RAQAMLARINI chapda */}
              <div className="order-2 flex flex-col items-start lg:order-1 lg:col-span-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.045] py-1.5 pl-2 pr-4">
                  <span className="inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#06080c]" style={{ background: accent }}>
                    {t.hero.factoryPrice}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/75">
                    {product.available === 'stock' ? <BadgeCheck size={12} style={{ color: accent }} /> : <Truck size={12} style={{ color: accent }} />}
                    {product.available === 'stock' ? t.hero.inStock : t.hero.fastDelivery}
                  </span>
                </div>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-white/[0.42]">{code}</span>
                <h2 className="mt-2 text-4xl font-extrabold uppercase leading-[0.96] text-white min-[420px]:text-5xl xl:text-6xl">
                  {product.name[lang].split(' ').map((w, i, arr) => (
                    <span key={i} className="block" style={i === arr.length - 1 ? { WebkitTextStroke: `1.3px ${accent}`, color: 'transparent' } : undefined}>{w}</span>
                  ))}
                </h2>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white sm:text-5xl">{formatMoney(unitPriceVal, currency)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {isCrushed ? t.catalog.perKg : t.catalog.perDona}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={addAndGo}
                  className="btn-primary mt-5 h-12 px-6 text-[12px]"
                  style={{ '--acc': accent, '--acc-glow': product.glow } as React.CSSProperties}
                >
                  <ShoppingBag size={17} strokeWidth={1.9} />
                  {t.detail.orderNow}
                </button>

                {/* mobil: ikonlar qatori */}
                <div className="mt-5 flex items-center gap-2 sm:hidden">
                  <FavBtn isFav={isFav} accent={accent} onToggle={() => { toggleFavorite(product.id); showToast(isFav ? t.toast.unfav : t.toast.fav); }} label={t.detail.fav} />
                  <button type="button" onClick={share} className="icon-btn h-11 w-11" aria-label={t.detail.share}><Share2 size={18} strokeWidth={1.6} /></button>
                  <button type="button" onClick={() => setShowInfo((v) => !v)} className="icon-btn h-11 w-11" aria-label={t.detail.info}><Info size={18} strokeWidth={1.6} /></button>
                </div>
              </div>

              {/* MARKAZ: rasm (parallax) */}
              <div className="relative order-1 flex h-[240px] items-center justify-center min-[420px]:h-[280px] sm:h-[340px] lg:order-2 lg:col-span-7 lg:h-auto lg:min-h-[520px]" style={{ perspective: 1000 }}>
                <motion.div
                  className="relative h-full w-full max-w-[540px] lg:max-w-[640px]"
                  style={{ x: springX as MotionValue<number>, y: springY as MotionValue<number>, rotateX, rotateY, transformStyle: 'preserve-3d' }}
                >
                  <div aria-hidden="true" className="absolute inset-[12%] rounded-full" style={{ background: `radial-gradient(circle, ${product.glow} 0%, transparent 65%)`, filter: 'blur(55px)', opacity: 0.9 }} />
                  <Image
                    src={product.image}
                    alt={product.name[lang]}
                    fill
                    priority
                    sizes="(max-width: 768px) 92vw, 640px"
                    className="object-contain mix-blend-screen drop-shadow-[0_50px_70px_rgba(0,0,0,0.65)]"
                  />
                </motion.div>
              </div>

              {/* O'NG rail: vertikal ikonlar (desktop) */}
              <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex lg:right-7">
                <FavBtn isFav={isFav} accent={accent} onToggle={() => { toggleFavorite(product.id); showToast(isFav ? t.toast.unfav : t.toast.fav); }} label={t.detail.fav} tall />
                <button type="button" onClick={share} className="icon-btn h-14 w-14 flex-col gap-1" aria-label={t.detail.share}>
                  <Share2 size={19} strokeWidth={1.6} />
                </button>
                <button type="button" onClick={() => setShowInfo((v) => !v)} className="icon-btn h-14 w-14" aria-label={t.detail.info} aria-pressed={showInfo}>
                  <Info size={19} strokeWidth={1.6} />
                </button>
              </div>
            </div>

            {/* TANLOV PANELI: chiplar + miqdor + jami */}
            <div className="relative z-10 border-t border-white/[0.07] px-4 py-4 sm:px-8 lg:px-12">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  {!isCrushed ? (
                    <>
                      <div className="no-scrollbar fade-x -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5">
                        {DENSITIES.map((d) => (
                          <button key={d} type="button" className="chip h-11 min-w-[2.75rem] text-[12px]" data-active={density === d} onClick={() => { setDensityL(d); setGlobalDensity(d); }} aria-pressed={density === d}>
                            {d}
                          </button>
                        ))}
                      </div>
                      <div className="no-scrollbar fade-x -mx-1 mt-1.5 flex gap-1.5 overflow-x-auto px-1 py-0.5">
                        {THICKNESSES.map((th) => (
                          <button key={th} type="button" className="chip h-11 min-w-[2.75rem] text-[12px]" data-active={thickness === th} onClick={() => setThickness(th)} aria-pressed={thickness === th}>
                            {th}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {[10, 50, 100].map((p) => (
                        <button key={p} type="button" className="chip h-11 px-5 text-[12px]" data-active={qty === p} onClick={() => setQty(p)}>
                          {p} kg
                        </button>
                      ))}
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.38]">{t.detail.kgPresets}</span>
                    </div>
                  )}
                </div>

                {/* miqdor + jami */}
                <div className="flex shrink-0 items-center justify-between gap-4 sm:gap-6">
                  <div className="flex h-12 items-center rounded-full border border-white/[0.12] bg-white/[0.04]">
                    <button type="button" className="flex h-12 w-12 items-center justify-center text-white/65 hover:text-white" onClick={() => setQty((v) => Math.max(1, v - (isCrushed ? 10 : 1)))} aria-label={isCrushed ? '−10 kg' : '−1'}>
                      <Minus size={17} strokeWidth={1.8} />
                    </button>
                    <span className="w-14 text-center font-mono text-base font-semibold tabular-nums text-white">
                      {qty}{isCrushed ? ' kg' : ''}
                    </span>
                    <button type="button" className="flex h-12 w-12 items-center justify-center text-white/65 hover:text-white" onClick={() => setQty((v) => v + (isCrushed ? 10 : 1))} aria-label={isCrushed ? '+10 kg' : '+1'}>
                      <Plus size={17} strokeWidth={1.8} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">{t.detail.total}</div>
                    <div className="mt-0.5 text-2xl font-extrabold leading-none sm:text-3xl" style={{ color: accent }}>
                      {formatMoney(lineTotal, currency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* past: tavsif + boshqa zichliklar */}
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-4 md:grid-cols-12">
                {showInfo && (
                  <div className="md:col-span-6 lg:col-span-5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.34em] text-white/40">{t.detail.desc}</div>
                    <p className="mt-1.5 max-w-md text-[12px] leading-relaxed text-white/[0.58]">{product.desc[lang]}</p>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/[0.32]">7–20 kg/m³ · 1–60 cm · EPS</div>
                  </div>
                )}
                {!isCrushed && (
                  <div className={showInfo ? 'md:col-span-6 lg:col-span-7' : 'md:col-span-12'}>
                    <div className="font-mono text-[9px] uppercase tracking-[0.34em] text-white/40">{t.detail.otherDensities}</div>
                    <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
                      {DENSITIES.map((d) => {
                        const p = calcSlabPrice(d, thickness);
                        const activeD = d === density;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => { setDensityL(d); setGlobalDensity(d); }}
                            className="group w-[92px] shrink-0 rounded-2xl border p-1.5 text-center transition-all duration-300"
                            style={activeD ? { borderColor: accent, background: `${accent}1F` } : { borderColor: 'rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.03)' }}
                            aria-pressed={activeD}
                          >
                            <span className="product-tile flex h-12 items-center justify-center overflow-hidden rounded-xl">
                              <Image src={product.image} alt={`${d} kg/m³`} width={72} height={52} className="h-full w-full object-contain mix-blend-screen" />
                            </span>
                            <span className="mt-1.5 block font-mono text-[8px] uppercase tracking-[0.14em] text-white/55">{densityCode(product.code, d)}</span>
                            <span className="mt-0.5 block text-[11px] font-bold text-white/90">${p}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FavBtn({ isFav, accent, onToggle, label, tall = false }: { isFav: boolean; accent: string; onToggle: () => void; label: string; tall?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`icon-btn ${tall ? 'h-14 w-14' : 'h-11 w-11'}`}
      style={isFav ? { borderColor: accent, color: accent } : undefined}
      aria-label={label}
      aria-pressed={isFav}
    >
      <Heart size={19} strokeWidth={1.6} fill={isFav ? accent : 'none'} color={isFav ? accent : 'currentColor'} />
    </button>
  );
}
