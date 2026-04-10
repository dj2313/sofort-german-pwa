import Dexie, { Table } from 'dexie';

export interface VocabEntry {
  id: string;
  german: string;
  article?: string;
  plural?: string;
  english: string;
  exampleDe: string;
  exampleEn: string;
  situation?: string;
  source: string; // builtin_a1 | builtin_a2 | imported
  level: string; // A1 | A2 | B1 | custom
  addedAt: Date;
  reviewScore?: number;
}

export interface LevelProgress {
  level: string; // e.g., 'A1'
  skill: string; // 'speaking' | 'listening' | 'reading' | 'writing'
  completed: number;
  total: number;
}

export class SofortDatabase extends Dexie {
  vocab!: Table<VocabEntry, string>;
  levelProgress!: Table<LevelProgress, [string, string]>;
  constructor() {
    super('sofort_db');
    this.version(2).stores({
      vocab: 'id, german, english, situation, source, level',
      levelProgress: 'level,skill'
    });
  }
}

export const db = new SofortDatabase();
