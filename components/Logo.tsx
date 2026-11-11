'use client';

/**
 * PLAST CITY logo — original mark: izometrik EPS plitasi + wordmark.
 * Ranglar brend tokenlaridan (logo mavjud bo'lmagani uchun shu manba hisoblanadi).
 */
export default function Logo({
  compact = false,
  className = '',
  iconClassName = 'h-9 w-9',
}: {
  compact?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={iconClassName}
        role="img"
        aria-label="Plast City logo"
      >
        {/* chap bet */}
        <path d="M6 20.5 32 35.5V50L6 35V20.5Z" fill="#155E86" />
        {/* o'ng bet */}
        <path d="M58 20.5 32 35.5V50l26-15V20.5Z" fill="#0E3D58" />
        {/* yuza (gradient) */}
        <path
          d="M32 4 58 19 32 34 6 19 32 4Z"
          fill="url(#pc-top)"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* EPS donalari */}
        <g fill="rgba(6,24,36,0.5)">
          <circle cx="32" cy="13.4" r="1.5" />
          <circle cx="24.4" cy="18.1" r="1.5" />
          <circle cx="39.6" cy="18.1" r="1.5" />
          <circle cx="17" cy="22.6" r="1.3" />
          <circle cx="32" cy="22.6" r="1.5" />
          <circle cx="47" cy="22.6" r="1.3" />
          <circle cx="25" cy="26.9" r="1.2" />
          <circle cx="39" cy="26.9" r="1.2" />
        </g>
        <defs>
          <linearGradient id="pc-top" x1="6" y1="19" x2="58" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3FB6EC" />
            <stop offset="0.5" stopColor="#1E8BC3" />
            <stop offset="1" stopColor="#155E86" />
          </linearGradient>
        </defs>
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[19px] font-extrabold tracking-[0.08em] text-white">
            PLAST<span className="font-light text-brand-blue"> CITY</span>
          </span>
          <span className="mt-1 font-mono text-[8.5px] font-medium uppercase tracking-[0.42em] text-white/55">
            Penaplast Zavodi
          </span>
        </span>
      )}
    </span>
  );
}
