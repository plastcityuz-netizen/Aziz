import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import AmbientBackground from '@/components/AmbientBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuOverlay from '@/components/MenuOverlay';
import ProductDetail from '@/components/ProductDetail';
import CartDrawer from '@/components/CartDrawer';
import OrderModal from '@/components/OrderModal';
import ProductionModal from '@/components/ProductionModal';
import Toast from '@/components/Toast';
import StickyMobileCTA from '@/components/StickyMobileCTA';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.plastcity.uz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Plast City — Penaplast Zavodi | Sifatli EPS Penaplast',
  description:
    'Plast City Penaplast Zavodi — qurilish va issiqlik izolyatsiyasi uchun sifatli EPS penaplast mahsulotlari. Oq, qora va maydalangan penaplast: 7–20 kg/m³, 1–60 cm. Zavod narxlari, tez yetkazib berish.',
  keywords: [
    'penaplast',
    'EPS',
    'penoplast zavodi',
    'issiqlik izolyatsiyasi',
    'Plast City',
    'oq penaplast',
    'qora penaplast',
    'maydalangan penaplast',
    'Toshkent',
  ],
  authors: [{ name: 'Plast City' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    siteName: 'Plast City — Penaplast Zavodi',
    title: 'Plast City — Penaplast Zavodi | Sifatli EPS Penaplast',
    description:
      'Qurilish va issiqlik izolyatsiyasi uchun sifatli EPS penaplast. 7–20 kg/m³, 1–60 cm. Zavod narxlari.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plast City — Penaplast Zavodi | Sifatli EPS Penaplast',
    description:
      'Qurilish va issiqlik izolyatsiyasi uchun sifatli EPS penaplast. 7–20 kg/m³, 1–60 cm.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#04060a',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Plast City — Penaplast Zavodi',
  description:
    'Qurilish, issiqlik izolyatsiyasi va sanoat uchun sifatli EPS penaplast mahsulotlari.',
  telephone: '+998995132222',
  url: siteUrl,
  sameAs: ['https://t.me/penaplast_uz'],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Oq penaplast' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Qora penaplast' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Maydalangan penaplast' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <StoreProvider>
          <AmbientBackground />
          {/* Tashqi xira fon ustidagi "ilova oynasi" frame */}
          <div className="relative z-10 px-1.5 py-1.5 sm:px-4 sm:py-3 lg:px-6">
            <div className="relative mx-auto max-w-[1760px] overflow-visible rounded-[22px] border border-white/[0.08] bg-[#06080C] shadow-[0_60px_160px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.05)] sm:rounded-[30px] lg:rounded-[36px]">
              <Navbar />
              <main id="main">{children}</main>
              <Footer />
              {/* Mobil: sticky CTA balandligini qoplaydigan bo'shliq */}
              <div aria-hidden="true" className="h-[72px] md:hidden" />
              {/* To'liq ekran overlaylar */}
              <MenuOverlay />
              <ProductDetail />
              <CartDrawer />
              <OrderModal />
              <ProductionModal />
              <Toast />
              <StickyMobileCTA />
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
