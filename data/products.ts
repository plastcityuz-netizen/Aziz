/**
 * PLAST CITY — yagona ma'lumot manbasi.
 * Barcha narxlar shu faylda. priceMatrix[zichlik][qalinlik] — qalinlikdan qat'i
 * nazar zichlik narxi ishlatiladi (strukturasi kelajakdagi farqlar uchun tayyor).
 */

export const DENSITIES = [7, 10, 12, 14, 15, 16, 18, 20] as const;
export type Density = (typeof DENSITIES)[number];

export const THICKNESSES = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60] as const;
export type Thickness = (typeof THICKNESSES)[number];

/** Zichlik narxlari, USD / dona (plita) */
export const DENSITY_PRICES: Record<Density, number> = {
  7: 32,
  10: 40,
  12: 50,
  14: 62,
  15: 67,
  16: 71,
  18: 79,
  20: 87,
};

/** priceMatrix[zichlik][qalinlik] — hozircha qalinlikka qaramay zichlik narxi */
export const PRICE_MATRIX: Record<Density, Record<Thickness, number>> = DENSITIES.reduce(
  (acc, d) => {
    acc[d] = THICKNESSES.reduce((row, t) => {
      row[t] = DENSITY_PRICES[d];
      return row;
    }, {} as Record<Thickness, number>);
    return acc;
  },
  {} as Record<Density, Record<Thickness, number>>
);

export const CRUSHED_PRICE_PER_KG = 0.7; // USD / kg

/** Statik kurs: 1 USD = 12 750 UZS (so'm ko'rinishi uchun). Yangilash shu yerni o'zgartiring. */
export const UZS_PER_USD = 12750;

export const PHONE_DISPLAY = '+998 99 513 22 22';
export const PHONE_TEL = 'tel:+998995132222';
export const TELEGRAM_HANDLE = '@penaplast_uz';
export const TELEGRAM_URL = 'https://t.me/penaplast_uz';

export type ProductId = 'white' | 'black' | 'crushed';
export type Lang = 'uz' | 'ru';
export type Currency = 'USD' | 'UZS';

export interface ProductMeta {
  id: ProductId;
  code: string;
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
  desc: Record<Lang, string>;
  image: string;
  /** Asosiy aksent — tugmalar, chiplar, nuqtalar */
  accent: string;
  /** Atrof muhit / glow uchun (var gradient) */
  glow: string;
  /** tashqi ambient fon dog'i */
  ambient: string;
  available: 'stock' | 'fast';
  unit: 'dona' | 'kg';
}

