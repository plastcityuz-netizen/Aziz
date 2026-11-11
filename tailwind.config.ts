import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#06080C',
        panel: '#0B0F16',
        panel2: '#0E131C',
        line: 'rgba(255,255,255,0.08)',
        brand: {
          blue: '#1E8BC3',
          copper: '#D98E6A',
          sand: '#C9B79C',
        },
        mute: '#8A93A6',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        glow: '0 0 60px rgba(30,139,195,0.35)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(.22,1,.36,1)',
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        'spin-slow': 'spin 9s linear infinite',
        shimmer: 'shimmer 3.2s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2.2s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(0,-18px,0) rotate(-1.1deg)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(52,211,153,0.5)' },
          '50%': { opacity: '0.65', boxShadow: '0 0 0 5px rgba(52,211,153,0.08)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
