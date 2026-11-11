import { ImageResponse } from 'next/og';

export const alt = 'Plast City — Penaplast Zavodi | Sifatli EPS Penaplast';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          backgroundColor: '#06080C',
          backgroundImage:
            'radial-gradient(circle at 82% 18%, rgba(30,139,195,0.42) 0%, rgba(6,8,12,0) 55%), radial-gradient(circle at 8% 92%, rgba(217,142,106,0.3) 0%, rgba(6,8,12,0) 52%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 26,
            letterSpacing: 14,
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: 56, height: 4, background: '#1E8BC3', marginRight: 22, borderRadius: 999 }} />
          Penaplast Zavodi
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          <span>PLAST</span>
          <span style={{ fontWeight: 300, color: '#3FB6EC', marginLeft: 26 }}>CITY</span>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontSize: 32,
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          Sifatli EPS penaplast — qurilish va izolyatsiya uchun
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 46,
            fontSize: 27,
            color: '#8A93A6',
          }}
        >
          <span style={{ color: '#3FB6EC' }}>+998 99 513 22 22</span>
          <span style={{ margin: '0 18px' }}>·</span>
          <span>@penaplast_uz</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
