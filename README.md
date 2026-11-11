# Plast City — Penaplast Zavodi

Qurilish, issiqlik izolyatsiyasi va sanoat uchun sifatli **EPS penaplast** mahsulotlari — buyurtma berish sayti.
Ilova oynasi (frame) uslubidagi premium qorong'u dizayn: oq, qora (grafitlangan) va maydalangan penaplast katalogi,
jonli narx hisobi, savat va Telegram orqali buyurtma.

## Texnologiyalar

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** (animatsiyalar), **lucide-react** (ikonlar)
- Shriftlar: Manrope (variable) + JetBrains Mono — `@fontsource` orqali, offline build
- Savat holati: React Context + `localStorage` (try/catch bilan xavfsiz)

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # production server
npm run lint       # ESLint
```

## Telegram buyurtma yetkazish

Buyurtmalar `app/api/order/route.ts` orqali Telegram Bot API'ga yuboriladi.
Token va chat ID **faqat server tomonda** — `.env` faylida (namuna: `.env.example`):

```bash
cp .env.example .env
# .env ni to'ldiring:
# TELEGRAM_BOT_TOKEN=...
# TELEGRAM_CHAT_ID=...
```

- `@BotFather` da bot yarating, `/newbot` → token oling.
- Botga buyurtma tushishi kerak bo'lgan chat ID sini oling (masalan `@userinfobot` yoki guruhga qo'shib `-100…`).
- Token frontendga HECH QACHON chiqmaydi (`NEXT_PUBLIC_` emas).

Telegram sozlanmagan yoki ishlamasa — foydalanuvchiga avtomatik zaxira havola taklif qilinadi:
`https://t.me/penaplast_uz?text=<kodlangan buyurtma matni>` (qo'lda yuborish).

**Spam himoyasi:** honeypot maydoni + IP bo'yicha 10 daqiqada 5 ta buyurtma (in-memory rate-limit) + server-side validatsiya.

## Narxlar

Barcha narxlar — yagona manbada: [`data/products.ts`](data/products.ts).
`priceMatrix[zichlik][qalinlik]` strukturasi qo'llab-quvvatlanadi; hozircha qalinlikdan qat'i nazar
zichlik narxi ishlatiladi (`calcPrice` mantiqi `calcSlabPrice` / `calcLineTotal` da).
So'm ko'rinishi uchun statik kurs: `UZS_PER_USD` (shu faylda o'zgartiring).

## Struktura

```
app/            # layout (SEO/OG), page, opengraph-image, icon.svg, api/order
components/     # Navbar, HeroCarousel, FilterPanel, ProductDetail, CartDrawer, OrderModal, …
data/products.ts# yagona ma'lumot + narx manbasi
lib/            # store (context: savat, UZ/RU, valyuta, overlaylar), i18n, order matni
```

## SEO

`title`, `description`, Open Graph (`/opengraph-image`), `icon.svg`, JSON-LD (LocalBusiness),
`sitemap.xml`, `robots.txt` — barchasi sozlangan. Asosiy til: o'zbek (lotin), UZ/RU almashtirish mavjud.

© 2026 Plast City — Penaplast Zavodi. Barcha huquqlar himoyalangan.
