import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHaptic } from '../hooks/useHaptic';

export default function OptimizeModal({ isOpen, onClose, onOptimizeComplete }) {
  const [step, setStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const haptic = useHaptic();

  const steps = [
    { title: 'Auditing Active Background Tasks', sub: 'Terminating 9 non-essential wake-locks' },
    { title: 'Freeing Memory Buffers', sub: 'Reclaimed 1.8 GB RAM from stale caches' },
    { title: 'Purging Junk & Cache Fragments', sub: 'Purged 1.42 GB temporary log artifacts' },
    { title: 'Calibrating Thermal & AI Model', sub: 'Device health elevated to Optimal' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setIsFinished(false);
      return;
    }

    // Step sequence
    const t1 = setTimeout(() => {
      setStep(1);
      haptic.light();
    }, 600);

    const t2 = setTimeout(() => {
      setStep(2);
      haptic.light();
    }, 1200);

    const t3 = setTimeout(() => {
      setStep(3);
      haptic.light();
    }, 1800);

    const t4 = setTimeout(() => {
      setIsFinished(true);
      haptic.success();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      if (onOptimizeComplete) onOptimizeComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-device-surface border border-device-border p-6 shadow-2xl overflow-hidden">
        {/* Close Button when finished */}
        {isFinished && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Animated Hero Icon */}
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full ${isFinished ? 'bg-emerald-500/20' : 'bg-cyan-500/20'} animate-ping opacity-75`} />
            <div className={`relative w-16 h-16 rounded-2xl ${isFinished ? 'bg-gradient-to-tr from-emerald-500 to-teal-500' : 'bg-gradient-to-tr from-cyan-500 to-indigo-600'} flex items-center justify-center shadow-lg transition-colors duration-500`}>
              {isFinished ? (
                <CheckCircle2 className="w-8 h-8 text-white animate-bounce" />
              ) : (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white">
            {isFinished ? 'Device Fully Optimized!' : 'Optimizing Device...'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
            {isFinished
              ? 'Memory freed, junk cleared, and thermal thresholds re-balanced.'
              : 'AI Engine is executing performance realignment across all subsystems.'}
          </p>

          {/* Progress Steps List */}
          <div className="w-full mt-6 space-y-3 text-left">
            {steps.map((s, idx) => {
              const isCurrent = step === idx && !isFinished;
              const isDone = step > idx || isFinished;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                    isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-device-card/40'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${isDone ? 'text-slate-200' : isCurrent ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {s.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          {isFinished && (
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition"
            >
              Done (Return to Dashboard)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
