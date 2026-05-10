import { useCallback, useEffect, useRef, useState } from 'react';
import { JourneyRecord, SessionState } from '../types';
import { audioService } from '../services/audioService';
import { NotificationService } from '../services/notificationService';

export function useTimer(initialState: SessionState | null, onFinish: (record: JourneyRecord) => void) {
  const [session, setSession] = useState<SessionState | null>(initialState);
  const [timeLeft, setTimeLeft] = useState(initialState?.totalTimeMs ?? 0);
  const [distractions, setDistractions] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pct, setPct] = useState(0);

  const rAFRef = useRef<number | null>(null);
  const pauseTimeRef = useRef(0);
  const halfwayNotifiedRef = useRef(false);
  const finishedNotifiedRef = useRef(false);

  useEffect(() => {
    setSession(initialState);
    setTimeLeft(initialState?.totalTimeMs ?? 0);
    setDistractions(0);
    setIsPaused(false);
    setPct(0);
    halfwayNotifiedRef.current = false;
    finishedNotifiedRef.current = false;
  }, [initialState]);

  const stop = useCallback((isManual = false) => {
    if (!session) return;

    if (rAFRef.current !== null) {
      cancelAnimationFrame(rAFRef.current);
    }

    audioService.stopAll();

    if (!isManual && !finishedNotifiedRef.current) {
      NotificationService.notifyArrival(session.from, session.to);
      finishedNotifiedRef.current = true;
    }

    const actualDurMs = isManual ? Math.max(0, session.totalTimeMs - timeLeft) : session.totalTimeMs;
    const scoreRaw = 100 - distractions * 10 - session.manualPauses * 5;
    const focusScore = Math.max(0, Math.min(100, scoreRaw));

    const record: JourneyRecord = {
      id: session.vehicleId,
      date: new Date().toLocaleDateString(),
      mode: session.mode,
      from: session.from,
      to: session.to,
      subject: session.subject,
      duration: actualDurMs,
      goals: session.goals.length,
      goalsMet: session.goalsMet,
      breaks: 0,
      distractions,
      pauses: session.manualPauses,
      score: focusScore,
      timestamp: Date.now(),
      notes: (window as any).__LAST_NOTES || '',
      weather: (window as any).__LAST_WEATHER || 'clear'
    };

    onFinish(record);
  }, [distractions, onFinish, session, timeLeft]);

  useEffect(() => {
    if (!session || !session.isActive || isPaused) return;

    audioService.playAmbient(session.mode);
    const procPromise = audioService.startProceduralEngine(session.mode);

    const loop = () => {
      const now = Date.now();
      const left = session.endTime - now;

      if (left <= 0) {
        setTimeLeft(0);
        setPct(1);
        stop(false);
        return;
      }

      const currentPct = 1 - left / session.totalTimeMs;
      if (currentPct >= 0.5 && !halfwayNotifiedRef.current) {
        NotificationService.notifyHalfway(session.to);
        halfwayNotifiedRef.current = true;
      }

      setTimeLeft(left);
      setPct(currentPct);
      rAFRef.current = requestAnimationFrame(loop);
    };

    rAFRef.current = requestAnimationFrame(loop);

    return () => {
      if (rAFRef.current !== null) {
        cancelAnimationFrame(rAFRef.current);
      }
      procPromise.then((proc) => proc?.stop()).catch(() => undefined);
      audioService.stopAll();
    };
  }, [isPaused, session, stop]);

  const togglePause = () => {
    if (!session || !session.isActive) return;

    if (isPaused) {
      const diff = Date.now() - pauseTimeRef.current;
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isPaused: false,
          endTime: prev.endTime + diff
        };
      });
      setIsPaused(false);
      audioService.playAmbient(session.mode);
      return;
    }

    pauseTimeRef.current = Date.now();
    setIsPaused(true);
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isPaused: true,
        manualPauses: prev.manualPauses + 1
      };
    });
    audioService.stopAll();
  };

  const addDistraction = useCallback(() => {
    setDistractions((prev) => prev + 1);
  }, []);

  return {
    timeLeft,
    pct,
    isPaused,
    togglePause,
    distractions,
    addDistraction,
    setSession,
    stop
  };
}
