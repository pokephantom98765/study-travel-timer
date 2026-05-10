import React from 'react';
import { JourneyRecord } from '../../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { Trophy, Home, CloudRain, Plane, Award, Download, BarChart3 } from 'lucide-react';
import { getSessionFeedback } from '../../services/geminiService';
import { toPng } from 'html-to-image';

interface LandingProps {
  record: JourneyRecord;
  onHome: () => void;
  onAnalytics: () => void;
}

export const Landing: React.FC<LandingProps> = ({ record, onHome, onAnalytics }) => {
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [loadingAI, setLoadingAI] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchAI = async () => {
      setLoadingAI(true);
      const res = await getSessionFeedback(record.subject, record.duration, record.notes || '', record.distractions);
      if (isMounted) {
        setFeedback(res);
        setLoadingAI(false);
      }
    };

    fetchAI();
    return () => {
      isMounted = false;
    };
  }, [record]);

  const downloadPass = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `studytravel-pass-${record.date.replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating pass:', error);
    }
  };

  const getGrade = () => {
    if (record.score >= 90) return { letter: 'A', color: 'text-green-500' };
    if (record.score >= 75) return { letter: 'B', color: 'text-blue-500' };
    if (record.score >= 60) return { letter: 'C', color: 'text-amber-500' };
    return { letter: 'D', color: 'text-red-500' };
  };

  const grade = getGrade();

  return (
    <div className="relative z-10 flex min-h-[100dvh] items-center justify-center p-4 sm:p-6 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
      <motion.div
        ref={cardRef}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1a2235] p-6 text-center shadow-2xl sm:p-8"
      >
        <div className="mb-6">
          <div className="mb-4 inline-flex rounded-full bg-blue-500/10 p-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Journey Complete!</h2>
          <p className="mt-1 text-sm text-gray-400">{record.from} -&gt; {record.to} . {record.subject}</p>
        </div>

        <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Focus Grade</p>
            <p className="text-xs text-gray-400">Score: {record.score}/100</p>
          </div>
          <div className={cn('text-5xl font-black', grade.color)}>{grade.letter}</div>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-gray-500">Time</span>
            <span className="text-lg font-bold text-white">{Math.floor(record.duration / 60000)}m</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 px-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">XP Gained</span>
            <span className="text-lg font-bold text-blue-400">+{Math.round(record.duration / 60000)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase text-gray-500">Penalty</span>
            <span className="text-lg font-bold text-red-500">{record.distractions}</span>
          </div>
        </div>

        <div className="group relative mb-8 overflow-hidden rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5 text-left">
          <div className="absolute right-0 top-0 p-2 opacity-10 transition-opacity group-hover:opacity-20">
            <Plane size={40} className="-rotate-45" />
          </div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
            <Award size={12} /> Cabin Crew Feedback
          </p>
          {loadingAI ? (
            <div className="flex h-12 items-center gap-2 text-xs italic text-gray-500">
              <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500" />
              <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
              <div className="h-1 w-1 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              Analyzing your flight logs...
            </div>
          ) : (
            <p className="text-xs italic leading-relaxed text-blue-100/80">
              "{feedback || "Safe travels, passenger. You completed your journey with excellence. Ready for your next departure?"}"
            </p>
          )}
        </div>

        <div className="weather-card mb-6 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-bg-secondary p-4 text-sm capitalize text-gray-400">
          <CloudRain size={18} className="text-blue-400" />
          <span>Atmospheric conditions: {record.weather || 'Clear skies'}</span>
        </div>

        <div className="relative my-4 flex h-32 items-center justify-center overflow-hidden">
          <motion.svg
            initial={{ scale: 2, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.5 }}
            className="h-24 w-24"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="1" />
            <text x="50" y="40" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">{record.from} to {record.to}</text>
            <text x="50" y="55" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold">ARRIVED</text>
            <text x="50" y="70" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">{record.date}</text>
          </motion.svg>
        </div>

        <button onClick={downloadPass} className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-bold text-white hover:bg-green-500">
          <Download size={18} /> Download Exit Pass
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button onClick={onHome} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-white hover:bg-white/10">
            <Home size={18} /> Exit
          </button>
          <button onClick={onAnalytics} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-500">
            <BarChart3 size={18} /> Analytics
          </button>
        </div>
      </motion.div>
    </div>
  );
};
