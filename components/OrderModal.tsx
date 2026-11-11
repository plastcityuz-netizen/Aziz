'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertTriangle, Send, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  calcLineTotal,
  formatMoney,
  PHONE_DISPLAY,
  PRODUCTS,
  TELEGRAM_URL,
  unitPrice,
} from '@/data/products';
import { buildOrderText, type OrderLine } from '@/lib/order';

const EASE = [0.22, 1, 0.36, 1] as const;
type FormState = 'idle' | 'sending' | 'success' | 'error';

/** +998 XX XXX-XX-XX ko'rinishiga formatlash */
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(0, 12);
  else digits = ('998' + digits).slice(0, 12);
  const p = digits.slice(3);
  let out = '+998';
  if (p.length > 0) out += ` (${p.slice(0, 2)}`;
  if (p.length >= 2) out += ')';
  if (p.length > 2) out += ` ${p.slice(2, 5)}`;
  if (p.length > 5) out += `-${p.slice(5, 7)}`;
  if (p.length > 7) out += `-${p.slice(7, 9)}`;
  return out;
}
const phoneValid = (v: string) => {
  const digits = v.replace(/\D/g, '');
  return /^998\d{9}$/.test(digits);
};

export default function OrderModal() {
  const { overlay, openOverlay, closeOverlay, cart, cartSubtotal, clearCart, t, lang, currency } = useStore();
  const open = overlay === 'order';

  const [state, setState] = useState<FormState>('idle');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const inFlight = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setState('idle');
      setErrors({});
      lastFocus.current = document.activeElement as HTMLElement;
      const id = window.setTimeout(() => nameRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    } else {
      lastFocus.current?.focus?.();
    }
  }, [open]);

  // Escape + focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state !== 'sending') {
        e.stopPropagation();
        closeToCart();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state]);

  const closeToCart = () => openOverlay('cart');

  // Buyurtma qatorlarini tayyorlash (client + server uchun bir xil)
  const orderLines: OrderLine[] = useMemo(
    () =>
      cart.map((item) => {
        const product = PRODUCTS[item.productId];
        const meta =
          item.unit === 'kg'
            ? 'maydalangan, kilogramm'
            : `${item.density} kg/m³ — ${item.thickness} cm`;
        return {
          name: product.name[lang],
          meta,
          quantity: item.quantity,
          unit: item.unit === 'kg' ? 'kg' : t.cart.pcs,
          unitPriceUSD: unitPrice(item.productId, item.density, item.thickness),
          lineTotalUSD: calcLineTotal(item),
        };
      }),
    [cart, lang, t.cart.pcs]
  );

  const fallbackText = buildOrderText(orderLines, cartSubtotal, { name: name || '—', phone, address: address || '—', note });
  const fallbackHref = `${TELEGRAM_URL}?text=${encodeURIComponent(fallbackText)}`;

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = t.form.errName;
    if (!phoneValid(phone)) next.phone = t.form.errPhone;
    if (address.trim().length < 3) next.address = t.form.errAddress;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inFlight.current || state === 'sending') return; // qayta bosishdan himoya
    if (!validate()) return;

    inFlight.current = true;
    setState('sending');

    const payload = {
      name: name.trim(),
      phone: '+' + phone.replace(/\D/g, ''),
      address: address.trim(),
      note: note.trim(),
      website, // honeypot — bo'sh bo'lishi kerak
      total: Math.round(cartSubtotal * 100) / 100,
      currency: 'USD',
      items: orderLines.map((l) => ({
        name: l.name,
        meta: l.meta,
        quantity: l.quantity,
        unit: l.unit,
        unitPrice: l.unitPriceUSD,
        lineTotal: l.lineTotalUSD,
      })),
    };

    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 10000);
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      window.clearTimeout(timer);
      if (!res.ok) throw new Error(`order_failed_${res.status}`);
      setState('success');
      clearCart();
      window.setTimeout(() => closeOverlay(), 3000);
    } catch {
      setState('error');
    } finally {
      inFlight.current = false;
    }
  };

  const inputCls = (invalid?: string) =>
    `h-12 w-full rounded-2xl border bg-white/[0.04] px-4 text-[14px] text-white placeholder-white/[0.28] outline-none transition-colors duration-300 focus:border-brand-blue/60 ${
      invalid ? 'border-red-400/50' : 'border-white/[0.12]'
    }`;

  return (
    <AnimatePresence>
      {open && (
        <div key="order" className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={t.form.title}>
          {/* fon */}
          <motion.button
            type="button"
            aria-label={t.nav.close}
            className="absolute inset-0 cursor-default bg-[#02040a]/78 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => state !== 'sending' && closeToCart()}
          />
          {/* panel */}
          <motion.div
            ref={panelRef}
            className="glass-strong relative z-10 max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] p-5 min-[420px]:p-6 sm:max-w-lg sm:rounded-[28px] sm:p-7"
            initial={{ y: '100%', opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/[0.14] sm:hidden" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold uppercase tracking-[0.02em] text-white">{t.form.title}</h3>
                <p className="mt-1 text-[12px] text-white/45">{t.form.subtitle}</p>
              </div>
              <button type="button" onClick={() => state !== 'sending' && closeToCart()} className="icon-btn h-10 w-10 shrink-0" aria-label={t.nav.close} disabled={state === 'sending'}>
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            {state === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                >
                  <CheckCircle2 size={72} strokeWidth={1.4} className="text-emerald-400" />
                </motion.span>
                <p className="text-lg font-bold leading-snug text-white">{t.form.successTitle}</p>
                <p className="max-w-xs text-sm text-white/50">{t.form.successSub}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 flex flex-col gap-3.5" noValidate>
                {/* honeypot — odam ko'rmaydi */}
                <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                  <label htmlFor="pc-website">{t.form.honeypot}</label>
                  <input id="pc-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <div>
                  <label htmlFor="pc-name" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.48]">
                    {t.form.name} <span className="text-brand-copper">*</span>
                  </label>
                  <input ref={nameRef} id="pc-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.form.namePh} className={inputCls(errors.name)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'pc-name-err' : undefined} />
                  {errors.name && <p id="pc-name-err" role="alert" className="mt-1.5 text-[11px] text-red-300">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="pc-phone" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.48]">
                    {t.form.phone} <span className="text-brand-copper">*</span>
                  </label>
                  <input
                    id="pc-phone" type="tel" autoComplete="tel" inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="+998 (90) 123-45-67"
                    className={inputCls(errors.phone)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'pc-phone-err' : undefined}
                  />
                  {errors.phone && <p id="pc-phone-err" role="alert" className="mt-1.5 text-[11px] text-red-300">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="pc-address" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.48]">
                    {t.form.address} <span className="text-brand-copper">*</span>
                  </label>
                  <input id="pc-address" type="text" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.form.addressPh} className={inputCls(errors.address)} aria-invalid={!!errors.address} aria-describedby={errors.address ? 'pc-address-err' : undefined} />
                  {errors.address && <p id="pc-address-err" role="alert" className="mt-1.5 text-[11px] text-red-300">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="pc-note" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-white/[0.48]">
                    {t.form.note}
                  </label>
                  <textarea id="pc-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.form.notePh} className="w-full resize-none rounded-2xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder-white/[0.28] outline-none transition-colors focus:border-brand-blue/60" />
                </div>

                {state === 'error' && (
                  <div role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
                    <div className="flex items-center gap-2.5 text-[13px] font-semibold text-red-200">
                      <AlertTriangle size={17} strokeWidth={1.8} className="shrink-0" />
                      {t.form.errorMsg}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setState('idle')} className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 hover:border-white/35">
                        {t.form.retry}
                      </button>
                      <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#229ED9] px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#06080c] transition-transform hover:scale-[1.03]">
                        <Send size={13} strokeWidth={2} />
                        {t.form.telegramFallback}
                      </a>
                    </div>
                  </div>
                )}

                {/* jami + yuborish */}
                <div className="mt-1 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
                  <div>
                    <div className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-white/40">{t.cart.total}</div>
                    <div className="mt-0.5 text-2xl font-extrabold text-white">{formatMoney(cartSubtotal, currency)}</div>
                  </div>
                  <button
                    type="submit"
                    disabled={state === 'sending' || cart.length === 0}
                    className="btn-primary min-h-[52px] px-6 text-[11.5px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === 'sending' ? (
                      <>
                        <Loader2 size={17} strokeWidth={2} className="animate-spin" />
                        {t.form.sending}
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={17} strokeWidth={2} />
                        {t.form.submit}
                      </>
                    )}
                  </button>
                </div>
                {cart.length === 0 && <p className="text-center text-[11px] text-white/35">{t.cart.empty}</p>}
                <p className="text-center font-mono text-[9px] uppercase tracking-[0.24em] text-white/[0.28]">
                  {PHONE_DISPLAY} · @penaplast_uz
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
