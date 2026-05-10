import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number): string {
  const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
  const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function getLevel(xp: number) {
  if (xp < 100) return { rank: 'Beginner', next: 100 };
  if (xp < 500) return { rank: 'Explorer', next: 500 };
  if (xp < 2000) return { rank: 'Pilot', next: 2000 };
  return { rank: 'Captain', next: Infinity };
}
