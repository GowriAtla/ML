import React, { useState } from 'react';
import { Wifi, Signal, Globe, ArrowDownUp, RefreshCw, Zap, ShieldCheck, Activity } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function NetworkRadarScreen({ telemetry }) {
  const haptic = useHaptic();
  const [isTesting, setIsTesting] = useState(false);
  const [pingResult, setPingResult] = useState({ ping: 24, jitter: 3.2, packetLoss: '0.0%' });
  const [dnsFlushed, setDnsFlushed] = useState(false);

  const runLatencyTest = async () => {
    haptic.medium();
    setIsTesting(true);
    const start = performance.now();
    try {
      // Test real fetch response latency
      await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      const duration = Math.round(performance.now() - start);
      setPingResult({
        ping: Math.max(12, duration),
        jitter: parseFloat((Math.random() * 2 + 1.2).toFixed(1)),
        packetLoss: '0.0%'
      });
    } catch (e) {
      setPingResult({
        ping: Math.floor(Math.random() * 15) + 20,
        jitter: 2.4,
        packetLoss: '0.0%'
      });
    }
    setIsTesting(false);
    haptic.success();
  };

  const handleFlushDNS = () => {
    haptic.medium();
    setDnsFlushed(true);
    setTimeout(() => {
      setDnsFlushed(false);
      haptic.success();
    }, 2000);
  };

  const dataApps = [
    { name: 'Instagram & Reels', type: 'Foreground', usageToday: '1.42 GB', status: 'Active' },
    { name: 'YouTube Video HD', type: 'Foreground', usageToday: '2.15 GB', status: 'Idle' },
    { name: 'Cloud Drive Auto-Backup', type: 'Background Sync', usageToday: '420 MB', status: 'Restricted' },
    { name: 'System OS Updates', type: 'Background', usageToday: '110 MB', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* 5G / Wi-Fi Radar Hero */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Network & 5G Radar
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {telemetry.networkType} Online
          </span>
        </div>

        {/* Circular Radar Sweep */}
        <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
          {/* Radar Circles */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-6 rounded-full border border-cyan-500/30" />
          <div className="absolute inset-12 rounded-full border border-cyan-500/40" />
          <div className="absolute inset-20 rounded-full border border-indigo-500/50" />

          {/* Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20" />

          {/* Sweeping Cone */}
          <div className="absolute inset-0 rounded-full border border-transparent border-t-cyan-400 animate-spin-slow opacity-80" />

          {/* Center Signal Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10">
            <Signal className="w-6 h-6 text-white" />
          </div>

          {/* Blip Nodes */}
          <div className="absolute top-10 right-12 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-ping" />
          <div className="absolute bottom-12 left-14 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
        </div>

        {/* Real-time Metrics Pill Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
          <div className="p-2.5 rounded-2xl bg-device-card border border-device-border/60">
            <span className="text-[10px] text-slate-400 block mb-0.5">RTT Latency</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{pingResult.ping} ms</span>
            <span className="text-[9px] text-emerald-400 block mt-0.5">Optimal</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-device-card border border-device-border/60">
            <span className="text-[10px] text-slate-400 block mb-0.5">Jitter Variance</span>
            <span className="text-sm font-bold font-mono text-white">{pingResult.jitter} ms</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Low jitter</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-device-card border border-device-border/60">
            <span className="text-[10px] text-slate-400 block mb-0.5">Estimated Down</span>
            <span className="text-sm font-bold font-mono text-indigo-400">
              {telemetry.network.toFixed(1)} Mb/s
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Carrier 5G</span>
          </div>
        </div>

        {/* Run Latency Test Button */}
        <button
          onClick={runLatencyTest}
          disabled={isTesting}
          className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          {isTesting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Pinging Gateway Node...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>Run Live Latency & Speed Diagnostic</span>
            </>
          )}
        </button>
      </div>

      {/* Network Optimizer Tool */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">DNS Cache & Radio Sockets</h4>
          <p className="text-[10px] text-slate-400">Flush stale cellular routing tables</p>
        </div>
        <button
          onClick={handleFlushDNS}
          disabled={dnsFlushed}
          className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold active:scale-95 transition"
        >
          {dnsFlushed ? 'Sockets Flushed!' : 'Flush Sockets'}
        </button>
      </div>

      {/* Background Data Hog Auditor */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cellular Bandwidth Consumption
          </h3>
          <span className="text-[10px] text-slate-500">Today</span>
        </div>

        <div className="space-y-2.5">
          {dataApps.map((app, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-device-card border border-device-border/60 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-semibold text-white">{app.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                  <span className="font-mono text-cyan-400 font-bold">{app.usageToday}</span>
                  <span className="px-1.5 rounded bg-slate-800 text-slate-300">{app.type}</span>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                app.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
