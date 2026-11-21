import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Sliders, CheckCircle2, AlertTriangle, Flame, RotateCcw, Activity } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function AIDiagnosticsScreen({ telemetry, aiPrediction, updateFeature }) {
  const haptic = useHaptic();
  const [showSliders, setShowSliders] = useState(false);

  const { classProbabilities, primaryStatus, confidence, predictedDrainRate, bottlenecks, metadata } = aiPrediction;

  const classColors = {
    OPTIMAL: 'bg-emerald-400',
    MODERATE_DRAIN: 'bg-amber-400',
    THERMAL_THROTTLE: 'bg-rose-500',
    CRITICAL_CONGESTION: 'bg-purple-500'
  };

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* AI Hero Banner */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">On-Device AI Model</h2>
              <p className="text-[10px] text-slate-400">Deep Neural Network v1.0</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {metadata?.evaluation?.test_classification_accuracy_pct}% Accuracy
          </span>
        </div>

        {/* Primary Classification Result */}
        <div className="my-4 p-4 rounded-2xl bg-device-card border border-device-border/80">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Predicted Health State:</span>
            <span className="text-[10px] font-semibold text-slate-500">
              {confidence}% Confidence
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className={`w-3 h-3 rounded-full ${classColors[primaryStatus] || 'bg-cyan-400'} animate-pulse`} />
            <span className="text-lg font-bold text-white tracking-tight font-mono">
              {primaryStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-device-border/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Estimated Battery Drop:</span>
            <span className="font-mono font-bold text-cyan-400">
              {predictedDrainRate}% / hour
            </span>
          </div>
        </div>

        {/* Softmax Probabilities Breakdown */}
        <div className="space-y-2 mt-4">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Softmax Class Probabilities
          </h4>
          {Object.entries(classProbabilities).map(([cls, prob]) => (
            <div key={cls} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-mono text-[10px]">{cls.replace('_', ' ')}</span>
                <span className="font-mono font-bold text-slate-400">{prob}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${classColors[cls] || 'bg-cyan-400'}`}
                  style={{ width: `${prob}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Telemetry Playground */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Telemetry Simulator
            </h3>
          </div>
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="text-xs text-cyan-400 font-semibold"
          >
            {showSliders ? 'Collapse' : 'Test Model'}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mb-3">
          Simulate different hardware load scenarios to observe live inference response:
        </p>

        {showSliders && (
          <div className="space-y-4 pt-2 border-t border-device-border/60">
            {/* CPU Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">CPU Load</span>
                <span className="font-mono font-bold text-cyan-400">{telemetry.cpu}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="99"
                value={telemetry.cpu}
                onChange={(e) => {
                  haptic.light();
                  updateFeature('cpu', parseInt(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* RAM Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">RAM Pressure</span>
                <span className="font-mono font-bold text-cyan-400">{telemetry.ram}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="98"
                value={telemetry.ram}
                onChange={(e) => {
                  haptic.light();
                  updateFeature('ram', parseInt(e.target.value));
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Battery Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Battery Temp</span>
                <span className={`font-mono font-bold ${telemetry.temp > 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {telemetry.temp}°C
                </span>
              </div>
              <input
                type="range"
                min="22"
                max="52"
                step="0.5"
                value={telemetry.temp}
                onChange={(e) => {
                  haptic.light();
                  updateFeature('temp', parseFloat(e.target.value));
                }}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Background Apps Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Background Processes</span>
                <span className="font-mono font-bold text-indigo-400">{telemetry.bgApps} Apps</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={telemetry.bgApps}
                onChange={(e) => {
                  haptic.light();
                  updateFeature('bgApps', parseInt(e.target.value));
                }}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Model Architecture Specifications */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          Neural Architecture & Weights
        </h3>
        <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
          <div className="p-2 rounded-xl bg-device-card flex justify-between">
            <span>Input Dimensions:</span>
            <span className="text-cyan-400 font-bold">8 Features</span>
          </div>
          <div className="p-2 rounded-xl bg-device-card flex justify-between">
            <span>Hidden Layers:</span>
            <span className="text-white font-bold">Dense(64) + Dense(32)</span>
          </div>
          <div className="p-2 rounded-xl bg-device-card flex justify-between">
            <span>Output Heads:</span>
            <span className="text-white font-bold">Softmax(4) + Linear(2)</span>
          </div>
          <div className="p-2 rounded-xl bg-device-card flex justify-between">
            <span>Training Framework:</span>
            <span className="text-emerald-400 font-bold">TensorFlow / Keras</span>
          </div>
          <div className="p-2 rounded-xl bg-device-card flex justify-between">
            <span>Inference Latency:</span>
            <span className="text-indigo-400 font-bold">&lt; 1.5ms (On-Device)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
