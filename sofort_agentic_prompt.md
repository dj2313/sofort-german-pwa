# Sofort — Agentic Build Prompt

You are a senior Next.js engineer. Read CLAUDE.md fully before writing any code. Follow phases in order. After every phase run `npx tsc --noEmit` — zero errors before moving on.

---

## Phase 1 — Bootstrap

```bash
npx create-next-app@latest sofort --typescript --tailwind --app --no-src-dir
npm install zustand idb-keyval pdfjs-dist next-pwa
npx shadcn-ui@latest init
npx shadcn-ui@latest add button tabs badge card progress sheet popover toast
```

- Set `tsconfig.json` strict: true
- Add all design tokens to `tailwind.config.ts` from CLAUDE.md
- Load Syne + IBM Plex Mono via `next/font/google` in `app/layout.tsx`
- Create all empty folders per CLAUDE.md structure
- Create all type files: `lib/types/vocab.ts`, `lib/types/levels.ts`, `lib/types/practice.ts` with exact interfaces from CLAUDE.md

---

## Phase 2 — Data Layer

- `lib/services/storageService.ts` — typed idb-keyval wrapper (get, set, del)
- `lib/store/vocabStore.ts` — Zustand store with full VocabStore interface
- `lib/store/sessionStore.ts` — Zustand store with full SessionStore interface
- `lib/services/vocabService.ts` — search (fuzzy on german + english), getByLevel, getBySituation, addEntry, deleteEntry, loadBuiltIn
- `data/vocab/a1_vocab.json` — 60 real A1 words in VocabEntry format
- `data/vocab/a2_vocab.json` — 60 real A2 words
- `data/vocab/b1_vocab.json` — 50 real B1 words
- `data/vocab/b2_vocab.json` — 40 real B2 words
- `data/vocab/c1_vocab.json` — 30 real C1 words
- `data/vocab/c2_vocab.json` — 30 real C2 words
- `data/situations/situations.json` — 10 situations, each with 8–12 vocab IDs
- `loadBuiltIn` reads all 6 JSON files, dedupes by id, saves to IndexedDB on first load

---

## Phase 3 — TTS + Speech

- `lib/services/ttsService.ts` — speak(text, rate, lang), stop() — all guarded with `typeof window !== 'undefined'`
- `lib/services/speechService.ts` — startListening(), stopListening(), compareToTarget() → returns 0.0–1.0
- `components/vocab/AudioButton.tsx` — button that calls ttsService.speak()
- `components/shared/SpeedSlider.tsx` — 0.5 / 1.0 / 1.5, writes to Zustand

---

## Phase 4 — Home (Quick Search)

- `app/page.tsx` — full-width SearchBar auto-focused on mount
- Below search: 5 nav tiles — Levels, Situations, Sentence Builder, Shadow Listen, Vocab Bank
- Search debounced 150ms → vocabService.search() → list of VocabCard
- `components/vocab/VocabCard.tsx` — article (ArticleTag) + german (IBM Plex Mono, large) + plural + english + exampleDe + exampleEn + AudioButton
- AudioButton speaks german then exampleDe at selected speed
- Empty state: "Type a word in English or German"
- No results: "Not in your vocab bank yet — import a PDF to add more"

---

## Phase 5 — Situations

- `app/situations/page.tsx` — 2-col grid, 10 situation tiles, icon + label
- `app/situations/[slug]/page.tsx` — VocabCards for that situation + SpeedSlider at top

---

## Phase 6 — PDF Import

- `app/import/page.tsx` — file input (PDF only)
- `lib/services/pdfParser.ts`:
  - pdfjs-dist extracts text from all pages
  - Run 4 regex patterns per line (first match wins):
    - `/^(der|die|das)\s+(\w+)\s+[–-]\s+(.+)$/i`
    - `/^([A-ZÄÖÜ][a-zäöüß]+)\s+[–-]\s+(.+)$/`
    - `/^(\S+)\s{2,}(.+)$/`
    - `/^\d+[\.\)]\s+(.+?)\s+[–-]\s+(.+)$/`
  - If extractedText empty → throw 'image-based PDF not supported'
- Preview: checklist of candidates, all checked by default, inline editable fields
- Confirm → vocabService.addEntry() for each checked item
- Success toast: "X words added" | Error toast for image-based PDF

---

## Phase 7 — Vocab Bank

- `app/vocab-bank/page.tsx`
- Filter tabs: All / A1 / A2 / B1 / B2 / C1 / C2 / Imported
- Search within tab
- Row: ArticleTag + german + english + source badge + delete button
- Tap row → shadcn Sheet with full VocabCard + AudioButton
- Delete → confirm dialog → remove from IndexedDB + Zustand

---

## Phase 8 — Level Select + Dashboard

- `app/levels/page.tsx` — 2-col grid, 6 level cards (A1–C2)
- Level card: colored badge, name, short description — current level highlighted in accent
- Current level persisted to IndexedDB
- `app/levels/[level]/page.tsx` — 4 skill tiles: Listening, Reading, Writing, Speaking
- Each tile: icon + label + "Structure / Practice" sub-text
- Tap → `app/levels/[level]/[skill]/page.tsx`

---

## Phase 9 — Level + Practice Content (generate in 3 batches)

**Batch 1:** A1 + A2 | **Batch 2:** B1 + B2 | **Batch 3:** C1 + C2

