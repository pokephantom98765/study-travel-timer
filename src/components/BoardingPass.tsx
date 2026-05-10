import React from 'react';
import { motion } from 'motion/react';
import { TravelMode } from '../types';
import { cn } from '../lib/utils';
import { Plane, Train, Bus } from 'lucide-react';

interface BoardingPassProps {
  mode: TravelMode;
  from: string;
  to: string;
  fromFull: string;
  toFull: string;
  passenger: string;
  subject: string;
  durationMs: number;
  vehicleId: string;
}

export const BoardingPass: React.FC<BoardingPassProps> = ({
  mode, from, to, fromFull, toFull, passenger, subject, durationMs, vehicleId
}) => {
  const Icon = mode === 'train' ? Train : mode === 'bus' ? Bus : Plane;
  const title = mode === 'train' ? 'STUDYRAIL' : mode === 'bus' ? 'STUDYBUS' : 'STUDYAIR';
  
  const hr = Math.floor(durationMs / 3600000);
  const min = Math.floor((durationMs % 3600000) / 60000);

  const now = new Date();
  const dTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  now.setMinutes(now.getMinutes() + (durationMs / 60000));
  const aTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getHeaderColor = () => {
    if (mode === 'train') return 'bg-[#1B6B3A]';
    if (mode === 'bus') return 'bg-[#92400E]';
    return 'bg-[#0C447C]';
  };

  return (
    <motion.div
      id="boarding-pass"
      initial={{ perspective: 800, rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative w-full max-w-[440px] overflow-hidden rounded-[18px] border border-white/10 bg-[#1a2235] shadow-2xl"
    >
      <div className={cn("flex items-center justify-between px-4 py-3 text-white sm:px-6 sm:py-4", getHeaderColor())}>
        <span className="font-bold">{title}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80 sm:text-xs sm:tracking-widest">Boarding Pass</span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-3xl font-bold sm:text-4xl">{from}</span>
          <div className="relative mx-3 flex flex-1 items-center justify-center sm:mx-4">
             <div className="absolute w-full h-[2px] bg-white/10" />
             <Icon className="relative z-10 w-6 h-6 text-gray-400 fill-current bg-[#1a2235] px-1" />
          </div>
          <span className="text-3xl font-bold sm:text-4xl">{to}</span>
        </div>

        <div className="mb-5 flex justify-between text-xs text-gray-400 sm:mb-6 sm:text-sm">
          <span>{fromFull}</span>
          <span>{toFull}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3 sm:gap-4">
          <div className="col-span-1">
            <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Passenger</span>
            <span className="font-bold text-gray-100 uppercase">{passenger}</span>
          </div>
          <div className="col-span-1">
            <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</span>
            <span className="font-bold text-gray-100 truncate block">{subject}</span>
          </div>
          <div className="col-span-1 sm:text-right">
            <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</span>
            <span className="font-bold text-gray-100">{hr}h {min}m</span>
          </div>
        </div>
      </div>

      <div className="relative mx-4 h-0 border-t-2 border-dashed border-white/15 sm:mx-6">
        <div className="absolute -left-9 -top-[13px] w-6 h-6 bg-[#0a0e1a] rounded-full border-r border-white/10" />
        <div className="absolute -right-9 -top-[13px] w-6 h-6 bg-[#0a0e1a] rounded-full border-l border-white/10" />
      </div>

      <div className="grid grid-cols-3 gap-3 bg-white/[0.02] p-4 sm:flex sm:justify-between sm:p-6">
        <div>
          <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Departs</span>
          <span className="text-gray-100">{dTime}</span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Arrives</span>
          <span className="text-gray-100">{aTime}</span>
        </div>
        <div className="text-right">
          <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">ID</span>
          <span className="text-gray-100">{vehicleId}</span>
        </div>
      </div>
    </motion.div>
  );
};
