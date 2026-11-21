import React, { useState } from 'react';
import { HardDrive, Trash2, CheckCircle2, FileText, Image, Film, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function StorageScreen({ telemetry, cleanJunkStorage }) {
  const haptic = useHaptic();
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(telemetry.storageJunkMb === 0);

  const handleClean = () => {
    haptic.medium();
    setIsCleaning(true);
    setTimeout(() => {
      cleanJunkStorage();
      setIsCleaning(false);
      setCleaned(true);
      haptic.success();
    }, 1500);
  };

  const junkCategories = [
    { title: 'App Cache Data', size: '820 MB', desc: 'Cached web feeds, image thumbnails, temp API responses' },
    { title: 'Residual App Data', size: '340 MB', desc: 'Leftover configuration files from removed applications' },
    { title: 'System Logs & Crash Dumps', size: '180 MB', desc: 'Outdated diagnostic log records' },
    { title: 'Empty Folders & Temp Files', size: '80 MB', desc: '0-byte directories created by download managers' }
  ];

  return (
    <div className="space-y-4 pb-24 pt-2 px-4 max-w-md mx-auto">
      {/* Storage Hero Overview */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Internal Flash Storage
          </span>
          <span className="text-xs font-semibold text-indigo-400">
            {telemetry.storageTotalGb} GB Total
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-4 mb-2">
          <div>
            <span className="text-4xl font-extrabold text-white font-mono">
              {telemetry.storageFreeGb}
            </span>
            <span className="text-xl font-bold text-slate-400 ml-1">GB Free</span>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            {telemetry.storageUsedPct}% Used
          </span>
        </div>

        {/* Multi-segmented Storage Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden mt-3 mb-2">
          <div style={{ width: '42%' }} className="bg-indigo-500 h-full" title="Apps" />
          <div style={{ width: '22%' }} className="bg-cyan-500 h-full" title="Media" />
          <div style={{ width: '12%' }} className="bg-purple-500 h-full" title="System" />
          <div style={{ width: `${cleaned ? 0 : 5}%` }} className="bg-rose-500 h-full transition-all duration-500" title="Junk" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-400 mt-3 pt-3 border-t border-device-border/60">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Apps (54G)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Media (28G)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>System (16G)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cleaned ? 'bg-slate-600' : 'bg-rose-500'}`} />
            <span>{cleaned ? 'Clean' : 'Junk (1.4G)'}</span>
          </div>
        </div>
      </div>

      {/* Junk Cleaner Action Card */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl ${cleaned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {cleaned ? 'Junk Files Cleaned' : 'Purge Junk & Temp Cache'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {cleaned ? 'All cache directories are optimal' : '1.42 GB removable space identified'}
              </p>
            </div>
          </div>
        </div>

        {!cleaned ? (
          <button
            onClick={handleClean}
            disabled={isCleaning}
            className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            {isCleaning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Purging Application Buffers...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Clean 1.42 GB Junk Now</span>
              </>
            )}
          </button>
        ) : (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Storage cache optimized! Reclaimed 1.42 GB of flash storage.</span>
          </div>
        )}
      </div>

      {/* Junk Item Breakdown */}
      <div className="rounded-3xl bg-device-surface border border-device-border p-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Removable Cache Categories
        </h3>
        <div className="space-y-2.5">
          {junkCategories.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-device-card border border-device-border/60 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <span className={`text-xs font-mono font-bold shrink-0 ml-2 ${cleaned ? 'text-slate-500 line-through' : 'text-rose-400'}`}>
                {item.size}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Intelligence Advice */}
      <div className="p-4 rounded-2xl bg-device-card border border-device-border/70 flex items-start gap-3 text-xs">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Flash storage speeds (UFS / eMMC) remain highest when at least 15% free space is maintained for wear-leveling and background garbage collection.
        </p>
      </div>
    </div>
  );
}