Create `data/levels/level_content.json` — 24 entries (6 levels × 4 skills)
Each entry: overview, examFormat, timeAllowed, parts[], tips[], commonMistakes[]

Accurate Goethe exam data per level:

| Level | Skill | Parts | Time |
|---|---|---|---|
| A1 | Listening | 3 | 20 min |
| A1 | Reading | 3 | 25 min |
| A1 | Writing | 2 | 20 min |
| A1 | Speaking | 3 | 15 min |
| A2 | Listening | 4 | 30 min |
| A2 | Reading | 4 | 30 min |
| A2 | Writing | 2 | 30 min |
| A2 | Speaking | 3 | 15 min |
| B1 | Listening | 4 | 40 min |
| B1 | Reading | 4 | 65 min |
| B1 | Writing | 2 | 60 min |
| B1 | Speaking | 3 | 15 min |
| B2 | Listening | 3 | 40 min |
| B2 | Reading | 3 | 65 min |
| B2 | Writing | 2 | 75 min |
| B2 | Speaking | 3 | 15 min |
| C1 | Listening | 3 | 40 min |
| C1 | Reading | 3 | 70 min |
| C1 | Writing | 2 | 80 min |
| C1 | Speaking | 2 | 15 min |
| C2 | Listening | 3 | 45 min |
| C2 | Reading | 3 | 75 min |
| C2 | Writing | 2 | 90 min |
| C2 | Speaking | 2 | 16 min |

Create `data/levels/practice_items.json` — 240 items (10 per level per skill)
Use real German text. Cover all 6 types: multiple_choice, fill_blank, match, write, speak, listen.
Each item: id, level, skill, type, prompt, content, options, correctAnswer, explanation, vocabUsed[]

---

## Phase 10 — Skill Screen

- `app/levels/[level]/[skill]/page.tsx` — shadcn Tabs (Structure | Practice)

**Structure tab:**
- Level badge + skill name + time chip
- "What This Tests" section — overview
- "Exam Format" — part cards (title, task type, example task)
- "Tips" — numbered list
- "Common Mistakes" — list with ⚠
- "Start Practice →" button → switches to Practice tab

**Practice tab:**
- Load 10 items for level+skill
- Progress bar "3 / 10"
- Render by type:
  - `multiple_choice` → question + 4 option buttons
  - `fill_blank` → sentence + text input + Submit
  - `match` → tap col-1 item then col-2 item to connect
  - `write` → prompt + textarea + Submit (check: length > 20 + keyword match)
  - `speak` → prompt + mic → show model answer after stop
  - `listen` → TTS auto-plays content → question + options
- After answer: green/red + explanation + Next
- End: ScoreCard (X/10, time taken) + "Review Wrong" button
- Save score to IndexedDB `scores:[level]:[skill]`

---

## Phase 11 — Sentence Builder

- `app/sentence-builder/page.tsx`
- English input + "Build" button
- `lib/utils/sentenceBuilder.ts` — rule-based SVO engine:
  - Verb map: go=gehen, have=haben, be=sein, want=möchten, buy=kaufen, eat=essen, make=machen, go=fahren
  - Look up nouns in vocabStore, apply article + case
  - Apply verb-second rule for main clauses
- Output: German sentence, each word a WordChip
- WordChip tap → Popover: meaning + article
- Full sentence AudioButton + SpeedSlider
- No match → "Simplify — try subject + verb + object only"

---

## Phase 12 — Shadow Listen

- `app/shadow-listen/page.tsx`
- Textarea for German text input
- "Load Examples" → 5 random exampleDe sentences from vocabStore
- Playback: Play / Pause / Stop + loop toggle
- SpeedSlider
- Each word is a clickable span → click pauses + shows Popover (vocabService lookup or "not in vocab bank")
- Loop mode repeats current sentence until stopped

---

## Phase 13 — Pronunciation Check

- `app/pronunciation/page.tsx`
- Random word from vocabStore + "Next Word" button
- Large display: article (muted) + german (accent, IBM Plex Mono)
- "Hear It" → TTS
- Mic button → speechService.startListening() de-DE
- Score ring: green > 80%, yellow 50–80%, red < 50%
- "You said: X" vs "Target: Y"
- "Try Again" + "Next Word"

---

## Phase 14 — PWA + Offline

- `public/manifest.json` — name: Sofort, display: standalone, bg: #0A0A0A, theme: #0A0A0A, icons 192 + 512
- `next.config.js` — next-pwa with dest: public, disabled in dev
- `next build` → confirm sw.js + workbox files in /public
- Test offline in Chrome DevTools: all pages load, TTS works, IndexedDB data persists

---

## Final Quality Gates

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `next build` — zero errors
- [ ] No `any` types: `grep -r ": any" lib/ components/ app/` returns nothing
- [ ] Search < 300ms on 300+ word bank
- [ ] PDF import parses clean Goethe PDF correctly
- [ ] All 24 structure entries render without missing data
- [ ] All 6 practice item types complete without crash
- [ ] Score saved and reloads correctly per level+skill
- [ ] App fully functional offline after first visit
- [ ] PWA installs from Chrome

---

## Execution Rules

- One phase per session
- Say "Phase X done" then stop — wait for next instruction
- Generate practice_items.json in 3 batches matching Phase 9
- Never use `any` — if unsure of a type, use `unknown` + narrow it
- Never use Pages Router
- Never add Turbopack
- All browser API calls guarded with `typeof window !== 'undefined'`
