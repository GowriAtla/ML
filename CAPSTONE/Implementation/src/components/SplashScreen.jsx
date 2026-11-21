import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Cpu, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function SplashScreen({ onComplete }) {
  const [bootStep, setBootStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const haptic = useHaptic();

  const bootMessages = [
    { label: 'INITIALIZING HARDWARE SENSOR MESH...', icon: Cpu },
    { label: 'LOADING TENSORFLOW AI NEURAL WEIGHTS...', icon: Sparkles },
    { label: 'CALIBRATING OCTA-CORE CPU TOPOLOGY...', icon: Activity },
    { label: 'ANALYZING STORAGE WEAR & RAM PARTITIONS...', icon: Zap },
    { label: 'DEVICE CARE KERNEL: ACTIVE & OPTIMAL', icon: ShieldCheck }
  ];

  useEffect(() => {
    // Play initial subtle haptic
    haptic.medium();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setBootStep(0);
    else if (progress < 50) setBootStep(1);
    else if (progress < 75) setBootStep(2);
    else if (progress < 95) setBootStep(3);
    else setBootStep(4);

    if (progress >= 100) {
      haptic.success();
      const timer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const CurrentIcon = bootMessages[bootStep].icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* Top Header Label */}
      <div className="relative pt-8 flex flex-col items-center">
        <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/80 px-3 py-1 rounded-full">
          AI TELEMETRY SYSTEM v2.4
        </span>
      </div>

      {/* Center Holographic Logo & Animation */}
      <div className="relative flex flex-col items-center my-auto">
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          {/* Rotating Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border border-indigo-500/30 border-b-indigo-400 animate-spin-slow" />
          <div className="absolute inset-4 rounded-full border border-dashed border-slate-700 animate-pulse" />

          {/* Central Logo Box */}
          <div className="w-18 h-18 p-4 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span>Device Care</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 text-white">
            PRO
          </span>
        </h1>
        <p className="text-xs text-slate-400 tracking-wide mt-1">
          Neural Hardware & Resource Intelligence
        </p>
      </div>

      {/* Bottom Boot Log & Progress Bar */}
      <div className="relative w-full max-w-xs pb-6">
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <CurrentIcon className="w-3.5 h-3.5 animate-pulse" />
            <span className="truncate max-w-[200px]">{bootMessages[bootStep].label}</span>
          </div>
          <span className="font-bold text-white">{progress}%</span>
        </div>

        {/* Cyber Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 transition-all duration-150 ease-out shadow-lg shadow-cyan-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-[9px] font-mono text-slate-500">
          <span>ARMv8 / LPDDR5</span>
          <span>ON-DEVICE TENSORFLOW</span>
          <span>SECURE KERNEL</span>
        </div>
      </div>
    </div>
  );
}
