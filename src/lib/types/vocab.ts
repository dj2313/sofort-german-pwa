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
  level: string; // A1 | A2 | B1 | B2 | C1 | C2 | custom
  addedAt: string; // ISO date string
  reviewScore?: number;
}
