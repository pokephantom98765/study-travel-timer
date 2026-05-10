import React from 'react';
import { BoardingPass } from '../BoardingPass';
import { SessionState } from '../../types';
import { FLIGHT_CITIES, TRAIN_CITIES, BUS_ROUTES } from '../../constants/data';
import { toPng } from 'html-to-image';
import { Share2 } from 'lucide-react';

interface PassScreenProps {
  session: SessionState;
  onBoard: () => void;
}

export const PassScreen: React.FC<PassScreenProps> = ({ session, onBoard }) => {
  const exportPass = async () => {
    const node = document.getElementById('boarding-pass');
    if (!node) return;

    try {
      const dataUrl = await toPng(node);
      const link = document.createElement('a');
      link.download = `boarding-pass-${session.vehicleId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export boarding pass image:', error);
    }
  };

  const getFullCityName = (code: string) => {
    const list = session.mode === 'flight'
      ? FLIGHT_CITIES
      : session.mode === 'train'
        ? TRAIN_CITIES
        : Array.from(new Map(BUS_ROUTES.flatMap((r) => [[r.from, { code: r.from, name: r.from }], [r.to, { code: r.to, name: r.to }]])).values());

    const city = list.find((c) => c.code === code);
    return city ? city.name : code;
  };

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-6 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="mb-2 text-xl font-bold text-white">Your boarding pass is ready</h2>
        <p className="text-sm text-gray-400">Please review your journey details before boarding.</p>
      </div>

      <BoardingPass
        mode={session.mode}
        from={session.from}
        to={session.to}
        fromFull={getFullCityName(session.from)}
        toFull={getFullCityName(session.to)}
        passenger={session.passenger}
        subject={session.subject}
        durationMs={session.durationMs}
        vehicleId={session.vehicleId}
      />

      <div className="mt-8 w-full max-w-[440px] space-y-4 sm:mt-12">
        <button
          onClick={onBoard}
          className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-xl transition-all hover:bg-blue-500 active:scale-95 sm:text-lg"
        >
          Board and Start Journey -&gt;
        </button>

        <button
          onClick={exportPass}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-gray-300 transition-all hover:bg-white/10 active:scale-95"
        >
          <Share2 size={16} /> Save Pass to Gallery
        </button>

        {session.strictMode && (
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-red-500 animate-pulse">
            Strict mode active: no tab switching allowed
          </p>
        )}
      </div>
    </div>
  );
};
