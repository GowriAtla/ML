import { useCallback } from 'react';

export function useHaptic() {
  const triggerHaptic = useCallback((pattern = 15) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  return {
    light: () => triggerHaptic(12),
    medium: () => triggerHaptic(25),
    success: () => triggerHaptic([30, 60, 30]),
    warning: () => triggerHaptic([60, 40, 80]),
  };
}
