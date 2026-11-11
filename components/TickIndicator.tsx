'use client';

/** Videodagi tick-slider indikatori: ingichka chiziqchalar + faol raqam */
export default function TickIndicator({
  total,
  index,
  accent,
  ticks = 46,
}: {
  total: number;
  index: number;
  accent: string;
  ticks?: number;
}) {
  const filled = Math.round(((index + 1) / total) * ticks);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-3 sm:gap-5" role="presentation">
      <span className="font-mono text-2xl font-medium tabular-nums text-white sm:text-3xl">
        {pad(index + 1)}
      </span>
      <div className="flex items-center gap-[3px]" aria-hidden="true">
        {Array.from({ length: ticks }).map((_, i) => {
          const active = i < filled;
          return (
            <span
              key={i}
              className="w-[2px] rounded-full transition-all duration-500 ease-premium"
              style={{
                height: i % 6 === 0 ? 18 : 11,
                background: active ? accent : 'rgba(255,255,255,0.13)',
                boxShadow: active && i === filled - 1 ? `0 0 8px ${accent}` : 'none',
                transitionDelay: `${i * 6}ms`,
              }}
            />
          );
        })}
      </div>
      <span className="font-mono text-xs tabular-nums text-white/35 sm:text-sm">{pad(total)}</span>
    </div>
  );
}
