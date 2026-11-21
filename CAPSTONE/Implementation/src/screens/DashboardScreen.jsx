import React from 'react';
import { Battery, HardDrive, Cpu, Flame, Zap, ShieldCheck, Sparkles, ChevronRight, Activity } from 'lucide-react';
import HealthGauge from '../components/HealthGauge';
import MetricCard from '../components/MetricCard';
import { useHaptic } from '../hooks/useHaptic';

export default function DashboardScreen({
  telemetry,
  aiPrediction,
  onOpenOptimize,
  onNavigateTab,
  onOpenAssistant
}) {
  const haptic = useHaptic();

  const getStatusLabel = (status) => {
    switch (status) {
      case 'OPTIMAL': return 'Optimal Condition';
      case 'MODERATE_DRAIN': return 'Moderate Drain';
      case 'THERMAL_THROTTLE': return 'Thermal Throttling';
      case 'CRITICAL_CONGESTION': return 'Needs Deep Clean';
      default: return 'Good';
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto">
      {/* Hero Health Gauge Card */}
      <div className="rounded-3xl bg-device-surface border border-device-border/80 p-5 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Device Health Score
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Protected
          </span>
        </div>

        {/* Circular Gauge */}
        <HealthGauge
          score={aiPrediction.predictedHealthScore}
          status={getStatusLabel(aiPrediction.primaryStatus)}
        />

        {/* One-Tap Optimize Button */}
        <div className="mt-2">
          <button
            onClick={() => {
              haptic.medium();
              onOpenOptimize();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Optimize Now</span>
          </button>
          {telemetry.lastOptimized && (
            <p className="text-[10px] text-center text-slate-500 mt-2">
              Last optimized today at {telemetry.lastOptimized}
            </p>
          )}
        </div>
      </div>

      {/* AI Intelligence Prescriptive Banner */}
      <div
        onClick={() => {
          haptic.light();
          onOpenAssistant();
        }}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-device-card border border-indigo-500/30 flex items-center justify-between cursor-pointer active:scale-[0.99] transition shadow-md"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-indigo-200">AI Diagnostic Insight</h4>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300">
                {aiPrediction.confidence}% Match
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
              {aiPrediction.recommendation}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Battery Card */}
        <MetricCard
          icon={Battery}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          title="Battery"
          subvalue={telemetry.isCharging ? 'Charging' : `${aiPrediction.remainingTime.formatted} left`}
          value={`${telemetry.batteryLevel}%`}
          progress={telemetry.batteryLevel}
          progressColor={telemetry.batteryLevel < 20 ? 'bg-rose-500' : 'bg-emerald-400'}
          badge={telemetry.powerMode}
          badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          onClick={() => onNavigateTab('battery')}
        />

        {/* Memory / RAM Card */}
        <MetricCard
          icon={Cpu}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          title="Memory"
          subvalue={`${telemetry.bgApps} apps in background`}
          value={`${telemetry.ram}%`}
          progress={telemetry.ram}
          progressColor={telemetry.ram > 80 ? 'bg-amber-500' : 'bg-cyan-400'}
          badge={`${((telemetry.totalRamGb * telemetry.ram) / 100).toFixed(1)} / ${telemetry.totalRamGb} GB`}
          badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
          onClick={() => onNavigateTab('memory')}
        />

        {/* Storage Card */}
        <MetricCard
          icon={HardDrive}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          title="Storage"
          subvalue={telemetry.storageJunkMb > 0 ? `${(telemetry.storageJunkMb / 1024).toFixed(1)} GB junk found` : 'Clean'}
          value={`${telemetry.storageUsedPct}%`}
          progress={telemetry.storageUsedPct}
          progressColor="bg-indigo-400"
          badge={`${telemetry.storageFreeGb} GB Free`}
          badgeColor="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
          onClick={() => onNavigateTab('storage')}
        />

        {/* Thermal / Temperature Card */}
        <MetricCard
          icon={Flame}
          iconColor={telemetry.temp > 40 ? 'text-rose-400' : 'text-amber-400'}
          iconBg={telemetry.temp > 40 ? 'bg-rose-500/10' : 'bg-amber-500/10'}
          title="Thermal Core"
          subvalue="Battery & SoC temp"
          value={`${telemetry.temp}°C`}
          progress={Math.min(100, (telemetry.temp / 55) * 100)}
          progressColor={telemetry.temp > 40 ? 'bg-rose-500' : 'bg-amber-400'}
          badge={telemetry.temp > 40 ? 'Warm' : 'Cool'}
          badgeColor={telemetry.temp > 40 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}
          onClick={() => onNavigateTab('ai_lab')}
        />
      </div>

      {/* Security & System Info Status */}
      <div className="p-4 rounded-2xl bg-device-card border border-device-border/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Security & Anti-Malware</h4>
            <p className="text-[11px] text-slate-400">All 48 installed packages verified safe</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          No Threats
        </span>
      </div>
    </div>
  );
}
