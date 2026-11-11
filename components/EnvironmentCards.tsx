'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const CARDS = [
  { src: '/images/factory.jpg', href: '#ishlab-chiqarish', altUz: 'Plast City — ishlab chiqarish liniyasi', altRu: 'Plast City — производственная линия', uz: 'ISHLAB CHIQARISH', ru: 'ПРОИЗВОДСТВО', wide: true },
  { src: '/images/closeup.jpg', href: '#mahsulotlar', altUz: 'EPS penaplast — yaqin plan', altRu: 'Пенопласт EPS — крупный план', uz: 'MAHSULOT YAQIN PLANDA', ru: 'ПРОДУКТ КРУПНЫМ ПЛАНОМ', wide: false },
  { src: '/images/construction.jpg', href: '#qayerda', altUz: 'Qurilishda ishlatilishi', altRu: 'Применение в строительстве', uz: "QURILISHDA ISHLATILISHI", ru: 'ПРИМЕНЕНИЕ В СТРОИТЕЛЬСТВЕ', wide: false },
];

/** Hero ostidagi 3 ta muhit kartasi — videodagi kabi, scroll qilganda ko'tariladi */
export default function EnvironmentCards() {
  const { lang } = useStore();

  return (
    <div className="relative px-3 pb-2 sm:px-7 lg:px-9">
      <div className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-3 sm:gap-4">
        {CARDS.map((c) => (
          <a
            key={c.src}
            href={c.href}
            className={`group relative h-40 overflow-hidden rounded-[22px] border border-white/[0.09] sm:h-52 lg:h-60 ${
              c.wide ? 'min-[560px]:col-span-1' : ''
            }`}
            aria-label={lang === 'uz' ? c.uz : c.ru}
          >
            <Image
              src={c.src}
              alt={lang === 'uz' ? c.altUz : c.altRu}
              fill
              sizes="(max-width: 560px) 100vw, 33vw"
              className="object-cover opacity-80 transition-all duration-[900ms] ease-premium group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
              <span className="max-w-[80%] font-mono text-[9px] font-medium uppercase leading-relaxed tracking-[0.24em] text-white/[0.92] sm:text-[10px]">
                {lang === 'uz' ? c.uz : c.ru}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all duration-500 ease-premium group-hover:rotate-45 group-hover:border-white/50">
                <ArrowUpRight size={16} strokeWidth={1.6} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
