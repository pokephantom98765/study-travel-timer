import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Cloud {
  id: number;
  top: number;
  scale: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
}

export const Sky: React.FC<{ mode: 'flight' | 'train' | 'bus', weather?: 'clear' | 'rain' | 'cloudy' }> = ({ mode, weather = 'clear' }) => {
  const [phase, setPhase] = useState<'dawn' | 'morning' | 'day' | 'dusk' | 'evening' | 'night'>('day');
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mobileMedia = window.matchMedia('(max-width: 640px)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncPreferences = () => {
      setIsMobile(mobileMedia.matches);
      setReduceMotion(motionMedia.matches);
    };

    syncPreferences();
    mobileMedia.addEventListener('change', syncPreferences);
    motionMedia.addEventListener('change', syncPreferences);

    const updatePhase = () => {
      const hr = new Date().getHours();
      if (hr >= 5 && hr < 6.5) setPhase('dawn');
      else if (hr >= 6.5 && hr < 10) setPhase('morning');
      else if (hr >= 10 && hr < 16) setPhase('day');
      else if (hr >= 16 && hr < 18.5) setPhase('dusk');
      else if (hr >= 18.5 && hr < 20) setPhase('evening');
      else setPhase('night');
    };

    updatePhase();
    const interval = setInterval(updatePhase, 60000);

    const cloudCount = mobileMedia.matches ? 5 : 8;
    const starCount = motionMedia.matches ? 0 : (mobileMedia.matches ? 45 : 100);

    // Initialize Clouds
    const newClouds: Cloud[] = Array.from({ length: cloudCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 35,
      scale: 0.5 + Math.random() * 0.8,
      opacity: 0.4 + Math.random() * 0.4,
      duration: 70 + Math.random() * 80,
      delay: -Math.random() * 100
    }));
    setClouds(newClouds);

    // Initialize Stars
    const newStars: Star[] = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3,
      duration: 2 + Math.random() * 4
    }));
    setStars(newStars);

    return () => {
      clearInterval(interval);
      mobileMedia.removeEventListener('change', syncPreferences);
      motionMedia.removeEventListener('change', syncPreferences);
    };
  }, []);

  const isRainy = weather === 'rain';
  const rainCount = reduceMotion ? 0 : (isMobile ? 28 : 60);

  return (
    <div className={cn(
      "fixed inset-0 z-0 transition-colors duration-[4000ms] overflow-hidden",
      phase === 'dawn' && "bg-gradient-to-b from-[#1a1a3e] via-[#4a3b69] to-[#f0a854]",
      phase === 'morning' && "bg-gradient-to-b from-[#7db9e8] via-[#a8d3f0] to-[#e6f2fa]",
      phase === 'day' && "bg-gradient-to-b from-[#1a6bbd] via-[#4da3e8] to-[#87ceeb]",
      phase === 'dusk' && "bg-gradient-to-b from-[#1a1a3e] via-[#6b3a9e] to-[#f0a854]",
      phase === 'evening' && "bg-gradient-to-b from-[#0d1a3e] via-[#1a2a5e] to-[#3a2a4e]",
      phase === 'night' && "bg-gradient-to-b from-[#050510] via-[#0a0e1a] to-[#111827]",
      isRainy && "brightness-50 saturate-50 contrast-125"
    )}>
      {/* Rainfall Layer */}
      {isRainy && rainCount > 0 && (
        <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
           {Array.from({ length: rainCount }).map((_, i) => (
             <div 
               key={i} 
               className="absolute bg-white/60 w-[1px] h-20 animate-rain"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${-Math.random() * 20}%`,
                 animationDelay: `${Math.random() * 2}s`,
                 animationDuration: `${0.3 + Math.random() * 0.3}s`
               }}
             />
           ))}
        </div>
      )}
      {/* Stars Layer */}
      <AnimatePresence>
        {(phase === 'night' || phase === 'evening') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {stars.map(star => (
              <div
                key={star.id}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDuration: `${star.duration}s`
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clouds Layer */}
      <AnimatePresence>
        {!(phase === 'night' || phase === 'evening') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {clouds.map(cloud => (
              <div
                key={cloud.id}
                className="absolute cloud-shape animate-drift"
                style={{
                  top: `${cloud.top}%`,
                  opacity: cloud.opacity,
                  '--scale': cloud.scale,
                  animationDuration: `${cloud.duration / cloud.scale}s`,
                  animationDelay: `${cloud.delay}s`
                } as any}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ground Landscape for Train/Bus/Flight */}
      {(mode === 'train' || mode === 'bus' || mode === 'flight') && (
        <div className="absolute bottom-0 left-0 w-[200vw] h-[20vh] sm:h-[25vh] flex overflow-hidden pointer-events-none">
          {/* Far Mountains */}
          <div className="absolute inset-0 flex">
            <div 
              className="w-1/2 h-full landscape-scroll opacity-20" 
              style={{ 
                animationDuration: mode === 'bus' ? '120s' : mode === 'flight' ? '180s' : '60s',
                filter: 'brightness(0.6) blur(2px)',
                bottom: '8vh'
              }} 
            />
            <div 
              className="w-1/2 h-full landscape-scroll opacity-20" 
              style={{ 
                animationDuration: mode === 'bus' ? '120s' : mode === 'flight' ? '180s' : '60s',
                filter: 'brightness(0.6) blur(2px)',
                bottom: '8vh'
              }} 
            />
          </div>

          {/* Near Mountains (Not shown in flight as they would move too fast or look weird at altitude) */}
          {(mode === 'train' || mode === 'bus') && !isMobile && !reduceMotion && (
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/2 h-full landscape-scroll" 
                style={{ animationDuration: mode === 'bus' ? '40s' : '20s' }} 
              />
              <div 
                className="w-1/2 h-full landscape-scroll" 
                style={{ animationDuration: mode === 'bus' ? '40s' : '20s' }} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
