import { useEffect } from 'react';

export function useFocusWatcher(isActive: boolean, isPaused: boolean, enabled: boolean, onDistraction: () => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && !isPaused && enabled) {
        onDistraction();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, isPaused, enabled, onDistraction]);
}
