'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  calcLineTotal,
  unitPrice,
  type Currency,
  type Density,
  type Lang,
  type ProductId,
  type Thickness,
} from '@/data/products';
import { translations, type Dict } from '@/lib/i18n';

export interface CartItem {
  key: string;
  productId: ProductId;
  density: Density | null;
  thickness: Thickness | null;
  quantity: number;
  unit: 'dona' | 'kg';
}

export type Overlay = 'none' | 'menu' | 'detail' | 'cart' | 'order' | 'production';

interface StoreContextValue {
  // i18n / currency
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  toggleCurrency: () => void;
  t: Dict;
  // tanlov (chip paneli)
  density: Density;
  setDensity: (d: Density) => void;
  thickness: Thickness;
  setThickness: (t: Thickness) => void;
  // hero / ambient
  heroIndex: number;
  setHeroIndex: (i: number) => void;
  // savat
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'key'> & { key?: string }) => void;
  removeFromCart: (key: string) => void;
  setQuantity: (key: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  // sevimlilar
  favorites: ProductId[];
  toggleFavorite: (id: ProductId) => void;
  // overlay nav
  overlay: Overlay;
  openOverlay: (o: Overlay) => void;
  closeOverlay: () => void;
  detailProduct: ProductId | null;
  openDetail: (id: ProductId) => void;
  // toast
  toast: { id: number; msg: string } | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — jim o'tkazamiz */
  }
}

const cartKey = (i: Pick<CartItem, 'productId' | 'density' | 'thickness'>) =>
  `${i.productId}|${i.density ?? ''}|${i.thickness ?? ''}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [density, setDensity] = useState<Density>(15);
  const [thickness, setThickness] = useState<Thickness>(10);
  const [heroIndex, setHeroIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<ProductId[]>([]);
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [detailProduct, setDetailProduct] = useState<ProductId | null>(null);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Bir martalik localStorage yuklash (try/catch ichida)
  useEffect(() => {
    setLangState(loadLS<Lang>('pc_lang', 'uz'));
    setCurrency(loadLS<Currency>('pc_currency', 'USD'));
    setCart(loadLS<CartItem[]>('pc_cart', []));
    setFavorites(loadLS<ProductId[]>('pc_favs', []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLS('pc_lang', lang);
  }, [lang, hydrated]);
  useEffect(() => {
    if (hydrated) saveLS('pc_currency', currency);
  }, [currency, hydrated]);
  useEffect(() => {
    if (hydrated) saveLS('pc_cart', cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) saveLS('pc_favs', favorites);
  }, [favorites, hydrated]);

  // Overlay ochiq bo'lsa body scroll qulflanadi
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const locked = overlay !== 'none';
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [overlay]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleCurrency = useCallback(
    () => setCurrency((c) => (c === 'USD' ? 'UZS' : 'USD')),
    []
  );

  const addToCart = useCallback((item: Omit<CartItem, 'key'> & { key?: string }) => {
    const key = item.key ?? cartKey(item);
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, { ...item, key, quantity: Math.max(1, item.quantity) }];
    });
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.key === key ? { ...i, quantity: Math.max(0, Math.floor(qty) || 0) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((id: ProductId) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const openOverlay = useCallback((o: Overlay) => setOverlay(o), []);
  const closeOverlay = useCallback(() => setOverlay('none'), []);
  const openDetail = useCallback((id: ProductId) => {
    setDetailProduct(id);
    setOverlay('detail');
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast({ id: Date.now(), msg });
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + (i.unit === 'kg' ? 1 : i.quantity), 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (sum, i) =>
          sum +
          calcLineTotal({
            productId: i.productId,
            density: i.density,
            thickness: i.thickness,
            quantity: i.quantity,
          }),
        0
      ),
    [cart]
  );

  const value: StoreContextValue = {
    lang,
    setLang,
    currency,
    toggleCurrency,
    t: translations[lang],
    density,
    setDensity,
    thickness,
    setThickness,
    heroIndex,
    setHeroIndex,
    cart,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    favorites,
    toggleFavorite,
    overlay,
    openOverlay,
    closeOverlay,
    detailProduct,
    openDetail,
    toast,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export { unitPrice };
