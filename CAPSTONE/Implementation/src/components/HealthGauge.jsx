import React from 'react';

export default function HealthGauge({ score, status, isOptimizing }) {
  // SVG circular calculation
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score clamped between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColorInfo = (s) => {
    if (s >= 85) {
      return {
        stroke: 'url(#gradient-success)',
        glow: 'shadow-emerald-500/20 text-emerald-400',
        badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        label: 'Great'
      };
    }
    if (s >= 65) {
      return {
        stroke: 'url(#gradient-warning)',
        glow: 'shadow-amber-500/20 text-amber-400',
        badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        label: 'Good'
      };
    }
    return {
      stroke: 'url(#gradient-danger)',
      glow: 'shadow-rose-500/20 text-rose-400',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      label: 'Needs Care'
    };
  };

  const colorInfo = getColorInfo(clampedScore);

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      <div className="relative w-[210px] h-[210px] flex items-center justify-center">
        {/* Ambient background glow */}
        <div className={`absolute w-36 h-36 rounded-full blur-2xl opacity-25 ${colorInfo.glow}`} />

        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34d399" />
              <stop offset="100%" stop-color="#06b6d4" />
            </linearGradient>
            <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#f97316" />
            </linearGradient>
            <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f43f5e" />
              <stop offset="100%" stop-color="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1b253b"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Animated score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorInfo.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Counter and Status */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-extrabold tracking-tight text-white font-mono">
              {isOptimizing ? '--' : clampedScore}
            </span>
            <span className="text-lg font-bold text-slate-400 ml-0.5">/100</span>
          </div>

          <div className={`mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colorInfo.badge}`}>
            {status || colorInfo.label}
          </div>
        </div>
      </div>
    </div>
  );
}
