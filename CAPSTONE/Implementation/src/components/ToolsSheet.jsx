import React from 'react';
import { X, Signal, ShieldCheck, BrainCircuit, Wrench, Settings, Sparkles, ChevronRight } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function ToolsSheet({ isOpen, onClose, onSelectScreen, onOpenHardwareTest }) {
  const haptic = useHaptic();

  if (!isOpen) return null;

  const tools = [
    {
      id: 'network',
      title: '5G Radar & Latency Diagnostic',
      desc: 'Ping RTT, jitter, cellular packet radar & DNS flush',
      icon: Signal,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      badge: 'Real-Time'
    },
    {
      id: 'security',
      title: 'Privacy Sentinel & Permissions',
      desc: 'Camera, mic, GPS background leak auditor & anti-malware',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      badge: 'Shield'
    },
    {
      id: 'ai_lab',
      title: 'Neural Network Simulator & Weights',
      desc: 'Interactive telemetry sliders & Softmax class inspector',
      icon: BrainCircuit,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      badge: 'TensorFlow'
    },
    {
      id: 'hardware_test',
      title: 'Hardware Diagnostics Suite',
      desc: 'Touch panel digitizer, speaker tone, haptic test',
      icon: Wrench,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      isAction: true
    },
    {
      id: 'settings',
      title: 'System Settings & JSON Export',
      desc: 'Daily auto-care, replay boot splash, diagnostic export',
      icon: Settings,
      color: 'text-slate-300 bg-slate-800 border-slate-700',
      badge: 'v2.4'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto bg-device-surface border-t border-device-border rounded-t-3xl p-5 shadow-2xl safe-bottom max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-device-border/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Advanced Utilities</h3>
              <p className="text-[11px] text-slate-400">Deep Device Hardware & Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => {
                  haptic.light();
                  onClose();
                  if (tool.isAction) {
                    onOpenHardwareTest();
                  } else {
                    onSelectScreen(tool.id);
                  }
                }}
                className="p-3 rounded-2xl bg-device-card border border-device-border/60 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer active:scale-[0.98] transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${tool.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{tool.title}</h4>
                      {tool.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{tool.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
