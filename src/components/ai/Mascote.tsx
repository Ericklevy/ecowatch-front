import React from 'react';

/**
 * "Gota", o mascote do EcoWatch: uma gotinha d'água original desenhada em SVG,
 * com uma folhinha (natureza) e olhos que piscam. Cores do tema (hydro/nominal).
 */
export const Mascote: React.FC<{ size?: number; pensando?: boolean; className?: string }> = ({
  size = 56,
  pensando = false,
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    role="img"
    aria-label="Gota, a assistente do EcoWatch"
  >
    <defs>
      <linearGradient id="gota-corpo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
      <radialGradient id="gota-brilho" cx="0.35" cy="0.3" r="0.5">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* sombra */}
    <ellipse cx="32" cy="60" rx="13" ry="2.5" fill="#000" opacity="0.25" className="gota-sombra" />

    {/* corpo da gota */}
    <path
      d="M32 4 C32 4 12 27 12 40 C12 51.6 21 58 32 58 C43 58 52 51.6 52 40 C52 27 32 4 32 4 Z"
      fill="url(#gota-corpo)"
      stroke="#0891b2"
      strokeWidth="1.5"
    />
    <ellipse cx="24" cy="30" rx="7" ry="10" fill="url(#gota-brilho)" />

    {/* folhinha no topo */}
    <path d="M33 9 C38 3 45 3 47 4 C46 9 41 13 34 12 Z" fill="#34d399" stroke="#059669" strokeWidth="1" />
    <path d="M34 11.5 C38 8.5 42 6.5 46 4.8" stroke="#059669" strokeWidth="0.8" fill="none" />

    {/* olhos (piscam com a classe gota-olho) */}
    <g className="gota-olho">
      <ellipse cx="25" cy="39" rx="3.2" ry={pensando ? 1.2 : 4} fill="#0f172a" />
      <ellipse cx="39" cy="39" rx="3.2" ry={pensando ? 1.2 : 4} fill="#0f172a" />
      {!pensando && (
        <>
          <circle cx="26.2" cy="37.4" r="1.2" fill="#fff" />
          <circle cx="40.2" cy="37.4" r="1.2" fill="#fff" />
        </>
      )}
    </g>

    {/* bochechas e sorriso */}
    <circle cx="19.5" cy="45" r="2.6" fill="#f472b6" opacity="0.45" />
    <circle cx="44.5" cy="45" r="2.6" fill="#f472b6" opacity="0.45" />
    {pensando ? (
      <circle cx="32" cy="48" r="1.8" fill="#0f172a" />
    ) : (
      <path d="M27 46.5 Q32 51 37 46.5" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
    )}
  </svg>
);
