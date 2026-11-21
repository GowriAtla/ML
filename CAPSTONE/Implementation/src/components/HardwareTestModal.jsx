import React, { useState } from 'react';
import { X, CheckCircle, Volume2, Smartphone, Vibrate, Eye, Activity, RotateCcw } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function HardwareTestModal({ isOpen, onClose, telemetry }) {
  const [activeTest, setActiveTest] = useState('menu'); // 'menu', 'touch', 'speaker', 'color'
  const [touchGrid, setTouchGrid] = useState(new Array(16).fill(false));
  const [colorIndex, setColorIndex] = useState(0);
  const haptic = useHaptic();

  const colors = ['#ef4444', '#22c55e', '#3b82f6', '#ffffff', '#000000'];

  // Play audio frequency for speaker test
  const playTone = (freq = 440) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio test error:', e);
    }
  };

  if (!isOpen) return null;

  // Touch Screen Grid Test View
  if (activeTest === 'touch') {
    const allTouched = touchGrid.every(Boolean);

    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col p-4">
        <div className="flex items-center justify-between py-2 text-white">
          <span className="text-xs font-semibold">Touch Screen Digitizer Test: Tap all tiles</span>
          <button
            onClick={() => {
              setActiveTest('menu');
              setTouchGrid(new Array(16).fill(false));
            }}
            className="p-1 rounded-full bg-slate-800 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2 my-2">
          {touchGrid.map((touched, idx) => (
            <div
              key={idx}
              onTouchStart={() => {
                haptic.light();
                setTouchGrid(prev => {
                  const copy = [...prev];
                  copy[idx] = true;
                  return copy;
                });
              }}
              onClick={() => {
                haptic.light();
                setTouchGrid(prev => {
                  const copy = [...prev];
                  copy[idx] = true;
                  return copy;
                });
              }}
              className={`rounded-xl border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                touched
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              {touched ? <CheckCircle className="w-5 h-5" /> : idx + 1}
            </div>
          ))}
        </div>

        {allTouched && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center text-emerald-300 text-xs font-bold mb-2">
            Touch Panel Passed 100% Responsiveness!
          </div>
        )}

        <button
          onClick={() => {
            setActiveTest('menu');
            setTouchGrid(new Array(16).fill(false));
          }}
          className="w-full py-3 rounded-xl bg-slate-800 text-white text-xs font-bold"
        >
          Exit Touch Test
        </button>
      </div>
    );
  }

  // Full Screen Pixel Color Test View
  if (activeTest === 'color') {
    return (
      <div
        onClick={() => {
          if (colorIndex < colors.length - 1) {
            setColorIndex(colorIndex + 1);
          } else {
            setActiveTest('menu');
            setColorIndex(0);
          }
        }}
        style={{ backgroundColor: colors[colorIndex] }}
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none"
      >
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md">
          Color {colorIndex + 1}/{colors.length} - Tap screen for next color
        </span>
      </div>
    );
  }

  // Main Hardware Diagnostics Menu
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-device-surface border border-device-border p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-device-border/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Hardware Diagnostics</h3>
              <p className="text-[11px] text-slate-400">Sensor & Component Checks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Touch Screen Test */}
          <div className="p-3 rounded-2xl bg-device-card border border-device-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Multi-Touch Digitizer</h4>
                <p className="text-[10px] text-slate-400">Test responsiveness across screen</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTest('touch')}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 active:scale-95 transition"
            >
              Start
            </button>
          </div>

          {/* Speaker Sound Test */}
          <div className="p-3 rounded-2xl bg-device-card border border-device-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Stereo Speaker Tone</h4>
                <p className="text-[10px] text-slate-400">Play acoustic test frequency</p>
              </div>
            </div>
            <button
              onClick={() => {
                haptic.medium();
                playTone(520);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 active:scale-95 transition"
            >
              Play Tone
            </button>
          </div>

          {/* Vibration Motor Test */}
          <div className="p-3 rounded-2xl bg-device-card border border-device-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Vibrate className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Haptic Motor</h4>
                <p className="text-[10px] text-slate-400">Trigger tactile vibration pulse</p>
              </div>
            </div>
            <button
              onClick={() => {
                haptic.warning();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 active:scale-95 transition"
            >
              Vibrate
            </button>
          </div>

          {/* Display & Dead Pixels Test */}
          <div className="p-3 rounded-2xl bg-device-card border border-device-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Screen Pixel Quality</h4>
                <p className="text-[10px] text-slate-400">Inspect full-screen color gamut</p>
              </div>
            </div>
            <button
              onClick={() => {
                setColorIndex(0);
                setActiveTest('color');
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 active:scale-95 transition"
            >
              Inspect
            </button>
          </div>

          {/* Real Live Hardware Specifications */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-device-border/60">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">Live Sensor Feed</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-device-surface">
                <span className="text-slate-400 block text-[10px]">CPU Cores</span>
                <span className="text-white font-mono font-semibold">{telemetry.cpuCores} Cores Detected</span>
              </div>
              <div className="p-2 rounded-lg bg-device-surface">
                <span className="text-slate-400 block text-[10px]">Device RAM Approx</span>
                <span className="text-white font-mono font-semibold">{telemetry.totalRamGb} GB Physical</span>
              </div>
              <div className="p-2 rounded-lg bg-device-surface">
                <span className="text-slate-400 block text-[10px]">Battery Core Temp</span>
                <span className="text-white font-mono font-semibold">{telemetry.temp}°C Thermal</span>
              </div>
              <div className="p-2 rounded-lg bg-device-surface">
                <span className="text-slate-400 block text-[10px]">Network Carrier</span>
                <span className="text-white font-mono font-semibold">{telemetry.networkType}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-2xl bg-device-card hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-device-border transition"
        >
          Close Diagnostics
        </button>
      </div>
    </div>
  );
}
