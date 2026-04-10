import { storageGet, storageSet } from '@/lib/services/storageService';
import { VocabEntry } from '@/lib/types/vocab';
import { CefrLevel } from '@/lib/types/levels';

const VOCAB_KEY = 'vocab_entries';

export async function loadBuiltIn() {
  // Load JSON files from public/data/vocab
  const levels: CefrLevel[] = ['A1','A2','B1','B2','C1','C2'];
  const all: VocabEntry[] = [];
  for (const level of levels) {
    try {
      const res = await fetch(`/data/vocab/${level.toLowerCase()}_vocab.json`);
      if (res.ok) {
        const data: VocabEntry[] = await res.json();
        all.push(...data);
      }
    } catch (e) {
      console.error('Failed to load vocab for', level, e);
    }
  }
  await storageSet(VOCAB_KEY, all);
  return all;
}

export async function getAllVocab(): Promise<VocabEntry[]> {
  const stored = await storageGet<VocabEntry[]>(VOCAB_KEY);
  return stored ?? [];
}

export async function search(query: string): Promise<VocabEntry[]> {
  const all = await getAllVocab();
  const q = query.toLowerCase();
  return all.filter(e =>
    e.german.toLowerCase().includes(q) ||
    e.english.toLowerCase().includes(q)
  ).slice(0, 20);
}

export async function getByLevel(level: CefrLevel): Promise<VocabEntry[]> {
  const all = await getAllVocab();
  return all.filter(e => e.level === level);
}

export async function addEntry(entry: VocabEntry): Promise<void> {
  const all = await getAllVocab();
  const updated = [...all.filter(e => e.id !== entry.id), entry];
  await storageSet(VOCAB_KEY, updated);
}

export async function deleteEntry(id: string): Promise<void> {
  const all = await getAllVocab();
  const updated = all.filter(e => e.id !== id);
  await storageSet(VOCAB_KEY, updated);
}
