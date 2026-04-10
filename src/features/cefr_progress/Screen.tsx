'use client';

import Link from 'next/link';
import { CefrLevel, Skill, CEFR_SKILLS } from '@/core/constants/cefr';

// Render the CEFR hierarchy as published by the Goethe Institute.
// Each level (A1‑C2) shows its four skill parts (speaking, listening, reading, writing).
// The layout uses clear headings and a responsive grid for visibility.

export default function CefrScreen() {
  const levels = Object.keys(CEFR_SKILLS) as (keyof typeof CEFR_SKILLS)[];
  const skills: Skill[] = ['speaking', 'listening', 'reading', 'writing'];

  return (
    <main style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>CEFR Levels – Goethe Institute</h1>
      {levels.map(level => (
        <section key={level} style={{ marginBottom: '48px' }}>
          <h2 style={{ borderBottom: '2px solid var(--accent-color)', paddingBottom: '8px' }}>{level}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {skills.map(skill => (
              <Link
                key={skill}
                href={`/cefr/${level}/${skill}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-bg)',
                  }}
                >
                  <h3 style={{ margin: '0 0 8px' }}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Coming soon</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