export const PRODUCTS: Record<ProductId, ProductMeta> = {
  white: {
    id: 'white',
    code: 'PC-WHT-01',
    name: { uz: 'OQ PENAPLAST', ru: 'БЕЛЫЙ ПЕНОПЛАСТ' },
    tagline: {
      uz: "Uy-joy qurilishi, fasad va issiqlik izolyatsiyasi uchun klassik EPS.",
      ru: 'Классический EPS для жилых домов, фасадов и теплоизоляции.',
    },
    desc: {
      uz: "Oq penaplast — qurilish, issiqlik izolyatsiyasi, fasad va pollar uchun ishonchli tanlov. Zichlik 7–20 kg/m³, qalinlik 1–60 cm.",
      ru: 'Белый пенопласт — надёжный выбор для строительства, теплоизоляции фасадов и полов. Плотность 7–20 кг/м³, толщина 1–60 см.',
    },
    image: '/images/white-eps.webp',
    accent: '#1E8BC3',
    glow: 'rgba(30,139,195,0.55)',
    ambient: 'rgba(38,110,158,0.55)',
    available: 'stock',
    unit: 'dona',
  },
  black: {
    id: 'black',
    code: 'PC-BLK-02',
    name: { uz: 'QORA PENAPLAST', ru: 'ЧЁРНЫЙ ПЕНОПЛАСТ' },
    tagline: {
      uz: "Grafit qo'shilgan grafitlangan EPS — yuqori issiqlik qarshiligi.",
      ru: 'Графитированный EPS с повышенным сопротивлением теплопередаче.',
    },
    desc: {
      uz: "Qora (grafitlangan) penaplast — devor, tom va pol izolyatsiyasi uchun. Bir xil zichlikda oq EPSga qaraganda samaraliroq izolyatsiya.",
      ru: 'Чёрный (графитированный) пенопласт для изоляции стен, кровли и полов. При той же плотности эффективнее белого EPS.',
    },
    image: '/images/black-eps.webp',
    accent: '#D98E6A',
    glow: 'rgba(217,142,106,0.5)',
    ambient: 'rgba(146,84,54,0.5)',
    available: 'fast',
    unit: 'dona',
  },
  crushed: {
    id: 'crushed',
    code: 'PC-CRH-03',
    name: { uz: 'MAYDALANGAN PENAPLAST', ru: 'КРОШКА ПЕНОПЛАСТА' },
    tagline: {
      uz: "Qadoqlash va bo'shliqlarni to'ldirish uchun donador EPS.",
      ru: 'Гранулы EPS для упаковки и заполнения пустот.',
    },
    desc: {
      uz: "Maydalangan penaplast — qadoqlash, to'ldirish va yengil to'siqlar uchun. Kilogramm bilan sotiladi, $0.70/kg.",
      ru: 'Крошка пенопласта для упаковки, заполнения и лёгких перегородок. Продаётся в килограммах, $0.70/кг.',
    },
    image: '/images/crushed-eps.webp',
    accent: '#C9B79C',
    glow: 'rgba(201,183,156,0.45)',
    ambient: 'rgba(140,126,99,0.5)',
    available: 'stock',
    unit: 'kg',
  },
};

export const PRODUCT_ORDER: ProductId[] = ['white', 'black', 'crushed'];

/** Zichlik bo'yicha kod (masalan PC-WHT-15) */
export function densityCode(base: string, density: Density): string {
  const prefix = base.split('-').slice(0, 2).join('-');
  return `${prefix}-${density}`;
}

/** Plita narxi — priceMatrix orqali (yagona hisoblash nuqtasi) */
export function calcSlabPrice(density: Density, thickness: Thickness): number {
  return PRICE_MATRIX[density][thickness];
}

export interface CalcInput {
  productId: ProductId;
  density: Density | null;
  thickness: Thickness | null;
  quantity: number; // dona yoki kg
}

/** Satr jami narxi (USD) */
export function calcLineTotal({ productId, density, thickness, quantity }: CalcInput): number {
  const qty = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
  if (productId === 'crushed') return round2(CRUSHED_PRICE_PER_KG * qty);
  const d: Density = density ?? 15;
  const t: Thickness = thickness ?? 10;
  return round2(calcSlabPrice(d, t) * qty);
}

/** Bir birlik narxi (USD) — narx yonida doim birlik bilan ko'rsatiladi */
export function unitPrice(productId: ProductId, density: Density | null, thickness: Thickness | null): number {
  if (productId === 'crushed') return CRUSHED_PRICE_PER_KG;
  return calcSlabPrice(density ?? 15, thickness ?? 10);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatMoney(usd: number, currency: Currency = 'USD'): string {
  if (currency === 'UZS') {
    const uzs = Math.round(usd * UZS_PER_USD);
    return `${uzs.toLocaleString('ru-RU')} so'm`;
  }
  const r = round2(usd);
  const fixed = Number.isInteger(r) ? String(r) : r.toFixed(2);
  return `$${fixed}`;
}

/** Kichik narx format — $0.70 kabi (sentlar doim ko'rinadi) */
export function formatUnitPrice(usd: number, currency: Currency = 'USD'): string {
  if (currency === 'UZS') return formatMoney(usd, 'UZS');
  return `$${round2(usd).toFixed(2)}`;
}
