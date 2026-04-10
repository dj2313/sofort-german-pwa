'use client';

import { CEFR_SKILLS, CEFR_METADATA, CefrLevel } from '@/core/constants/cefr';
import Link from 'next/link';

export default function CefrModulesPage() {
  const levels = Object.keys(CEFR_SKILLS) as CefrLevel[];

  return (
    <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ marginBottom: '16px', color: 'var(--accent-color)', fontSize: '3rem', letterSpacing: '-0.04em' }}>Goethe Path</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Structured German language mastery following the Goethe Institute CEFR standard.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {levels.map(level => {
          const meta = CEFR_METADATA[level];
          return (
            <Link
              key={level}
              href={`/cefr/${level}`}
              style={{ textDecoration: 'none' }}
              className="fade-in"
            >
              <div
                className="card"
                style={{
                  padding: '32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', fontWeight: 900, opacity: 0.05, pointerEvents: 'none' }}>{level}</div>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--accent-color)' }}>{level}</h2>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{meta.focus}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1 }}>{meta.description}</p>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-plex-mono)', color: 'var(--accent-color)' }}>{meta.vocabSize}</span>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Explore &rarr;</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
