import React, { useState } from 'react';
import { BatteryCharging, Battery, Zap, ShieldAlert, Sparkles, Moon, Flame, RefreshCw, Power } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function BatteryScreen({ telemetry, aiPrediction, setPowerMode }) {
  const haptic = useHaptic();
  const [appStates, setAppStates] = useState({
    'Camera & Video Engine': { usage: '18.4%', drain: 'High', sleeping: false },
    'Social Media Feed': { usage: '14.2%', drain: 'Moderate', sleeping: false },
    'Maps & GPS Location': { usage: '9.6%', drain: 'Moderate', sleeping: false },
    'Background Cloud Sync': { usage: '7.1%', drain: 'Low', sleeping: false },
    'Display & System UI': { usage: '28.5%', drain: 'Normal', sleeping: false }
  });

  const toggleSleep = (app) => {
    haptic.light();
    setAppStates(prev => ({
      ...prev,
      [app]: { ...prev[app], sleeping: !prev[app].sleeping }
    }));
  };

  const powerProfiles = [
    { id: 'Normal', label: 'Balanced', desc: 'Standard Android performance profile' },
    { id: 'Saving', label: 'Adaptive Saver', desc: 'Limits CPU to 70% & restricts background data' },
    { id: 'Ultra', label: 'Ultra Saver', desc: 'Monochrome theme, essential apps only' },
    { id: 'Performance', label: 'Performance', desc: 'Zero throttling for gaming & heavy compute' }
  ];

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Battery Status Hero */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Battery & Power Management
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
            {telemetry.isCharging ? '⚡ Fast Charging' : 'Discharging'}
          </span>
        </div>

        <div className="flex items-center justify-between my-5">
          <div>
            <div className="flex items-baseline">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
                {telemetry.batteryLevel}
              </span>
              <span className="text-2xl font-bold text-slate-400 ml-1">%</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Estimated <strong className="text-emerald-400">{aiPrediction.remainingTime.formatted}</strong> remaining
            </p>
          </div>

          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center">
            {telemetry.isCharging ? (
              <BatteryCharging className="w-10 h-10 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-10 h-10 text-emerald-400" />
            )}
            <span className="absolute -bottom-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md">
              {telemetry.powerMode}
            </span>
          </div>
        </div>

        {/* AI Drain Rate Metric Pill */}
        <div className="p-3 rounded-2xl bg-device-card border border-device-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">AI Estimated Drain Rate:</span>
          </div>
          <span className="font-mono font-bold text-white">
            {aiPrediction.predictedDrainRate}% / hour
          </span>
        </div>
      </div>

      {/* Power Mode Selector */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Power Saving Profiles
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {powerProfiles.map((p) => {
            const isSelected = telemetry.powerMode === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  haptic.medium();
                  setPowerMode(p.id);
                }}
                className={`p-3 rounded-2xl text-left border transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border-cyan-500 text-white shadow-md'
                    : 'bg-device-card border-device-border/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{p.label}</h4>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Battery Health & Cycles */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Hardware Cell Health
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-device-card border border-device-border/60">
            <span className="text-[10px] text-slate-400 block mb-1">Max Capacity</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">92%</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Good condition</span>
          </div>
          <div className="p-3 rounded-2xl bg-device-card border border-device-border/60">
            <span className="text-[10px] text-slate-400 block mb-1">Charge Cycles</span>
            <span className="text-sm font-bold text-white font-mono">{telemetry.cycles}</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Under 500 rating</span>
          </div>
          <div className="p-3 rounded-2xl bg-device-card border border-device-border/60">
            <span className="text-[10px] text-slate-400 block mb-1">Core Temp</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{telemetry.temp}°C</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Thermal normal</span>
          </div>
        </div>
      </div>

      {/* App Battery Usage Breakdown */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Consumption by App
          </h3>
          <span className="text-[10px] text-slate-500">Since last full charge</span>
        </div>

        <div className="space-y-2.5">
          {Object.entries(appStates).map(([name, data]) => (
            <div
              key={name}
              className="p-3 rounded-2xl bg-device-card border border-device-border/60 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-semibold text-white">{name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                  <span className="text-slate-400 font-mono font-bold">{data.usage}</span>
                  <span className={`px-1.5 rounded ${data.drain === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
                    {data.drain} Drain
                  </span>
                  {data.sleeping && (
                    <span className="bg-indigo-500/20 text-indigo-300 px-1.5 rounded">
                      Sleeping
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleSleep(name)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition ${
                  data.sleeping
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 active:scale-95'
                }`}
              >
                {data.sleeping ? 'Awake' : 'Put to Sleep'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
