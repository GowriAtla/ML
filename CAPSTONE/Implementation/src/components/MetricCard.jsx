import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function MetricCard({
  icon: Icon,
  iconColor = 'text-cyan-400',
  iconBg = 'bg-cyan-500/10',
  title,
  value,
  subvalue,
  progress = null,
  progressColor = 'bg-cyan-500',
  badge = null,
  badgeColor = 'bg-slate-700 text-slate-300',
  onClick = null
}) {
  const haptic = useHaptic();

  return (
    <div
      onClick={() => {
        if (onClick) {
          haptic.light();
          onClick();
        }
      }}
      className={`p-3.5 rounded-2xl bg-device-card border border-device-border/60 shadow-sm transition-all duration-200 ${
        onClick ? 'active:scale-[0.98] cursor-pointer hover:border-slate-600' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${iconBg} ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-300">{title}</h3>
            {subvalue && <p className="text-[11px] text-slate-400">{subvalue}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {badge}
            </span>
          )}
          {onClick && <ChevronRight className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-lg font-bold text-white font-mono">{value}</span>
      </div>

      {progress !== null && (
        <div className="mt-2.5 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
