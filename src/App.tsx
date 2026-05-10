import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Sky } from './components/Sky';
import { Booking } from './components/screens/Booking';
import { JourneyRecord, Profile, SessionState } from './types';

const PassScreen = lazy(async () => import('./components/screens/PassScreen').then((m) => ({ default: m.PassScreen })));
const Journey = lazy(async () => import('./components/screens/Journey').then((m) => ({ default: m.Journey })));
const Landing = lazy(async () => import('./components/screens/Landing').then((m) => ({ default: m.Landing })));
const Analytics = lazy(async () => import('./components/screens/Analytics').then((m) => ({ default: m.Analytics })));

export default function App() {
  const [screen, setScreen] = useState<'booking' | 'pass' | 'journey' | 'landing' | 'analytics'>('booking');
  const [session, setSession] = useState<SessionState | null>(null);
  const [lastRecord, setLastRecord] = useState<JourneyRecord | null>(null);
  const [profile, setProfile] = useState<Profile>({
    xp: 0,
    streak: 0,
    lastLogin: new Date().toISOString(),
    totalMs: 0,
    distractions: 0,
    sessions: 0,
    username: 'Pilot'
  });
  const [history, setHistory] = useState<JourneyRecord[]>([]);
  const [weather, setWeather] = useState<'clear' | 'rain' | 'cloudy'>('clear');

  useEffect(() => {
    const moods: Array<'clear' | 'cloudy' | 'rain'> = ['clear', 'clear', 'clear', 'cloudy', 'rain'];
    const nextWeather = moods[Math.floor(Math.random() * moods.length)];
    setWeather(nextWeather);
    (window as any).__LAST_WEATHER = nextWeather;
  }, [screen]);

  const handleBook = (sessionState: SessionState) => {
    setSession(sessionState);
    setScreen('pass');
  };

  const handleBoard = () => {
    setSession((prev) => {
      if (!prev) return null;
      const now = Date.now();
      return {
        ...prev,
        isActive: true,
        isPaused: false,
        endTime: now + prev.totalTimeMs,
      };
    });
    setScreen('journey');
  };

  const handleFinish = (record: JourneyRecord) => {
    setLastRecord(record);

    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + Math.round(record.duration / 60000),
      totalMs: prev.totalMs + record.duration,
      sessions: prev.sessions + 1,
      distractions: prev.distractions + record.distractions,
      streak: 1,
      lastLogin: new Date().toISOString(),
    }));

    setHistory((prev) => [record, ...prev]);
    setSession((prev) => (prev ? { ...prev, isActive: false, isPaused: false } : null));
    setScreen('landing');
  };

  const handleExitToBooking = () => {
    setSession(null);
    setScreen('booking');
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden font-sans">
      <Sky mode={session?.mode ?? 'flight'} weather={weather} />

      <main className="relative z-10 h-[100dvh] w-full overflow-y-auto overscroll-contain [padding-bottom:env(safe-area-inset-bottom)]">
        {screen === 'booking' && (
          <div className="min-h-full flex flex-col items-center justify-center p-4">
            <Booking onBook={handleBook} weather={weather} />
          </div>
        )}

        <Suspense
          fallback={
            <div className="flex min-h-full items-center justify-center p-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Preparing cabin...
            </div>
          }
        >
          {screen === 'pass' && session && (
            <PassScreen
              session={session}
              onBoard={handleBoard}
            />
          )}

          {screen === 'journey' && session && (
            <Journey
              initialState={session}
              onFinish={handleFinish}
              onEarlyExit={handleExitToBooking}
            />
          )}

          {screen === 'landing' && lastRecord && (
            <Landing
              record={lastRecord}
              onHome={handleExitToBooking}
              onAnalytics={() => setScreen('analytics')}
            />
          )}

          {screen === 'analytics' && (
            <Analytics
              profile={profile}
              history={history}
              onBack={handleExitToBooking}
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}
