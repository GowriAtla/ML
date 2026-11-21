import React, { useState } from 'react';
import { Flame, Snowflake, ShieldAlert, Cpu, Activity, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function ThermalChamberScreen({ telemetry, updateFeature }) {
  const haptic = useHaptic();
  const [isCooling, setIsCooling] = useState(false);
  const [cooled, setCooled] = useState(false);

  // Chassis zone temperatures computed realistically from core temp
  const socTemp = (telemetry.temp + (telemetry.cpu > 60 ? 4.5 : 2.1)).toFixed(1);
  const modemTemp = (telemetry.temp + 1.2).toFixed(1);
  const displayTemp = (telemetry.temp - 1.8).toFixed(1);

  const handleCryoCool = () => {
    haptic.medium();
    setIsCooling(true);
    setTimeout(() => {
      // Lower temperatures and CPU
      updateFeature('temp', Math.max(27.0, telemetry.temp - 3.5));
      updateFeature('cpu', Math.max(14, Math.round(telemetry.cpu * 0.5)));
      setIsCooling(false);
      setCooled(true);
      haptic.success();
    }, 1800);
  };

  const getHeatColor = (t) => {
    const val = parseFloat(t);
    if (val >= 43) return 'text-rose-500 fill-rose-500/30 stroke-rose-500';
    if (val >= 38) return 'text-amber-400 fill-amber-400/25 stroke-amber-400';
    return 'text-cyan-400 fill-cyan-400/20 stroke-cyan-400';
  };

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Thermal Chamber Hero */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Thermal Dissipation & GPU Throttle
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            telemetry.temp > 40
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          }`}>
            {telemetry.temp > 40 ? 'Thermal Warning' : 'Safe Comfort Zone'}
          </span>
        </div>

        {/* Chassis Heatmap Graphic */}
        <div className="my-5 flex items-center justify-center gap-6">
          {/* Smartphone Outline Heatmap */}
          <div className="relative w-28 h-52 rounded-[28px] border-2 border-slate-700 bg-slate-950 p-2 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Top speaker notch */}
            <div className="w-8 h-1 rounded-full bg-slate-800 mx-auto" />

            {/* Zone 1: SoC / Processor Hotspot */}
            <div className={`p-2 rounded-xl border transition-all duration-500 text-center ${
              parseFloat(socTemp) > 42 ? 'bg-rose-500/25 border-rose-500/50' : 'bg-amber-500/20 border-amber-500/40'
            }`}>
              <span className="text-[8px] font-bold text-slate-300 block">SoC / GPU</span>
              <span className="text-xs font-mono font-bold text-white">{socTemp}°C</span>
            </div>

            {/* Zone 2: Battery Cell Core */}
            <div className={`p-2.5 rounded-xl border transition-all duration-500 text-center ${
              telemetry.temp > 40 ? 'bg-rose-500/20 border-rose-500/40' : 'bg-cyan-500/15 border-cyan-500/30'
            }`}>
              <span className="text-[8px] font-bold text-slate-300 block">Battery Cell</span>
              <span className="text-xs font-mono font-bold text-white">{telemetry.temp}°C</span>
            </div>

            {/* Zone 3: 5G Baseband Modem */}
            <div className="p-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
              <span className="text-[8px] font-bold text-slate-400 block">5G Modem</span>
              <span className="text-[10px] font-mono text-slate-300">{modemTemp}°C</span>
            </div>

            {/* Bottom gesture line */}
            <div className="w-10 h-0.5 rounded-full bg-slate-800 mx-auto" />
          </div>

          {/* Thermal Breakdown List */}
          <div className="flex-1 space-y-2.5 text-xs">
            <div className="p-2.5 rounded-2xl bg-device-card border border-device-border/60">
              <span className="text-[10px] text-slate-400 block">CPU Peak Frequency</span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {(2.84 * (telemetry.cpu / 100) + 0.8).toFixed(2)} GHz
              </span>
              <span className="text-[9px] text-slate-500 block">Kryo Prime Core</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-device-card border border-device-border/60">
              <span className="text-[10px] text-slate-400 block">GPU Frame Governor</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {telemetry.temp > 42 ? 'Throttled 60 FPS' : 'Max 120 Hz Dynamic'}
              </span>
              <span className="text-[9px] text-slate-500 block">Adreno AI Pipeline</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-device-card border border-device-border/60">
              <span className="text-[10px] text-slate-400 block">Thermal Headroom</span>
              <span className="text-sm font-bold font-mono text-white">
                {(45.0 - telemetry.temp).toFixed(1)}°C margin
              </span>
              <span className="text-[9px] text-slate-500 block">Until thermal cutoff</span>
            </div>
          </div>
        </div>

        {/* AI Cryo-Cooling Action Button */}
        <button
          onClick={handleCryoCool}
          disabled={isCooling}
          className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          {isCooling ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Calibrating Thermal Dissipation Cycle...</span>
            </>
          ) : (
            <>
              <Snowflake className="w-4 h-4" />
              <span>Engage AI Cryo-Cooling (Drop ~3.5°C)</span>
            </>
          )}
        </button>

        {cooled && (
          <div className="mt-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 text-xs text-cyan-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Thermal dissipation cycle complete. SoC cooled down!</span>
          </div>
        )}
      </div>

      {/* Thermal Safety Guidelines */}
      <div className="p-4 rounded-3xl bg-device-surface border border-device-border space-y-2 text-xs">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Thermal Protection Rules
        </h4>
        <div className="space-y-1.5 text-[11px] text-slate-400">
          <p>• Operating temperatures above 42°C trigger aggressive CPU thermal throttling to protect lithium battery chemistry.</p>
          <p>• Avoid charging while running high-load 3D games or 4K video recording in direct sunlight.</p>
        </div>
      </div>
    </div>
  );
}
