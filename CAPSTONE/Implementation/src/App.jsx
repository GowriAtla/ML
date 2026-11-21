import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import TopAppBar from './components/TopAppBar';
import BottomNav from './components/BottomNav';
import ToolsSheet from './components/ToolsSheet';
import OptimizeModal from './components/OptimizeModal';
import HardwareTestModal from './components/HardwareTestModal';
import AIAssistantSheet from './components/AIAssistantSheet';

import DashboardScreen from './screens/DashboardScreen';
import BatteryScreen from './screens/BatteryScreen';
import ThermalChamberScreen from './screens/ThermalChamberScreen';
import StorageScreen from './screens/StorageScreen';
import MemoryScreen from './screens/MemoryScreen';
import NetworkRadarScreen from './screens/NetworkRadarScreen';
import SecurityAuditorScreen from './screens/SecurityAuditorScreen';
import AIDiagnosticsScreen from './screens/AIDiagnosticsScreen';
import SettingsScreen from './screens/SettingsScreen';

import { useDeviceTelemetry } from './hooks/useDeviceTelemetry';
import { Download, X } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);
  const [isHardwareTestOpen, setIsHardwareTestOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const {
    telemetry,
    aiPrediction,
    optimizeDevice,
    boostRam,
    cleanJunkStorage,
    setPowerMode,
    updateFeature
  } = useDeviceTelemetry();

  // Capture PWA beforeinstallprompt event for 1-click home screen install
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => {
        setInstallPrompt(null);
        setShowInstallBanner(false);
      });
    }
  };

  return (
    <>
      {/* High-Tech Futuristic Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      <div className="min-h-screen bg-device-bg text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
        {/* Top Header */}
        <TopAppBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenHardwareTest={() => setIsHardwareTestOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenTools={() => setIsToolsOpen(true)}
        />

        {/* PWA Home Screen Install Banner */}
        {showInstallBanner && (
          <div className="bg-gradient-to-r from-indigo-900 to-cyan-950 px-4 py-2 border-b border-indigo-500/40 flex items-center justify-between text-xs max-w-md mx-auto w-full">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span className="font-medium text-slate-200">Install as Full Mobile App</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-white font-bold text-[10px] active:scale-95 transition"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen Router */}
        <main className="flex-1 w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              telemetry={telemetry}
              aiPrediction={aiPrediction}
              onOpenOptimize={() => setIsOptimizeOpen(true)}
              onNavigateTab={setActiveTab}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />
          )}

          {activeTab === 'battery' && (
            <BatteryScreen
              telemetry={telemetry}
              aiPrediction={aiPrediction}
              setPowerMode={setPowerMode}
            />
          )}

          {activeTab === 'thermal' && (
            <ThermalChamberScreen
              telemetry={telemetry}
              updateFeature={updateFeature}
            />
          )}

          {activeTab === 'storage' && (
            <StorageScreen
              telemetry={telemetry}
              cleanJunkStorage={cleanJunkStorage}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryScreen
              telemetry={telemetry}
              boostRam={boostRam}
            />
          )}

          {activeTab === 'network' && (
            <NetworkRadarScreen
              telemetry={telemetry}
            />
          )}

          {activeTab === 'security' && (
            <SecurityAuditorScreen />
          )}

          {activeTab === 'ai_lab' && (
            <AIDiagnosticsScreen
              telemetry={telemetry}
              aiPrediction={aiPrediction}
              updateFeature={updateFeature}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              telemetry={telemetry}
              aiPrediction={aiPrediction}
              onReplaySplash={() => setShowSplash(true)}
            />
          )}
        </main>

        {/* Bottom Mobile Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenTools={() => setIsToolsOpen(true)}
        />

        {/* Pro Tools Sheet Drawer */}
        <ToolsSheet
          isOpen={isToolsOpen}
          onClose={() => setIsToolsOpen(false)}
          onSelectScreen={(screenId) => setActiveTab(screenId)}
          onOpenHardwareTest={() => setIsHardwareTestOpen(true)}
        />

        {/* Modals & Bottom Sheets */}
        <OptimizeModal
          isOpen={isOptimizeOpen}
          onClose={() => setIsOptimizeOpen(false)}
          onOptimizeComplete={optimizeDevice}
        />

        <HardwareTestModal
          isOpen={isHardwareTestOpen}
          onClose={() => setIsHardwareTestOpen(false)}
          telemetry={telemetry}
        />

        <AIAssistantSheet
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          telemetry={telemetry}
          aiPrediction={aiPrediction}
          onQuickOptimize={() => setIsOptimizeOpen(true)}
        />
      </div>
    </>
  );
}
