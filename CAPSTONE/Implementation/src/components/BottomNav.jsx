import React from 'react';
import { LayoutDashboard, BatteryCharging, Flame, HardDrive, Cpu, Grid } from 'lucide-react';
import { useHaptic } from '../hooks/useHaptic';

export default function BottomNav({ activeTab, onSelectTab, onOpenTools }) {
  const haptic = useHaptic();

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'battery', label: 'Battery', icon: BatteryCharging },
    { id: 'thermal', label: 'Thermal', icon: Flame },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'memory', label: 'Memory', icon: Cpu },
    { id: 'tools', label: 'Tools', icon: Grid, isToolsTrigger: true }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-device-surface/92 backdrop-blur-xl border-t border-device-border/70 safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto px-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                haptic.light();
                if (tab.isToolsTrigger) {
                  onOpenTools();
                } else {
                  onSelectTab(tab.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${isActive ? 'bg-cyan-500/15 text-cyan-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
