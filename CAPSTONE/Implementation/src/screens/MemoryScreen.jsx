import React, { useState } from 'react';
import { Cpu, Zap, RefreshCw, CheckCircle2, Shield, XCircle, Activity } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function MemoryScreen({ telemetry, boostRam }) {
  const haptic = useHaptic();
  const [isBoosting, setIsBoosting] = useState(false);
  const [boosted, setBoosted] = useState(false);

  const [processes, setProcesses] = useState([
    { id: 1, name: 'Web Browser Engine', ramMb: 680, cpuPct: '8.4%', category: 'Browser' },
    { id: 2, name: 'Social Media Feed & Video', ramMb: 520, cpuPct: '5.2%', category: 'Social' },
    { id: 3, name: 'Background Location Service', ramMb: 240, cpuPct: '3.1%', category: 'System' },
    { id: 4, name: 'Cloud Photos Auto-Upload', ramMb: 310, cpuPct: '4.0%', category: 'Sync' },
    { id: 5, name: 'Music & Podcast Streamer', ramMb: 190, cpuPct: '1.8%', category: 'Media' }
  ]);

  const handleBoost = () => {
    haptic.medium();
    setIsBoosting(true);
    setTimeout(() => {
      boostRam();
      setIsBoosting(false);
      setBoosted(true);
      // Remove killed tasks
      setProcesses(prev => prev.slice(2));
      haptic.success();
    }, 1200);
  };

  const killProcess = (id) => {
    haptic.light();
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  const usedGb = ((telemetry.totalRamGb * telemetry.ram) / 100).toFixed(1);
  const freeGb = (telemetry.totalRamGb - parseFloat(usedGb)).toFixed(1);

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Memory Hero Gauge */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Random Access Memory (RAM)
          </span>
          <span className="text-xs font-semibold text-cyan-400">
            {telemetry.totalRamGb} GB LPDDR5
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-4 mb-2">
          <div>
            <span className="text-4xl font-extrabold text-white font-mono">
              {usedGb}
            </span>
            <span className="text-xl font-bold text-slate-400 ml-1">/ {telemetry.totalRamGb} GB</span>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {telemetry.ram}% Used
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              telemetry.ram > 80 ? 'bg-amber-400' : 'bg-cyan-400'
            }`}
            style={{ width: `${telemetry.ram}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
          <span>Available: <strong className="text-white">{freeGb} GB</strong></span>
          <span>Background Apps: <strong className="text-cyan-400">{telemetry.bgApps}</strong></span>
        </div>

        {/* Boost Button */}
        <button
          onClick={handleBoost}
          disabled={isBoosting}
          className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          {isBoosting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Flushing Memory Pages...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Boost Memory (Free ~1.2 GB)</span>
            </>
          )}
        </button>

        {boosted && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>RAM optimized! Background wake-locks terminated.</span>
          </div>
        )}
      </div>

      {/* Active Running Apps */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Background Processes ({processes.length})
          </h3>
          <span className="text-[10px] text-slate-400">Sorted by memory</span>
        </div>

        <div className="space-y-2.5">
          {processes.map((proc) => (
            <div
              key={proc.id}
              className="p-3 rounded-2xl bg-device-card border border-device-border/60 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-semibold text-white">{proc.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                  <span className="font-mono text-cyan-400 font-bold">{proc.ramMb} MB</span>
                  <span>CPU: {proc.cpuPct}</span>
                  <span className="px-1.5 rounded bg-slate-700 text-slate-300">{proc.category}</span>
                </div>
              </div>

              <button
                onClick={() => killProcess(proc.id)}
                title="End Task"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}

          {processes.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              All non-essential background processes have been terminated!
            </p>
          )}
        </div>
      </div>

      {/* Real Hardware CPU Cores */}
      <div className="p-4 rounded-2xl bg-device-card border border-device-border/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Octa-Core CPU Scheduler</h4>
            <p className="text-[11px] text-slate-400">{telemetry.cpuCores} hardware cores active</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400">
          {telemetry.cpu}% Load
        </span>
      </div>
    </div>
  );
}
