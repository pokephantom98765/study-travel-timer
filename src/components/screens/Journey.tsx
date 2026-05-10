import React, { useEffect, useState } from 'react';
import { JourneyRecord, SessionState } from '../../types';
import { useTimer } from '../../hooks/useTimer';
import { useFocusWatcher } from '../../hooks/useFocusWatcher';
import { formatMs, cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { Plane, Train, Bus, ClipboardList, XCircle, Pause, Play, Music, Link } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { NotificationService } from '../../services/notificationService';

interface JourneyProps {
  initialState: SessionState;
  onFinish: (record: JourneyRecord) => void;
  onEarlyExit: () => void;
}

export const Journey: React.FC<JourneyProps> = ({ initialState, onFinish, onEarlyExit }) => {
  const { timeLeft, pct, isPaused, togglePause, distractions, addDistraction } = useTimer(initialState, onFinish);
  const [showNotes, setShowNotes] = useState(false);
  const [showSounds, setShowSounds] = useState(false);
  const [localNotes, setLocalNotes] = useState('');
  const [customSoundUrl, setCustomSoundUrl] = useState('');

  const extractYouTubeInfo = (url: string) => {
    const videoMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = videoMatch ? videoMatch[1] : null;

    const playlistMatch = url.match(/[?&]list=([^"&?\/\s]+)/);
    const playlistId = playlistMatch ? playlistMatch[1] : null;

    return { videoId, playlistId };
  };

  const { videoId: youtubeId, playlistId } = extractYouTubeInfo(customSoundUrl);
  const [vol, setVol] = useState(0.4);

  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  useEffect(() => {
    (window as any).__LAST_NOTES = localNotes;
  }, [localNotes]);

  useFocusWatcher(initialState.isActive, isPaused, initialState.strictMode, addDistraction);

  const Icon = initialState.mode === 'train' ? Train : initialState.mode === 'bus' ? Bus : Plane;

  const renderTelemetry = () => {
    if (initialState.mode === 'flight') {
      const alt = pct < 0.1 ? Math.round(pct * 10 * 35000) : pct > 0.9 ? Math.round((1 - pct) * 10 * 35000) : 35000;
      const spd = pct < 0.05 ? Math.round(pct * 20 * 867) : pct > 0.95 ? Math.round((1 - pct) * 20 * 867) : 867;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase text-gray-400">Altitude</p>
            <p className="text-sm font-bold tabular-nums">{alt.toLocaleString()} ft</p>
          </div>
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase text-gray-400">Airspeed</p>
            <p className="text-sm font-bold tabular-nums">{spd} km/h</p>
          </div>
        </div>
      );
    }

    if (initialState.mode === 'train') {
      const spd = pct < 0.05 || pct > 0.95 ? 45 : 110;
      const station = Math.min(12, Math.floor(pct * 12) + 1);
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase text-gray-400">Station</p>
            <p className="text-sm font-bold tabular-nums">{station}/12</p>
          </div>
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase text-gray-400">Speed</p>
            <p className="text-sm font-bold tabular-nums">{spd} km/h</p>
          </div>
        </div>
      );
    }

    const spd = pct < 0.05 || pct > 0.95 ? 30 : 82;
    const progress = Math.round(pct * 100);
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase text-gray-400">Progress</p>
          <p className="text-sm font-bold tabular-nums">{progress}%</p>
        </div>
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase text-gray-400">Speed</p>
          <p className="text-sm font-bold tabular-nums">{spd} km/h</p>
        </div>
      </div>
    );
  };

  const getPhaseLabels = () => {
    if (initialState.mode === 'flight') return ['Taxi', 'Takeoff', 'Cruise', 'Descent', 'Land'];
    if (initialState.mode === 'train') return ['Depart', 'Accel', 'Speed', 'Brake', 'Arrive'];
    return ['Start', 'City', 'Highway', 'Traffic', 'Arrive'];
  };

  const phases = getPhaseLabels();

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col text-white">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl sm:px-6 [padding-top:calc(0.5rem+env(safe-area-inset-top))]">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <div className="flex min-w-0 items-center gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
            <Icon size={18} />
            <span className="truncate">STUDYTRAVEL</span>
            <span className="opacity-40">.</span>
            <span className="truncate">{initialState.from} -&gt; {initialState.to}</span>
          </div>
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSounds(!showSounds)} className={cn('rounded-lg p-2.5 transition-colors hover:bg-white/10', showSounds ? 'bg-white/5 text-blue-400' : 'text-gray-400')} title="Sound Settings"><Music size={18} /></button>
          <button onClick={() => setShowNotes(!showNotes)} className={cn('rounded-lg p-2.5 transition-colors hover:bg-white/10', showNotes ? 'bg-white/5 text-blue-400' : 'text-gray-400')} title="Notes"><ClipboardList size={18} /></button>
          <button onClick={onEarlyExit} className="rounded-lg p-2.5 text-red-400 hover:bg-white/10" title="End"><XCircle size={18} /></button>
        </div>
      </div>

      <div className={cn('flex flex-1 items-center justify-center px-3 py-5 sm:px-6', (youtubeId && showSounds) ? 'flex-col gap-4 lg:flex-row lg:gap-6' : 'flex-col')}>
        <div className="relative mx-0 w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl backdrop-blur-2xl sm:mx-4 sm:p-10">
          {isPaused && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl border border-yellow-500/20 bg-yellow-500/10"><span className="rounded bg-yellow-500 px-3 py-1 text-[10px] font-bold tracking-widest text-black">PAUSED</span></div>}

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Focus Session</p>
          <h1 className={cn('mb-4 text-5xl font-bold tabular-nums sm:text-7xl', timeLeft < 60000 && 'animate-pulse text-amber-500')}>
            {formatMs(timeLeft)}
          </h1>
          <p className="mb-8 text-sm font-medium uppercase tracking-widest text-gray-300">{initialState.subject}</p>

          <div className="inline-flex items-center gap-4 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider">
            <span>{initialState.from}</span>
            <Icon size={14} className={cn('text-gray-500', !isPaused && 'animate-pulse')} />
            <span>{initialState.to}</span>
          </div>

          <button
            onClick={togglePause}
            className="relative z-30 mx-auto mt-8 flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-bold shadow-lg transition-all hover:bg-white/5 active:scale-95 sm:mt-10 sm:px-8"
          >
            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>

        {youtubeId && showSounds && (
          <div className="h-fit w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-2xl sm:w-64 sm:p-6">
            <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">Custom Media</p>
            <iframe
              width="100%"
              height="150"
              src={playlistId ? `https://www.youtube.com/embed?list=${playlistId}&autoplay=1&mute=1&loop=1` : `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${youtubeId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        )}
      </div>

      <div className={cn(
        'fixed right-0 top-14 z-50 flex h-[calc(100dvh-3.5rem)] w-full max-w-sm flex-col border-l border-white/10 bg-bg-card/90 p-4 backdrop-blur-3xl transition-transform duration-300 sm:p-6 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]',
        !showNotes && 'translate-x-full'
      )}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Mission Hub</h3>
          <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-white">X</button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {initialState.goals.length > 0 ? (
            <div className="space-y-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Checklist</p>
              {initialState.goals.map((goal, idx) => (
                <label key={idx} className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-blue-500" />
                  <span className="text-sm text-gray-300 transition-all group-has-[:checked]:line-through group-has-[:checked]:opacity-40">{goal}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-gray-500">No goals set for this flight.</p>
          )}

          <div className="border-t border-white/10 pt-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Journey Notes</p>
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              className="h-64 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300 transition-colors focus:border-blue-500 focus:outline-none"
              placeholder="Jot down your progress..."
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-3 pb-8 sm:px-6 sm:pb-12 [padding-bottom:calc(2rem+env(safe-area-inset-bottom))]">
        <div className="relative mb-12 h-1 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300" style={{ width: `${pct * 100}%` }} />
          <motion.div
            className="absolute -top-3 left-0 transition-all duration-300"
            animate={{ left: `${pct * 100}%` }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ transform: 'translateX(-50%)' }}
          >
            <Icon className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] text-blue-500" fill="currentColor" size={24} />
          </motion.div>

          <div className="absolute inset-x-0 top-4 hidden justify-between text-[9px] font-bold uppercase tracking-tighter text-gray-500 sm:flex">
            {phases.map((p, i) => (
              <span key={p} className={cn(pct >= i / 4 && pct < (i + 1) / 4 && 'text-blue-400', pct === 1 && i === 4 && 'text-blue-400')}>
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Telemetry</p>
            {renderTelemetry()}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Ambience</p>
              <input type="range" min="0" max="1" step="0.1" value={vol} onChange={e => { const v = parseFloat(e.target.value); setVol(v); audioService.setVolume(v); }} className="w-16 accent-blue-500" />
            </div>
            <div className="flex flex-wrap gap-2">
              {['flight', 'rain', 'cafe', 'train'].map(type => (
                <button
                  key={type}
                  onClick={() => { audioService.setAmbient(type); setCustomSoundUrl(''); }}
                  className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {type}
                </button>
              ))}
            </div>

            {showSounds && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 border-t border-white/5 pt-4"
              >
                <p className="mb-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-gray-500"><Link size={10} /> Custom Audio URL</p>
                <input
                  type="text"
                  value={customSoundUrl}
                  onChange={(e) => setCustomSoundUrl(e.target.value)}
                  placeholder="YouTube video/playlist or direct MP3 URL"
                  className="mb-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[10px] text-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => audioService.setAmbient('custom', customSoundUrl)}
                    className="flex-1 rounded-lg bg-blue-600 px-2 py-2 text-[9px] font-bold transition-colors hover:bg-blue-500"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Strict Check</p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-tighter text-amber-500">Penalty</p>
              <span className="rounded-lg bg-red-500/20 px-3 py-1 text-xs font-black tabular-nums text-red-500">{distractions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
