import React, { useState } from 'react';
import { Settings, Sparkles, Moon, Bell, Shield, Download, RefreshCw, CheckCircle2, RotateCcw, Smartphone } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function SettingsScreen({ telemetry, aiPrediction, onReplaySplash }) {
  const haptic = useHaptic();
  const [autoCare, setAutoCare] = useState(true);
  const [hapticLevel, setHapticLevel] = useState('Crisp');
  const [aiMode, setAiMode] = useState('Neural FP16');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    haptic.medium();
    const diagnosticReport = {
      timestamp: new Date().toISOString(),
      appName: 'Device Care Mobile Performance & Resource Management',
      version: '2.4.0-ai',
      telemetry,
      aiModelInference: aiPrediction,
      clientPlatform: {
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemoryGb: navigator.deviceMemory || 8,
        online: navigator.onLine
      }
    };

    const blob = new Blob([JSON.stringify(diagnosticReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device_care_diagnostic_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    haptic.success();
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Settings Hero */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Advanced System Care</h2>
            <p className="text-[11px] text-slate-400">Configuration & AI Engine Settings</p>
          </div>
        </div>

        {/* Automated Daily Care Toggle */}
        <div className="p-3.5 rounded-2xl bg-device-card border border-device-border/60 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white">Automated Daily Maintenance</h4>
            <p className="text-[10px] text-slate-400">Auto-clean cache & optimize RAM at 3:00 AM</p>
          </div>
          <button
            onClick={() => {
              haptic.light();
              setAutoCare(!autoCare);
            }}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              autoCare ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* AI Engine & Performance Modes */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          AI Inference Precision
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['Neural FP16', 'Deep Multi-Pass'].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                haptic.light();
                setAiMode(mode);
              }}
              className={`p-3 rounded-2xl border text-left transition ${
                aiMode === mode
                  ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                  : 'bg-device-card border-device-border/60 text-slate-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{mode}</span>
                {aiMode === mode && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </div>
              <span className="text-[9px] text-slate-500 block mt-1">
                {mode === 'Neural FP16' ? '< 1.5ms Latency' : 'Maximum Heuristics'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual & Audio Experience */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Experience & Haptics
        </h3>

        {/* Replay Splash Screen Button */}
        <button
          onClick={() => {
            haptic.medium();
            onReplaySplash();
          }}
          className="w-full p-3 rounded-2xl bg-device-card border border-device-border/70 hover:border-cyan-500/50 flex items-center justify-between text-xs text-white active:scale-95 transition"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Replay Futuristic Boot Splash</span>
          </div>
          <RotateCcw className="w-4 h-4 text-slate-400" />
        </button>

        {/* Export Diagnostics File */}
        <button
          onClick={handleExport}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Download className="w-4 h-4" />
          <span>{exported ? 'Report Downloaded!' : 'Export Device Diagnostic JSON'}</span>
        </button>
      </div>

      {/* App Build Specifications */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-device-border text-center text-slate-500 text-[10px] font-mono space-y-1">
        <p className="text-slate-400 font-bold">Device Care Pro v2.4.0</p>
        <p>Built with React 18, Vite & TensorFlow Keras</p>
        <p>100% On-Device Zero-Cloud Privacy Verified</p>
      </div>
    </div>
  );
}
