'use client';
import { createContext, useContext, ReactNode, useCallback } from 'react';
import { db, LevelProgress } from '@/lib/db';
import { CefrLevel, Skill } from '@/core/constants/cefr';

interface CefrProgressContextType {
  getProgress: (level: CefrLevel, skill: Skill) => Promise<LevelProgress | undefined>;
  setProgress: (level: CefrLevel, skill: Skill, completed: number, total: number) => Promise<void>;
}

const CefrProgressContext = createContext<CefrProgressContextType | undefined>(undefined);

export function CefrProgressProvider({ children }: { children: ReactNode }) {
  const getProgress = useCallback(async (level: CefrLevel, skill: Skill) => {
    return await db.levelProgress
      .where(['level', 'skill'])
      .equals([level, skill])
      .first();
  }, []);

  const setProgress = useCallback(async (level: CefrLevel, skill: Skill, completed: number, total: number) => {
    await db.levelProgress.put({ level, skill, completed, total });
  }, []);

  return (
    <CefrProgressContext.Provider value={{ getProgress, setProgress }}>
      {children}
    </CefrProgressContext.Provider>
  );
}

export function useCefrProgress() {
  const ctx = useContext(CefrProgressContext);
  if (!ctx) {
    throw new Error('useCefrProgress must be used within CefrProgressProvider');
  }
  return ctx;
}
