import React from 'react';
import { Profile, JourneyRecord } from '../types';
import { getLevel } from '../lib/utils';
import { motion } from 'motion/react';
import { Shield, MapPin, Globe } from 'lucide-react';

interface PilotLicenseProps {
  profile: Profile;
  history: JourneyRecord[];
}

export const PilotLicense: React.FC<PilotLicenseProps> = ({ profile, history }) => {
  const level = getLevel(profile.xp);
  const cities = Array.from(new Set(history.map((h) => h.to).filter(Boolean)));

  return (
    <motion.div
      id="pilot-license"
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      className="relative aspect-[1.6/1] w-full max-w-sm overflow-hidden rounded-[24px] border-2 border-white/20 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-6 shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Globe className="h-full w-full scale-150 -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-[8px] font-bold uppercase tracking-widest text-blue-300">International StudyTravel Authority</h3>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Pilot License</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Shield className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-16 items-center justify-center overflow-hidden rounded border border-white/20 bg-gray-800">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-blue-500/10 to-blue-500/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rotate-45 text-[10px] font-bold uppercase text-white/40">VALID</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-[7px] font-bold uppercase text-blue-300/60">Passenger ID</p>
              <p className="text-sm font-bold tracking-tight">{profile.username || 'Anonymous'}</p>
            </div>
            <div>
              <p className="text-[7px] font-bold uppercase text-blue-300/60">Current Rank</p>
              <p className="text-xs font-black uppercase tracking-tighter text-amber-400">{level.rank}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-4">
          <div className="flex -space-x-2">
            {cities.slice(0, 5).map((city) => (
              <div key={city} className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20" title={city}>
                <MapPin size={10} className="text-emerald-400" />
              </div>
            ))}
            {cities.length > 5 && <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[8px] text-gray-400">+{cities.length - 5}</div>}
          </div>
          <div className="text-right">
            <p className="text-[7px] font-bold uppercase text-blue-300/60">Sessions Logged</p>
            <p className="text-lg font-black italic">{profile.sessions || 0}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
