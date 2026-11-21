import { useState, useEffect, useCallback } from 'react';
import { predictDeviceHealth } from '../ai/aiInferenceEngine';

const STORAGE_KEY = 'device_care_telemetry_state_v1';

export function useDeviceTelemetry() {
  // Initialize state with sensible defaults or persistent storage
  const [telemetry, setTelemetry] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      batteryLevel: 84,
      isCharging: false,
      cpu: 32,
      ram: 58,
      totalRamGb: navigator.deviceMemory || 8,
      temp: 34.2,
      screenTime: 4.2,
      bgApps: 11,
      storageUsedPct: 68,
      storageTotalGb: 128,
      storageFreeGb: 40.9,
      storageJunkMb: 1420,
      cycles: 312,
      network: 3.4,
      networkType: '5G / Wi-Fi',
      cpuCores: navigator.hardwareConcurrency || 8,
      powerMode: 'Normal', // 'Normal', 'Saving', 'Ultra', 'Performance'
      lastOptimized: null
    };
  });

  const [aiPrediction, setAiPrediction] = useState(() => predictDeviceHealth(telemetry));
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Sync with real browser battery API if supported
  useEffect(() => {
    let batteryInstance = null;

    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        batteryInstance = battery;
        const updateBattery = () => {
          setTelemetry((prev) => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
            isCharging: battery.charging
          }));
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }

    // Read real device storage quota if supported
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        if (estimate.quota && estimate.usage) {
          const totalGb = (estimate.quota / (1024 ** 3)).toFixed(1);
          const usedGb = (estimate.usage / (1024 ** 3)).toFixed(1);
          const pct = Math.min(95, Math.max(10, Math.round((estimate.usage / estimate.quota) * 100)));
          setTelemetry((prev) => ({
            ...prev,
            storageUsedPct: pct,
            storageTotalGb: parseFloat(totalGb) > 10 ? parseFloat(totalGb) : 128,
            storageFreeGb: Math.max(5, (128 * (100 - pct) / 100)).toFixed(1)
          }));
        }
      }).catch(() => {});
    }

    // Read network info if supported
    if (navigator.connection) {
      const conn = navigator.connection;
      const updateConn = () => {
        setTelemetry((prev) => ({
          ...prev,
          networkType: conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Wi-Fi',
          network: conn.downlink ? Math.min(45, conn.downlink * 1.5) : prev.network
        }));
      };
      updateConn();
      conn.addEventListener('change', updateConn);
    }
  }, []);

  // Update AI predictions whenever telemetry changes
  useEffect(() => {
    const pred = predictDeviceHealth(telemetry);
    setAiPrediction(pred);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(telemetry));
  }, [telemetry]);

  // Subtle real-time pulse simulation to simulate dynamic device load
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Natural small fluctuations (+- 1 to 2%)
        const cpuDrift = (Math.random() - 0.5) * 3;
        const ramDrift = (Math.random() - 0.5) * 1.5;
        const tempDrift = (Math.random() - 0.5) * 0.2;

        return {
          ...prev,
          cpu: Math.max(10, Math.min(98, Math.round(prev.cpu + cpuDrift))),
          ram: Math.max(25, Math.min(95, Math.round(prev.ram + ramDrift))),
          temp: parseFloat(Math.max(26.0, Math.min(48.0, prev.temp + tempDrift)).toFixed(1))
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // One-Tap Comprehensive Optimize Action
  const optimizeDevice = useCallback(() => {
    setIsOptimizing(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        setTelemetry((prev) => {
          const freedRamPct = Math.min(30, Math.max(12, Math.round(prev.ram * 0.28)));
          const cleanedJunk = prev.storageJunkMb;
          const newStoragePct = Math.max(20, prev.storageUsedPct - 4);

          return {
            ...prev,
            cpu: Math.max(12, Math.round(prev.cpu * 0.45)), // reduce CPU load
            ram: Math.max(28, prev.ram - freedRamPct),      // free RAM
            temp: parseFloat(Math.max(28.0, prev.temp - 2.8).toFixed(1)), // cool temp
            bgApps: Math.max(2, Math.round(prev.bgApps * 0.3)), // kill background tasks
            storageUsedPct: newStoragePct,
            storageJunkMb: 0,
            lastOptimized: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        setIsOptimizing(false);
        resolve(true);
      }, 2400);
    });
  }, []);

  // Boost RAM only
  const boostRam = useCallback(() => {
    setTelemetry((prev) => ({
      ...prev,
      ram: Math.max(28, prev.ram - 18),
      bgApps: Math.max(2, prev.bgApps - 6),
      cpu: Math.max(14, prev.cpu - 10)
    }));
  }, []);

  // Clean Storage Junk only
  const cleanJunkStorage = useCallback(() => {
    setTelemetry((prev) => ({
      ...prev,
      storageJunkMb: 0,
      storageUsedPct: Math.max(15, prev.storageUsedPct - 3)
    }));
  }, []);

  // Set Power Mode
  const setPowerMode = useCallback((mode) => {
    setTelemetry((prev) => {
      let cpuTarget = prev.cpu;
      let tempTarget = prev.temp;

      if (mode === 'Ultra') {
        cpuTarget = Math.min(30, prev.cpu);
        tempTarget = Math.min(32, prev.temp);
      } else if (mode === 'Saving') {
        cpuTarget = Math.min(50, prev.cpu);
      } else if (mode === 'Performance') {
        cpuTarget = Math.max(65, prev.cpu);
      }

      return {
        ...prev,
        powerMode: mode,
        cpu: cpuTarget,
        temp: tempTarget
      };
    });
  }, []);

  // Update specific feature (for AI testing playground)
  const updateFeature = useCallback((feature, value) => {
    setTelemetry((prev) => ({
      ...prev,
      [feature]: value
    }));
  }, []);

  return {
    telemetry,
    aiPrediction,
    isOptimizing,
    optimizeDevice,
    boostRam,
    cleanJunkStorage,
    setPowerMode,
    updateFeature
  };
}
