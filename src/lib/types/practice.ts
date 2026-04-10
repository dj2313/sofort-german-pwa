import { CefrLevel } from '@/lib/types/levels';
export type Skill = 'speaking' | 'listening' | 'reading' | 'writing';

export interface PracticeItem {
  id: string;
  level: CefrLevel;
  skill: Skill;
  type: string; // e.g., multiple_choice, fill_blank, etc.
  prompt: string;
  content: any;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
  vocabUsed: string[];
}
