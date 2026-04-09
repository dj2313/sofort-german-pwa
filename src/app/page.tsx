'use client';

import { useState, useEffect, useRef } from 'react';
import { db, VocabEntry } from '@/lib/db';
import { VocabCard } from '@/components/VocabCard';
import { Search, Grid, MessageSquare, Headphones, Mic } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VocabEntry[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on load
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const searchVocab = async () => {
      const q = query.toLowerCase().trim();
      if (!q) {
        setResults([]);
        return;
      }
      
      const res = await db.vocab.filter(entry => 
        entry.german.toLowerCase().includes(q) || 
        entry.english.toLowerCase().includes(q)
      ).limit(20).toArray();
      
      setResults(res);
    };
    
    searchVocab();
  }, [query]);

  return (
    <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--accent-color)' }}>Sofort.</h1>
      
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <Search 
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
          size={20} 
        />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Suchen... (German or English)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 16px 16px 48px',
            fontSize: '1.2rem',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-syne)',
            outline: 'none',
          }}
        />
      </div>

      {/* Modes Grid or Search Results */}
      {query ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {results.length > 0 ? (
            results.map(entry => <VocabCard key={entry.id} entry={entry} />)
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px 0' }}>Keine Ergebnisse (No results)</p>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Modes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ModeTile href="/situations" icon={<Grid size={24} />} title="Situations" />
            <ModeTile href="/build" icon={<MessageSquare size={24} />} title="Sentence Builder" />
            <ModeTile href="/shadow" icon={<Headphones size={24} />} title="Shadow Listen" />
            <ModeTile href="/pronounce" icon={<Mic size={24} />} title="Pronunciation" />
            <ModeTile href="/import" icon={<Grid size={24} />} title="PDF Import" />
            <ModeTile href="/bank" icon={<Grid size={24} />} title="Vocab Bank" />
          </div>
        </div>
      )}
    </main>
  );
}

function ModeTile({ href, icon, title }: { href: string, icon: React.ReactNode, title: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div 
        className="card" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '12px',
          padding: '24px 16px',
          textAlign: 'center',
          height: '100%'
        }}
      >
        <div style={{ color: 'var(--accent-color)' }}>{icon}</div>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
      </div>
    </Link>
  );
}
