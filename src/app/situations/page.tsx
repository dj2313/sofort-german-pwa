'use client';

import Link from 'next/link';
import situationsData from '@/data/situations.json';

export default function SituationsPage() {
  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>
          ← Back
        </Link>
        <h1 style={{ color: 'var(--text-primary)' }}>Situations</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
        {situationsData.map(sit => (
          <Link key={sit.id} href={`/situations/${sit.id}`} style={{ textDecoration: 'none' }}>
            <div 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '16px',
                padding: '32px 16px',
                textAlign: 'center',
                height: '100%',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{sit.icon}</div>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{sit.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
