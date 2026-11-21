import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, Eye, Mic, MapPin, RefreshCw, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function SecurityAuditorScreen() {
  const haptic = useHaptic();
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [revoked, setRevoked] = useState(false);

  const [permissions, setPermissions] = useState([
    { name: 'Camera Access', icon: Eye, activeApps: 0, status: 'Secured', risk: 'Safe' },
    { name: 'Microphone Sentinel', icon: Mic, activeApps: 0, status: 'Secured', risk: 'Safe' },
    { name: 'Background Location', icon: MapPin, activeApps: 2, status: 'Maps, Weather', risk: 'Monitored' },
    { name: 'Clipboard Monitor', icon: Key, activeApps: 0, status: 'No leaks', risk: 'Safe' }
  ]);

  const handleScan = () => {
    haptic.medium();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanDone(true);
      haptic.success();
    }, 2000);
  };

  const handleRevoke = () => {
    haptic.medium();
    setRevoked(true);
    setPermissions(prev => prev.map(p => ({ ...p, activeApps: 0, status: 'Secured', risk: 'Safe' })));
    haptic.success();
  };

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Privacy Shield Hero */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Privacy Sentinel & Anti-Malware
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Shield Active
          </span>
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-9 h-9 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">System Security: Optimal</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kernel integrity verified, sandbox enforced, 0 malicious APKs detected.
            </p>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Scanning 48 Application Packages...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Run Deep Heuristic Security Audit</span>
            </>
          )}
        </button>

        {scanDone && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Deep audit passed! 0 threats, 0 spyware vulnerabilities.</span>
          </div>
        )}
      </div>

      {/* Hardware Permission Sentinel */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Hardware Permission Sentinel
          </h3>
          <button
            onClick={handleRevoke}
            disabled={revoked}
            className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300"
          >
            {revoked ? 'All Revoked' : 'Revoke Idle'}
          </button>
        </div>

        <div className="space-y-2.5">
          {permissions.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-device-card border border-device-border/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                    <p className="text-[10px] text-slate-400">{p.status}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.risk === 'Safe' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {p.risk}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Engine Audit Details */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4 text-xs space-y-2">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Active Security Defenses
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-device-card border border-device-border/60">
            <span className="text-slate-400 block text-[10px]">Google Play Protect</span>
            <span className="text-emerald-400 font-bold">Certified Safe</span>
          </div>
          <div className="p-2.5 rounded-xl bg-device-card border border-device-border/60">
            <span className="text-slate-400 block text-[10px]">OS Patch Level</span>
            <span className="text-white font-bold font-mono">Current Build</span>
          </div>
        </div>
      </div>
    </div>
  );
}
