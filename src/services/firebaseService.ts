// Firebase service removed - using local state only
import { Profile, JourneyRecord } from "../types";

// Stub functions for compatibility
export const initFirebase = (config: any) => {
  console.log("Firebase removed - using local state only");
};

export const loginWithGoogle = async () => {
  return null;
};

export const onAuthChange = (callback: (user: any) => void) => {
  // Immediately call callback with null (no user)
  callback(null);
  return () => { };
};

export const getProfile = async (uid: string): Promise<Profile | null> => {
  return null;
};

export const saveProfile = async (uid: string, profile: Profile) => {
  // No-op
};

export const saveSession = async (uid: string, record: JourneyRecord) => {
  // No-op
};

export const getHistory = async (uid: string): Promise<JourneyRecord[]> => {
  return [];
};

export const getActivePilots = (callback: (count: number) => void) => {
  callback(1);
  return () => { };
};

export const updatePresence = async (userId: string, isFlying: boolean) => {
  // No-op
};
