import { create } from 'zustand';
import { CefrLevel } from '@/lib/types/levels';
import { Skill } from '@/lib/types/practice';

interface SessionStore {
  currentLevel: CefrLevel | null;
  setLevel: (level: CefrLevel) => void;
  currentSkill: Skill | null;
  setSkill: (skill: Skill) => void;
}

export const useSessionStore = create<SessionStore>(set => ({
  currentLevel: null,
  setLevel: level => set({ currentLevel: level }),
  currentSkill: null,
  setSkill: skill => set({ currentSkill: skill }),
}));
