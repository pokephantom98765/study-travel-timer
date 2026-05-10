import React, { useState } from 'react';
import { SessionState, TravelMode } from '../../types';
import { FLIGHT_CITIES, TRAIN_CITIES, BUS_ROUTES, DURATIONS } from '../../constants/data';
import { Plane, Train, Bus, ArrowRightLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BookingProps {
  onBook: (state: SessionState) => void;
  weather?: 'clear' | 'rain' | 'cloudy';
}

export const Booking: React.FC<BookingProps> = ({ onBook, weather = 'clear' }) => {
  const [mode, setMode] = useState<TravelMode>('flight');
  const [from, setFrom] = useState('DEL');
  const [to, setTo] = useState('BOM');
  const [durationMode, setDurationMode] = useState<'route' | 'custom'>('route');
  const [customHr, setCustomHr] = useState(1);
  const [customMin, setCustomMin] = useState(30);
  const [passenger, setPassenger] = useState('Student');
  const [subject, setSubject] = useState('');
  const [strictMode, setStrictMode] = useState(true);
  const [pomoEnabled, setPomoEnabled] = useState(false);
  const [pomoFocus] = useState(25);
  const [pomoBreak] = useState(5);
  const [goalInputs, setGoalInputs] = useState(['', '']);

  const cities = mode === 'flight'
    ? FLIGHT_CITIES
    : mode === 'train'
      ? TRAIN_CITIES
      : Array.from(
          new Map(
            BUS_ROUTES.flatMap((route) => [
              [route.from, { code: route.from, name: route.from }],
              [route.to, { code: route.to, name: route.to }]
            ])
          ).values()
        );

  const getEstDuration = () => {
    if (mode === 'flight' || mode === 'train') {
      return DURATIONS[`${from}-${to}`] || DURATIONS[`${to}-${from}`] || 120;
    }

    const route = BUS_ROUTES.find((r) => (r.from === from && r.to === to) || (r.from === to && r.to === from));
    return route ? route.duration : 180;
  };

  const estMin = getEstDuration();
  const estHr = Math.floor(estMin / 60);
  const estM = estMin % 60;

  const updateGoal = (index: number, value: string) => {
    setGoalInputs((prev) => prev.map((goal, idx) => (idx === index ? value : goal)));
  };

  const handleModeSwitch = (nextMode: TravelMode) => {
    setMode(nextMode);
    setFrom(nextMode === 'flight' ? 'DEL' : nextMode === 'train' ? 'NDLS' : BUS_ROUTES[0].from);
    setTo(nextMode === 'flight' ? 'BOM' : nextMode === 'train' ? 'CSTM' : BUS_ROUTES[0].to);
  };

  const handleBook = () => {
    if (from === to) {
      alert('Origin and destination cannot be the same. Please choose a different route.');
      return;
    }

    const trimmedSubject = subject.trim();
    if (!trimmedSubject) {
      alert('Please enter a subject.');
      return;
    }

    const goals = goalInputs.map((item) => item.trim()).filter((item) => item.length > 0);
    const normalizedHr = Number.isFinite(customHr) && customHr >= 0 ? customHr : 0;
    const normalizedMin = Number.isFinite(customMin) && customMin >= 0 ? customMin : 0;
    const minutes = durationMode === 'route' ? estMin : normalizedHr * 60 + normalizedMin;

    if (durationMode === 'custom' && minutes <= 0) {
      alert('Please choose a custom focus duration greater than 0 minutes.');
      return;
    }

    const vehicleId = mode === 'flight'
      ? `SA-${Math.floor(Math.random() * 900 + 100)}`
      : mode === 'train'
        ? `TR-${Math.floor(Math.random() * 89000 + 10000)}`
        : `BUS-${Math.floor(Math.random() * 900 + 100)}`;

    onBook({
      isActive: false,
      isPaused: false,
      mode,
      from,
      to,
      subject: trimmedSubject,
      passenger: passenger.trim() || 'Student',
      durationMs: minutes * 60000,
      endTime: Date.now() + minutes * 60000,
      totalTimeMs: minutes * 60000,
      goals,
      goalsMet: 0,
      distractions: 0,
      manualPauses: 0,
      strictMode,
      pomoEnabled,
      pomoFocus,
      pomoBreak,
      nextBreakTime: null,
      vehicleId
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg px-3 py-4 sm:px-4 sm:py-10">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Plane className="h-6 w-6 text-blue-500" /> StudyTravel
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Weather: {weather}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a2235] p-4 shadow-xl sm:p-6 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mb-6 grid grid-cols-1 gap-2 sm:flex">
          {(['flight', 'train', 'bus'] as TravelMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeSwitch(m)}
              className={cn(
                'flex-1 rounded-full py-3.5 font-semibold capitalize transition-all flex items-center justify-center gap-2',
                mode === m ? 'bg-blue-600 text-white' : 'border border-white/5 text-gray-400 hover:bg-white/5'
              )}
            >
              {m === 'flight' ? <Plane size={18} /> : m === 'train' ? <Train size={18} /> : <Bus size={18} />}
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:gap-3">
            <div className="min-w-0">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">Origin</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#111827] p-3 text-sm">
                {cities.map((city) => <option key={city.code} value={city.code}>{city.code} - {city.name}</option>)}
              </select>
            </div>
            <button onClick={() => { const nextFrom = to; const nextTo = from; setFrom(nextFrom); setTo(nextTo); }} className="mb-1 rounded-full border border-white/10 p-2.5 text-gray-400 hover:text-white">
              <ArrowRightLeft size={18} />
            </button>
            <div className="min-w-0">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">Destination</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#111827] p-3 text-sm">
                {cities.filter((city) => city.code !== from).map((city) => <option key={city.code} value={city.code}>{city.code} - {city.name}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-gray-500">Focus Duration</label>
            <div className="space-y-3">
              <label className="group flex cursor-pointer items-center gap-3">
                <input type="radio" checked={durationMode === 'route'} onChange={() => setDurationMode('route')} className="accent-blue-500" />
                <span className="text-sm text-gray-300">Estimated time: {estHr}h {estM}m</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input type="radio" checked={durationMode === 'custom'} onChange={() => setDurationMode('custom')} className="accent-blue-500" />
                <span className="text-sm text-gray-300">Set my own focus time</span>
              </label>
              {durationMode === 'custom' && (
                <div className="ml-7 flex flex-wrap items-center gap-2">
                  <input type="number" min={0} value={customHr} onChange={(e) => setCustomHr(Math.max(0, parseInt(e.target.value, 10) || 0))} className="w-16 rounded border border-white/10 bg-[#111827] p-2 text-center" /> hr
                  <input type="number" min={0} max={59} value={customMin} onChange={(e) => setCustomMin(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))} className="w-16 rounded border border-white/10 bg-[#111827] p-2 text-center" /> min
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">Passenger</label>
              <input type="text" value={passenger} onChange={(e) => setPassenger(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#111827] p-3 text-sm transition-colors focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-500">Subject</label>
              <input type="text" placeholder="e.g. Maths" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#111827] p-3 text-sm transition-colors focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="pt-4">
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-gray-500">Pre-flight Goals (Optional)</label>
            <div className="space-y-2">
              {goalInputs.map((goal, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={goal}
                  onChange={(e) => updateGoal(idx, e.target.value)}
                  placeholder={`Goal ${idx + 1}`}
                  className="w-full rounded-lg border border-white/10 bg-[#111827] p-3 text-sm"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-200">Strict Mode</p>
                <p className="text-xs text-gray-500">Penalty for switching tabs</p>
              </div>
              <input type="checkbox" checked={strictMode} onChange={(e) => setStrictMode(e.target.checked)} className="h-5 w-10 accent-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-200">Pomodoro Breaks</p>
                <p className="text-xs text-gray-500">Take mid-session rests</p>
              </div>
              <input type="checkbox" checked={pomoEnabled} onChange={(e) => setPomoEnabled(e.target.checked)} className="h-5 w-10 accent-blue-500" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Mission Intelligence</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-[10px] text-gray-400">
              <p className="mb-1 font-bold text-blue-400">Altitude focus</p>
              Strict mode tracks tab switches. Stay onboard.
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-[10px] text-gray-400">
              <p className="mb-1 font-bold text-emerald-400">XP multiplier</p>
              Longer sessions without pauses grant more rank points.
            </div>
          </div>
        </div>

        <button
          onClick={handleBook}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold shadow-lg transition hover:bg-blue-500 active:scale-95 sm:text-lg"
        >
          Request Clearance and Board <Plane size={20} />
        </button>
      </div>
    </div>
  );
};
