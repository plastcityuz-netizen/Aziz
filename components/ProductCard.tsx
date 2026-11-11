'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import {
  calcSlabPrice,
  DENSITIES,
  densityCode,
  formatMoney,
  PRODUCTS,
  type Density,
} from '@/data/products';
import { useStore } from '@/lib/store';

/** Bitta zichlik uchun katalog kartasi */
export function SlabCard({ productId, d }: { productId: 'white' | 'black'; d: Density }) {
  const { t, lang, currency, density, thickness, setDensity, openDetail, addToCart, showToast } = useStore();
  const product = PRODUCTS[productId];
  const price = calcSlabPrice(d, thickness);
  const active = density === d;
  const code = densityCode(product.code, d);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDensity(d);
    addToCart({ productId, density: d, thickness, quantity: 1, unit: 'dona' });
    showToast(t.toast.added);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${product.name[lang]} ${d} kg/m³`}
      onClick={() => {
        setDensity(d);
        openDetail(productId);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setDensity(d);
          openDetail(productId);
        }
      }}
      className={`card-hover group relative w-[180px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-[22px] border transition-all duration-500 ease-premium sm:w-[208px] ${
        active
          ? 'border-transparent shadow-[0_18px_60px_rgba(0,0,0,0.55)]'
          : 'glass border-white/[0.09] hover:border-white/[0.16]'
      }`}
      style={
        active
          ? { background: `linear-gradient(168deg, ${product.accent}2E 0%, rgba(12,16,24,0.92) 46%)`, boxShadow: `0 18px 60px rgba(0,0,0,0.55), inset 0 0 0 1px ${product.accent}55` }
          : undefined
      }
    >
      {/* zichlik pill + tez qo'shish */}
      <div className="flex items-center justify-between gap-2 p-3 pb-0">
        <span
          className="inline-flex h-7 items-center rounded-full px-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={
            active
              ? { background: product.accent, color: '#06080c' }
              : { border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.75)' }
          }
        >
          {d} kg/m³
        </span>
        <button
          type="button"
          onClick={quickAdd}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/5 text-white/75 transition-all duration-300 hover:scale-110 hover:border-transparent hover:text-[#06080c]"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = product.accent;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '';
          }}
          aria-label={t.catalog.add}
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>

      {/* rasm */}
      <div className="product-tile mx-3 mt-3 flex h-32 items-center justify-center overflow-hidden rounded-2xl sm:h-36">
        <Image
          src={product.image}
          alt={`${product.name[lang]} ${d} kg/m³`}
          width={200}
          height={160}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-screen transition-transform duration-700 ease-premium group-hover:scale-105"
        />
      </div>

      {/* ma'lumot */}
      <div className="p-3.5 pt-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.38]">{code}</div>
        <div className="mt-1 truncate text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white/[0.92]">
          {product.name[lang]}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-white/[0.08] pt-2">
          <span className="text-[22px] font-extrabold leading-none text-white">
            {formatMoney(price, currency)}
            <span className="ml-1 align-middle font-mono text-[8.5px] font-medium uppercase tracking-[0.2em] text-white/[0.42]">
              {t.catalog.perDona}
            </span>
          </span>
          <span className="font-mono text-[10px] text-white/40">{thickness} cm</span>
        </div>
      </div>
    </div>
  );
}

/** Maydalangan penaplast — bitta katta karta, kg hisobi */
export function CrushedCard() {
  const { t, lang, currency, addToCart, showToast, openDetail } = useStore();
  const [kg, setKg] = useState(10);
  const product = PRODUCTS.crushed;
  const total = Math.round(kg * 0.7 * 100) / 100;

  const add = () => {
    const qty = Number.isFinite(kg) && kg > 0 ? Math.floor(kg) : 1;
    addToCart({ productId: 'crushed', density: null, thickness: null, quantity: qty, unit: 'kg' });
    showToast(t.toast.added);
  };

  return (
    <div
      className="glass mt-4 grid grid-cols-1 gap-5 overflow-hidden rounded-[26px] p-4 transition-all duration-500 ease-premium hover:border-white/[0.16] md:grid-cols-12 md:items-center md:gap-6 md:p-6"
      style={{ background: 'linear-gradient(150deg, rgba(201,183,156,0.10) 0%, rgba(255,255,255,0.03) 45%)' }}
    >
      {/* rasm */}
      <button
        type="button"
        onClick={() => openDetail('crushed')}
        className="product-tile flex h-40 items-center justify-center overflow-hidden rounded-3xl md:col-span-3 md:h-56"
        aria-label={product.name[lang]}
      >
        <Image
          src={product.image}
          alt={product.name[lang]}
          width={360}
          height={280}
          loading="lazy"
          className="h-full w-full object-cover mix-blend-screen transition-transform duration-700 ease-premium hover:scale-105"
        />
      </button>

      {/* matn */}
      <div className="md:col-span-5">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-brand-sand">{product.code}</div>
        <h3 className="mt-1.5 text-2xl font-extrabold uppercase leading-[1.02] text-white sm:text-4xl">
          MAYDALANGAN<br />PENAPLAST
        </h3>
        <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-white/55 sm:text-[13px]">
          {product.tagline[lang]}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-brand-sand sm:text-4xl">{formatMoney(0.7, currency)}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">{t.catalog.perKg}</span>
        </div>
      </div>

      {/* kg tanlovi + qo'shish */}
      <div className="flex flex-col gap-3 md:col-span-4">
        <div className="flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center rounded-full border border-white/[0.12] bg-white/[0.04]">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center text-white/65 transition-colors hover:text-white"
              onClick={() => setKg((v) => Math.max(1, v - 10))}
              aria-label="−10 kg"
            >
              <Minus size={16} strokeWidth={1.8} />
            </button>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={kg}
              onChange={(e) => setKg(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
              className="h-full w-full bg-transparent text-center font-mono text-base font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="kg"
            />
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center text-white/65 transition-colors hover:text-white"
              onClick={() => setKg((v) => v + 10)}
              aria-label="+10 kg"
            >
              <Plus size={16} strokeWidth={1.8} />
            </button>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">kg</span>
        </div>
        <div className="flex gap-2">
          {[10, 50, 100].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setKg(p)}
              className="h-10 flex-1 rounded-full border border-white/[0.12] font-mono text-[11px] font-medium text-white/70 transition-all duration-300 hover:border-brand-sand/60 hover:text-brand-sand"
              data-active={kg === p}
              style={kg === p ? { background: '#C9B79C', borderColor: 'transparent', color: '#06080c' } : undefined}
            >
              {p} kg
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/[0.42]">{t.detail.total}</span>
          <span className="text-2xl font-extrabold text-white">{formatMoney(total, currency)}</span>
        </div>
        <button
          type="button"
          onClick={add}
          className="btn-primary h-12 w-full"
          style={{ '--acc': '#C9B79C', '--acc-glow': 'rgba(201,183,156,0.4)' } as React.CSSProperties}
        >
          {t.catalog.add}
        </button>
      </div>
    </div>
  );
}
