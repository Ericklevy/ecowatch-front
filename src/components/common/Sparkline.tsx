import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillGradient?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color = '#38bdf8',
  fillGradient = true,
  className = ''
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Calcula coordenadas dos pontos
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Cria caminho suave (Catmull-Rom ou Bezier)
  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const prev = points[index - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  // Caminho fechado para o gradiente de área
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const lastPoint = points[points.length - 1];
  const gradientId = `sparkline-grad-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {fillGradient && <path d={areaD} fill={`url(#${gradientId})`} />}

      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ponto final em destaque com brilho */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="3"
        fill={color}
        className="animate-pulse"
      />
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="6"
        fill={color}
        opacity="0.25"
      />
    </svg>
  );
};
