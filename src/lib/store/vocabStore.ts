import { create } from 'zustand';
import { VocabEntry } from '@/lib/types/vocab';

interface VocabStore {
  vocab: VocabEntry[];
  setVocab: (entries: VocabEntry[]) => void;
  addEntry: (entry: VocabEntry) => void;
  deleteEntry: (id: string) => void;
}

export const useVocabStore = create<VocabStore>(set => ({
  vocab: [],
  setVocab: entries => set({ vocab: entries }),
  addEntry: entry => set(state => ({ vocab: [...state.vocab, entry] })),
  deleteEntry: id => set(state => ({ vocab: state.vocab.filter(e => e.id !== id) })),
}));
