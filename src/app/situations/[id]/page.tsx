'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { db, VocabEntry } from '@/lib/db';
import { VocabCard } from '@/components/VocabCard';
import situationsData from '@/data/situations.json';

export default function SituationDetailPage() {
  const params = useParams();
  const situationId = params.id as string;
  const sitInfo = situationsData.find(s => s.id === situationId);

  const [words, setWords] = useState<VocabEntry[]>([]);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);

  useEffect(() => {
    const fetchWords = async () => {
      const results = await db.vocab.where('situation').equals(situationId).toArray();
      setWords(results);
    };
    fetchWords();
  }, [situationId]);

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/situations" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>
          ← Back
        </Link>
        <h1 style={{ color: 'var(--text-primary)' }}>
          {sitInfo?.icon} {sitInfo?.name || 'Category'}
        </h1>
      </div>

      <div className="card" style={{ marginBottom: '24px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 600 }}>TTS Speed: <span style={{ color: 'var(--accent-color)' }}>{ttsSpeed}x</span></div>
        <input 
          type="range" 
          min="0.5" max="1.5" step="0.5" 
          value={ttsSpeed} 
          onChange={(e) => setTtsSpeed(parseFloat(e.target.value))} 
          style={{ cursor: 'pointer', width: '150px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {words.length > 0 ? (
          words.map(entry => <VocabCard key={entry.id} entry={entry} ttsRate={ttsSpeed} />)
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No vocabulary assigned to this situation yet.</p>
        )}
      </div>
    </main>
  );
}
