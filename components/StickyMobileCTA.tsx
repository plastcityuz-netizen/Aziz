'use client';

import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatMoney } from '@/data/products';

/** Mobil: pastda doimiy "BUYURTMA BERISH" paneli (overlaylar ochiq bo'lsa yashirin) */
export default function StickyMobileCTA() {
  const { overlay, cartCount, cartSubtotal, currency, t, openOverlay } = useStore();

  if (overlay !== 'none') return null;

  const hasItems = cartCount > 0;
  const go = () => {
    if (hasItems) {
      openOverlay('cart');
    } else {
      document.querySelector('#mahsulotlar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[45] border-t border-white/[0.08] bg-[#06080C]/88 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2.5 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {hasItems ? (
            <>
              <div className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-white/40">
                {t.cart.total} ({cartCount})
              </div>
              <div className="text-xl font-extrabold leading-tight text-white">
                {formatMoney(cartSubtotal, currency)}
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-brand-blue">PLAST CITY</div>
              <div className="text-[12px] font-bold leading-tight text-white/[0.82]">Penaplast Zavodi</div>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={go}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-blue px-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#06080c] shadow-[0_10px_30px_rgba(30,139,195,0.4)] transition-transform active:scale-95"
        >
          <ShoppingBag size={16} strokeWidth={2} />
          {hasItems ? t.mobileBar.viewCart : t.mobileBar.order}
          <ArrowRight size={14} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
