'use client';

import { VocabEntry } from '@/lib/db';
import { TTSService } from '@/lib/tts';
import { Volume2 } from 'lucide-react';

interface Props {
  entry: VocabEntry;
  ttsRate?: number;
}

export function VocabCard({ entry, ttsRate = 1.0 }: Props) {
  const handleTTS = () => {
    // Speaks the German word, then the example sentence
    TTSService.speak(`${entry.german}. ${entry.exampleDe}`, ttsRate);
  };

  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="german-word" style={{ color: 'var(--accent-color)', fontSize: '1.75rem', marginBottom: '4px' }}>
            {entry.article && <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginRight: '8px' }}>{entry.article}</span>}
            {entry.german}
          </h2>
          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{entry.english}</p>
          {entry.plural && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Pl: {entry.plural}</p>}
        </div>
        <button onClick={handleTTS} aria-label="Listen" style={{ padding: '8px' }}>
          <Volume2 size={24} />
        </button>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
        <p className="german-word" style={{ marginBottom: '4px' }}>{entry.exampleDe}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{entry.exampleEn}</p>
      </div>
    </div>
  );
}
