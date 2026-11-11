'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShieldCheck, Send, Phone, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import {
  calcLineTotal,
  formatMoney,
  PHONE_DISPLAY,
  PHONE_TEL,
  PRODUCTS,
  TELEGRAM_URL,
  unitPrice,
} from '@/data/products';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CartDrawer() {
  const { overlay, openOverlay, closeOverlay, cart, setQuantity, removeFromCart, cartSubtotal, cartCount, t, lang, currency } =
    useStore();
  const open = overlay === 'cart';
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

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
        <motion.div
          key="cart"
          className="fixed inset-0 z-[55] overflow-y-auto bg-[#04060a]/92 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={t.cart.title}
        >
          <div className="relative mx-auto min-h-full w-full max-w-[1760px] bg-[#06080C] p-4 sm:m-3 sm:min-h-[calc(100vh-1.5rem)] sm:rounded-[30px] sm:border sm:border-white/[0.08] sm:p-6 lg:m-5 lg:min-h-[calc(100vh-2.5rem)] lg:rounded-[34px] lg:p-9">
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4 sm:pb-6">
              <div className="flex items-center gap-3 sm:gap-5">
                <button ref={closeRef} type="button" onClick={closeOverlay} className="icon-btn h-11 w-11" aria-label={t.nav.close}>
                  <ArrowLeft size={19} strokeWidth={1.7} />
                </button>
                <h2 className="text-2xl font-extrabold uppercase leading-none text-white min-[420px]:text-4xl lg:text-6xl">
                  {t.cart.title}
                </h2>
              </div>
              <span className="flex h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-3 font-mono text-xs text-white/70">
                {cartCount} {t.cart.pcs}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
                <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <ShoppingBag size={38} strokeWidth={1.2} className="text-white/35" />
                </span>
                <div>
                  <p className="text-xl font-bold text-white/85">{t.cart.empty}</p>
                  <p className="mt-1.5 text-sm text-white/45">{t.cart.emptySub}</p>
                </div>
                <button type="button" onClick={goCatalog} className="btn-primary">
                  {t.cart.emptyCta}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-12 lg:gap-8">
                {/* chap: mahsulotlar */}
                <ul className="flex flex-col gap-3 lg:col-span-7">
                  <AnimatePresence initial={false} mode="popLayout">
                    {cart.map((item) => {
                      const product = PRODUCTS[item.productId];
                      const price = unitPrice(item.productId, item.density, item.thickness);
                      const total = calcLineTotal(item);
                      const meta =
                        item.unit === 'kg'
                          ? '$0.70 / kg'
                          : `${item.density} kg/m³ · ${item.thickness} cm`;
                      return (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, x: -28 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 32, height: 0, marginBottom: -12 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="glass grid grid-cols-[92px_1fr_auto] items-center gap-3 rounded-3xl p-3 sm:grid-cols-[120px_1fr_auto] sm:gap-5 sm:p-4"
                        >
                          <button type="button" onClick={goCatalog} className="product-tile flex h-24 items-center justify-center overflow-hidden rounded-2xl sm:h-28" aria-label={product.name[lang]}>
                            <Image
                              src={product.image}
                              alt={product.name[lang]}
                              width={150}
                              height={130}
                              className="h-full w-full object-contain mix-blend-screen"
                            />
                          </button>
                          <div className="min-w-0">
                            <div className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-white/[0.38]">
                              {item.unit === 'kg' ? product.code : `${product.code.split('-').slice(0, 2).join('-')}-${item.density}`}
                            </div>
                            <div className="mt-0.5 truncate text-[13px] font-extrabold uppercase tracking-[0.04em] text-white sm:text-[14px]">
                              {product.name[lang]}
                            </div>
                            <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45">{meta}</div>
                            <div className="mt-2 flex h-9 w-max items-center rounded-full border border-white/[0.12] bg-white/[0.04]">
                              <button type="button" className="flex h-9 w-9 items-center justify-center text-white/60 hover:text-white" onClick={() => setQuantity(item.key, item.quantity - (item.unit === 'kg' ? 10 : 1))} aria-label={item.unit === 'kg' ? '−10 kg' : '−1'}>
                                <Minus size={14} strokeWidth={1.8} />
                              </button>
                              <span className="w-12 text-center font-mono text-[12.5px] font-semibold tabular-nums text-white">
                                {item.quantity}
                              </span>
                              <button type="button" className="flex h-9 w-9 items-center justify-center text-white/60 hover:text-white" onClick={() => setQuantity(item.key, item.quantity + (item.unit === 'kg' ? 10 : 1))} aria-label={item.unit === 'kg' ? '+10 kg' : '+1'}>
                                <Plus size={14} strokeWidth={1.8} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between gap-6 self-stretch py-1">
                            <button type="button" onClick={() => removeFromCart(item.key)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/45 transition-all duration-300 hover:border-red-400/40 hover:text-red-300" aria-label={t.cart.remove}>
                              <Trash2 size={15} strokeWidth={1.6} />
                            </button>
                            <div className="text-right">
                              <div className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/35">
                                {formatMoney(price, currency)}{item.unit === 'kg' ? ' / kg' : ''}
                              </div>
                              <div className="mt-0.5 text-lg font-extrabold text-white sm:text-xl">{formatMoney(total, currency)}</div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                {/* o'ng: xulosa */}
                <aside className="lg:col-span-5">
                  <div className="glass-strong sticky top-4 rounded-[26px] p-5 sm:p-7">
                    <div className="flex items-baseline justify-between text-[13px] text-white/[0.62]">
                      <span>{t.cart.subtotal}</span>
                      <span className="font-mono">{formatMoney(cartSubtotal, currency)}</span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between text-[13px] text-white/[0.62]">
                      <span>{t.cart.delivery}</span>
                      <span className="font-mono text-white/45">{t.cart.deliveryVal}</span>
                    </div>
                    <div className="my-4 h-px bg-white/[0.09]" />
                    <div className="flex items-end justify-between gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/[0.48]">{t.cart.total}</span>
                      <span className="text-4xl font-extrabold leading-none text-white sm:text-5xl">{formatMoney(cartSubtotal, currency)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openOverlay('order')}
                      className="btn-primary mt-6 h-14 w-full text-[13px]"
                    >
                      {t.cart.checkout}
                    </button>

                    <div className="mt-6 border-t border-white/[0.08] pt-5">
                      <div className="font-mono text-[9px] uppercase tracking-[0.34em] text-white/40">{t.cart.direct}</div>
                      <div className="mt-3 flex items-center gap-3">
                        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-blue/40 bg-brand-blue/15 text-brand-blue transition-all duration-300 hover:scale-105 hover:bg-brand-blue/25" aria-label="Telegram @penaplast_uz">
                          <Send size={22} strokeWidth={1.6} />
                        </a>
                        <a href={PHONE_TEL} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-white/85 transition-all duration-300 hover:scale-105 hover:border-white/30" aria-label={PHONE_DISPLAY}>
                          <Phone size={22} strokeWidth={1.6} />
                        </a>
                        <div className="min-w-0">
                          <div className="truncate font-mono text-[11px] text-white/[0.78]">{PHONE_DISPLAY}</div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/[0.38]">@penaplast_uz</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                        <ShieldCheck size={17} strokeWidth={1.7} className="shrink-0 text-emerald-400" />
                        <div>
                          <div className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-white/[0.62]">{t.cart.quality}</div>
                          <div className="text-[11px] text-white/45">{t.cart.qualitySub}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


