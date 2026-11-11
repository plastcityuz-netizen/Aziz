import { NextRequest, NextResponse } from 'next/server';
import { buildOrderText, type OrderLine } from '@/lib/order';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface IncomingItem {
  name: string;
  meta: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

interface IncomingOrder {
  name: string;
  phone: string;
  address: string;
  note?: string;
  website?: string; // honeypot
  total: number;
  items: IncomingItem[];
}

// Oddiy spam-himoya: IP bo'yicha 10 daqiqada max 5 ta buyurtma (in-memory)
const rateMap = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const hits = (rateMap.get(ip) ?? []).filter((ts) => ts > windowStart);
  if (hits.length >= MAX_PER_WINDOW) {
    rateMap.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateMap.set(ip, hits);
  // Map o'sib ketmasligi uchun eski yozuvlarni vaqti-vaqti bilan tozalash
  if (rateMap.size > 500) {
    rateMap.forEach((arr, key) => {
      const kept = arr.filter((ts) => ts > windowStart);
      if (kept.length === 0) rateMap.delete(key);
      else rateMap.set(key, kept);
    });
  }
  return true;
}

const str = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';
const finiteNum = (v: unknown, max = 1e9): number | null => {
  const n = typeof v === 'string' ? Number(v) : (typeof v === 'number' ? v : NaN);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return n;
};

export async function POST(req: NextRequest) {
  let body: IncomingOrder;
  try {
    body = (await req.json()) as IncomingOrder;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot to'ldirilgan — bot. Jim muvaffaqiyat qaytaramiz, lekin yubormaymiz.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // IP rate-limit
  const fwd = req.headers.get('x-forwarded-for');
  const ip = (fwd?.split(',')[0] ?? 'unknown').trim();
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  // Validatsiya
  const name = str(body.name, 80);
  const phone = str(body.phone, 20);
  const address = str(body.address, 200);
  const note = str(body.note, 500);

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 422 });
  }
  const digits = phone.replace(/\D/g, '');
  if (!/^998\d{9}$/.test(digits)) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 422 });
  }
  if (address.length < 3) {
    return NextResponse.json({ ok: false, error: 'invalid_address' }, { status: 422 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
    return NextResponse.json({ ok: false, error: 'invalid_items' }, { status: 422 });
  }

  const items: OrderLine[] = [];
  for (const raw of body.items) {
    const itemName = str(raw?.name, 90);
    const meta = str(raw?.meta, 90);
    const unit = str(raw?.unit, 12);
    const quantity = finiteNum(raw?.quantity, 100000);
    const unitPrice = finiteNum(raw?.unitPrice, 1e6);
    const lineTotal = finiteNum(raw?.lineTotal, 1e9);
    if (!itemName || quantity === null || quantity <= 0 || unitPrice === null || lineTotal === null) {
      return NextResponse.json({ ok: false, error: 'invalid_item' }, { status: 422 });
    }
    items.push({
      name: itemName,
      meta,
      quantity,
      unit: unit || 'dona',
      unitPriceUSD: unitPrice,
      lineTotalUSD: lineTotal,
    });
  }

  const totalFromClient = finiteNum(body.total, 1e9);
  const computedTotal = Math.round(items.reduce((s, i) => s + i.lineTotalUSD, 0) * 100) / 100;
  const total = totalFromClient ?? computedTotal;

  const text = buildOrderText(items, total, { name, phone: `+${digits}`, address, note });

  // Telegram yuborish (server tomonda, token faqat .env da)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[order] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan');
    return NextResponse.json({ ok: false, error: 'telegram_not_configured' }, { status: 503 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[order] Telegram xatosi:', res.status, errText.slice(0, 300));
      return NextResponse.json({ ok: false, error: 'telegram_failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[order] Telegram so\'rovi bajarilmadi:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: 'telegram_unreachable' }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
