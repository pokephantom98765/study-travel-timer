export type TravelMode = 'flight' | 'train' | 'bus';

export interface City {
  code: string;
  name: string;
}

export interface Profile {
  xp: number;
  streak: number;
  lastLogin: string;
  totalMs: number;
  distractions: number;
  sessions: number;
  username: string;
  ach1?: boolean;
  ach2?: boolean;
  ach3?: boolean;
  ach4?: boolean;
}

export interface JourneyRecord {
  id: string;
  date: string;
  mode: TravelMode;
  from: string;
  to: string;
  subject: string;
  duration: number;
  goals: number;
  goalsMet: number;
  breaks: number;
  distractions: number;
  pauses: number;
  score: number;
  timestamp: number;
  notes?: string;
  weather?: string;
}

export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  mode: TravelMode;
  from: string;
  to: string;
  subject: string;
  passenger: string;
  durationMs: number;
  endTime: number;
  totalTimeMs: number;
  goals: string[];
  goalsMet: number;
  distractions: number;
  manualPauses: number;
  strictMode: boolean;
  pomoEnabled: boolean;
  pomoFocus: number;
  pomoBreak: number;
  nextBreakTime: number | null;
  vehicleId: string;
}
